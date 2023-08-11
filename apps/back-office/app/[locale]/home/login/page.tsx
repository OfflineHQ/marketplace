import { useAuthContext } from '@next/auth';
import { Button, useToast } from '@ui/components';
import React, { useMemo, useCallback } from 'react';

export default async function Blabla(signInUserAction) {
  return (
    <>
      <Button onClick={signInUserAction}>Login</Button>
    </>
  );
}
