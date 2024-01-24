'use client';

import * as Bytescale from '@bytescale/sdk';
import env from '@env/client';
import { useAuthContext } from '@next/auth';
import { getNextAppURL } from '@shared/client';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface BytescaleProviderProps {
  children?: React.ReactNode;
}

interface UploaderContextValue {
  sessionReady: boolean;
}

const UploaderContext = createContext<UploaderContextValue | undefined>(
  undefined,
);

export const useUploader = () => {
  const context = useContext(UploaderContext);
  if (!context) {
    throw new Error('useUploader must be used within an UploaderProvider');
  }
  return context;
};

export const UploaderProvider: React.FC<BytescaleProviderProps> = ({
  children,
}) => {
  const { safeUser } = useAuthContext();
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    if (safeUser && !sessionReady) {
      Bytescale.AuthManager.endAuthSession();
      Bytescale.AuthManager.beginAuthSession({
        accountId: env.NEXT_PUBLIC_UPLOAD_ACCOUNT_ID,
        authUrl: `${getNextAppURL()}api/bytescale/jwt`,
        authHeaders: async () => Promise.resolve({}),
      });
      setSessionReady(true);
    } else if (!safeUser && sessionReady) {
      Bytescale.AuthManager.endAuthSession();
      setSessionReady(false);
    }
  }, [safeUser, sessionReady]);

  return (
    <UploaderContext.Provider value={{ sessionReady }}>
      {children}
    </UploaderContext.Provider>
  );
};
