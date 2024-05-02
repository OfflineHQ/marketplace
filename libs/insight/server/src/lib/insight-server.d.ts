import { FeatureFlagsEnum, Flags } from '@insight/types';
export declare class Posthog {
  private static instance?;
  private finalizationRegistry;
  private postHogClient;
  private constructor();
  static getInstance(): Posthog;
  static resetInstance(): void;
  reloadFeatureFlags(): void;
  getAllFlags(userAddress: string): Promise<Flags>;
  getFeatureFlag(flag: FeatureFlagsEnum, userAddress: string): Promise<boolean>;
  getFeatureFlagPayload(
    flag: FeatureFlagsEnum,
    userAddress: string,
  ): Promise<
    | (
        | string
        | number
        | boolean
        | {
            [key: string]:
              | string
              | number
              | boolean
              | any
              | (
                  | string
                  | number
                  | boolean
                  | any
                  | (
                      | string
                      | number
                      | boolean
                      | any
                      | (
                          | string
                          | number
                          | boolean
                          | any
                          | (
                              | string
                              | number
                              | boolean
                              | any
                              | (
                                  | string
                                  | number
                                  | boolean
                                  | any
                                  | (
                                      | string
                                      | number
                                      | boolean
                                      | any
                                      | (
                                          | string
                                          | number
                                          | boolean
                                          | any
                                          | (
                                              | string
                                              | number
                                              | boolean
                                              | any
                                              | (
                                                  | string
                                                  | number
                                                  | boolean
                                                  | any
                                                  | (
                                                      | string
                                                      | number
                                                      | boolean
                                                      | any
                                                      | (
                                                          | string
                                                          | number
                                                          | boolean
                                                          | any
                                                          | any
                                                          | null
                                                        )[]
                                                      | null
                                                    )[]
                                                  | null
                                                )[]
                                              | null
                                            )[]
                                          | null
                                        )[]
                                      | null
                                    )[]
                                  | null
                                )[]
                              | null
                            )[]
                          | null
                        )[]
                      | null
                    )[]
                  | null
                )[]
              | null;
          }
        | (
            | string
            | number
            | boolean
            | {
                [key: string]:
                  | string
                  | number
                  | boolean
                  | any
                  | (
                      | string
                      | number
                      | boolean
                      | any
                      | (
                          | string
                          | number
                          | boolean
                          | any
                          | (
                              | string
                              | number
                              | boolean
                              | any
                              | (
                                  | string
                                  | number
                                  | boolean
                                  | any
                                  | (
                                      | string
                                      | number
                                      | boolean
                                      | any
                                      | (
                                          | string
                                          | number
                                          | boolean
                                          | any
                                          | (
                                              | string
                                              | number
                                              | boolean
                                              | any
                                              | (
                                                  | string
                                                  | number
                                                  | boolean
                                                  | any
                                                  | (
                                                      | string
                                                      | number
                                                      | boolean
                                                      | any
                                                      | (
                                                          | string
                                                          | number
                                                          | boolean
                                                          | any
                                                          | (
                                                              | string
                                                              | number
                                                              | boolean
                                                              | any
                                                              | any
                                                              | null
                                                            )[]
                                                          | null
                                                        )[]
                                                      | null
                                                    )[]
                                                  | null
                                                )[]
                                              | null
                                            )[]
                                          | null
                                        )[]
                                      | null
                                    )[]
                                  | null
                                )[]
                              | null
                            )[]
                          | null
                        )[]
                      | null
                    )[]
                  | null;
              }
            | (
                | string
                | number
                | boolean
                | {
                    [key: string]:
                      | string
                      | number
                      | boolean
                      | any
                      | (
                          | string
                          | number
                          | boolean
                          | any
                          | (
                              | string
                              | number
                              | boolean
                              | any
                              | (
                                  | string
                                  | number
                                  | boolean
                                  | any
                                  | (
                                      | string
                                      | number
                                      | boolean
                                      | any
                                      | (
                                          | string
                                          | number
                                          | boolean
                                          | any
                                          | (
                                              | string
                                              | number
                                              | boolean
                                              | any
                                              | (
                                                  | string
                                                  | number
                                                  | boolean
                                                  | any
                                                  | (
                                                      | string
                                                      | number
                                                      | boolean
                                                      | any
                                                      | (
                                                          | string
                                                          | number
                                                          | boolean
                                                          | any
                                                          | (
                                                              | string
                                                              | number
                                                              | boolean
                                                              | any
                                                              | (
                                                                  | string
                                                                  | number
                                                                  | boolean
                                                                  | any
                                                                  | any
                                                                  | null
                                                                )[]
                                                              | null
                                                            )[]
                                                          | null
                                                        )[]
                                                      | null
                                                    )[]
                                                  | null
                                                )[]
                                              | null
                                            )[]
                                          | null
                                        )[]
                                      | null
                                    )[]
                                  | null
                                )[]
                              | null
                            )[]
                          | null
                        )[]
                      | null;
                  }
                | (
                    | string
                    | number
                    | boolean
                    | {
                        [key: string]:
                          | string
                          | number
                          | boolean
                          | any
                          | (
                              | string
                              | number
                              | boolean
                              | any
                              | (
                                  | string
                                  | number
                                  | boolean
                                  | any
                                  | (
                                      | string
                                      | number
                                      | boolean
                                      | any
                                      | (
                                          | string
                                          | number
                                          | boolean
                                          | any
                                          | (
                                              | string
                                              | number
                                              | boolean
                                              | any
                                              | (
                                                  | string
                                                  | number
                                                  | boolean
                                                  | any
                                                  | (
                                                      | string
                                                      | number
                                                      | boolean
                                                      | any
                                                      | (
                                                          | string
                                                          | number
                                                          | boolean
                                                          | any
                                                          | (
                                                              | string
                                                              | number
                                                              | boolean
                                                              | any
                                                              | (
                                                                  | string
                                                                  | number
                                                                  | boolean
                                                                  | any
                                                                  | (
                                                                      | string
                                                                      | number
                                                                      | boolean
                                                                      | any
                                                                      | any
                                                                      | null
                                                                    )[]
                                                                  | null
                                                                )[]
                                                              | null
                                                            )[]
                                                          | null
                                                        )[]
                                                      | null
                                                    )[]
                                                  | null
                                                )[]
                                              | null
                                            )[]
                                          | null
                                        )[]
                                      | null
                                    )[]
                                  | null
                                )[]
                              | null
                            )[]
                          | null;
                      }
                    | (
                        | string
                        | number
                        | boolean
                        | {
                            [key: string]:
                              | string
                              | number
                              | boolean
                              | any
                              | (
                                  | string
                                  | number
                                  | boolean
                                  | any
                                  | (
                                      | string
                                      | number
                                      | boolean
                                      | any
                                      | (
                                          | string
                                          | number
                                          | boolean
                                          | any
                                          | (
                                              | string
                                              | number
                                              | boolean
                                              | any
                                              | (
                                                  | string
                                                  | number
                                                  | boolean
                                                  | any
                                                  | (
                                                      | string
                                                      | number
                                                      | boolean
                                                      | any
                                                      | (
                                                          | string
                                                          | number
                                                          | boolean
                                                          | any
                                                          | (
                                                              | string
                                                              | number
                                                              | boolean
                                                              | any
                                                              | (
                                                                  | string
                                                                  | number
                                                                  | boolean
                                                                  | any
                                                                  | (
                                                                      | string
                                                                      | number
                                                                      | boolean
                                                                      | any
                                                                      | (
                                                                          | string
                                                                          | number
                                                                          | boolean
                                                                          | any
                                                                          | any
                                                                          | null
                                                                        )[]
                                                                      | null
                                                                    )[]
                                                                  | null
                                                                )[]
                                                              | null
                                                            )[]
                                                          | null
                                                        )[]
                                                      | null
                                                    )[]
                                                  | null
                                                )[]
                                              | null
                                            )[]
                                          | null
                                        )[]
                                      | null
                                    )[]
                                  | null
                                )[]
                              | null;
                          }
                        | (
                            | string
                            | number
                            | boolean
                            | {
                                [key: string]:
                                  | string
                                  | number
                                  | boolean
                                  | any
                                  | (
                                      | string
                                      | number
                                      | boolean
                                      | any
                                      | (
                                          | string
                                          | number
                                          | boolean
                                          | any
                                          | (
                                              | string
                                              | number
                                              | boolean
                                              | any
                                              | (
                                                  | string
                                                  | number
                                                  | boolean
                                                  | any
                                                  | (
                                                      | string
                                                      | number
                                                      | boolean
                                                      | any
                                                      | (
                                                          | string
                                                          | number
                                                          | boolean
                                                          | any
                                                          | (
                                                              | string
                                                              | number
                                                              | boolean
                                                              | any
                                                              | (
                                                                  | string
                                                                  | number
                                                                  | boolean
                                                                  | any
                                                                  | (
                                                                      | string
                                                                      | number
                                                                      | boolean
                                                                      | any
                                                                      | (
                                                                          | string
                                                                          | number
                                                                          | boolean
                                                                          | any
                                                                          | (
                                                                              | string
                                                                              | number
                                                                              | boolean
                                                                              | any
                                                                              | any
                                                                              | null
                                                                            )[]
                                                                          | null
                                                                        )[]
                                                                      | null
                                                                    )[]
                                                                  | null
                                                                )[]
                                                              | null
                                                            )[]
                                                          | null
                                                        )[]
                                                      | null
                                                    )[]
                                                  | null
                                                )[]
                                              | null
                                            )[]
                                          | null
                                        )[]
                                      | null
                                    )[]
                                  | null;
                              }
                            | (
                                | string
                                | number
                                | boolean
                                | {
                                    [key: string]:
                                      | string
                                      | number
                                      | boolean
                                      | any
                                      | (
                                          | string
                                          | number
                                          | boolean
                                          | any
                                          | (
                                              | string
                                              | number
                                              | boolean
                                              | any
                                              | (
                                                  | string
                                                  | number
                                                  | boolean
                                                  | any
                                                  | (
                                                      | string
                                                      | number
                                                      | boolean
                                                      | any
                                                      | (
                                                          | string
                                                          | number
                                                          | boolean
                                                          | any
                                                          | (
                                                              | string
                                                              | number
                                                              | boolean
                                                              | any
                                                              | (
                                                                  | string
                                                                  | number
                                                                  | boolean
                                                                  | any
                                                                  | (
                                                                      | string
                                                                      | number
                                                                      | boolean
                                                                      | any
                                                                      | (
                                                                          | string
                                                                          | number
                                                                          | boolean
                                                                          | any
                                                                          | (
                                                                              | string
                                                                              | number
                                                                              | boolean
                                                                              | any
                                                                              | (
                                                                                  | string
                                                                                  | number
                                                                                  | boolean
                                                                                  | any
                                                                                  | any
                                                                                  | null
                                                                                )[]
                                                                              | null
                                                                            )[]
                                                                          | null
                                                                        )[]
                                                                      | null
                                                                    )[]
                                                                  | null
                                                                )[]
                                                              | null
                                                            )[]
                                                          | null
                                                        )[]
                                                      | null
                                                    )[]
                                                  | null
                                                )[]
                                              | null
                                            )[]
                                          | null
                                        )[]
                                      | null;
                                  }
                                | (
                                    | string
                                    | number
                                    | boolean
                                    | {
                                        [key: string]:
                                          | string
                                          | number
                                          | boolean
                                          | any
                                          | (
                                              | string
                                              | number
                                              | boolean
                                              | any
                                              | (
                                                  | string
                                                  | number
                                                  | boolean
                                                  | any
                                                  | (
                                                      | string
                                                      | number
                                                      | boolean
                                                      | any
                                                      | (
                                                          | string
                                                          | number
                                                          | boolean
                                                          | any
                                                          | (
                                                              | string
                                                              | number
                                                              | boolean
                                                              | any
                                                              | (
                                                                  | string
                                                                  | number
                                                                  | boolean
                                                                  | any
                                                                  | (
                                                                      | string
                                                                      | number
                                                                      | boolean
                                                                      | any
                                                                      | (
                                                                          | string
                                                                          | number
                                                                          | boolean
                                                                          | any
                                                                          | (
                                                                              | string
                                                                              | number
                                                                              | boolean
                                                                              | any
                                                                              | (
                                                                                  | string
                                                                                  | number
                                                                                  | boolean
                                                                                  | any
                                                                                  | (
                                                                                      | string
                                                                                      | number
                                                                                      | boolean
                                                                                      | any
                                                                                      | any
                                                                                      | null
                                                                                    )[]
                                                                                  | null
                                                                                )[]
                                                                              | null
                                                                            )[]
                                                                          | null
                                                                        )[]
                                                                      | null
                                                                    )[]
                                                                  | null
                                                                )[]
                                                              | null
                                                            )[]
                                                          | null
                                                        )[]
                                                      | null
                                                    )[]
                                                  | null
                                                )[]
                                              | null
                                            )[]
                                          | null;
                                      }
                                    | (
                                        | string
                                        | number
                                        | boolean
                                        | {
                                            [key: string]:
                                              | string
                                              | number
                                              | boolean
                                              | any
                                              | (
                                                  | string
                                                  | number
                                                  | boolean
                                                  | any
                                                  | (
                                                      | string
                                                      | number
                                                      | boolean
                                                      | any
                                                      | (
                                                          | string
                                                          | number
                                                          | boolean
                                                          | any
                                                          | (
                                                              | string
                                                              | number
                                                              | boolean
                                                              | any
                                                              | (
                                                                  | string
                                                                  | number
                                                                  | boolean
                                                                  | any
                                                                  | (
                                                                      | string
                                                                      | number
                                                                      | boolean
                                                                      | any
                                                                      | (
                                                                          | string
                                                                          | number
                                                                          | boolean
                                                                          | any
                                                                          | (
                                                                              | string
                                                                              | number
                                                                              | boolean
                                                                              | any
                                                                              | (
                                                                                  | string
                                                                                  | number
                                                                                  | boolean
                                                                                  | any
                                                                                  | (
                                                                                      | string
                                                                                      | number
                                                                                      | boolean
                                                                                      | any
                                                                                      | (
                                                                                          | string
                                                                                          | number
                                                                                          | boolean
                                                                                          | any
                                                                                          | any
                                                                                          | null
                                                                                        )[]
                                                                                      | null
                                                                                    )[]
                                                                                  | null
                                                                                )[]
                                                                              | null
                                                                            )[]
                                                                          | null
                                                                        )[]
                                                                      | null
                                                                    )[]
                                                                  | null
                                                                )[]
                                                              | null
                                                            )[]
                                                          | null
                                                        )[]
                                                      | null
                                                    )[]
                                                  | null
                                                )[]
                                              | null;
                                          }
                                        | (
                                            | string
                                            | number
                                            | boolean
                                            | {
                                                [key: string]:
                                                  | string
                                                  | number
                                                  | boolean
                                                  | any
                                                  | (
                                                      | string
                                                      | number
                                                      | boolean
                                                      | any
                                                      | (
                                                          | string
                                                          | number
                                                          | boolean
                                                          | any
                                                          | (
                                                              | string
                                                              | number
                                                              | boolean
                                                              | any
                                                              | (
                                                                  | string
                                                                  | number
                                                                  | boolean
                                                                  | any
                                                                  | (
                                                                      | string
                                                                      | number
                                                                      | boolean
                                                                      | any
                                                                      | (
                                                                          | string
                                                                          | number
                                                                          | boolean
                                                                          | any
                                                                          | (
                                                                              | string
                                                                              | number
                                                                              | boolean
                                                                              | any
                                                                              | (
                                                                                  | string
                                                                                  | number
                                                                                  | boolean
                                                                                  | any
                                                                                  | (
                                                                                      | string
                                                                                      | number
                                                                                      | boolean
                                                                                      | any
                                                                                      | (
                                                                                          | string
                                                                                          | number
                                                                                          | boolean
                                                                                          | any
                                                                                          | (
                                                                                              | string
                                                                                              | number
                                                                                              | boolean
                                                                                              | any
                                                                                              | any
                                                                                              | null
                                                                                            )[]
                                                                                          | null
                                                                                        )[]
                                                                                      | null
                                                                                    )[]
                                                                                  | null
                                                                                )[]
                                                                              | null
                                                                            )[]
                                                                          | null
                                                                        )[]
                                                                      | null
                                                                    )[]
                                                                  | null
                                                                )[]
                                                              | null
                                                            )[]
                                                          | null
                                                        )[]
                                                      | null
                                                    )[]
                                                  | null;
                                              }
                                            | (
                                                | string
                                                | number
                                                | boolean
                                                | {
                                                    [key: string]:
                                                      | string
                                                      | number
                                                      | boolean
                                                      | any
                                                      | (
                                                          | string
                                                          | number
                                                          | boolean
                                                          | any
                                                          | (
                                                              | string
                                                              | number
                                                              | boolean
                                                              | any
                                                              | (
                                                                  | string
                                                                  | number
                                                                  | boolean
                                                                  | any
                                                                  | (
                                                                      | string
                                                                      | number
                                                                      | boolean
                                                                      | any
                                                                      | (
                                                                          | string
                                                                          | number
                                                                          | boolean
                                                                          | any
                                                                          | (
                                                                              | string
                                                                              | number
                                                                              | boolean
                                                                              | any
                                                                              | (
                                                                                  | string
                                                                                  | number
                                                                                  | boolean
                                                                                  | any
                                                                                  | (
                                                                                      | string
                                                                                      | number
                                                                                      | boolean
                                                                                      | any
                                                                                      | (
                                                                                          | string
                                                                                          | number
                                                                                          | boolean
                                                                                          | any
                                                                                          | (
                                                                                              | string
                                                                                              | number
                                                                                              | boolean
                                                                                              | any
                                                                                              | (
                                                                                                  | string
                                                                                                  | number
                                                                                                  | boolean
                                                                                                  | any
                                                                                                  | any
                                                                                                  | null
                                                                                                )[]
                                                                                              | null
                                                                                            )[]
                                                                                          | null
                                                                                        )[]
                                                                                      | null
                                                                                    )[]
                                                                                  | null
                                                                                )[]
                                                                              | null
                                                                            )[]
                                                                          | null
                                                                        )[]
                                                                      | null
                                                                    )[]
                                                                  | null
                                                                )[]
                                                              | null
                                                            )[]
                                                          | null
                                                        )[]
                                                      | null;
                                                  }
                                                | (
                                                    | string
                                                    | number
                                                    | boolean
                                                    | {
                                                        [key: string]:
                                                          | string
                                                          | number
                                                          | boolean
                                                          | any
                                                          | (
                                                              | string
                                                              | number
                                                              | boolean
                                                              | any
                                                              | (
                                                                  | string
                                                                  | number
                                                                  | boolean
                                                                  | any
                                                                  | (
                                                                      | string
                                                                      | number
                                                                      | boolean
                                                                      | any
                                                                      | (
                                                                          | string
                                                                          | number
                                                                          | boolean
                                                                          | any
                                                                          | (
                                                                              | string
                                                                              | number
                                                                              | boolean
                                                                              | any
                                                                              | (
                                                                                  | string
                                                                                  | number
                                                                                  | boolean
                                                                                  | any
                                                                                  | (
                                                                                      | string
                                                                                      | number
                                                                                      | boolean
                                                                                      | any
                                                                                      | (
                                                                                          | string
                                                                                          | number
                                                                                          | boolean
                                                                                          | any
                                                                                          | (
                                                                                              | string
                                                                                              | number
                                                                                              | boolean
                                                                                              | any
                                                                                              | (
                                                                                                  | string
                                                                                                  | number
                                                                                                  | boolean
                                                                                                  | any
                                                                                                  | (
                                                                                                      | string
                                                                                                      | number
                                                                                                      | boolean
                                                                                                      | any
                                                                                                      | any
                                                                                                      | null
                                                                                                    )[]
                                                                                                  | null
                                                                                                )[]
                                                                                              | null
                                                                                            )[]
                                                                                          | null
                                                                                        )[]
                                                                                      | null
                                                                                    )[]
                                                                                  | null
                                                                                )[]
                                                                              | null
                                                                            )[]
                                                                          | null
                                                                        )[]
                                                                      | null
                                                                    )[]
                                                                  | null
                                                                )[]
                                                              | null
                                                            )[]
                                                          | null;
                                                      }
                                                    | any
                                                    | null
                                                  )[]
                                                | null
                                              )[]
                                            | null
                                          )[]
                                        | null
                                      )[]
                                    | null
                                  )[]
                                | null
                              )[]
                            | null
                          )[]
                        | null
                      )[]
                    | null
                  )[]
                | null
              )[]
            | null
          )[]
        | null
      )
    | undefined
  >;
}
