'use client';

import { EventPass } from '@features/back-office/events-types';
import { GetEventPassOrganizerFolderPath } from '@features/pass-common';
import { Button } from '@ui/components';

export interface EventPassDeployButtonClientProps
  extends GetEventPassOrganizerFolderPath {
  eventPass: EventPass;
  children: React.ReactNode;
}

export function EventPassDeployButtonClient({
  children,
  eventPass,
}: EventPassDeployButtonClientProps) {
  //TODO add deploy button + await for sdk with signer
  return <Button block>{children}</Button>;
}
