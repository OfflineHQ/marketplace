type GetPassOrganizer = {
  organizerSlug: string;
  eventSlug: string;
  eventPassId: string;
  tokenId: string;
};
interface GetPassUser extends GetPassOrganizer {
  address: string;
}

export const getPassOrganizer = ({
  organizerSlug,
  eventSlug,
  eventPassId,
  tokenId,
}: GetPassOrganizer) => {
  return `/${process.env.UPLOAD_PATH_PREFIX}/organizers/${organizerSlug}/events/${eventSlug}/${eventPassId}/${eventSlug}-${eventPassId}-${tokenId}`;
};

export const getPassUser = ({
  address,
  organizerSlug,
  eventSlug,
  eventPassId,
  tokenId,
}: GetPassUser) => {
  return `/${process.env.UPLOAD_PATH_PREFIX}/users/${address}/${organizerSlug}/events/${eventSlug}/${eventPassId}/${eventSlug}-${eventPassId}-${tokenId}`;
};
