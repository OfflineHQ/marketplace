'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Uploader } from 'uploader';
import type { UploaderInterface } from 'uploader';
import { getNextAppURL } from '@utils';
import { useAuthContext } from '@next/auth';

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
        apiKey: (process.env.UPLOAD_PUBLIC_API_KEY ||
          process.env.NEXT_PUBLIC_UPLOAD_PUBLIC_API_KEY) as string,
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
