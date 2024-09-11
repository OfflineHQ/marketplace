'use client';

import * as Bytescale from '@bytescale/sdk';
import env from '@env/client';
import { getNextAppURL } from '@shared/client';
import { useSession } from 'next-auth/react';
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
  const { data } = useSession();
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    if (data && !sessionReady) {
      Bytescale.AuthManager.endAuthSession();
      Bytescale.AuthManager.beginAuthSession({
        accountId: env.NEXT_PUBLIC_BYTESCALE_ACCOUNT_ID,
        authUrl: `${getNextAppURL()}api/bytescale/jwt`,
        authHeaders: async () => Promise.resolve({}),
      });
      setSessionReady(true);
    } else if (!data && sessionReady) {
      Bytescale.AuthManager.endAuthSession();
      setSessionReady(false);
    }
  }, [data, sessionReady]);

  return (
    <UploaderContext.Provider value={{ sessionReady }}>
      {children}
    </UploaderContext.Provider>
  );
};
