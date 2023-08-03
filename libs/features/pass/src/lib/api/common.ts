type GetPassOrganizer = {
  organizerSlug: string;
  eventSlug: string;
  eventPassId: string;
  tokenId: string;
};
type GetPassUser = GetPassOrganizer;

export const getPassOrganizer = ({
  organizerSlug,
  eventSlug,
  eventPassId,
  tokenId,
}: GetPassOrganizer) => {
  return `/${process.env.UPLOAD_PATH_PREFIX}/organizers/${organizerSlug}/events/${eventSlug}/${eventPassId}/${eventSlug}-${eventPassId}-${tokenId}`;
};

export const getPassUser = ({
  organizerSlug,
  eventSlug,
  eventPassId,
  tokenId,
}: GetPassUser) => {
  return `/${process.env.UPLOAD_PATH_PREFIX}/users/${organizerSlug}/events/${eventSlug}/${eventPassId}/${eventSlug}-${eventPassId}-${tokenId}`;
};
