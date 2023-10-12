import env from '@env/server';

type GetEventPassOrganizerFolderPath = {
  organizerId: string;
  eventId: string;
  eventPassId: string;
};

interface GetPassOrganizer extends GetEventPassOrganizerFolderPath {
  tokenId: string;
}
interface GetPassUser extends GetPassOrganizer {
  address: string;
}

export const getEventPassOrganizerFolderPath = ({
  organizerId,
  eventId,
  eventPassId,
}: GetEventPassOrganizerFolderPath) => {
  return `/${env.UPLOAD_PATH_PREFIX}/organizers/${organizerId}/events/${eventId}/${eventPassId}`;
};

export const getPassOrganizer = ({
  organizerId,
  eventId,
  eventPassId,
  tokenId,
}: GetPassOrganizer) => {
  return `${getEventPassOrganizerFolderPath({
    organizerId,
    eventId,
    eventPassId,
  })}/${eventId}-${eventPassId}-${tokenId}`;
};

export const getPassUser = ({
  address,
  organizerId,
  eventId,
  eventPassId,
  tokenId,
}: GetPassUser) => {
  return `/${env.UPLOAD_PATH_PREFIX}/users/${address}/${organizerId}/events/${eventId}/${eventPassId}/${eventId}-${eventPassId}-${tokenId}`;
};
