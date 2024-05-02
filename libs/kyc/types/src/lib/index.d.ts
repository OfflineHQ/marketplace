import { KycLevelName_Enum, KycStatus_Enum } from '@gql/shared/types';
type IdDocType =
  | 'PASSPORT'
  | 'DRIVERS'
  | 'ID_CARD'
  | 'RESIDENCE_PERMIT'
  | 'SELFIE';
type VideoRequired = 'disabled' | 'enabled';
export type ReviewStatus = KycStatus_Enum;
type ApplicantType = 'individual' | 'company';
export type LevelName = KycLevelName_Enum;
type Gender = 'M' | 'F';
type Alpha3CountryCode = string;
type DateOfBirth = string;
interface Address {
  country?: Alpha3CountryCode;
  postCode?: string;
  town?: string;
  street?: string;
  subStreet?: string;
  state?: string;
}
interface IdDoc {
  [key: string]: any;
}
interface FixedInfo {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  firstNameEn?: string;
  lastNameEn?: string;
  middleNameEn?: string;
  legalName?: string;
  gender?: Gender;
  dob?: DateOfBirth;
  placeOfBirth?: string;
  country?: Alpha3CountryCode;
  nationality?: Alpha3CountryCode;
  addresses?: Address[];
  idDocs?: IdDoc[];
}
interface DocSet {
  idDocSetType: string;
  types: IdDocType[];
  videoRequired?: VideoRequired;
}
interface RequiredIdDocs {
  excludedCountries: string[];
  docSets: DocSet[];
}
interface Review {
  reprocessing: boolean;
  createDate: string;
  reviewStatus: ReviewStatus;
}
interface ApplicantBase {
  id: string;
  createdAt: string;
  clientId: string;
  externalUserId: string;
  fixedInfo: FixedInfo;
  email?: string;
  phone?: string;
  requiredIdDocs: RequiredIdDocs;
  type: ApplicantType;
}
export interface Applicant extends ApplicantBase {
  inspectionId: string;
  review: Review;
}
type ReviewAnswer = 'GREEN' | 'RED';
type ReviewRejectType = 'FINAL' | 'RETRY';
interface ReviewResult {
  reviewAnswer?: ReviewAnswer;
  rejectLabels: string[];
  reviewRejectType: ReviewRejectType;
  clientComment: string;
  moderationComment: string;
  buttonIds: string[];
}
export interface ApplicantReviewStatus {
  createDate?: string;
  reviewDate: string;
  startDate: string;
  reviewResult: ReviewResult;
  reviewStatus?: ReviewStatus;
  levelName: LevelName;
  attemptCnt: number;
}
export declare enum WebhookType {
  ApplicantReviewed = 'applicantReviewed',
  ApplicantPending = 'applicantPending',
  ApplicantCreated = 'applicantCreated',
  ApplicantOnHold = 'applicantOnHold',
  ApplicantPersonalInfoChanged = 'applicantPersonalInfoChanged',
  ApplicantPrechecked = 'applicantPrechecked',
  ApplicantDeleted = 'applicantDeleted',
  ApplicantLevelChanged = 'applicantLevelChanged',
  VideoIdentStatusChanged = 'videoIdentStatusChanged',
  ApplicantReset = 'applicantReset',
  ApplicantActionPending = 'applicantActionPending',
  ApplicantActionReviewed = 'applicantActionReviewed',
  ApplicantActionOnHold = 'applicantActionOnHold',
  ApplicantTravelRuleStatusChanged = 'applicantTravelRuleStatusChanged',
  ApplicantWorkflowCompleted = 'applicantWorkflowCompleted',
}
type VideoIdentReviewStatus = string;
interface ApplicantMemberOf {
  [key: string]: any;
}
export interface ApplicantWebhookPayload {
  applicantId: string;
  inspectionId: string;
  correlationId: string;
  levelName?: LevelName;
  externalUserId: string;
  type: WebhookType;
  sandboxMode: boolean;
  reviewStatus: ReviewStatus;
  createdAtMs: string;
  applicantType?: ApplicantType;
  reviewResult?: ReviewResult;
  applicantMemberOf?: ApplicantMemberOf[];
  videoIdentReviewStatus?: VideoIdentReviewStatus;
  applicantActionId?: string;
  externalApplicantActionId?: string;
  clientId: string;
}
type ISO639_1 = string;
interface Metadata {
  key: string;
  value: string;
}
interface Questionnaire {
  [key: string]: any;
}
export interface ApplicantPersonalData {
  id: string;
  inspectionId: string;
  externalUserId: string;
  sourceKey?: string;
  email?: string;
  phone?: string;
  lang?: ISO639_1;
  metadata?: Metadata[];
  fixedInfo?: FixedInfo;
  info?: FixedInfo;
  createdAt: string;
  requiredIdDocs?: RequiredIdDocs;
  review: Review;
  questionnaires?: Questionnaire[];
}
export interface SumsubRequest extends Request {
  sumsub: {
    rawBody: string;
    signature: string;
  };
}
export {};
