import {
  generateApiKeyId,
  generateRandomString,
  hashSecret,
  encryptSecret,
} from '@crypto';
import { adminSdk } from '@gql/admin/api';
import {
  PublishableApiKey_Insert_Input,
  SecretApiKey_Insert_Input,
} from '@gql/shared/types';
type SecretApiKeyOptionalFields = Pick<
  SecretApiKey_Insert_Input,
  'allowlist' | 'expiresAt' | 'status' | 'name' | 'type'
>;

interface InputSecretKeyProps
  extends SecretApiKeyOptionalFields,
    Required<Pick<SecretApiKey_Insert_Input, 'organizerId'>> {
  apiKey: string;
  originSecret?: string;
  integritySecret?: string;
}

export async function inputSecretKey({
  apiKey,
  organizerId,
  originSecret,
  integritySecret,
  ...optionalFields
}: InputSecretKeyProps) {
  if (!originSecret && !integritySecret) {
    throw new Error(
      'At least one of originSecret or integritySecret must be provided',
    );
  }

  const secretObject: SecretApiKey_Insert_Input = {
    apiKey,
    organizerId,
    ...optionalFields,
  };

  if (originSecret) {
    const salt = generateRandomString(16);
    const hashedOriginSecret = hashSecret(originSecret, salt);
    secretObject.hashedOriginSecret = hashedOriginSecret;
    secretObject.originSecretSalt = salt;
  }

  if (integritySecret) {
    secretObject.encryptedIntegritySecret = encryptSecret(integritySecret);
  }

  const res = await adminSdk.CreateSecretApiKey({
    object: secretObject,
  });

  if (!res || !res.insert_secretApiKey_one) {
    throw new Error('Failed to create secret API key');
  }

  return res.insert_secretApiKey_one;
}

interface CreateSecretApiKeyProps
  extends Omit<SecretApiKeyOptionalFields, 'status'>,
    Required<Pick<SecretApiKey_Insert_Input, 'organizerId'>> {
  apiKeyPrefix?: string;
  originSecret?: boolean;
  integritySecret?: boolean;
}

export async function createSecretApiKey({
  originSecret = true,
  integritySecret = true,
  ...props
}: CreateSecretApiKeyProps) {
  const apiKeyId = generateApiKeyId(props.apiKeyPrefix || '');
  let secretObject: SecretApiKey_Insert_Input = {
    ...props,
    apiKey: apiKeyId,
  };
  if (!originSecret && !integritySecret) {
    throw new Error(
      'At least one of originSecret or integritySecret must be true',
    );
  }
  let apiKeySecret: string = '';
  if (originSecret) {
    apiKeySecret = generateApiKeyId();
    const salt = generateRandomString(16);
    const hashedApiKeySecret = hashSecret(apiKeySecret, salt);
    secretObject = {
      ...secretObject,
      hashedOriginSecret: hashedApiKeySecret,
      originSecretSalt: salt,
    };
  }
  let apiKeyIntegritySecret: string = '';
  if (integritySecret) {
    apiKeyIntegritySecret = generateApiKeyId();
    secretObject = {
      ...secretObject,
      encryptedIntegritySecret: encryptSecret(apiKeyIntegritySecret),
    };
  }
  const res = await adminSdk.CreateSecretApiKey({
    object: secretObject,
  });
  if (!res || !res.insert_secretApiKey_one) {
    throw new Error('Failed to create Shopify API key');
  } else
    return {
      ...res.insert_secretApiKey_one,
      apiKeyIntegritySecret, // Return the secret to the caller, not stored into the database so it's secure. It's the caller's responsibility to store it securely.
      apiKeySecret, // Return the secret to the caller, not stored into the database so it's secure. It's the caller's responsibility to store it securely.
    };
}

export async function getSecretApiKey(apiKey: string) {
  const res = await adminSdk.GetSecretApiKey({
    apiKey,
  });
  return res?.secretApiKey?.[0];
}

type PublishableApiKeyOptionalFields = Pick<
  PublishableApiKey_Insert_Input,
  'allowlist' | 'expiresAt' | 'status' | 'name'
>;

interface CreatePublishableApiKeyProps
  extends Required<Pick<PublishableApiKey_Insert_Input, 'organizerId'>>,
    Omit<PublishableApiKeyOptionalFields, 'status'> {
  apiKeyPrefix?: string;
}

export async function createPublishableApiKey(
  props: CreatePublishableApiKeyProps,
) {
  const apiKeyId = generateApiKeyId(props.apiKeyPrefix || '');
  const res = await adminSdk.CreatePublishableApiKey({
    object: {
      ...props,
      apiKey: apiKeyId,
    },
  });
  if (!res || !res.insert_publishableApiKey_one) {
    throw new Error('Failed to create Shopify API key');
  } else return res.insert_publishableApiKey_one;
}

export async function getPublishableApiKey(apiKey: string) {
  const res = await adminSdk.GetPublishableApiKey({
    apiKey,
  });
  return res?.publishableApiKey?.[0];
}
