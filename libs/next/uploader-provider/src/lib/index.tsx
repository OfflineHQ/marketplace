'use client';

import * as Bytescale from '@bytescale/sdk';
import type { UploaderInterface } from '@bytescale/upload-widget';
import env from '@env/client';
import { useAuthContext } from '@next/auth';
import { getNextAppURL } from '@shared/client';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface BytescaleProviderProps {
  children?: React.ReactNode;
}

interface UploaderContextValue {
  uploader: UploaderInterface | null;
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
  const [uploader, setUploader] = useState(false);

  useEffect(() => {
    if (safeUser && !uploader) {
      Bytescale.AuthManager.beginAuthSession({
        accountId: env.NEXT_PUBLIC_UPLOAD_ACCOUNT_ID,
        authUrl: `${getNextAppURL()}/api/bytescale/jwt`,
        authHeaders: async () => Promise.resolve({}),
      });
      setUploader(true);
    } else if (!safeUser && uploader) {
      Bytescale.AuthManager.endAuthSession();
      setUploader(false);
    }
  }, [safeUser, uploader]);

  return (
    <UploaderContext.Provider value={{ uploader }}>
      {children}
    </UploaderContext.Provider>
  );
};
