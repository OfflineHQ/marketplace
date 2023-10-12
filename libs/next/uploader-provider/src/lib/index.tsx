'use client';

import env from '@env/client';
import { useAuthContext } from '@next/auth';
import { getNextAppURL } from '@shared/client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UploaderInterface } from 'uploader';
import { Uploader } from 'uploader';

interface BytescaleProviderProps {
  children?: React.ReactNode;
}

interface UploaderContextValue {
  uploader: UploaderInterface | null;
}

const UploaderContext = createContext<UploaderContextValue | undefined>(
  undefined
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
  const [uploader, setUploader] = useState<UploaderInterface | null>(null);

  useEffect(() => {
    if (safeUser && !uploader) {
      const uploaderInstance = Uploader({
        apiKey: env.NEXT_PUBLIC_UPLOAD_PUBLIC_API_KEY,
      });
      uploaderInstance.beginAuthSession(
        `${getNextAppURL()}/api/bytescale/jwt`,
        async () => Promise.resolve({})
      );
      setUploader(uploaderInstance);
    } else if (!safeUser && uploader) {
      uploader.endAuthSession();
      setUploader(null);
    }
  }, [safeUser, uploader]);

  return (
    <UploaderContext.Provider value={{ uploader }}>
      {children}
    </UploaderContext.Provider>
  );
};
