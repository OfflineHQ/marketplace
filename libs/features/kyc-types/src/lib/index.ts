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
type Alpha3CountryCode = string; // Alpha-3 country code, e.g., 'DEU', 'GBR'
type DateOfBirth = string; // YYYY-mm-dd format, e.g., '2001-09-25'

interface Address {
  // Alpha-3 country code.
  country?: Alpha3CountryCode;

  // Postal code.
  postCode?: string;

  // Town or city name.
  town?: string;

  // Street name.
  street?: string;

  // Additional street information.
  subStreet?: string;

  // State name if applicable.
  state?: string;
}

interface IdDoc {
  // Represents the set of data recognized from uploaded documents.
  // Details not explicitly mentioned in the doc
  [key: string]: any;
}

interface FixedInfo {
  // First name.
  firstName?: string;

  // Last name.
  lastName?: string;

  // Middle name.
  middleName?: string;

  // Automatic transliteration of the first name.
  firstNameEn?: string;

  // Automatic transliteration of the last name.
  lastNameEn?: string;

  // Automatic transliteration of the middle name.
  middleNameEn?: string;

  // Legal name.
  legalName?: string;

  // Sex of a person (M or F).
  gender?: Gender;

  // Date of birth (format YYYY-mm-dd, e.g. 2001-09-25).
  dob?: DateOfBirth;

  // Place of birth.
  placeOfBirth?: string;

  // Alpha-3 country code (e.g. DEU or GBR) (Wikipedia).
  country?: Alpha3CountryCode;

  // Alpha-3 country code (Wikipedia).
  nationality?: Alpha3CountryCode;

  // List of addresses.
  addresses?: Address[];

  // Represents the set of data recognized from uploaded documents.
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
  createDate?: string; // Date in your application
  reviewDate: string; // Date in your application
  startDate: string; // Date in your application
  reviewResult: ReviewResult;
  reviewStatus?: ReviewStatus;
  levelName: LevelName;
  attemptCnt: number;
}

export enum WebhookType {
  // When verification is completed. Contains the verification result.
  ApplicantReviewed = 'applicantReviewed',

  // When a user uploaded all the required documents and the applicant's status changed to pending.
  ApplicantPending = 'applicantPending',

  // When an applicant is created.
  ApplicantCreated = 'applicantCreated',

  // Processing of the applicant is paused for an agreed reason.
  ApplicantOnHold = 'applicantOnHold',

  // Applicant's personal info has been changed.
  ApplicantPersonalInfoChanged = 'applicantPersonalInfoChanged',

  // When primary data processing is completed.
  ApplicantPrechecked = 'applicantPrechecked',

  // Applicant has been permanently deleted.
  ApplicantDeleted = 'applicantDeleted',

  // Applicant level has been changed.
  ApplicantLevelChanged = 'applicantLevelChanged',

  // Status of Video Ident type of verification has been changed.
  VideoIdentStatusChanged = 'videoIdentStatusChanged',

  // Applicant has been reset: applicant status changed to init and all documents were set as inactive.
  ApplicantReset = 'applicantReset',

  // Applicant action status changed to pending.
  ApplicantActionPending = 'applicantActionPending',

  // Applicant action verification has been completed.
  ApplicantActionReviewed = 'applicantActionReviewed',

  // Applicant action verification has been paused for an agreed reason.
  ApplicantActionOnHold = 'applicantActionOnHold',

  // Travel rule request status has been changed.
  ApplicantTravelRuleStatusChanged = 'applicantTravelRuleStatusChanged',

  // Workflow has been completed for an applicant.
  ApplicantWorkflowCompleted = 'applicantWorkflowCompleted',
}

type VideoIdentReviewStatus = string; // Replace with specific statuses if available

// Contains the list of company applicantIds that current applicant belongs as a beneficiary.
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
  createdAtMs: string; // Date string in specified format
  applicantType?: ApplicantType;
  reviewResult?: ReviewResult;
  applicantMemberOf?: ApplicantMemberOf[];
  videoIdentReviewStatus?: VideoIdentReviewStatus;
  applicantActionId?: string;
  externalApplicantActionId?: string;
  clientId: string;
}

type ISO639_1 = string; // ISO 639-1 language codes, e.g. 'en', 'fr', 'de'

interface Metadata {
  key: string;
  value: string;
}

interface Questionnaire {
  // Contains data about filled questionnaire.
  // Details not explicitly mentioned in the doc
  [key: string]: any;
}

export interface ApplicantPersonalData {
  // An applicantId.
  id: string;

  // Inspection ID.
  inspectionId: string;

  // An applicant ID on the client side, should be unique.
  externalUserId: string;

  // If you want to separate your clients that send applicants, provide this field to distinguish between them.
  // It also shows up at the webhook payloads.
  sourceKey?: string;

  // Applicant email.
  email?: string;

  // Applicant phone number.
  phone?: string;

  // The language in which the applicant should see the result of verification in ISO 639-1 format.
  lang?: ISO639_1;

  // Additional information that is not displayed to the end user.
  metadata?: Metadata[];

  // Basic information about the applicant that we shouldn't change from our side but cross-validate it with data recognized from documents.
  fixedInfo?: FixedInfo;

  // info that could be changed by the client so not validated from documents.
  info?: FixedInfo;

  // Time and date of applicant creation.
  createdAt: string;

  // Object that describes the set of required documents and data for applicant to upload and pass verification.
  requiredIdDocs?: RequiredIdDocs;

  // Object that describes current applicant status.
  review: Review;

  // Contains data about filled questionnaire.
  questionnaires?: Questionnaire[];
}

export interface SumsubWebhookEvent {
  webhookId: string;
  id: string;
  createdAt: Date;
  type: WebhookType;
}

export interface SumsubWebhookApplicantStatusEvent extends SumsubWebhookEvent {
  applicant: ApplicantWebhookPayload;
}
