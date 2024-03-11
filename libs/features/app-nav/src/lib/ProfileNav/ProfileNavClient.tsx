'use client';

import { useAuthContext } from '@next/auth';
import { Link } from '@next/navigation';
import { AppUser } from '@next/types';
import { useWalletContext } from '@next/wallet';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@ui/components';
import {
  LifeBuoy,
  LogIn,
  LogOut,
  Settings,
  SignUp,
  VerifyEmail,
} from '@ui/icons';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ProfileNav,
  ProfileNavSkeleton,
  type ProfileNavProps,
} from './ProfileNav';

const VerifyEmailDynamic = dynamic(
  async () => (await import('@features/kyc')).SumsubDialog,
  { ssr: false },
);

export interface ProfileNavClientProps
  extends Pick<ProfileNavProps, 'signInText' | 'accountPlaceholder'> {
  profileSectionsText: {
    myAccount: string;
    support: string;
    supportTitle: string;
    supportDescription: string;
    signOut: string;
    signOutTitle: string;
    signOutDescription: string;
    signIn: string;
    createAccount: string;
    createAccountTitle: string;
    createAccountDescription: string;
    dontHaveAnAccount: string;
    verifyEmail: string;
    verifyEmailContinue: string;
    settings: string;
  };
  isNextAuthConnected?: boolean;
  account: AppUser | undefined;
}

export const ProfileNavClient = ({
  signInText,
  accountPlaceholder,
  profileSectionsText,
  isNextAuthConnected,
  account,
}: ProfileNavClientProps) => {
  const { login, logout, createAccount, loginAuto, isReady, connecting } =
    useAuthContext();
  const { autoConnectAddress } = useWalletContext();
  const { toast } = useToast();
  const [isVerifyEmail, setIsVerifyEmail] = useState(false);

  const signOutUserAction = useCallback(async () => {
    await logout({ refresh: true });
    toast({
      title: profileSectionsText.signOutTitle,
      description: profileSectionsText.signOutDescription,
    });
  }, [logout, toast, profileSectionsText]);

  const createAccountAction = useCallback(async () => {
    await createAccount();
    toast({
      title: profileSectionsText.createAccountTitle,
      description: profileSectionsText.createAccountDescription,
    });
  }, [createAccount, toast, profileSectionsText]);

  // Inside your component or hook
  const loginMutation = useMutation({
    mutationFn: loginAuto, // Assuming loginAuto is your function to login
    onSuccess: () => {
      console.log('Auto login successful with: ', autoConnectAddress);
      // Handle success, e.g., updating state or notifying the user
    },
    onError: (error) => {
      console.error('Auto login failed with: ', error);
      // Handle error, e.g., showing an error message
    },
  });

  useEffect(() => {
    console.log({ autoConnectAddress, isReady, connecting });
    // Check if autoConnectAddress is available, the system is ready, and not currently connecting
    // Also, ensure the mutation is not already in progress or has not completed successfully
    if (
      autoConnectAddress &&
      isReady &&
      !connecting &&
      !isNextAuthConnected &&
      loginMutation.status === 'idle'
    ) {
      console.log('applying mutation for auto login', autoConnectAddress);
      loginMutation.mutate(autoConnectAddress);
    }
  }, [
    autoConnectAddress,
    isReady,
    connecting,
    loginMutation,
    isNextAuthConnected,
  ]);

  const commonSections: ProfileNavProps['items'] = [
    {
      type: 'item',
      wrapper: <Link href="/settings" />,
      icon: <Settings />,
      className: 'cursor-pointer',
      text: profileSectionsText.settings,
    },
    {
      type: 'item',
      icon: <LifeBuoy />,
      className: 'cursor-pointer',
      text: profileSectionsText.support,
      action: () =>
        toast({
          title: profileSectionsText.supportTitle,
          description: profileSectionsText.supportDescription,
        }),
    },
  ];

  const items: ProfileNavProps['items'] = useMemo(
    () =>
      !account
        ? [
            {
              type: 'item',
              icon: <LogIn />,
              className: 'cursor-pointer font-semibold',
              action: login,
              text: profileSectionsText.signIn,
            },
            { type: 'separator' },
            {
              type: 'label',
              className: 'font-normal text-xs',
              text: profileSectionsText.dontHaveAnAccount,
            },
            {
              type: 'item',
              icon: <SignUp />,
              className: 'cursor-pointer',
              action: createAccountAction,
              text: profileSectionsText.createAccount,
            },
            { type: 'separator' },
            ...commonSections,
          ]
        : [
            {
              type: 'label',
              text: profileSectionsText.myAccount,
              className: 'pt-2 pb-0',
            },
            account.email
              ? {
                  type: 'children',
                  children: (
                    <div className="overflow-hidden text-ellipsis px-2 pb-2 text-sm">
                      {account.email}
                    </div>
                  ),
                }
              : {
                  type: 'item',
                  icon: <VerifyEmail />,
                  className: 'cursor-pointer font-semibold',
                  action: () => setIsVerifyEmail(true),
                  text: profileSectionsText.verifyEmail,
                },
            { type: 'separator' },
            ...commonSections,
            { type: 'separator' },
            {
              type: 'item',
              icon: <LogOut />,
              className: 'cursor-pointer',
              action: signOutUserAction,
              text: profileSectionsText.signOut,
            },
          ],
    [
      account,
      signOutUserAction,
      login,
      profileSectionsText,
      commonSections,
      createAccountAction,
    ],
  );
  return connecting && !isNextAuthConnected ? (
    <ProfileNavSkeleton />
  ) : (
    <>
      {isVerifyEmail && (
        <VerifyEmailDynamic
          open={isVerifyEmail}
          confirmedText={profileSectionsText.verifyEmailContinue}
          onOpenChange={setIsVerifyEmail}
          title={profileSectionsText.verifyEmail}
        />
      )}
      <ProfileNav
        items={items}
        isLoading={connecting && !isNextAuthConnected}
        user={account}
        signInText={signInText}
        accountPlaceholder={accountPlaceholder}
      />
    </>
  );
};
