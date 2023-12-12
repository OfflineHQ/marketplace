import env from '@env/server';
import { FeatureFlagsEnum, FeatureFlagsValues, Flags } from '@insight/types';
import { PostHog as PosthogNode } from 'posthog-node';
import { isPosthogActivated } from './isPosthogActivated';

export class Posthog {
  private static instance?: Posthog;
  private finalizationRegistry: FinalizationRegistry<PosthogNode>;
  private postHogClient: PosthogNode;

  private constructor() {
    this.postHogClient = new PosthogNode(env.POSTHOG_KEY, {
      host: 'https://eu.posthog.com',
      personalApiKey: env.POSTHOG_PERSONAL_API_KEY,
      featureFlagsPollingInterval: 500000, // 5 minutes // TODO set back to 15 minutes when we have more users to avoid reaching the limit
      // featureFlagsPollingInterval: 1500000, // 15 minutes
      enable: isPosthogActivated(),
    });
    this.finalizationRegistry = new FinalizationRegistry((postHogClient) => {
      postHogClient.shutdown();
    });

    this.finalizationRegistry.register(
      this,
      this.postHogClient,
      this.postHogClient,
    );
  }
  public static getInstance(): Posthog {
    if (!Posthog.instance) {
      Posthog.instance = new Posthog();
    }

    return Posthog.instance;
  }

  public static resetInstance(): void {
    if (Posthog.instance) {
      Posthog.instance.postHogClient.shutdown();
      Posthog.instance.finalizationRegistry.unregister(
        Posthog.instance.postHogClient,
      );
    }
    Posthog.instance = undefined;
  }

  public reloadFeatureFlags(): void {
    this.postHogClient.reloadFeatureFlags();
  }

  // usefull in case we want to validate multiple flags at once to avoid multiple calls
  public async getAllFlags(userAddress: string) {
    const allFlags = await this.postHogClient.getAllFlags(userAddress, {
      personProperties: {
        address: userAddress,
      },
    });
    const flags: Flags = Object.assign(
      {},
      ...FeatureFlagsValues.map((flag) => [flag, false]),
    );
    for (const flag of FeatureFlagsValues) {
      if (!(flag in allFlags)) {
        console.warn(
          `Warning: ${flag} from FeatureFlagsValues is not defined in PosthogNode`,
        );
      } else {
        flags[flag] = Boolean(allFlags[flag]);
      }
    }
    return flags;
  }

  // TODO add organization when have role
  public async getFeatureFlag(flag: FeatureFlagsEnum, userAddress: string) {
    const res = await this.postHogClient.getFeatureFlag(flag, userAddress, {
      personProperties: {
        address: userAddress,
      },
    });
    return !!res;
  }
  // JSON payload payload, get it in case `getFeatureFlag` return true and the feature flag is a JSON payload and not a boolean
  public async getFeatureFlagPayload(
    flag: FeatureFlagsEnum,
    userAddress: string,
  ) {
    return this.postHogClient.getFeatureFlagPayload(flag, userAddress);
  }
}
