type GetPassOrganizer = {
  organizerId: string;
  eventId: string;
  eventPassId: string;
  tokenId: string;
};
interface GetPassUser extends GetPassOrganizer {
  address: string;
}

export const getPassOrganizer = ({
  organizerId,
  eventId,
  eventPassId,
  tokenId,
}: GetPassOrganizer) => {
  return `/${process.env.UPLOAD_PATH_PREFIX}/organizers/${organizerId}/events/${eventId}/${eventPassId}/${eventId}-${eventPassId}-${tokenId}`;
};

export const getPassUser = ({
  address,
  organizerId,
  eventId,
  eventPassId,
  tokenId,
}: GetPassUser) => {
  return `/${process.env.UPLOAD_PATH_PREFIX}/users/${address}/${organizerId}/events/${eventId}/${eventPassId}/${eventId}-${eventPassId}-${tokenId}`;
};
