import type { ReviewStatus } from '@kyc/types';

export const isApplicantPending = (reviewStatus: ReviewStatus) => {
  return ['pending', 'queued', 'onHold'].includes(reviewStatus);
};
