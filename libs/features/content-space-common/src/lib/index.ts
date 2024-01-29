export interface GetContentSpaceFolderPath {
  organizerId: string;
  contentSpaceId: string;
}

export const getContentSpaceFolderPath = ({
  organizerId,
  contentSpaceId,
}: GetContentSpaceFolderPath) => {
  return `/${
    process.env.UPLOAD_PATH_PREFIX || process.env.NEXT_PUBLIC_UPLOAD_PATH_PREFIX
  }/organizers/${organizerId}/content-spaces/${contentSpaceId}`;
};
