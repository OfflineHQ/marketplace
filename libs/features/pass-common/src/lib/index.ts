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
  return `/${
    process.env.UPLOAD_PATH_PREFIX || process.env.NEXT_PUBLIC_UPLOAD_PATH_PREFIX
  }/organizers/${organizerId}/events/${eventId}/${eventPassId}`;
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
  return `/${
    process.env.UPLOAD_PATH_PREFIX || process.env.NEXT_PUBLIC_UPLOAD_PATH_PREFIX
  }/users/${address}/${organizerId}/events/${eventId}/${eventPassId}/${eventId}-${eventPassId}-${tokenId}`;
};
