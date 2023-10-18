import { adminSdk } from '@gql/admin/api';
import { KycStatus_Enum } from '@gql/shared/types';
import {
  ApplicantWebhookPayload,
  SumsubRequest,
  WebhookType,
} from '@kyc/types';
import { applicantStatusChanged } from './applicantStatusChanged';
import { isValidSignatureForSumsubRequest } from './utils';

// Mock implementations
jest.mock('./utils', () => ({
  isValidSignatureForSumsubRequest: jest.fn().mockReturnValue(true),
  addSumsubContextToRequest: jest.fn(),
}));

// Spy on the methods
const updateKycSpy = jest.spyOn(adminSdk, 'UpdateKyc').mockResolvedValue({});
const deleteKycSpy = jest.spyOn(adminSdk, 'DeleteKyc').mockResolvedValue({});

const mockPayload: ApplicantWebhookPayload = {
  applicantId: 'test-applicant-id',
  inspectionId: 'test-inspection-id',
  correlationId: 'test-correlation-id',
  externalUserId: 'test-external-user-id',
  type: WebhookType.ApplicantReviewed,
  sandboxMode: false,
  reviewStatus: KycStatus_Enum.Completed,
  createdAtMs: new Date().toISOString(),
  clientId: 'test-client-id',
};

// Create a mock Headers object
const mockHeaders: Headers = {
  get: jest.fn().mockReturnValue('mock-x-payload-digest'),
} as unknown as Headers;

// Mock the headers function to return the mock Headers object
jest.mock('next/headers', () => ({
  headers: () => mockHeaders,
}));

// Mock SumsubRequest
const createMockSumsubRequest = (
  body: ApplicantWebhookPayload,
): SumsubRequest => {
  return {
    sumsub: {
      rawBody: JSON.stringify(body),
      signature: 'mock-signature',
    },
    text: jest.fn().mockResolvedValue(JSON.stringify(body)),
  } as unknown as SumsubRequest;
};

describe('applicantStatusChanged', () => {
  beforeEach(() => {
    updateKycSpy.mockClear();
    deleteKycSpy.mockClear();
  });
  it('should process applicant status change correctly', async () => {
    const response = await applicantStatusChanged(
      createMockSumsubRequest(mockPayload),
      'test-status',
    );

    expect(response.status).toEqual(200);
    expect(isValidSignatureForSumsubRequest).toHaveBeenCalled();
    expect(updateKycSpy).toHaveBeenCalledWith({
      externalUserId: mockPayload.externalUserId,
      kyc: {
        reviewStatus: mockPayload.reviewStatus,
      },
    });
    expect(deleteKycSpy).not.toHaveBeenCalled();
  });

  it('should delete applicant if type is delete', async () => {
    const mockPayloadDelete = {
      ...mockPayload,
      type: WebhookType.ApplicantDeleted,
    };
    const response = await applicantStatusChanged(
      createMockSumsubRequest(mockPayloadDelete),
      'test-status',
    );
    expect(response.status).toEqual(200);
    expect(isValidSignatureForSumsubRequest).toHaveBeenCalled();
    expect(deleteKycSpy).toHaveBeenCalledWith({
      externalUserId: mockPayload.externalUserId,
    });
    expect(updateKycSpy).not.toHaveBeenCalled();
  });

  it('should return error 403 from invalid signature', async () => {
    // Override the validation to return false
    (isValidSignatureForSumsubRequest as jest.Mock).mockReturnValueOnce(false);

    const response = await applicantStatusChanged(
      createMockSumsubRequest(mockPayload),
      'test-status',
    );

    expect(response.status).toEqual(403);
  });

  it('should return error 400 for incorrect webhook type', async () => {
    const mockPayloadTypeError: ApplicantWebhookPayload = {
      ...mockPayload,
      type: WebhookType.ApplicantWorkflowCompleted, // Invalid Type
    };

    const response = await applicantStatusChanged(
      createMockSumsubRequest(mockPayloadTypeError),
      'test-status',
    );

    expect(response.status).toEqual(400);
  });
});
