// https://developers.sumsub.com/api-reference/#webhook-types
// applicantPending => When a user uploaded all the required documents and the applicant's status changed to pending.
// applicantReviewed => When verification is completed. Contains the verification result.
// applicantOnHold => Processing of the applicant is paused for an agreed reason.
// applicantDeleted => Applicant has been permanently deleted.
// applicantReset => Applicant has been reset: applicant status changed to init and all documents were set as inactive.

import { adminSdk } from '@gql/admin/api';
import {
  WebhookType,
  type ApplicantWebhookPayload,
  type SumsubRequest,
} from '@kyc/types';
import { headers } from 'next/headers';
import {
  addSumsubContextToRequest,
  isValidSignatureForSumsubRequest,
} from './utils';
import env from '@env/server';

export async function applicantStatusChanged(
  req: SumsubRequest,
  status: string
) {
  const body = await req.text();
  const signature = headers().get('x-payload-digest') as string;
  addSumsubContextToRequest(req, body, signature);

  if (!isValidSignatureForSumsubRequest(req, env.SUMSUB_WEBHOOKS_SECRET_KEY)) {
    return new Response('Signature validation failed, unauthorized!', {
      status: 403,
    });
  }
  const applicantPaypload: ApplicantWebhookPayload = JSON.parse(body);

  if (
    ![
      WebhookType.ApplicantPending,
      WebhookType.ApplicantReviewed,
      WebhookType.ApplicantOnHold,
      WebhookType.ApplicantDeleted,
      WebhookType.ApplicantReset,
    ].includes(applicantPaypload.type)
  ) {
    return new Response(`Invalid webhook type: ${applicantPaypload.type}`, {
      status: 400,
    });
  }
  //TODO send email or notifications depending on the type of applicant status changes.
  if (applicantPaypload.type !== WebhookType.ApplicantDeleted)
    await adminSdk.UpdateKyc({
      externalUserId: applicantPaypload.externalUserId,
      kyc: {
        reviewStatus: applicantPaypload.reviewStatus,
      },
    });
  else {
    await adminSdk.DeleteKyc({
      externalUserId: applicantPaypload.externalUserId,
    });
  }
  return new Response(null, { status: 200 });
}
