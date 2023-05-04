'use client';

// Imports
// ========================================================
import React from 'react';
import ClientOnly from './clientOnly';
import { useAuthContext, type SafeUser } from '@client/auth';

interface WalletProps {
  user: SafeUser;
}
// Page
// ========================================================
export default function Wallet({ user }: WalletProps) {
  const { login, logout } = useAuthContext();
  return (
    <div>
      <ClientOnly>
        {!user ? (
          <div>
            <button
              className="h-10 rounded-full bg-blue-600 px-6 text-white transition-colors duration-200 ease-in-out hover:bg-blue-800"
              onClick={login} // connect()
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div>
            <label className="mb-2 block text-zinc-400">
              Wallet Address Connected {user?.eoa}
            </label>
            <button
              className="h-10 rounded-full bg-red-600 px-6 text-white transition-colors duration-200 ease-in-out hover:bg-red-800"
              onClick={logout}
            >
              Disconnect Wallet
            </button>
          </div>
        )}
      </ClientOnly>
    </div>
  );
}
