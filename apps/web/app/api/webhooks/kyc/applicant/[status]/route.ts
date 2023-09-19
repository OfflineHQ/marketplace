import { SumsubRequest } from '@kyc/types';
import { applicantStatusChanged } from '@kyc/webhooks';

export async function POST(req: SumsubRequest, { params: { status } }) {
  return applicantStatusChanged(req, status);
}
