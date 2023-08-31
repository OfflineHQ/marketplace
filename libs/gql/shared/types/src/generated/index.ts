export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  Json: any;
  Long: any;
  RichTextAST: any;
  bigint: any;
  jsonb: any;
  timestamptz: any;
  uuid: any;
};

export type Aggregate = {
  __typename?: 'Aggregate';
  count: Scalars['Int'];
};

/** Asset system model */
export type Asset = Node & {
  __typename?: 'Asset';
  /** The time the document was created */
  createdAt: Scalars['DateTime'];
  /** User that created this document */
  createdBy?: Maybe<User>;
  /** Get the document in other stages */
  documentInStages: Array<Asset>;
  /** The file name */
  fileName: Scalars['String'];
  /** The file handle */
  handle: Scalars['String'];
  /** The height of the file */
  height?: Maybe<Scalars['Float']>;
  heroImageEvent: Array<Event>;
  /** List of Asset versions */
  history: Array<Version>;
  /** The unique identifier */
  id: Scalars['ID'];
  imageOrganizer: Array<Organizer>;
  /** System Locale field */
  locale: Locale;
  /** Get the other localizations for this document */
  localizations: Array<Asset>;
  /** The mime type of the file */
  mimeType?: Maybe<Scalars['String']>;
  nftImageEventPass: Array<EventPass>;
  /** The time the document was published. Null on documents in draft stage. */
  publishedAt?: Maybe<Scalars['DateTime']>;
  /** User that last published this document */
  publishedBy?: Maybe<User>;
  scheduledIn: Array<ScheduledOperation>;
  /** The file size */
  size?: Maybe<Scalars['Float']>;
  /** System stage field */
  stage: Stage;
  /** The time the document was updated */
  updatedAt: Scalars['DateTime'];
  /** User that last updated this document */
  updatedBy?: Maybe<User>;
  /** Get the url for the asset with provided transformations applied. */
  url: Scalars['String'];
  /** The file width */
  width?: Maybe<Scalars['Float']>;
};


/** Asset system model */
export type AssetCreatedAtArgs = {
  variation?: SystemDateTimeFieldVariation;
};


/** Asset system model */
export type AssetCreatedByArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};


/** Asset system model */
export type AssetDocumentInStagesArgs = {
  includeCurrent?: Scalars['Boolean'];
  inheritLocale?: Scalars['Boolean'];
  stages?: Array<Stage>;
};


/** Asset system model */
export type AssetHeroImageEventArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: InputMaybe<Array<Locale>>;
  orderBy?: InputMaybe<EventOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EventWhereInput>;
};


/** Asset system model */
export type AssetHistoryArgs = {
  limit?: Scalars['Int'];
  skip?: Scalars['Int'];
  stageOverride?: InputMaybe<Stage>;
};


/** Asset system model */
export type AssetImageOrganizerArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: InputMaybe<Array<Locale>>;
  orderBy?: InputMaybe<OrganizerOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OrganizerWhereInput>;
};


/** Asset system model */
export type AssetLocalizationsArgs = {
  includeCurrent?: Scalars['Boolean'];
  locales?: Array<Locale>;
};


/** Asset system model */
export type AssetNftImageEventPassArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: InputMaybe<Array<Locale>>;
  orderBy?: InputMaybe<EventPassOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EventPassWhereInput>;
};


/** Asset system model */
export type AssetPublishedAtArgs = {
  variation?: SystemDateTimeFieldVariation;
};


/** Asset system model */
export type AssetPublishedByArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};


/** Asset system model */
export type AssetScheduledInArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: InputMaybe<Array<Locale>>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ScheduledOperationWhereInput>;
};


/** Asset system model */
export type AssetUpdatedAtArgs = {
  variation?: SystemDateTimeFieldVariation;
};


/** Asset system model */
export type AssetUpdatedByArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};


/** Asset system model */
export type AssetUrlArgs = {
  transformation?: InputMaybe<AssetTransformationInput>;
};

/** A connection to a list of items. */
export type AssetConnection = {
  __typename?: 'AssetConnection';
  aggregate: Aggregate;
  /** A list of edges. */
  edges: Array<AssetEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

export type AssetCreateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>;
  fileName: Scalars['String'];
  handle: Scalars['String'];
  height?: InputMaybe<Scalars['Float']>;
  heroImageEvent?: InputMaybe<EventCreateManyInlineInput>;
  imageOrganizer?: InputMaybe<OrganizerCreateManyInlineInput>;
  /** Inline mutations for managing document localizations excluding the default locale */
  localizations?: InputMaybe<AssetCreateLocalizationsInput>;
  mimeType?: InputMaybe<Scalars['String']>;
  nftImageEventPass?: InputMaybe<EventPassCreateManyInlineInput>;
  size?: InputMaybe<Scalars['Float']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  width?: InputMaybe<Scalars['Float']>;
};

export type AssetCreateLocalizationDataInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>;
  fileName: Scalars['String'];
  handle: Scalars['String'];
  height?: InputMaybe<Scalars['Float']>;
  mimeType?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Float']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  width?: InputMaybe<Scalars['Float']>;
};

export type AssetCreateLocalizationInput = {
  /** Localization input */
  data: AssetCreateLocalizationDataInput;
  locale: Locale;
};

export type AssetCreateLocalizationsInput = {
  /** Create localizations for the newly-created document */
  create?: InputMaybe<Array<AssetCreateLocalizationInput>>;
};

export type AssetCreateOneInlineInput = {
  /** Connect one existing Asset document */
  connect?: InputMaybe<AssetWhereUniqueInput>;
  /** Create and connect one Asset document */
  create?: InputMaybe<AssetCreateInput>;
};

/** An edge in a connection. */
export type AssetEdge = {
  __typename?: 'AssetEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Asset;
};

/** Identifies documents */
export type AssetManyWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<AssetWhereInput>>;
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<AssetWhereInput>>;
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<AssetWhereInput>>;
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  createdBy?: InputMaybe<UserWhereInput>;
  documentInStages_every?: InputMaybe<AssetWhereStageInput>;
  documentInStages_none?: InputMaybe<AssetWhereStageInput>;
  documentInStages_some?: InputMaybe<AssetWhereStageInput>;
  heroImageEvent_every?: InputMaybe<EventWhereInput>;
  heroImageEvent_none?: InputMaybe<EventWhereInput>;
  heroImageEvent_some?: InputMaybe<EventWhereInput>;
  id?: InputMaybe<Scalars['ID']>;
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>;
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Any other value that exists and is not equal to the given value. */
  id_not?: InputMaybe<Scalars['ID']>;
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>;
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>;
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>;
  imageOrganizer_every?: InputMaybe<OrganizerWhereInput>;
  imageOrganizer_none?: InputMaybe<OrganizerWhereInput>;
  imageOrganizer_some?: InputMaybe<OrganizerWhereInput>;
  nftImageEventPass_every?: InputMaybe<EventPassWhereInput>;
  nftImageEventPass_none?: InputMaybe<EventPassWhereInput>;
  nftImageEventPass_some?: InputMaybe<EventPassWhereInput>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  publishedBy?: InputMaybe<UserWhereInput>;
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>;
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>;
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  updatedBy?: InputMaybe<UserWhereInput>;
};

export const enum AssetOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  FileNameAsc = 'fileName_ASC',
  FileNameDesc = 'fileName_DESC',
  HandleAsc = 'handle_ASC',
  HandleDesc = 'handle_DESC',
  HeightAsc = 'height_ASC',
  HeightDesc = 'height_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MimeTypeAsc = 'mimeType_ASC',
  MimeTypeDesc = 'mimeType_DESC',
  PublishedAtAsc = 'publishedAt_ASC',
  PublishedAtDesc = 'publishedAt_DESC',
  SizeAsc = 'size_ASC',
  SizeDesc = 'size_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  WidthAsc = 'width_ASC',
  WidthDesc = 'width_DESC'
};

/** Transformations for Assets */
export type AssetTransformationInput = {
  document?: InputMaybe<DocumentTransformationInput>;
  image?: InputMaybe<ImageTransformationInput>;
  /** Pass true if you want to validate the passed transformation parameters */
  validateOptions?: InputMaybe<Scalars['Boolean']>;
};

export type AssetUpdateInput = {
  fileName?: InputMaybe<Scalars['String']>;
  handle?: InputMaybe<Scalars['String']>;
  height?: InputMaybe<Scalars['Float']>;
  heroImageEvent?: InputMaybe<EventUpdateManyInlineInput>;
  imageOrganizer?: InputMaybe<OrganizerUpdateManyInlineInput>;
  /** Manage document localizations */
  localizations?: InputMaybe<AssetUpdateLocalizationsInput>;
  mimeType?: InputMaybe<Scalars['String']>;
  nftImageEventPass?: InputMaybe<EventPassUpdateManyInlineInput>;
  size?: InputMaybe<Scalars['Float']>;
  width?: InputMaybe<Scalars['Float']>;
};

export type AssetUpdateLocalizationDataInput = {
  fileName?: InputMaybe<Scalars['String']>;
  handle?: InputMaybe<Scalars['String']>;
  height?: InputMaybe<Scalars['Float']>;
  mimeType?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Float']>;
  width?: InputMaybe<Scalars['Float']>;
};

export type AssetUpdateLocalizationInput = {
  data: AssetUpdateLocalizationDataInput;
  locale: Locale;
};

export type AssetUpdateLocalizationsInput = {
  /** Localizations to create */
  create?: InputMaybe<Array<AssetCreateLocalizationInput>>;
  /** Localizations to delete */
  delete?: InputMaybe<Array<Locale>>;
  /** Localizations to update */
  update?: InputMaybe<Array<AssetUpdateLocalizationInput>>;
  upsert?: InputMaybe<Array<AssetUpsertLocalizationInput>>;
};

export type AssetUpdateManyInput = {
  fileName?: InputMaybe<Scalars['String']>;
  height?: InputMaybe<Scalars['Float']>;
  /** Optional updates to localizations */
  localizations?: InputMaybe<AssetUpdateManyLocalizationsInput>;
  mimeType?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Float']>;
  width?: InputMaybe<Scalars['Float']>;
};

export type AssetUpdateManyLocalizationDataInput = {
  fileName?: InputMaybe<Scalars['String']>;
  height?: InputMaybe<Scalars['Float']>;
  mimeType?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Float']>;
  width?: InputMaybe<Scalars['Float']>;
};

export type AssetUpdateManyLocalizationInput = {
  data: AssetUpdateManyLocalizationDataInput;
  locale: Locale;
};

export type AssetUpdateManyLocalizationsInput = {
  /** Localizations to update */
  update?: InputMaybe<Array<AssetUpdateManyLocalizationInput>>;
};

export type AssetUpdateOneInlineInput = {
  /** Connect existing Asset document */
  connect?: InputMaybe<AssetWhereUniqueInput>;
  /** Create and connect one Asset document */
  create?: InputMaybe<AssetCreateInput>;
  /** Delete currently connected Asset document */
  delete?: InputMaybe<Scalars['Boolean']>;
  /** Disconnect currently connected Asset document */
  disconnect?: InputMaybe<Scalars['Boolean']>;
  /** Update single Asset document */
  update?: InputMaybe<AssetUpdateWithNestedWhereUniqueInput>;
  /** Upsert single Asset document */
  upsert?: InputMaybe<AssetUpsertWithNestedWhereUniqueInput>;
};

export type AssetUpdateWithNestedWhereUniqueInput = {
  /** Document to update */
  data: AssetUpdateInput;
  /** Unique document search */
  where: AssetWhereUniqueInput;
};

export type AssetUpsertInput = {
  /** Create document if it didn't exist */
  create: AssetCreateInput;
  /** Update document if it exists */
  update: AssetUpdateInput;
};

export type AssetUpsertLocalizationInput = {
  create: AssetCreateLocalizationDataInput;
  locale: Locale;
  update: AssetUpdateLocalizationDataInput;
};

export type AssetUpsertWithNestedWhereUniqueInput = {
  /** Upsert data */
  data: AssetUpsertInput;
  /** Unique document search */
  where: AssetWhereUniqueInput;
};

/** This contains a set of filters that can be used to compare values internally */
export type AssetWhereComparatorInput = {
  /** This field can be used to request to check if the entry is outdated by internal comparison */
  outdated_to?: InputMaybe<Scalars['Boolean']>;
};

/** Identifies documents */
export type AssetWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<AssetWhereInput>>;
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<AssetWhereInput>>;
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<AssetWhereInput>>;
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  createdBy?: InputMaybe<UserWhereInput>;
  documentInStages_every?: InputMaybe<AssetWhereStageInput>;
  documentInStages_none?: InputMaybe<AssetWhereStageInput>;
  documentInStages_some?: InputMaybe<AssetWhereStageInput>;
  fileName?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  fileName_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  fileName_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  fileName_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  fileName_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  fileName_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  fileName_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  fileName_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  fileName_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  fileName_starts_with?: InputMaybe<Scalars['String']>;
  handle?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  handle_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  handle_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  handle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  handle_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  handle_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  handle_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  handle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  handle_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  handle_starts_with?: InputMaybe<Scalars['String']>;
  height?: InputMaybe<Scalars['Float']>;
  /** All values greater than the given value. */
  height_gt?: InputMaybe<Scalars['Float']>;
  /** All values greater than or equal the given value. */
  height_gte?: InputMaybe<Scalars['Float']>;
  /** All values that are contained in given list. */
  height_in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  /** All values less than the given value. */
  height_lt?: InputMaybe<Scalars['Float']>;
  /** All values less than or equal the given value. */
  height_lte?: InputMaybe<Scalars['Float']>;
  /** Any other value that exists and is not equal to the given value. */
  height_not?: InputMaybe<Scalars['Float']>;
  /** All values that are not contained in given list. */
  height_not_in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  heroImageEvent_every?: InputMaybe<EventWhereInput>;
  heroImageEvent_none?: InputMaybe<EventWhereInput>;
  heroImageEvent_some?: InputMaybe<EventWhereInput>;
  id?: InputMaybe<Scalars['ID']>;
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>;
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Any other value that exists and is not equal to the given value. */
  id_not?: InputMaybe<Scalars['ID']>;
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>;
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>;
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>;
  imageOrganizer_every?: InputMaybe<OrganizerWhereInput>;
  imageOrganizer_none?: InputMaybe<OrganizerWhereInput>;
  imageOrganizer_some?: InputMaybe<OrganizerWhereInput>;
  mimeType?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  mimeType_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  mimeType_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  mimeType_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  mimeType_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  mimeType_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  mimeType_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  mimeType_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  mimeType_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  mimeType_starts_with?: InputMaybe<Scalars['String']>;
  nftImageEventPass_every?: InputMaybe<EventPassWhereInput>;
  nftImageEventPass_none?: InputMaybe<EventPassWhereInput>;
  nftImageEventPass_some?: InputMaybe<EventPassWhereInput>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  publishedBy?: InputMaybe<UserWhereInput>;
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>;
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>;
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>;
  size?: InputMaybe<Scalars['Float']>;
  /** All values greater than the given value. */
  size_gt?: InputMaybe<Scalars['Float']>;
  /** All values greater than or equal the given value. */
  size_gte?: InputMaybe<Scalars['Float']>;
  /** All values that are contained in given list. */
  size_in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  /** All values less than the given value. */
  size_lt?: InputMaybe<Scalars['Float']>;
  /** All values less than or equal the given value. */
  size_lte?: InputMaybe<Scalars['Float']>;
  /** Any other value that exists and is not equal to the given value. */
  size_not?: InputMaybe<Scalars['Float']>;
  /** All values that are not contained in given list. */
  size_not_in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  updatedBy?: InputMaybe<UserWhereInput>;
  width?: InputMaybe<Scalars['Float']>;
  /** All values greater than the given value. */
  width_gt?: InputMaybe<Scalars['Float']>;
  /** All values greater than or equal the given value. */
  width_gte?: InputMaybe<Scalars['Float']>;
  /** All values that are contained in given list. */
  width_in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  /** All values less than the given value. */
  width_lt?: InputMaybe<Scalars['Float']>;
  /** All values less than or equal the given value. */
  width_lte?: InputMaybe<Scalars['Float']>;
  /** Any other value that exists and is not equal to the given value. */
  width_not?: InputMaybe<Scalars['Float']>;
  /** All values that are not contained in given list. */
  width_not_in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
};

/** The document in stages filter allows specifying a stage entry to cross compare the same document between different stages */
export type AssetWhereStageInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<AssetWhereStageInput>>;
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<AssetWhereStageInput>>;
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<AssetWhereStageInput>>;
  /** This field contains fields which can be set as true or false to specify an internal comparison */
  compareWithParent?: InputMaybe<AssetWhereComparatorInput>;
  /** Specify the stage to compare with */
  stage?: InputMaybe<Stage>;
};

/** References Asset record uniquely */
export type AssetWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>;
};

export type BatchPayload = {
  __typename?: 'BatchPayload';
  /** The number of nodes that have been affected by the Batch operation. */
  count: Scalars['Long'];
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']>;
  _gt?: InputMaybe<Scalars['Boolean']>;
  _gte?: InputMaybe<Scalars['Boolean']>;
  _in?: InputMaybe<Array<Scalars['Boolean']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Boolean']>;
  _lte?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Scalars['Boolean']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']>>;
};

export type ConnectPositionInput = {
  /** Connect document after specified document */
  after?: InputMaybe<Scalars['ID']>;
  /** Connect document before specified document */
  before?: InputMaybe<Scalars['ID']>;
  /** Connect document at last position */
  end?: InputMaybe<Scalars['Boolean']>;
  /** Connect document at first position */
  start?: InputMaybe<Scalars['Boolean']>;
};

export const enum DocumentFileTypes {
  Doc = 'doc',
  Docx = 'docx',
  Html = 'html',
  Jpg = 'jpg',
  Odp = 'odp',
  Ods = 'ods',
  Odt = 'odt',
  Pdf = 'pdf',
  Png = 'png',
  Ppt = 'ppt',
  Pptx = 'pptx',
  Svg = 'svg',
  Txt = 'txt',
  Webp = 'webp',
  Xls = 'xls',
  Xlsx = 'xlsx'
};

export type DocumentOutputInput = {
  /**
   * Transforms a document into a desired file type.
   * See this matrix for format support:
   *
   * PDF:	jpg, odp, ods, odt, png, svg, txt, and webp
   * DOC:	docx, html, jpg, odt, pdf, png, svg, txt, and webp
   * DOCX:	doc, html, jpg, odt, pdf, png, svg, txt, and webp
   * ODT:	doc, docx, html, jpg, pdf, png, svg, txt, and webp
   * XLS:	jpg, pdf, ods, png, svg, xlsx, and webp
   * XLSX:	jpg, pdf, ods, png, svg, xls, and webp
   * ODS:	jpg, pdf, png, xls, svg, xlsx, and webp
   * PPT:	jpg, odp, pdf, png, svg, pptx, and webp
   * PPTX:	jpg, odp, pdf, png, svg, ppt, and webp
   * ODP:	jpg, pdf, png, ppt, svg, pptx, and webp
   * BMP:	jpg, odp, ods, odt, pdf, png, svg, and webp
   * GIF:	jpg, odp, ods, odt, pdf, png, svg, and webp
   * JPG:	jpg, odp, ods, odt, pdf, png, svg, and webp
   * PNG:	jpg, odp, ods, odt, pdf, png, svg, and webp
   * WEBP:	jpg, odp, ods, odt, pdf, png, svg, and webp
   * TIFF:	jpg, odp, ods, odt, pdf, png, svg, and webp
   * AI:	    jpg, odp, ods, odt, pdf, png, svg, and webp
   * PSD:	jpg, odp, ods, odt, pdf, png, svg, and webp
   * SVG:	jpg, odp, ods, odt, pdf, png, and webp
   * HTML:	jpg, odt, pdf, svg, txt, and webp
   * TXT:	jpg, html, odt, pdf, svg, and webp
   */
  format?: InputMaybe<DocumentFileTypes>;
};

/** Transformations for Documents */
export type DocumentTransformationInput = {
  /** Changes the output for the file. */
  output?: InputMaybe<DocumentOutputInput>;
};

export type DocumentVersion = {
  __typename?: 'DocumentVersion';
  createdAt: Scalars['DateTime'];
  data?: Maybe<Scalars['Json']>;
  id: Scalars['ID'];
  revision: Scalars['Int'];
  stage: Stage;
};

/** Root event model */
export type Event = Node & {
  __typename?: 'Event';
  /** The time the document was created */
  createdAt: Scalars['DateTime'];
  /** User that created this document */
  createdBy?: Maybe<User>;
  description: EventDescriptionRichText;
  /** Get the document in other stages */
  documentInStages: Array<Event>;
  /**
   * Define the different locations and timeframe for your event.
   * This is only for information purpose but it should match your 'Event Pass' locations and dates
   */
  eventDateLocations: Array<EventDateLocation>;
  eventPasses: Array<EventPass>;
  heroImage: Asset;
  /** List of Event versions */
  history: Array<Version>;
  /** The unique identifier */
  id: Scalars['ID'];
  /** System Locale field */
  locale: Locale;
  /** Get the other localizations for this document */
  localizations: Array<Event>;
  organizer?: Maybe<Organizer>;
  /** Whether the event is public (visible to anyone) or private (for instance visible only to owner of specific NFTs) */
  public?: Maybe<Scalars['Boolean']>;
  /** Whether the event is published or not (visible only to organizers) */
  published: Scalars['Boolean'];
  /** The time the document was published. Null on documents in draft stage. */
  publishedAt?: Maybe<Scalars['DateTime']>;
  /** User that last published this document */
  publishedBy?: Maybe<User>;
  scheduledIn: Array<ScheduledOperation>;
  /** Used in the URL */
  slug: Scalars['String'];
  /** System stage field */
  stage: Stage;
  title: Scalars['String'];
  /** The time the document was updated */
  updatedAt: Scalars['DateTime'];
  /** User that last updated this document */
  updatedBy?: Maybe<User>;
};


/** Root event model */
export type EventCreatedAtArgs = {
  variation?: SystemDateTimeFieldVariation;
};


/** Root event model */
export type EventCreatedByArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};


/** Root event model */
export type EventDocumentInStagesArgs = {
  includeCurrent?: Scalars['Boolean'];
  inheritLocale?: Scalars['Boolean'];
  stages?: Array<Stage>;
};


/** Root event model */
export type EventEventDateLocationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: InputMaybe<Array<Locale>>;
  orderBy?: InputMaybe<EventDateLocationOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EventDateLocationWhereInput>;
};


/** Root event model */
export type EventEventPassesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: InputMaybe<Array<Locale>>;
  orderBy?: InputMaybe<EventPassOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EventPassWhereInput>;
};


/** Root event model */
export type EventHeroImageArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};


/** Root event model */
export type EventHistoryArgs = {
  limit?: Scalars['Int'];
  skip?: Scalars['Int'];
  stageOverride?: InputMaybe<Stage>;
};


/** Root event model */
export type EventLocalizationsArgs = {
  includeCurrent?: Scalars['Boolean'];
  locales?: Array<Locale>;
};


/** Root event model */
export type EventOrganizerArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};


/** Root event model */
export type EventPublishedAtArgs = {
  variation?: SystemDateTimeFieldVariation;
};


/** Root event model */
export type EventPublishedByArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};


/** Root event model */
export type EventScheduledInArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: InputMaybe<Array<Locale>>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ScheduledOperationWhereInput>;
};


/** Root event model */
export type EventUpdatedAtArgs = {
  variation?: SystemDateTimeFieldVariation;
};


/** Root event model */
export type EventUpdatedByArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};

export type EventConnectInput = {
  /** Allow to specify document position in list of connected documents, will default to appending at end of list */
  position?: InputMaybe<ConnectPositionInput>;
  /** Document to connect */
  where: EventWhereUniqueInput;
};

/** A connection to a list of items. */
export type EventConnection = {
  __typename?: 'EventConnection';
  aggregate: Aggregate;
  /** A list of edges. */
  edges: Array<EventEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

export type EventCreateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>;
  /** description input for default locale (en) */
  description: Scalars['RichTextAST'];
  eventDateLocations?: InputMaybe<EventDateLocationCreateManyInlineInput>;
  eventPasses?: InputMaybe<EventPassCreateManyInlineInput>;
  heroImage: AssetCreateOneInlineInput;
  /** Inline mutations for managing document localizations excluding the default locale */
  localizations?: InputMaybe<EventCreateLocalizationsInput>;
  organizer?: InputMaybe<OrganizerCreateOneInlineInput>;
  public?: InputMaybe<Scalars['Boolean']>;
  published: Scalars['Boolean'];
  slug: Scalars['String'];
  /** title input for default locale (en) */
  title: Scalars['String'];
  updatedAt?: InputMaybe<Scalars['DateTime']>;
};

export type EventCreateLocalizationDataInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>;
  description: Scalars['RichTextAST'];
  title: Scalars['String'];
  updatedAt?: InputMaybe<Scalars['DateTime']>;
};

export type EventCreateLocalizationInput = {
  /** Localization input */
  data: EventCreateLocalizationDataInput;
  locale: Locale;
};

export type EventCreateLocalizationsInput = {
  /** Create localizations for the newly-created document */
  create?: InputMaybe<Array<EventCreateLocalizationInput>>;
};

export type EventCreateManyInlineInput = {
  /** Connect multiple existing Event documents */
  connect?: InputMaybe<Array<EventWhereUniqueInput>>;
  /** Create and connect multiple existing Event documents */
  create?: InputMaybe<Array<EventCreateInput>>;
};

export type EventCreateOneInlineInput = {
  /** Connect one existing Event document */
  connect?: InputMaybe<EventWhereUniqueInput>;
  /** Create and connect one Event document */
  create?: InputMaybe<EventCreateInput>;
};

/** Model used to define the different locations and dates of an event. A festival or a tournament for instance could have several. */
export type EventDateLocation = {
  __typename?: 'EventDateLocation';
  /** The end date including time on the UTC timezone. */
  dateEnd: Scalars['DateTime'];
  /** The start date including time on the UTC timezone. */
  dateStart: Scalars['DateTime'];
  /** The unique identifier */
  id: Scalars['ID'];
  /** The location expressed in coordinates on a map and address */
  locationAddress: LocationAddress;
  /** System stage field */
  stage: Stage;
};


/** Model used to define the different locations and dates of an event. A festival or a tournament for instance could have several. */
export type EventDateLocationLocationAddressArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};

export type EventDateLocationCreateInput = {
  dateEnd: Scalars['DateTime'];
  dateStart: Scalars['DateTime'];
  locationAddress: LocationAddressCreateOneInlineInput;
};

export type EventDateLocationCreateManyInlineInput = {
  /** Create and connect multiple existing EventDateLocation documents */
  create?: InputMaybe<Array<EventDateLocationCreateInput>>;
};

export type EventDateLocationCreateOneInlineInput = {
  /** Create and connect one EventDateLocation document */
  create?: InputMaybe<EventDateLocationCreateInput>;
};

export type EventDateLocationCreateWithPositionInput = {
  /** Document to create */
  data: EventDateLocationCreateInput;
  /** Position in the list of existing component instances, will default to appending at the end of list */
  position?: InputMaybe<ConnectPositionInput>;
};

export const enum EventDateLocationOrderByInput {
  DateEndAsc = 'dateEnd_ASC',
  DateEndDesc = 'dateEnd_DESC',
  DateStartAsc = 'dateStart_ASC',
  DateStartDesc = 'dateStart_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
};

export type EventDateLocationUpdateInput = {
  dateEnd?: InputMaybe<Scalars['DateTime']>;
  dateStart?: InputMaybe<Scalars['DateTime']>;
  locationAddress?: InputMaybe<LocationAddressUpdateOneInlineInput>;
};

export type EventDateLocationUpdateManyInlineInput = {
  /** Create and connect multiple EventDateLocation component instances */
  create?: InputMaybe<Array<EventDateLocationCreateWithPositionInput>>;
  /** Delete multiple EventDateLocation documents */
  delete?: InputMaybe<Array<EventDateLocationWhereUniqueInput>>;
  /** Update multiple EventDateLocation component instances */
  update?: InputMaybe<Array<EventDateLocationUpdateWithNestedWhereUniqueAndPositionInput>>;
  /** Upsert multiple EventDateLocation component instances */
  upsert?: InputMaybe<Array<EventDateLocationUpsertWithNestedWhereUniqueAndPositionInput>>;
};

export type EventDateLocationUpdateOneInlineInput = {
  /** Create and connect one EventDateLocation document */
  create?: InputMaybe<EventDateLocationCreateInput>;
  /** Delete currently connected EventDateLocation document */
  delete?: InputMaybe<Scalars['Boolean']>;
  /** Update single EventDateLocation document */
  update?: InputMaybe<EventDateLocationUpdateWithNestedWhereUniqueInput>;
  /** Upsert single EventDateLocation document */
  upsert?: InputMaybe<EventDateLocationUpsertWithNestedWhereUniqueInput>;
};

export type EventDateLocationUpdateWithNestedWhereUniqueAndPositionInput = {
  /** Document to update */
  data?: InputMaybe<EventDateLocationUpdateInput>;
  /** Position in the list of existing component instances, will default to appending at the end of list */
  position?: InputMaybe<ConnectPositionInput>;
  /** Unique component instance search */
  where: EventDateLocationWhereUniqueInput;
};

export type EventDateLocationUpdateWithNestedWhereUniqueInput = {
  /** Document to update */
  data: EventDateLocationUpdateInput;
  /** Unique document search */
  where: EventDateLocationWhereUniqueInput;
};

export type EventDateLocationUpsertInput = {
  /** Create document if it didn't exist */
  create: EventDateLocationCreateInput;
  /** Update document if it exists */
  update: EventDateLocationUpdateInput;
};

export type EventDateLocationUpsertWithNestedWhereUniqueAndPositionInput = {
  /** Document to upsert */
  data?: InputMaybe<EventDateLocationUpsertInput>;
  /** Position in the list of existing component instances, will default to appending at the end of list */
  position?: InputMaybe<ConnectPositionInput>;
  /** Unique component instance search */
  where: EventDateLocationWhereUniqueInput;
};

export type EventDateLocationUpsertWithNestedWhereUniqueInput = {
  /** Upsert data */
  data: EventDateLocationUpsertInput;
  /** Unique document search */
  where: EventDateLocationWhereUniqueInput;
};

/** Identifies documents */
export type EventDateLocationWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<EventDateLocationWhereInput>>;
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<EventDateLocationWhereInput>>;
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<EventDateLocationWhereInput>>;
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>;
  dateEnd?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  dateEnd_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  dateEnd_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  dateEnd_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  dateEnd_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  dateEnd_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  dateEnd_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  dateEnd_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  dateStart?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  dateStart_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  dateStart_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  dateStart_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  dateStart_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  dateStart_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  dateStart_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  dateStart_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  id?: InputMaybe<Scalars['ID']>;
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>;
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Any other value that exists and is not equal to the given value. */
  id_not?: InputMaybe<Scalars['ID']>;
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>;
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>;
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>;
  locationAddress?: InputMaybe<LocationAddressWhereInput>;
};

/** References EventDateLocation record uniquely */
export type EventDateLocationWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>;
};

export type EventDescriptionRichText = {
  __typename?: 'EventDescriptionRichText';
  /** Returns HTMl representation */
  html: Scalars['String'];
  json: Scalars['RichTextAST'];
  /** Returns Markdown representation */
  markdown: Scalars['String'];
  raw: Scalars['RichTextAST'];
  references: Array<EventDescriptionRichTextEmbeddedTypes>;
  /** Returns plain-text contents of RichText */
  text: Scalars['String'];
};


export type EventDescriptionRichTextReferencesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type EventDescriptionRichTextEmbeddedTypes = Asset;

/** An edge in a connection. */
export type EventEdge = {
  __typename?: 'EventEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Event;
};

/** Identifies documents */
export type EventManyWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<EventWhereInput>>;
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<EventWhereInput>>;
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<EventWhereInput>>;
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  createdBy?: InputMaybe<UserWhereInput>;
  documentInStages_every?: InputMaybe<EventWhereStageInput>;
  documentInStages_none?: InputMaybe<EventWhereStageInput>;
  documentInStages_some?: InputMaybe<EventWhereStageInput>;
  eventDateLocations_every?: InputMaybe<EventDateLocationWhereInput>;
  eventDateLocations_none?: InputMaybe<EventDateLocationWhereInput>;
  eventDateLocations_some?: InputMaybe<EventDateLocationWhereInput>;
  eventPasses_every?: InputMaybe<EventPassWhereInput>;
  eventPasses_none?: InputMaybe<EventPassWhereInput>;
  eventPasses_some?: InputMaybe<EventPassWhereInput>;
  heroImage?: InputMaybe<AssetWhereInput>;
  id?: InputMaybe<Scalars['ID']>;
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>;
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Any other value that exists and is not equal to the given value. */
  id_not?: InputMaybe<Scalars['ID']>;
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>;
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>;
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>;
  organizer?: InputMaybe<OrganizerWhereInput>;
  public?: InputMaybe<Scalars['Boolean']>;
  /** Any other value that exists and is not equal to the given value. */
  public_not?: InputMaybe<Scalars['Boolean']>;
  published?: InputMaybe<Scalars['Boolean']>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  publishedBy?: InputMaybe<UserWhereInput>;
  /** Any other value that exists and is not equal to the given value. */
  published_not?: InputMaybe<Scalars['Boolean']>;
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>;
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>;
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>;
  slug?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  slug_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  slug_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  slug_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  slug_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  slug_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  slug_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  slug_starts_with?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  updatedBy?: InputMaybe<UserWhereInput>;
};

export const enum EventOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PublicAsc = 'public_ASC',
  PublicDesc = 'public_DESC',
  PublishedAtAsc = 'publishedAt_ASC',
  PublishedAtDesc = 'publishedAt_DESC',
  PublishedAsc = 'published_ASC',
  PublishedDesc = 'published_DESC',
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC'
};

/** Define a pass for an event with different options, price, number of passes etc. */
export type EventPass = Node & {
  __typename?: 'EventPass';
  /** The time the document was created */
  createdAt: Scalars['DateTime'];
  /** User that created this document */
  createdBy?: Maybe<User>;
  /** Description of the pass, like "Access to the event for 3 days" */
  description: Scalars['String'];
  /** Get the document in other stages */
  documentInStages: Array<EventPass>;
  event?: Maybe<Event>;
  eventPassNftContract?: Maybe<EventPassNftContract>;
  eventPassOrderSums?: Maybe<EventPassOrderSums>;
  eventPassPricing?: Maybe<EventPassPricing>;
  /** List of EventPass versions */
  history: Array<Version>;
  /** The unique identifier */
  id: Scalars['ID'];
  /** System Locale field */
  locale: Locale;
  /** Get the other localizations for this document */
  localizations: Array<EventPass>;
  /** User-friendly name of the pass, like "VIP 3-Day Pass" */
  name: Scalars['String'];
  /** Fixed description pertaining to the NFT. This content is static and non-localizable. */
  nftDescription: Scalars['String'];
  /** Permanent image representing the NFT. Advised resolution is 350 x 350 pixels. Image content is non-changeable and cannot be localized. */
  nftImage: Asset;
  /** Permanent name associated with the NFT. Cannot be changed or localized. */
  nftName: Scalars['String'];
  /** Define the different pass options. An option is defined for a specific location and timeframe */
  passOptions: Array<PassOption>;
  /** The time the document was published. Null on documents in draft stage. */
  publishedAt?: Maybe<Scalars['DateTime']>;
  /** User that last published this document */
  publishedBy?: Maybe<User>;
  scheduledIn: Array<ScheduledOperation>;
  /** System stage field */
  stage: Stage;
  /** The time the document was updated */
  updatedAt: Scalars['DateTime'];
  /** User that last updated this document */
  updatedBy?: Maybe<User>;
};


/** Define a pass for an event with different options, price, number of passes etc. */
export type EventPassCreatedAtArgs = {
  variation?: SystemDateTimeFieldVariation;
};


/** Define a pass for an event with different options, price, number of passes etc. */
export type EventPassCreatedByArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};


/** Define a pass for an event with different options, price, number of passes etc. */
export type EventPassDocumentInStagesArgs = {
  includeCurrent?: Scalars['Boolean'];
  inheritLocale?: Scalars['Boolean'];
  stages?: Array<Stage>;
};


/** Define a pass for an event with different options, price, number of passes etc. */
export type EventPassEventArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};


/** Define a pass for an event with different options, price, number of passes etc. */
export type EventPassHistoryArgs = {
  limit?: Scalars['Int'];
  skip?: Scalars['Int'];
  stageOverride?: InputMaybe<Stage>;
};


/** Define a pass for an event with different options, price, number of passes etc. */
export type EventPassLocalizationsArgs = {
  includeCurrent?: Scalars['Boolean'];
  locales?: Array<Locale>;
};


/** Define a pass for an event with different options, price, number of passes etc. */
export type EventPassNftImageArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};


/** Define a pass for an event with different options, price, number of passes etc. */
export type EventPassPassOptionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: InputMaybe<Array<Locale>>;
  orderBy?: InputMaybe<PassOptionOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PassOptionWhereInput>;
};


/** Define a pass for an event with different options, price, number of passes etc. */
export type EventPassPublishedAtArgs = {
  variation?: SystemDateTimeFieldVariation;
};


/** Define a pass for an event with different options, price, number of passes etc. */
export type EventPassPublishedByArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};


/** Define a pass for an event with different options, price, number of passes etc. */
export type EventPassScheduledInArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: InputMaybe<Array<Locale>>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ScheduledOperationWhereInput>;
};


/** Define a pass for an event with different options, price, number of passes etc. */
export type EventPassUpdatedAtArgs = {
  variation?: SystemDateTimeFieldVariation;
};


/** Define a pass for an event with different options, price, number of passes etc. */
export type EventPassUpdatedByArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};

export type EventPassConnectInput = {
  /** Allow to specify document position in list of connected documents, will default to appending at end of list */
  position?: InputMaybe<ConnectPositionInput>;
  /** Document to connect */
  where: EventPassWhereUniqueInput;
};

/** A connection to a list of items. */
export type EventPassConnection = {
  __typename?: 'EventPassConnection';
  aggregate: Aggregate;
  /** A list of edges. */
  edges: Array<EventPassEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

export type EventPassCreateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>;
  /** description input for default locale (en) */
  description: Scalars['String'];
  event?: InputMaybe<EventCreateOneInlineInput>;
  /** Inline mutations for managing document localizations excluding the default locale */
  localizations?: InputMaybe<EventPassCreateLocalizationsInput>;
  /** name input for default locale (en) */
  name: Scalars['String'];
  nftDescription: Scalars['String'];
  nftImage: AssetCreateOneInlineInput;
  nftName: Scalars['String'];
  passOptions?: InputMaybe<PassOptionCreateManyInlineInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
};

export type EventPassCreateLocalizationDataInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>;
  description: Scalars['String'];
  name: Scalars['String'];
  updatedAt?: InputMaybe<Scalars['DateTime']>;
};

export type EventPassCreateLocalizationInput = {
  /** Localization input */
  data: EventPassCreateLocalizationDataInput;
  locale: Locale;
};

export type EventPassCreateLocalizationsInput = {
  /** Create localizations for the newly-created document */
  create?: InputMaybe<Array<EventPassCreateLocalizationInput>>;
};

export type EventPassCreateManyInlineInput = {
  /** Connect multiple existing EventPass documents */
  connect?: InputMaybe<Array<EventPassWhereUniqueInput>>;
  /** Create and connect multiple existing EventPass documents */
  create?: InputMaybe<Array<EventPassCreateInput>>;
};

/** An edge in a connection. */
export type EventPassEdge = {
  __typename?: 'EventPassEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: EventPass;
};

/** Identifies documents */
export type EventPassManyWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<EventPassWhereInput>>;
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<EventPassWhereInput>>;
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<EventPassWhereInput>>;
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  createdBy?: InputMaybe<UserWhereInput>;
  documentInStages_every?: InputMaybe<EventPassWhereStageInput>;
  documentInStages_none?: InputMaybe<EventPassWhereStageInput>;
  documentInStages_some?: InputMaybe<EventPassWhereStageInput>;
  event?: InputMaybe<EventWhereInput>;
  id?: InputMaybe<Scalars['ID']>;
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>;
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Any other value that exists and is not equal to the given value. */
  id_not?: InputMaybe<Scalars['ID']>;
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>;
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>;
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>;
  nftDescription?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  nftDescription_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  nftDescription_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  nftDescription_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  nftDescription_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  nftDescription_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  nftDescription_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  nftDescription_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  nftDescription_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  nftDescription_starts_with?: InputMaybe<Scalars['String']>;
  nftImage?: InputMaybe<AssetWhereInput>;
  nftName?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  nftName_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  nftName_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  nftName_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  nftName_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  nftName_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  nftName_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  nftName_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  nftName_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  nftName_starts_with?: InputMaybe<Scalars['String']>;
  passOptions_every?: InputMaybe<PassOptionWhereInput>;
  passOptions_none?: InputMaybe<PassOptionWhereInput>;
  passOptions_some?: InputMaybe<PassOptionWhereInput>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  publishedBy?: InputMaybe<UserWhereInput>;
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>;
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>;
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  updatedBy?: InputMaybe<UserWhereInput>;
};

export const enum EventPassOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  NftDescriptionAsc = 'nftDescription_ASC',
  NftDescriptionDesc = 'nftDescription_DESC',
  NftNameAsc = 'nftName_ASC',
  NftNameDesc = 'nftName_DESC',
  PublishedAtAsc = 'publishedAt_ASC',
  PublishedAtDesc = 'publishedAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC'
};

export type EventPassUpdateInput = {
  /** description input for default locale (en) */
  description?: InputMaybe<Scalars['String']>;
  event?: InputMaybe<EventUpdateOneInlineInput>;
  /** Manage document localizations */
  localizations?: InputMaybe<EventPassUpdateLocalizationsInput>;
  /** name input for default locale (en) */
  name?: InputMaybe<Scalars['String']>;
  nftDescription?: InputMaybe<Scalars['String']>;
  nftImage?: InputMaybe<AssetUpdateOneInlineInput>;
  nftName?: InputMaybe<Scalars['String']>;
  passOptions?: InputMaybe<PassOptionUpdateManyInlineInput>;
};

export type EventPassUpdateLocalizationDataInput = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type EventPassUpdateLocalizationInput = {
  data: EventPassUpdateLocalizationDataInput;
  locale: Locale;
};

export type EventPassUpdateLocalizationsInput = {
  /** Localizations to create */
  create?: InputMaybe<Array<EventPassCreateLocalizationInput>>;
  /** Localizations to delete */
  delete?: InputMaybe<Array<Locale>>;
  /** Localizations to update */
  update?: InputMaybe<Array<EventPassUpdateLocalizationInput>>;
  upsert?: InputMaybe<Array<EventPassUpsertLocalizationInput>>;
};

export type EventPassUpdateManyInlineInput = {
  /** Connect multiple existing EventPass documents */
  connect?: InputMaybe<Array<EventPassConnectInput>>;
  /** Create and connect multiple EventPass documents */
  create?: InputMaybe<Array<EventPassCreateInput>>;
  /** Delete multiple EventPass documents */
  delete?: InputMaybe<Array<EventPassWhereUniqueInput>>;
  /** Disconnect multiple EventPass documents */
  disconnect?: InputMaybe<Array<EventPassWhereUniqueInput>>;
  /** Override currently-connected documents with multiple existing EventPass documents */
  set?: InputMaybe<Array<EventPassWhereUniqueInput>>;
  /** Update multiple EventPass documents */
  update?: InputMaybe<Array<EventPassUpdateWithNestedWhereUniqueInput>>;
  /** Upsert multiple EventPass documents */
  upsert?: InputMaybe<Array<EventPassUpsertWithNestedWhereUniqueInput>>;
};

export type EventPassUpdateManyInput = {
  /** description input for default locale (en) */
  description?: InputMaybe<Scalars['String']>;
  /** Optional updates to localizations */
  localizations?: InputMaybe<EventPassUpdateManyLocalizationsInput>;
  /** name input for default locale (en) */
  name?: InputMaybe<Scalars['String']>;
  nftDescription?: InputMaybe<Scalars['String']>;
  nftName?: InputMaybe<Scalars['String']>;
};

export type EventPassUpdateManyLocalizationDataInput = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type EventPassUpdateManyLocalizationInput = {
  data: EventPassUpdateManyLocalizationDataInput;
  locale: Locale;
};

export type EventPassUpdateManyLocalizationsInput = {
  /** Localizations to update */
  update?: InputMaybe<Array<EventPassUpdateManyLocalizationInput>>;
};

export type EventPassUpdateWithNestedWhereUniqueInput = {
  /** Document to update */
  data: EventPassUpdateInput;
  /** Unique document search */
  where: EventPassWhereUniqueInput;
};

export type EventPassUpsertInput = {
  /** Create document if it didn't exist */
  create: EventPassCreateInput;
  /** Update document if it exists */
  update: EventPassUpdateInput;
};

export type EventPassUpsertLocalizationInput = {
  create: EventPassCreateLocalizationDataInput;
  locale: Locale;
  update: EventPassUpdateLocalizationDataInput;
};

export type EventPassUpsertWithNestedWhereUniqueInput = {
  /** Upsert data */
  data: EventPassUpsertInput;
  /** Unique document search */
  where: EventPassWhereUniqueInput;
};

/** This contains a set of filters that can be used to compare values internally */
export type EventPassWhereComparatorInput = {
  /** This field can be used to request to check if the entry is outdated by internal comparison */
  outdated_to?: InputMaybe<Scalars['Boolean']>;
};

/** Identifies documents */
export type EventPassWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<EventPassWhereInput>>;
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<EventPassWhereInput>>;
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<EventPassWhereInput>>;
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  createdBy?: InputMaybe<UserWhereInput>;
  description?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  description_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  description_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  description_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  description_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  description_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  description_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  description_starts_with?: InputMaybe<Scalars['String']>;
  documentInStages_every?: InputMaybe<EventPassWhereStageInput>;
  documentInStages_none?: InputMaybe<EventPassWhereStageInput>;
  documentInStages_some?: InputMaybe<EventPassWhereStageInput>;
  event?: InputMaybe<EventWhereInput>;
  id?: InputMaybe<Scalars['ID']>;
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>;
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Any other value that exists and is not equal to the given value. */
  id_not?: InputMaybe<Scalars['ID']>;
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>;
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>;
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  name_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  name_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  name_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  name_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  name_starts_with?: InputMaybe<Scalars['String']>;
  nftDescription?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  nftDescription_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  nftDescription_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  nftDescription_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  nftDescription_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  nftDescription_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  nftDescription_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  nftDescription_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  nftDescription_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  nftDescription_starts_with?: InputMaybe<Scalars['String']>;
  nftImage?: InputMaybe<AssetWhereInput>;
  nftName?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  nftName_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  nftName_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  nftName_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  nftName_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  nftName_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  nftName_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  nftName_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  nftName_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  nftName_starts_with?: InputMaybe<Scalars['String']>;
  passOptions_every?: InputMaybe<PassOptionWhereInput>;
  passOptions_none?: InputMaybe<PassOptionWhereInput>;
  passOptions_some?: InputMaybe<PassOptionWhereInput>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  publishedBy?: InputMaybe<UserWhereInput>;
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>;
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>;
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  updatedBy?: InputMaybe<UserWhereInput>;
};

/** The document in stages filter allows specifying a stage entry to cross compare the same document between different stages */
export type EventPassWhereStageInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<EventPassWhereStageInput>>;
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<EventPassWhereStageInput>>;
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<EventPassWhereStageInput>>;
  /** This field contains fields which can be set as true or false to specify an internal comparison */
  compareWithParent?: InputMaybe<EventPassWhereComparatorInput>;
  /** Specify the stage to compare with */
  stage?: InputMaybe<Stage>;
};

/** References EventPass record uniquely */
export type EventPassWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>;
};

export type EventUpdateInput = {
  /** description input for default locale (en) */
  description?: InputMaybe<Scalars['RichTextAST']>;
  eventDateLocations?: InputMaybe<EventDateLocationUpdateManyInlineInput>;
  eventPasses?: InputMaybe<EventPassUpdateManyInlineInput>;
  heroImage?: InputMaybe<AssetUpdateOneInlineInput>;
  /** Manage document localizations */
  localizations?: InputMaybe<EventUpdateLocalizationsInput>;
  organizer?: InputMaybe<OrganizerUpdateOneInlineInput>;
  public?: InputMaybe<Scalars['Boolean']>;
  published?: InputMaybe<Scalars['Boolean']>;
  slug?: InputMaybe<Scalars['String']>;
  /** title input for default locale (en) */
  title?: InputMaybe<Scalars['String']>;
};

export type EventUpdateLocalizationDataInput = {
  description?: InputMaybe<Scalars['RichTextAST']>;
  title?: InputMaybe<Scalars['String']>;
};

export type EventUpdateLocalizationInput = {
  data: EventUpdateLocalizationDataInput;
  locale: Locale;
};

export type EventUpdateLocalizationsInput = {
  /** Localizations to create */
  create?: InputMaybe<Array<EventCreateLocalizationInput>>;
  /** Localizations to delete */
  delete?: InputMaybe<Array<Locale>>;
  /** Localizations to update */
  update?: InputMaybe<Array<EventUpdateLocalizationInput>>;
  upsert?: InputMaybe<Array<EventUpsertLocalizationInput>>;
};

export type EventUpdateManyInlineInput = {
  /** Connect multiple existing Event documents */
  connect?: InputMaybe<Array<EventConnectInput>>;
  /** Create and connect multiple Event documents */
  create?: InputMaybe<Array<EventCreateInput>>;
  /** Delete multiple Event documents */
  delete?: InputMaybe<Array<EventWhereUniqueInput>>;
  /** Disconnect multiple Event documents */
  disconnect?: InputMaybe<Array<EventWhereUniqueInput>>;
  /** Override currently-connected documents with multiple existing Event documents */
  set?: InputMaybe<Array<EventWhereUniqueInput>>;
  /** Update multiple Event documents */
  update?: InputMaybe<Array<EventUpdateWithNestedWhereUniqueInput>>;
  /** Upsert multiple Event documents */
  upsert?: InputMaybe<Array<EventUpsertWithNestedWhereUniqueInput>>;
};

export type EventUpdateManyInput = {
  /** description input for default locale (en) */
  description?: InputMaybe<Scalars['RichTextAST']>;
  /** Optional updates to localizations */
  localizations?: InputMaybe<EventUpdateManyLocalizationsInput>;
  public?: InputMaybe<Scalars['Boolean']>;
  published?: InputMaybe<Scalars['Boolean']>;
  /** title input for default locale (en) */
  title?: InputMaybe<Scalars['String']>;
};

export type EventUpdateManyLocalizationDataInput = {
  description?: InputMaybe<Scalars['RichTextAST']>;
  title?: InputMaybe<Scalars['String']>;
};

export type EventUpdateManyLocalizationInput = {
  data: EventUpdateManyLocalizationDataInput;
  locale: Locale;
};

export type EventUpdateManyLocalizationsInput = {
  /** Localizations to update */
  update?: InputMaybe<Array<EventUpdateManyLocalizationInput>>;
};

export type EventUpdateOneInlineInput = {
  /** Connect existing Event document */
  connect?: InputMaybe<EventWhereUniqueInput>;
  /** Create and connect one Event document */
  create?: InputMaybe<EventCreateInput>;
  /** Delete currently connected Event document */
  delete?: InputMaybe<Scalars['Boolean']>;
  /** Disconnect currently connected Event document */
  disconnect?: InputMaybe<Scalars['Boolean']>;
  /** Update single Event document */
  update?: InputMaybe<EventUpdateWithNestedWhereUniqueInput>;
  /** Upsert single Event document */
  upsert?: InputMaybe<EventUpsertWithNestedWhereUniqueInput>;
};

export type EventUpdateWithNestedWhereUniqueInput = {
  /** Document to update */
  data: EventUpdateInput;
  /** Unique document search */
  where: EventWhereUniqueInput;
};

export type EventUpsertInput = {
  /** Create document if it didn't exist */
  create: EventCreateInput;
  /** Update document if it exists */
  update: EventUpdateInput;
};

export type EventUpsertLocalizationInput = {
  create: EventCreateLocalizationDataInput;
  locale: Locale;
  update: EventUpdateLocalizationDataInput;
};

export type EventUpsertWithNestedWhereUniqueInput = {
  /** Upsert data */
  data: EventUpsertInput;
  /** Unique document search */
  where: EventWhereUniqueInput;
};

/** This contains a set of filters that can be used to compare values internally */
export type EventWhereComparatorInput = {
  /** This field can be used to request to check if the entry is outdated by internal comparison */
  outdated_to?: InputMaybe<Scalars['Boolean']>;
};

/** Identifies documents */
export type EventWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<EventWhereInput>>;
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<EventWhereInput>>;
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<EventWhereInput>>;
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  createdBy?: InputMaybe<UserWhereInput>;
  documentInStages_every?: InputMaybe<EventWhereStageInput>;
  documentInStages_none?: InputMaybe<EventWhereStageInput>;
  documentInStages_some?: InputMaybe<EventWhereStageInput>;
  eventDateLocations_every?: InputMaybe<EventDateLocationWhereInput>;
  eventDateLocations_none?: InputMaybe<EventDateLocationWhereInput>;
  eventDateLocations_some?: InputMaybe<EventDateLocationWhereInput>;
  eventPasses_every?: InputMaybe<EventPassWhereInput>;
  eventPasses_none?: InputMaybe<EventPassWhereInput>;
  eventPasses_some?: InputMaybe<EventPassWhereInput>;
  heroImage?: InputMaybe<AssetWhereInput>;
  id?: InputMaybe<Scalars['ID']>;
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>;
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Any other value that exists and is not equal to the given value. */
  id_not?: InputMaybe<Scalars['ID']>;
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>;
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>;
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>;
  organizer?: InputMaybe<OrganizerWhereInput>;
  public?: InputMaybe<Scalars['Boolean']>;
  /** Any other value that exists and is not equal to the given value. */
  public_not?: InputMaybe<Scalars['Boolean']>;
  published?: InputMaybe<Scalars['Boolean']>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  publishedBy?: InputMaybe<UserWhereInput>;
  /** Any other value that exists and is not equal to the given value. */
  published_not?: InputMaybe<Scalars['Boolean']>;
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>;
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>;
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>;
  slug?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  slug_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  slug_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  slug_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  slug_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  slug_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  slug_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  slug_starts_with?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  title_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  title_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  title_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  title_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  title_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  title_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  title_starts_with?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  updatedBy?: InputMaybe<UserWhereInput>;
};

/** The document in stages filter allows specifying a stage entry to cross compare the same document between different stages */
export type EventWhereStageInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<EventWhereStageInput>>;
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<EventWhereStageInput>>;
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<EventWhereStageInput>>;
  /** This field contains fields which can be set as true or false to specify an internal comparison */
  compareWithParent?: InputMaybe<EventWhereComparatorInput>;
  /** Specify the stage to compare with */
  stage?: InputMaybe<Stage>;
};

/** References Event record uniquely */
export type EventWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};

export const enum ImageFit {
  /** Resizes the image to fit within the specified parameters without distorting, cropping, or changing the aspect ratio. */
  Clip = 'clip',
  /** Resizes the image to fit the specified parameters exactly by removing any parts of the image that don't fit within the boundaries. */
  Crop = 'crop',
  /** Resizes the image to fit within the parameters, but as opposed to 'fit:clip' will not scale the image if the image is smaller than the output size. */
  Max = 'max',
  /** Resizes the image to fit the specified parameters exactly by scaling the image to the desired size. The aspect ratio of the image is not respected and the image can be distorted using this method. */
  Scale = 'scale'
};

export type ImageResizeInput = {
  /** The default value for the fit parameter is fit:clip. */
  fit?: InputMaybe<ImageFit>;
  /** The height in pixels to resize the image to. The value must be an integer from 1 to 10000. */
  height?: InputMaybe<Scalars['Int']>;
  /** The width in pixels to resize the image to. The value must be an integer from 1 to 10000. */
  width?: InputMaybe<Scalars['Int']>;
};

/** Transformations for Images */
export type ImageTransformationInput = {
  /** Resizes the image */
  resize?: InputMaybe<ImageResizeInput>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']>;
  _gt?: InputMaybe<Scalars['Int']>;
  _gte?: InputMaybe<Scalars['Int']>;
  _in?: InputMaybe<Array<Scalars['Int']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Int']>;
  _lte?: InputMaybe<Scalars['Int']>;
  _neq?: InputMaybe<Scalars['Int']>;
  _nin?: InputMaybe<Array<Scalars['Int']>>;
};

/** Locale system enumeration */
export const enum Locale {
  /** System locale */
  En = 'en',
  Fr = 'fr'
};

/** Representing a geolocation point with latitude and longitude */
export type Location = {
  __typename?: 'Location';
  distance: Scalars['Float'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
};


/** Representing a geolocation point with latitude and longitude */
export type LocationDistanceArgs = {
  from: LocationInput;
};

/** A model for location data (point on a map) + additional info such as street, venue etc. */
export type LocationAddress = {
  __typename?: 'LocationAddress';
  /** Name of the city */
  city: Scalars['String'];
  /** Point into the map where the event is happening */
  coordinates: Location;
  /** The name of the country */
  country: Scalars['String'];
  /** The unique identifier */
  id: Scalars['ID'];
  /** Place ID from google maps */
  placeId?: Maybe<Scalars['String']>;
  postalCode: Scalars['String'];
  /** System stage field */
  stage: Stage;
  /** The name of the state if it exist */
  state?: Maybe<Scalars['String']>;
  /** Name of the street */
  street?: Maybe<Scalars['String']>;
  /** Name of the venue, useful if the address doesn't apply */
  venue?: Maybe<Scalars['String']>;
};

export type LocationAddressCreateInput = {
  city: Scalars['String'];
  coordinates: LocationInput;
  country: Scalars['String'];
  placeId?: InputMaybe<Scalars['String']>;
  postalCode: Scalars['String'];
  state?: InputMaybe<Scalars['String']>;
  street?: InputMaybe<Scalars['String']>;
  venue?: InputMaybe<Scalars['String']>;
};

export type LocationAddressCreateOneInlineInput = {
  /** Create and connect one LocationAddress document */
  create?: InputMaybe<LocationAddressCreateInput>;
};

export type LocationAddressUpdateInput = {
  city?: InputMaybe<Scalars['String']>;
  coordinates?: InputMaybe<LocationInput>;
  country?: InputMaybe<Scalars['String']>;
  placeId?: InputMaybe<Scalars['String']>;
  postalCode?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  street?: InputMaybe<Scalars['String']>;
  venue?: InputMaybe<Scalars['String']>;
};

export type LocationAddressUpdateOneInlineInput = {
  /** Create and connect one LocationAddress document */
  create?: InputMaybe<LocationAddressCreateInput>;
  /** Delete currently connected LocationAddress document */
  delete?: InputMaybe<Scalars['Boolean']>;
  /** Update single LocationAddress document */
  update?: InputMaybe<LocationAddressUpdateWithNestedWhereUniqueInput>;
  /** Upsert single LocationAddress document */
  upsert?: InputMaybe<LocationAddressUpsertWithNestedWhereUniqueInput>;
};

export type LocationAddressUpdateWithNestedWhereUniqueInput = {
  /** Document to update */
  data: LocationAddressUpdateInput;
  /** Unique document search */
  where: LocationAddressWhereUniqueInput;
};

export type LocationAddressUpsertInput = {
  /** Create document if it didn't exist */
  create: LocationAddressCreateInput;
  /** Update document if it exists */
  update: LocationAddressUpdateInput;
};

export type LocationAddressUpsertWithNestedWhereUniqueInput = {
  /** Upsert data */
  data: LocationAddressUpsertInput;
  /** Unique document search */
  where: LocationAddressWhereUniqueInput;
};

/** Identifies documents */
export type LocationAddressWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<LocationAddressWhereInput>>;
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<LocationAddressWhereInput>>;
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<LocationAddressWhereInput>>;
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  city_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  city_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  city_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  city_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  city_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  city_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  city_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  city_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  city_starts_with?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  country_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  country_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  country_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  country_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  country_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  country_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  country_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  country_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  country_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>;
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Any other value that exists and is not equal to the given value. */
  id_not?: InputMaybe<Scalars['ID']>;
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>;
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>;
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>;
  placeId?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  placeId_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  placeId_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  placeId_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  placeId_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  placeId_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  placeId_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  placeId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  placeId_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  placeId_starts_with?: InputMaybe<Scalars['String']>;
  postalCode?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  postalCode_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  postalCode_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  postalCode_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  postalCode_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  postalCode_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  postalCode_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  postalCode_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  postalCode_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  postalCode_starts_with?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  state_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  state_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  state_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  state_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  state_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  state_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  state_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  state_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  state_starts_with?: InputMaybe<Scalars['String']>;
  street?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  street_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  street_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  street_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  street_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  street_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  street_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  street_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  street_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  street_starts_with?: InputMaybe<Scalars['String']>;
  venue?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  venue_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  venue_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  venue_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  venue_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  venue_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  venue_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  venue_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  venue_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  venue_starts_with?: InputMaybe<Scalars['String']>;
};

/** References LocationAddress record uniquely */
export type LocationAddressWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>;
};

/** Input for a geolocation point with latitude and longitude */
export type LocationInput = {
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
};

/** An object with an ID */
export type Node = {
  /** The id of the object. */
  id: Scalars['ID'];
  /** The Stage of an object */
  stage: Stage;
};

/** An organizer is an entity that launch events and handle the pass benefits. */
export type Organizer = Node & {
  __typename?: 'Organizer';
  /** The time the document was created */
  createdAt: Scalars['DateTime'];
  /** User that created this document */
  createdBy?: Maybe<User>;
  description?: Maybe<OrganizerDescriptionRichText>;
  /** Get the document in other stages */
  documentInStages: Array<Organizer>;
  events: Array<Event>;
  /** List of Organizer versions */
  history: Array<Version>;
  /** The unique identifier */
  id: Scalars['ID'];
  image: Asset;
  /** System Locale field */
  locale: Locale;
  /** Get the other localizations for this document */
  localizations: Array<Organizer>;
  /** Name of the organizer */
  name: Scalars['String'];
  /** The time the document was published. Null on documents in draft stage. */
  publishedAt?: Maybe<Scalars['DateTime']>;
  /** User that last published this document */
  publishedBy?: Maybe<User>;
  scheduledIn: Array<ScheduledOperation>;
  /** Used in URL */
  slug: Scalars['String'];
  /** System stage field */
  stage: Stage;
  /** The time the document was updated */
  updatedAt: Scalars['DateTime'];
  /** User that last updated this document */
  updatedBy?: Maybe<User>;
};


/** An organizer is an entity that launch events and handle the pass benefits. */
export type OrganizerCreatedAtArgs = {
  variation?: SystemDateTimeFieldVariation;
};


/** An organizer is an entity that launch events and handle the pass benefits. */
export type OrganizerCreatedByArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};


/** An organizer is an entity that launch events and handle the pass benefits. */
export type OrganizerDocumentInStagesArgs = {
  includeCurrent?: Scalars['Boolean'];
  inheritLocale?: Scalars['Boolean'];
  stages?: Array<Stage>;
};


/** An organizer is an entity that launch events and handle the pass benefits. */
export type OrganizerEventsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: InputMaybe<Array<Locale>>;
  orderBy?: InputMaybe<EventOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EventWhereInput>;
};


/** An organizer is an entity that launch events and handle the pass benefits. */
export type OrganizerHistoryArgs = {
  limit?: Scalars['Int'];
  skip?: Scalars['Int'];
  stageOverride?: InputMaybe<Stage>;
};


/** An organizer is an entity that launch events and handle the pass benefits. */
export type OrganizerImageArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};


/** An organizer is an entity that launch events and handle the pass benefits. */
export type OrganizerLocalizationsArgs = {
  includeCurrent?: Scalars['Boolean'];
  locales?: Array<Locale>;
};


/** An organizer is an entity that launch events and handle the pass benefits. */
export type OrganizerPublishedAtArgs = {
  variation?: SystemDateTimeFieldVariation;
};


/** An organizer is an entity that launch events and handle the pass benefits. */
export type OrganizerPublishedByArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};


/** An organizer is an entity that launch events and handle the pass benefits. */
export type OrganizerScheduledInArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: InputMaybe<Array<Locale>>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ScheduledOperationWhereInput>;
};


/** An organizer is an entity that launch events and handle the pass benefits. */
export type OrganizerUpdatedAtArgs = {
  variation?: SystemDateTimeFieldVariation;
};


/** An organizer is an entity that launch events and handle the pass benefits. */
export type OrganizerUpdatedByArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};

export type OrganizerConnectInput = {
  /** Allow to specify document position in list of connected documents, will default to appending at end of list */
  position?: InputMaybe<ConnectPositionInput>;
  /** Document to connect */
  where: OrganizerWhereUniqueInput;
};

/** A connection to a list of items. */
export type OrganizerConnection = {
  __typename?: 'OrganizerConnection';
  aggregate: Aggregate;
  /** A list of edges. */
  edges: Array<OrganizerEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

export type OrganizerCreateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>;
  /** description input for default locale (en) */
  description?: InputMaybe<Scalars['RichTextAST']>;
  events?: InputMaybe<EventCreateManyInlineInput>;
  image: AssetCreateOneInlineInput;
  /** Inline mutations for managing document localizations excluding the default locale */
  localizations?: InputMaybe<OrganizerCreateLocalizationsInput>;
  name: Scalars['String'];
  slug: Scalars['String'];
  updatedAt?: InputMaybe<Scalars['DateTime']>;
};

export type OrganizerCreateLocalizationDataInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['RichTextAST']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
};

export type OrganizerCreateLocalizationInput = {
  /** Localization input */
  data: OrganizerCreateLocalizationDataInput;
  locale: Locale;
};

export type OrganizerCreateLocalizationsInput = {
  /** Create localizations for the newly-created document */
  create?: InputMaybe<Array<OrganizerCreateLocalizationInput>>;
};

export type OrganizerCreateManyInlineInput = {
  /** Connect multiple existing Organizer documents */
  connect?: InputMaybe<Array<OrganizerWhereUniqueInput>>;
  /** Create and connect multiple existing Organizer documents */
  create?: InputMaybe<Array<OrganizerCreateInput>>;
};

export type OrganizerCreateOneInlineInput = {
  /** Connect one existing Organizer document */
  connect?: InputMaybe<OrganizerWhereUniqueInput>;
  /** Create and connect one Organizer document */
  create?: InputMaybe<OrganizerCreateInput>;
};

export type OrganizerDescriptionRichText = {
  __typename?: 'OrganizerDescriptionRichText';
  /** Returns HTMl representation */
  html: Scalars['String'];
  json: Scalars['RichTextAST'];
  /** Returns Markdown representation */
  markdown: Scalars['String'];
  raw: Scalars['RichTextAST'];
  references: Array<OrganizerDescriptionRichTextEmbeddedTypes>;
  /** Returns plain-text contents of RichText */
  text: Scalars['String'];
};


export type OrganizerDescriptionRichTextReferencesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type OrganizerDescriptionRichTextEmbeddedTypes = Asset;

/** An edge in a connection. */
export type OrganizerEdge = {
  __typename?: 'OrganizerEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Organizer;
};

/** Identifies documents */
export type OrganizerManyWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<OrganizerWhereInput>>;
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<OrganizerWhereInput>>;
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<OrganizerWhereInput>>;
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  createdBy?: InputMaybe<UserWhereInput>;
  documentInStages_every?: InputMaybe<OrganizerWhereStageInput>;
  documentInStages_none?: InputMaybe<OrganizerWhereStageInput>;
  documentInStages_some?: InputMaybe<OrganizerWhereStageInput>;
  events_every?: InputMaybe<EventWhereInput>;
  events_none?: InputMaybe<EventWhereInput>;
  events_some?: InputMaybe<EventWhereInput>;
  id?: InputMaybe<Scalars['ID']>;
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>;
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Any other value that exists and is not equal to the given value. */
  id_not?: InputMaybe<Scalars['ID']>;
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>;
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>;
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>;
  image?: InputMaybe<AssetWhereInput>;
  name?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  name_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  name_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  name_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  name_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  name_starts_with?: InputMaybe<Scalars['String']>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  publishedBy?: InputMaybe<UserWhereInput>;
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>;
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>;
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>;
  slug?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  slug_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  slug_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  slug_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  slug_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  slug_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  slug_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  slug_starts_with?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  updatedBy?: InputMaybe<UserWhereInput>;
};

export const enum OrganizerOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  PublishedAtAsc = 'publishedAt_ASC',
  PublishedAtDesc = 'publishedAt_DESC',
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC'
};

export type OrganizerUpdateInput = {
  /** description input for default locale (en) */
  description?: InputMaybe<Scalars['RichTextAST']>;
  events?: InputMaybe<EventUpdateManyInlineInput>;
  image?: InputMaybe<AssetUpdateOneInlineInput>;
  /** Manage document localizations */
  localizations?: InputMaybe<OrganizerUpdateLocalizationsInput>;
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};

export type OrganizerUpdateLocalizationDataInput = {
  description?: InputMaybe<Scalars['RichTextAST']>;
};

export type OrganizerUpdateLocalizationInput = {
  data: OrganizerUpdateLocalizationDataInput;
  locale: Locale;
};

export type OrganizerUpdateLocalizationsInput = {
  /** Localizations to create */
  create?: InputMaybe<Array<OrganizerCreateLocalizationInput>>;
  /** Localizations to delete */
  delete?: InputMaybe<Array<Locale>>;
  /** Localizations to update */
  update?: InputMaybe<Array<OrganizerUpdateLocalizationInput>>;
  upsert?: InputMaybe<Array<OrganizerUpsertLocalizationInput>>;
};

export type OrganizerUpdateManyInlineInput = {
  /** Connect multiple existing Organizer documents */
  connect?: InputMaybe<Array<OrganizerConnectInput>>;
  /** Create and connect multiple Organizer documents */
  create?: InputMaybe<Array<OrganizerCreateInput>>;
  /** Delete multiple Organizer documents */
  delete?: InputMaybe<Array<OrganizerWhereUniqueInput>>;
  /** Disconnect multiple Organizer documents */
  disconnect?: InputMaybe<Array<OrganizerWhereUniqueInput>>;
  /** Override currently-connected documents with multiple existing Organizer documents */
  set?: InputMaybe<Array<OrganizerWhereUniqueInput>>;
  /** Update multiple Organizer documents */
  update?: InputMaybe<Array<OrganizerUpdateWithNestedWhereUniqueInput>>;
  /** Upsert multiple Organizer documents */
  upsert?: InputMaybe<Array<OrganizerUpsertWithNestedWhereUniqueInput>>;
};

export type OrganizerUpdateManyInput = {
  /** description input for default locale (en) */
  description?: InputMaybe<Scalars['RichTextAST']>;
  /** Optional updates to localizations */
  localizations?: InputMaybe<OrganizerUpdateManyLocalizationsInput>;
};

export type OrganizerUpdateManyLocalizationDataInput = {
  description?: InputMaybe<Scalars['RichTextAST']>;
};

export type OrganizerUpdateManyLocalizationInput = {
  data: OrganizerUpdateManyLocalizationDataInput;
  locale: Locale;
};

export type OrganizerUpdateManyLocalizationsInput = {
  /** Localizations to update */
  update?: InputMaybe<Array<OrganizerUpdateManyLocalizationInput>>;
};

export type OrganizerUpdateOneInlineInput = {
  /** Connect existing Organizer document */
  connect?: InputMaybe<OrganizerWhereUniqueInput>;
  /** Create and connect one Organizer document */
  create?: InputMaybe<OrganizerCreateInput>;
  /** Delete currently connected Organizer document */
  delete?: InputMaybe<Scalars['Boolean']>;
  /** Disconnect currently connected Organizer document */
  disconnect?: InputMaybe<Scalars['Boolean']>;
  /** Update single Organizer document */
  update?: InputMaybe<OrganizerUpdateWithNestedWhereUniqueInput>;
  /** Upsert single Organizer document */
  upsert?: InputMaybe<OrganizerUpsertWithNestedWhereUniqueInput>;
};

export type OrganizerUpdateWithNestedWhereUniqueInput = {
  /** Document to update */
  data: OrganizerUpdateInput;
  /** Unique document search */
  where: OrganizerWhereUniqueInput;
};

export type OrganizerUpsertInput = {
  /** Create document if it didn't exist */
  create: OrganizerCreateInput;
  /** Update document if it exists */
  update: OrganizerUpdateInput;
};

export type OrganizerUpsertLocalizationInput = {
  create: OrganizerCreateLocalizationDataInput;
  locale: Locale;
  update: OrganizerUpdateLocalizationDataInput;
};

export type OrganizerUpsertWithNestedWhereUniqueInput = {
  /** Upsert data */
  data: OrganizerUpsertInput;
  /** Unique document search */
  where: OrganizerWhereUniqueInput;
};

/** This contains a set of filters that can be used to compare values internally */
export type OrganizerWhereComparatorInput = {
  /** This field can be used to request to check if the entry is outdated by internal comparison */
  outdated_to?: InputMaybe<Scalars['Boolean']>;
};

/** Identifies documents */
export type OrganizerWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<OrganizerWhereInput>>;
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<OrganizerWhereInput>>;
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<OrganizerWhereInput>>;
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  createdBy?: InputMaybe<UserWhereInput>;
  documentInStages_every?: InputMaybe<OrganizerWhereStageInput>;
  documentInStages_none?: InputMaybe<OrganizerWhereStageInput>;
  documentInStages_some?: InputMaybe<OrganizerWhereStageInput>;
  events_every?: InputMaybe<EventWhereInput>;
  events_none?: InputMaybe<EventWhereInput>;
  events_some?: InputMaybe<EventWhereInput>;
  id?: InputMaybe<Scalars['ID']>;
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>;
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Any other value that exists and is not equal to the given value. */
  id_not?: InputMaybe<Scalars['ID']>;
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>;
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>;
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>;
  image?: InputMaybe<AssetWhereInput>;
  name?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  name_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  name_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  name_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  name_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  name_starts_with?: InputMaybe<Scalars['String']>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  publishedBy?: InputMaybe<UserWhereInput>;
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>;
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>;
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>;
  slug?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  slug_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  slug_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  slug_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  slug_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  slug_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  slug_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  slug_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  slug_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  slug_starts_with?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  updatedBy?: InputMaybe<UserWhereInput>;
};

/** The document in stages filter allows specifying a stage entry to cross compare the same document between different stages */
export type OrganizerWhereStageInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<OrganizerWhereStageInput>>;
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<OrganizerWhereStageInput>>;
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<OrganizerWhereStageInput>>;
  /** This field contains fields which can be set as true or false to specify an internal comparison */
  compareWithParent?: InputMaybe<OrganizerWhereComparatorInput>;
  /** Specify the stage to compare with */
  stage?: InputMaybe<Stage>;
};

/** References Organizer record uniquely */
export type OrganizerWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};

/** References Organizer record uniquely */
export type OrganizerWhereUniqueInput_Remote_Rel_Accountorganizer = {
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** Number of items in the current page. */
  pageSize?: Maybe<Scalars['Int']>;
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

/** Define the options of an 'Event Pass' on an 'Event Date Location'. You can define severals if the event have multiple locations. */
export type PassOption = {
  __typename?: 'PassOption';
  /** Description of the option, like "Access to the event on Day 1" */
  description?: Maybe<Scalars['String']>;
  /**
   * Define the location and date for this option.
   * Important ! It will determine the release and availability for the Pass access.
   */
  eventDateLocation: EventDateLocation;
  /** The unique identifier */
  id: Scalars['ID'];
  /** System Locale field */
  locale: Locale;
  /** Get the other localizations for this document */
  localizations: Array<PassOption>;
  /** Name of the options, like "Day 1 Access" or "VIP Room Access" */
  name: Scalars['String'];
  /** System stage field */
  stage: Stage;
};


/** Define the options of an 'Event Pass' on an 'Event Date Location'. You can define severals if the event have multiple locations. */
export type PassOptionEventDateLocationArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};


/** Define the options of an 'Event Pass' on an 'Event Date Location'. You can define severals if the event have multiple locations. */
export type PassOptionLocalizationsArgs = {
  includeCurrent?: Scalars['Boolean'];
  locales?: Array<Locale>;
};

export type PassOptionCreateInput = {
  /** description input for default locale (en) */
  description?: InputMaybe<Scalars['String']>;
  eventDateLocation: EventDateLocationCreateOneInlineInput;
  /** Inline mutations for managing document localizations excluding the default locale */
  localizations?: InputMaybe<PassOptionCreateLocalizationsInput>;
  /** name input for default locale (en) */
  name: Scalars['String'];
};

export type PassOptionCreateLocalizationDataInput = {
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type PassOptionCreateLocalizationInput = {
  /** Localization input */
  data: PassOptionCreateLocalizationDataInput;
  locale: Locale;
};

export type PassOptionCreateLocalizationsInput = {
  /** Create localizations for the newly-created document */
  create?: InputMaybe<Array<PassOptionCreateLocalizationInput>>;
};

export type PassOptionCreateManyInlineInput = {
  /** Create and connect multiple existing PassOption documents */
  create?: InputMaybe<Array<PassOptionCreateInput>>;
};

export type PassOptionCreateWithPositionInput = {
  /** Document to create */
  data: PassOptionCreateInput;
  /** Position in the list of existing component instances, will default to appending at the end of list */
  position?: InputMaybe<ConnectPositionInput>;
};

export const enum PassOptionOrderByInput {
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC'
};

export type PassOptionUpdateInput = {
  /** description input for default locale (en) */
  description?: InputMaybe<Scalars['String']>;
  eventDateLocation?: InputMaybe<EventDateLocationUpdateOneInlineInput>;
  /** Manage document localizations */
  localizations?: InputMaybe<PassOptionUpdateLocalizationsInput>;
  /** name input for default locale (en) */
  name?: InputMaybe<Scalars['String']>;
};

export type PassOptionUpdateLocalizationDataInput = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type PassOptionUpdateLocalizationInput = {
  data: PassOptionUpdateLocalizationDataInput;
  locale: Locale;
};

export type PassOptionUpdateLocalizationsInput = {
  /** Localizations to create */
  create?: InputMaybe<Array<PassOptionCreateLocalizationInput>>;
  /** Localizations to delete */
  delete?: InputMaybe<Array<Locale>>;
  /** Localizations to update */
  update?: InputMaybe<Array<PassOptionUpdateLocalizationInput>>;
  upsert?: InputMaybe<Array<PassOptionUpsertLocalizationInput>>;
};

export type PassOptionUpdateManyInlineInput = {
  /** Create and connect multiple PassOption component instances */
  create?: InputMaybe<Array<PassOptionCreateWithPositionInput>>;
  /** Delete multiple PassOption documents */
  delete?: InputMaybe<Array<PassOptionWhereUniqueInput>>;
  /** Update multiple PassOption component instances */
  update?: InputMaybe<Array<PassOptionUpdateWithNestedWhereUniqueAndPositionInput>>;
  /** Upsert multiple PassOption component instances */
  upsert?: InputMaybe<Array<PassOptionUpsertWithNestedWhereUniqueAndPositionInput>>;
};

export type PassOptionUpdateWithNestedWhereUniqueAndPositionInput = {
  /** Document to update */
  data?: InputMaybe<PassOptionUpdateInput>;
  /** Position in the list of existing component instances, will default to appending at the end of list */
  position?: InputMaybe<ConnectPositionInput>;
  /** Unique component instance search */
  where: PassOptionWhereUniqueInput;
};

export type PassOptionUpsertInput = {
  /** Create document if it didn't exist */
  create: PassOptionCreateInput;
  /** Update document if it exists */
  update: PassOptionUpdateInput;
};

export type PassOptionUpsertLocalizationInput = {
  create: PassOptionCreateLocalizationDataInput;
  locale: Locale;
  update: PassOptionUpdateLocalizationDataInput;
};

export type PassOptionUpsertWithNestedWhereUniqueAndPositionInput = {
  /** Document to upsert */
  data?: InputMaybe<PassOptionUpsertInput>;
  /** Position in the list of existing component instances, will default to appending at the end of list */
  position?: InputMaybe<ConnectPositionInput>;
  /** Unique component instance search */
  where: PassOptionWhereUniqueInput;
};

/** Identifies documents */
export type PassOptionWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<PassOptionWhereInput>>;
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<PassOptionWhereInput>>;
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<PassOptionWhereInput>>;
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  description_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  description_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  description_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  description_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  description_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  description_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  description_starts_with?: InputMaybe<Scalars['String']>;
  eventDateLocation?: InputMaybe<EventDateLocationWhereInput>;
  id?: InputMaybe<Scalars['ID']>;
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>;
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Any other value that exists and is not equal to the given value. */
  id_not?: InputMaybe<Scalars['ID']>;
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>;
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>;
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  name_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  name_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  name_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  name_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  name_starts_with?: InputMaybe<Scalars['String']>;
};

/** References PassOption record uniquely */
export type PassOptionWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>;
};

/** Scheduled Operation system model */
export type ScheduledOperation = Node & {
  __typename?: 'ScheduledOperation';
  affectedDocuments: Array<ScheduledOperationAffectedDocument>;
  /** The time the document was created */
  createdAt: Scalars['DateTime'];
  /** User that created this document */
  createdBy?: Maybe<User>;
  /** Operation description */
  description?: Maybe<Scalars['String']>;
  /** Get the document in other stages */
  documentInStages: Array<ScheduledOperation>;
  /** Operation error message */
  errorMessage?: Maybe<Scalars['String']>;
  /** The unique identifier */
  id: Scalars['ID'];
  /** The time the document was published. Null on documents in draft stage. */
  publishedAt?: Maybe<Scalars['DateTime']>;
  /** User that last published this document */
  publishedBy?: Maybe<User>;
  /** Raw operation payload including all details, this field is subject to change */
  rawPayload: Scalars['Json'];
  /** The release this operation is scheduled for */
  release?: Maybe<ScheduledRelease>;
  /** System stage field */
  stage: Stage;
  /** operation Status */
  status: ScheduledOperationStatus;
  /** The time the document was updated */
  updatedAt: Scalars['DateTime'];
  /** User that last updated this document */
  updatedBy?: Maybe<User>;
};


/** Scheduled Operation system model */
export type ScheduledOperationAffectedDocumentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: InputMaybe<Array<Locale>>;
  skip?: InputMaybe<Scalars['Int']>;
};


/** Scheduled Operation system model */
export type ScheduledOperationCreatedByArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};


/** Scheduled Operation system model */
export type ScheduledOperationDocumentInStagesArgs = {
  includeCurrent?: Scalars['Boolean'];
  inheritLocale?: Scalars['Boolean'];
  stages?: Array<Stage>;
};


/** Scheduled Operation system model */
export type ScheduledOperationPublishedByArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};


/** Scheduled Operation system model */
export type ScheduledOperationReleaseArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};


/** Scheduled Operation system model */
export type ScheduledOperationUpdatedByArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};

export type ScheduledOperationAffectedDocument = Asset | Event | EventPass | Organizer;

/** A connection to a list of items. */
export type ScheduledOperationConnection = {
  __typename?: 'ScheduledOperationConnection';
  aggregate: Aggregate;
  /** A list of edges. */
  edges: Array<ScheduledOperationEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ScheduledOperationEdge = {
  __typename?: 'ScheduledOperationEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: ScheduledOperation;
};

export const enum ScheduledOperationOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  ErrorMessageAsc = 'errorMessage_ASC',
  ErrorMessageDesc = 'errorMessage_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PublishedAtAsc = 'publishedAt_ASC',
  PublishedAtDesc = 'publishedAt_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC'
};

/** System Scheduled Operation Status */
export const enum ScheduledOperationStatus {
  Canceled = 'CANCELED',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING'
};

/** Identifies documents */
export type ScheduledOperationWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<ScheduledOperationWhereInput>>;
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<ScheduledOperationWhereInput>>;
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<ScheduledOperationWhereInput>>;
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  createdBy?: InputMaybe<UserWhereInput>;
  description?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  description_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  description_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  description_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  description_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  description_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  description_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  description_starts_with?: InputMaybe<Scalars['String']>;
  errorMessage?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  errorMessage_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  errorMessage_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  errorMessage_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  errorMessage_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  errorMessage_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  errorMessage_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  errorMessage_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  errorMessage_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  errorMessage_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>;
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Any other value that exists and is not equal to the given value. */
  id_not?: InputMaybe<Scalars['ID']>;
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>;
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>;
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  publishedBy?: InputMaybe<UserWhereInput>;
  /** All values containing the given json path. */
  rawPayload_json_path_exists?: InputMaybe<Scalars['String']>;
  /**
   * Recursively tries to find the provided JSON scalar value inside the field.
   * It does use an exact match when comparing values.
   * If you pass `null` as value the filter will be ignored.
   * Note: This filter fails if you try to look for a non scalar JSON value!
   */
  rawPayload_value_recursive?: InputMaybe<Scalars['Json']>;
  release?: InputMaybe<ScheduledReleaseWhereInput>;
  status?: InputMaybe<ScheduledOperationStatus>;
  /** All values that are contained in given list. */
  status_in?: InputMaybe<Array<InputMaybe<ScheduledOperationStatus>>>;
  /** Any other value that exists and is not equal to the given value. */
  status_not?: InputMaybe<ScheduledOperationStatus>;
  /** All values that are not contained in given list. */
  status_not_in?: InputMaybe<Array<InputMaybe<ScheduledOperationStatus>>>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  updatedBy?: InputMaybe<UserWhereInput>;
};

/** References ScheduledOperation record uniquely */
export type ScheduledOperationWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>;
};

/** Scheduled Release system model */
export type ScheduledRelease = Node & {
  __typename?: 'ScheduledRelease';
  /** The time the document was created */
  createdAt: Scalars['DateTime'];
  /** User that created this document */
  createdBy?: Maybe<User>;
  /** Release description */
  description?: Maybe<Scalars['String']>;
  /** Get the document in other stages */
  documentInStages: Array<ScheduledRelease>;
  /** Release error message */
  errorMessage?: Maybe<Scalars['String']>;
  /** The unique identifier */
  id: Scalars['ID'];
  /** Whether scheduled release should be run */
  isActive: Scalars['Boolean'];
  /** Whether scheduled release is implicit */
  isImplicit: Scalars['Boolean'];
  /** Operations to run with this release */
  operations: Array<ScheduledOperation>;
  /** The time the document was published. Null on documents in draft stage. */
  publishedAt?: Maybe<Scalars['DateTime']>;
  /** User that last published this document */
  publishedBy?: Maybe<User>;
  /** Release date and time */
  releaseAt?: Maybe<Scalars['DateTime']>;
  /** System stage field */
  stage: Stage;
  /** Release Status */
  status: ScheduledReleaseStatus;
  /** Release Title */
  title?: Maybe<Scalars['String']>;
  /** The time the document was updated */
  updatedAt: Scalars['DateTime'];
  /** User that last updated this document */
  updatedBy?: Maybe<User>;
};


/** Scheduled Release system model */
export type ScheduledReleaseCreatedByArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};


/** Scheduled Release system model */
export type ScheduledReleaseDocumentInStagesArgs = {
  includeCurrent?: Scalars['Boolean'];
  inheritLocale?: Scalars['Boolean'];
  stages?: Array<Stage>;
};


/** Scheduled Release system model */
export type ScheduledReleaseOperationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: InputMaybe<Array<Locale>>;
  orderBy?: InputMaybe<ScheduledOperationOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ScheduledOperationWhereInput>;
};


/** Scheduled Release system model */
export type ScheduledReleasePublishedByArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};


/** Scheduled Release system model */
export type ScheduledReleaseUpdatedByArgs = {
  forceParentLocale?: InputMaybe<Scalars['Boolean']>;
  locales?: InputMaybe<Array<Locale>>;
};

/** A connection to a list of items. */
export type ScheduledReleaseConnection = {
  __typename?: 'ScheduledReleaseConnection';
  aggregate: Aggregate;
  /** A list of edges. */
  edges: Array<ScheduledReleaseEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

export type ScheduledReleaseCreateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  errorMessage?: InputMaybe<Scalars['String']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  releaseAt?: InputMaybe<Scalars['DateTime']>;
  title?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
};

/** An edge in a connection. */
export type ScheduledReleaseEdge = {
  __typename?: 'ScheduledReleaseEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: ScheduledRelease;
};

export const enum ScheduledReleaseOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  ErrorMessageAsc = 'errorMessage_ASC',
  ErrorMessageDesc = 'errorMessage_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsActiveAsc = 'isActive_ASC',
  IsActiveDesc = 'isActive_DESC',
  IsImplicitAsc = 'isImplicit_ASC',
  IsImplicitDesc = 'isImplicit_DESC',
  PublishedAtAsc = 'publishedAt_ASC',
  PublishedAtDesc = 'publishedAt_DESC',
  ReleaseAtAsc = 'releaseAt_ASC',
  ReleaseAtDesc = 'releaseAt_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC'
};

/** System Scheduled Release Status */
export const enum ScheduledReleaseStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING'
};

export type ScheduledReleaseUpdateInput = {
  description?: InputMaybe<Scalars['String']>;
  errorMessage?: InputMaybe<Scalars['String']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  releaseAt?: InputMaybe<Scalars['DateTime']>;
  title?: InputMaybe<Scalars['String']>;
};

/** Identifies documents */
export type ScheduledReleaseWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<ScheduledReleaseWhereInput>>;
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<ScheduledReleaseWhereInput>>;
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<ScheduledReleaseWhereInput>>;
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  createdBy?: InputMaybe<UserWhereInput>;
  description?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  description_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  description_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  description_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  description_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  description_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  description_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  description_starts_with?: InputMaybe<Scalars['String']>;
  errorMessage?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  errorMessage_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  errorMessage_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  errorMessage_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  errorMessage_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  errorMessage_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  errorMessage_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  errorMessage_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  errorMessage_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  errorMessage_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>;
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Any other value that exists and is not equal to the given value. */
  id_not?: InputMaybe<Scalars['ID']>;
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>;
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>;
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  /** Any other value that exists and is not equal to the given value. */
  isActive_not?: InputMaybe<Scalars['Boolean']>;
  isImplicit?: InputMaybe<Scalars['Boolean']>;
  /** Any other value that exists and is not equal to the given value. */
  isImplicit_not?: InputMaybe<Scalars['Boolean']>;
  operations_every?: InputMaybe<ScheduledOperationWhereInput>;
  operations_none?: InputMaybe<ScheduledOperationWhereInput>;
  operations_some?: InputMaybe<ScheduledOperationWhereInput>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  publishedBy?: InputMaybe<UserWhereInput>;
  releaseAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  releaseAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  releaseAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  releaseAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  releaseAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  releaseAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  releaseAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  releaseAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  status?: InputMaybe<ScheduledReleaseStatus>;
  /** All values that are contained in given list. */
  status_in?: InputMaybe<Array<InputMaybe<ScheduledReleaseStatus>>>;
  /** Any other value that exists and is not equal to the given value. */
  status_not?: InputMaybe<ScheduledReleaseStatus>;
  /** All values that are not contained in given list. */
  status_not_in?: InputMaybe<Array<InputMaybe<ScheduledReleaseStatus>>>;
  title?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  title_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  title_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  title_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  title_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  title_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  title_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  title_starts_with?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  updatedBy?: InputMaybe<UserWhereInput>;
};

/** References ScheduledRelease record uniquely */
export type ScheduledReleaseWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>;
};

/** Stage system enumeration */
export const enum Stage {
  /** The Draft is the default stage for all your content. */
  Draft = 'DRAFT',
  /** The Published stage is where you can publish your content to. */
  Published = 'PUBLISHED'
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
};

export const enum SystemDateTimeFieldVariation {
  Base = 'BASE',
  Combined = 'COMBINED',
  Localization = 'LOCALIZATION'
};

/** User system model */
export type User = Node & {
  __typename?: 'User';
  /** The time the document was created */
  createdAt: Scalars['DateTime'];
  /** Get the document in other stages */
  documentInStages: Array<User>;
  /** The unique identifier */
  id: Scalars['ID'];
  /** Flag to determine if user is active or not */
  isActive: Scalars['Boolean'];
  /** User Kind. Can be either MEMBER, PAT or PUBLIC */
  kind: UserKind;
  /** The username */
  name: Scalars['String'];
  /** Profile Picture url */
  picture?: Maybe<Scalars['String']>;
  /** The time the document was published. Null on documents in draft stage. */
  publishedAt?: Maybe<Scalars['DateTime']>;
  /** System stage field */
  stage: Stage;
  /** The time the document was updated */
  updatedAt: Scalars['DateTime'];
};


/** User system model */
export type UserDocumentInStagesArgs = {
  includeCurrent?: Scalars['Boolean'];
  inheritLocale?: Scalars['Boolean'];
  stages?: Array<Stage>;
};

/** A connection to a list of items. */
export type UserConnection = {
  __typename?: 'UserConnection';
  aggregate: Aggregate;
  /** A list of edges. */
  edges: Array<UserEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type UserEdge = {
  __typename?: 'UserEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: User;
};

/** System User Kind */
export const enum UserKind {
  AppToken = 'APP_TOKEN',
  Member = 'MEMBER',
  Pat = 'PAT',
  Public = 'PUBLIC',
  Webhook = 'WEBHOOK'
};

export const enum UserOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsActiveAsc = 'isActive_ASC',
  IsActiveDesc = 'isActive_DESC',
  KindAsc = 'kind_ASC',
  KindDesc = 'kind_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  PictureAsc = 'picture_ASC',
  PictureDesc = 'picture_DESC',
  PublishedAtAsc = 'publishedAt_ASC',
  PublishedAtDesc = 'publishedAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC'
};

/** This contains a set of filters that can be used to compare values internally */
export type UserWhereComparatorInput = {
  /** This field can be used to request to check if the entry is outdated by internal comparison */
  outdated_to?: InputMaybe<Scalars['Boolean']>;
};

/** Identifies documents */
export type UserWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<UserWhereInput>>;
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<UserWhereInput>>;
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<UserWhereInput>>;
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  documentInStages_every?: InputMaybe<UserWhereStageInput>;
  documentInStages_none?: InputMaybe<UserWhereStageInput>;
  documentInStages_some?: InputMaybe<UserWhereStageInput>;
  id?: InputMaybe<Scalars['ID']>;
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>;
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Any other value that exists and is not equal to the given value. */
  id_not?: InputMaybe<Scalars['ID']>;
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>;
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>;
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>;
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  /** Any other value that exists and is not equal to the given value. */
  isActive_not?: InputMaybe<Scalars['Boolean']>;
  kind?: InputMaybe<UserKind>;
  /** All values that are contained in given list. */
  kind_in?: InputMaybe<Array<InputMaybe<UserKind>>>;
  /** Any other value that exists and is not equal to the given value. */
  kind_not?: InputMaybe<UserKind>;
  /** All values that are not contained in given list. */
  kind_not_in?: InputMaybe<Array<InputMaybe<UserKind>>>;
  name?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  name_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  name_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  name_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  name_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  name_starts_with?: InputMaybe<Scalars['String']>;
  picture?: InputMaybe<Scalars['String']>;
  /** All values containing the given string. */
  picture_contains?: InputMaybe<Scalars['String']>;
  /** All values ending with the given string. */
  picture_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are contained in given list. */
  picture_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Any other value that exists and is not equal to the given value. */
  picture_not?: InputMaybe<Scalars['String']>;
  /** All values not containing the given string. */
  picture_not_contains?: InputMaybe<Scalars['String']>;
  /** All values not ending with the given string */
  picture_not_ends_with?: InputMaybe<Scalars['String']>;
  /** All values that are not contained in given list. */
  picture_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** All values not starting with the given string. */
  picture_not_starts_with?: InputMaybe<Scalars['String']>;
  /** All values starting with the given string. */
  picture_starts_with?: InputMaybe<Scalars['String']>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>;
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>;
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>;
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>;
  /** Any other value that exists and is not equal to the given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>;
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
};

/** The document in stages filter allows specifying a stage entry to cross compare the same document between different stages */
export type UserWhereStageInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<UserWhereStageInput>>;
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<UserWhereStageInput>>;
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<UserWhereStageInput>>;
  /** This field contains fields which can be set as true or false to specify an internal comparison */
  compareWithParent?: InputMaybe<UserWhereComparatorInput>;
  /** Specify the stage to compare with */
  stage?: InputMaybe<Stage>;
};

/** References User record uniquely */
export type UserWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>;
};

export type Version = {
  __typename?: 'Version';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  revision: Scalars['Int'];
  stage: Stage;
};

export type VersionWhereInput = {
  id: Scalars['ID'];
  revision: Scalars['Int'];
  stage: Stage;
};

/** An account can represent an user or organizer. It store essential informations and is used as the root class for relationships with other tables */
export type Account = {
  __typename?: 'account';
  address: Scalars['String'];
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  emailVerified: Scalars['Boolean'];
  id: Scalars['uuid'];
  isOrganizer: Scalars['Boolean'];
  organizer?: Maybe<Organizer>;
  organizerId?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};


/** An account can represent an user or organizer. It store essential informations and is used as the root class for relationships with other tables */
export type AccountOrganizerArgs = {
  locales?: Array<Locale>;
  stage?: Stage;
  where: OrganizerWhereUniqueInput_Remote_Rel_Accountorganizer;
};

/** aggregated selection of "account" */
export type Account_Aggregate = {
  __typename?: 'account_aggregate';
  aggregate?: Maybe<Account_Aggregate_Fields>;
  nodes: Array<Account>;
};

/** aggregate fields of "account" */
export type Account_Aggregate_Fields = {
  __typename?: 'account_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Account_Max_Fields>;
  min?: Maybe<Account_Min_Fields>;
};


/** aggregate fields of "account" */
export type Account_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Account_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "account". All fields are combined with a logical 'AND'. */
export type Account_Bool_Exp = {
  _and?: InputMaybe<Array<Account_Bool_Exp>>;
  _not?: InputMaybe<Account_Bool_Exp>;
  _or?: InputMaybe<Array<Account_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  emailVerified?: InputMaybe<Boolean_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  isOrganizer?: InputMaybe<Boolean_Comparison_Exp>;
  organizerId?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "account" */
export const enum Account_Constraint {
  /** unique or primary key constraint on columns "address" */
  AccountAddressKey = 'account_address_key',
  /** unique or primary key constraint on columns "id" */
  AccountPkey = 'account_pkey'
};

/** input type for inserting data into table "account" */
export type Account_Insert_Input = {
  address?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  email?: InputMaybe<Scalars['String']>;
  emailVerified?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['uuid']>;
  isOrganizer?: InputMaybe<Scalars['Boolean']>;
  organizerId?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Account_Max_Fields = {
  __typename?: 'account_max_fields';
  address?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  organizerId?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Account_Min_Fields = {
  __typename?: 'account_min_fields';
  address?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  organizerId?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "account" */
export type Account_Mutation_Response = {
  __typename?: 'account_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Account>;
};

/** input type for inserting object relation for remote table "account" */
export type Account_Obj_Rel_Insert_Input = {
  data: Account_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Account_On_Conflict>;
};

/** on_conflict condition type for table "account" */
export type Account_On_Conflict = {
  constraint: Account_Constraint;
  update_columns?: Array<Account_Update_Column>;
  where?: InputMaybe<Account_Bool_Exp>;
};

/** Ordering options when selecting data from "account". */
export type Account_Order_By = {
  address?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  emailVerified?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isOrganizer?: InputMaybe<Order_By>;
  organizerId?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: account */
export type Account_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "account" */
export const enum Account_Select_Column {
  /** column name */
  Address = 'address',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  EmailVerified = 'emailVerified',
  /** column name */
  Id = 'id',
  /** column name */
  IsOrganizer = 'isOrganizer',
  /** column name */
  OrganizerId = 'organizerId',
  /** column name */
  UpdatedAt = 'updated_at'
};

/** input type for updating data in table "account" */
export type Account_Set_Input = {
  address?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  email?: InputMaybe<Scalars['String']>;
  emailVerified?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['uuid']>;
  isOrganizer?: InputMaybe<Scalars['Boolean']>;
  organizerId?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** Streaming cursor of the table "account" */
export type Account_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Account_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Account_Stream_Cursor_Value_Input = {
  address?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  email?: InputMaybe<Scalars['String']>;
  emailVerified?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['uuid']>;
  isOrganizer?: InputMaybe<Scalars['Boolean']>;
  organizerId?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "account" */
export const enum Account_Update_Column {
  /** column name */
  Address = 'address',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  EmailVerified = 'emailVerified',
  /** column name */
  Id = 'id',
  /** column name */
  IsOrganizer = 'isOrganizer',
  /** column name */
  OrganizerId = 'organizerId',
  /** column name */
  UpdatedAt = 'updated_at'
};

export type Account_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Account_Set_Input>;
  /** filter the rows which have to be updated */
  where: Account_Bool_Exp;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bigint']>;
  _gt?: InputMaybe<Scalars['bigint']>;
  _gte?: InputMaybe<Scalars['bigint']>;
  _in?: InputMaybe<Array<Scalars['bigint']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['bigint']>;
  _lte?: InputMaybe<Scalars['bigint']>;
  _neq?: InputMaybe<Scalars['bigint']>;
  _nin?: InputMaybe<Array<Scalars['bigint']>>;
};

/** Currencies code following the standard ISO 4217 (https://en.wikipedia.org/wiki/ISO_4217) */
export type Currency = {
  __typename?: 'currency';
  value: Scalars['String'];
};

/** aggregated selection of "currency" */
export type Currency_Aggregate = {
  __typename?: 'currency_aggregate';
  aggregate?: Maybe<Currency_Aggregate_Fields>;
  nodes: Array<Currency>;
};

/** aggregate fields of "currency" */
export type Currency_Aggregate_Fields = {
  __typename?: 'currency_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Currency_Max_Fields>;
  min?: Maybe<Currency_Min_Fields>;
};


/** aggregate fields of "currency" */
export type Currency_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Currency_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "currency". All fields are combined with a logical 'AND'. */
export type Currency_Bool_Exp = {
  _and?: InputMaybe<Array<Currency_Bool_Exp>>;
  _not?: InputMaybe<Currency_Bool_Exp>;
  _or?: InputMaybe<Array<Currency_Bool_Exp>>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "currency" */
export const enum Currency_Constraint {
  /** unique or primary key constraint on columns "value" */
  CurrencyPkey = 'currency_pkey'
};

export const enum Currency_Enum {
  Aed = 'AED',
  Cny = 'CNY',
  Eur = 'EUR',
  Gbp = 'GBP',
  Qar = 'QAR',
  Sgd = 'SGD',
  Usd = 'USD'
};

/** Boolean expression to compare columns of type "currency_enum". All fields are combined with logical 'AND'. */
export type Currency_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Currency_Enum>;
  _in?: InputMaybe<Array<Currency_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Currency_Enum>;
  _nin?: InputMaybe<Array<Currency_Enum>>;
};

/** input type for inserting data into table "currency" */
export type Currency_Insert_Input = {
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Currency_Max_Fields = {
  __typename?: 'currency_max_fields';
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Currency_Min_Fields = {
  __typename?: 'currency_min_fields';
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "currency" */
export type Currency_Mutation_Response = {
  __typename?: 'currency_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Currency>;
};

/** on_conflict condition type for table "currency" */
export type Currency_On_Conflict = {
  constraint: Currency_Constraint;
  update_columns?: Array<Currency_Update_Column>;
  where?: InputMaybe<Currency_Bool_Exp>;
};

/** Ordering options when selecting data from "currency". */
export type Currency_Order_By = {
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: currency */
export type Currency_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "currency" */
export const enum Currency_Select_Column {
  /** column name */
  Value = 'value'
};

/** input type for updating data in table "currency" */
export type Currency_Set_Input = {
  value?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "currency" */
export type Currency_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Currency_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Currency_Stream_Cursor_Value_Input = {
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "currency" */
export const enum Currency_Update_Column {
  /** column name */
  Value = 'value'
};

export type Currency_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Currency_Set_Input>;
  /** filter the rows which have to be updated */
  where: Currency_Bool_Exp;
};

/** ordering argument of a cursor */
export const enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
};

/** The eventParameters model is designed to define properties on an event involving all event passes. This table includes critical details like the eventId and activityWebhookId, which aids in monitoring and processing events or changes related to the event parameters. By centralizing this information, our system can effectively manage and control parameters tied to specific events, enhancing the overall functionality and flexibility of event handling. */
export type EventParameters = {
  __typename?: 'eventParameters';
  activityWebhookId?: Maybe<Scalars['String']>;
  eventId: Scalars['String'];
  /** An array relationship */
  eventPassNftContracts: Array<EventPassNftContract>;
  /** An aggregate relationship */
  eventPassNftContracts_aggregate: EventPassNftContract_Aggregate;
  id: Scalars['uuid'];
};


/** The eventParameters model is designed to define properties on an event involving all event passes. This table includes critical details like the eventId and activityWebhookId, which aids in monitoring and processing events or changes related to the event parameters. By centralizing this information, our system can effectively manage and control parameters tied to specific events, enhancing the overall functionality and flexibility of event handling. */
export type EventParametersEventPassNftContractsArgs = {
  distinct_on?: InputMaybe<Array<EventPassNftContract_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassNftContract_Order_By>>;
  where?: InputMaybe<EventPassNftContract_Bool_Exp>;
};


/** The eventParameters model is designed to define properties on an event involving all event passes. This table includes critical details like the eventId and activityWebhookId, which aids in monitoring and processing events or changes related to the event parameters. By centralizing this information, our system can effectively manage and control parameters tied to specific events, enhancing the overall functionality and flexibility of event handling. */
export type EventParametersEventPassNftContracts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<EventPassNftContract_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassNftContract_Order_By>>;
  where?: InputMaybe<EventPassNftContract_Bool_Exp>;
};

/** aggregated selection of "eventParameters" */
export type EventParameters_Aggregate = {
  __typename?: 'eventParameters_aggregate';
  aggregate?: Maybe<EventParameters_Aggregate_Fields>;
  nodes: Array<EventParameters>;
};

/** aggregate fields of "eventParameters" */
export type EventParameters_Aggregate_Fields = {
  __typename?: 'eventParameters_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<EventParameters_Max_Fields>;
  min?: Maybe<EventParameters_Min_Fields>;
};


/** aggregate fields of "eventParameters" */
export type EventParameters_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<EventParameters_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "eventParameters". All fields are combined with a logical 'AND'. */
export type EventParameters_Bool_Exp = {
  _and?: InputMaybe<Array<EventParameters_Bool_Exp>>;
  _not?: InputMaybe<EventParameters_Bool_Exp>;
  _or?: InputMaybe<Array<EventParameters_Bool_Exp>>;
  activityWebhookId?: InputMaybe<String_Comparison_Exp>;
  eventId?: InputMaybe<String_Comparison_Exp>;
  eventPassNftContracts?: InputMaybe<EventPassNftContract_Bool_Exp>;
  eventPassNftContracts_aggregate?: InputMaybe<EventPassNftContract_Aggregate_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "eventParameters" */
export const enum EventParameters_Constraint {
  /** unique or primary key constraint on columns "activityWebhookId" */
  EventParametersActivityWebhookIdKey = 'eventParameters_activityWebhookId_key',
  /** unique or primary key constraint on columns "eventId" */
  EventParametersEventIdKey = 'eventParameters_eventId_key',
  /** unique or primary key constraint on columns "id" */
  EventParametersPkey = 'eventParameters_pkey'
};

/** input type for inserting data into table "eventParameters" */
export type EventParameters_Insert_Input = {
  activityWebhookId?: InputMaybe<Scalars['String']>;
  eventId?: InputMaybe<Scalars['String']>;
  eventPassNftContracts?: InputMaybe<EventPassNftContract_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type EventParameters_Max_Fields = {
  __typename?: 'eventParameters_max_fields';
  activityWebhookId?: Maybe<Scalars['String']>;
  eventId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type EventParameters_Min_Fields = {
  __typename?: 'eventParameters_min_fields';
  activityWebhookId?: Maybe<Scalars['String']>;
  eventId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "eventParameters" */
export type EventParameters_Mutation_Response = {
  __typename?: 'eventParameters_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<EventParameters>;
};

/** on_conflict condition type for table "eventParameters" */
export type EventParameters_On_Conflict = {
  constraint: EventParameters_Constraint;
  update_columns?: Array<EventParameters_Update_Column>;
  where?: InputMaybe<EventParameters_Bool_Exp>;
};

/** Ordering options when selecting data from "eventParameters". */
export type EventParameters_Order_By = {
  activityWebhookId?: InputMaybe<Order_By>;
  eventId?: InputMaybe<Order_By>;
  eventPassNftContracts_aggregate?: InputMaybe<EventPassNftContract_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: eventParameters */
export type EventParameters_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "eventParameters" */
export const enum EventParameters_Select_Column {
  /** column name */
  ActivityWebhookId = 'activityWebhookId',
  /** column name */
  EventId = 'eventId',
  /** column name */
  Id = 'id'
};

/** input type for updating data in table "eventParameters" */
export type EventParameters_Set_Input = {
  activityWebhookId?: InputMaybe<Scalars['String']>;
  eventId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "eventParameters" */
export type EventParameters_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: EventParameters_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type EventParameters_Stream_Cursor_Value_Input = {
  activityWebhookId?: InputMaybe<Scalars['String']>;
  eventId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "eventParameters" */
export const enum EventParameters_Update_Column {
  /** column name */
  ActivityWebhookId = 'activityWebhookId',
  /** column name */
  EventId = 'eventId',
  /** column name */
  Id = 'id'
};

export type EventParameters_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<EventParameters_Set_Input>;
  /** filter the rows which have to be updated */
  where: EventParameters_Bool_Exp;
};

/** The eventPassNft model is designed to consolidate and store the metadata associated with each event pass NFT. It centralizes fixed metadata, enabling the system to retrieve NFT details without frequently querying external APIs. It integrates with the existing nftTransfer model, providing a holistic view of each event pass NFT's journey and characteristics within the platform. */
export type EventPassNft = {
  __typename?: 'eventPassNft';
  /** Denotes the specific blockchain or network of the event pass NFT */
  chainId: Scalars['String'];
  /** Identifies the smart contract associated with the event pass NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress: Scalars['String'];
  created_at: Scalars['timestamptz'];
  /** The address currently holding the event pass NFT, allowing tracking of ownership */
  currentOwnerAddress: Scalars['String'];
  /** Contains any error message related to metadata retrieval, ensuring transparency in the data extraction process. */
  error?: Maybe<Scalars['String']>;
  /** A reference to the event associated with the event pass NFT */
  eventId: Scalars['String'];
  eventPass?: Maybe<EventPass>;
  /** Directly relates to a specific Event Pass within the system */
  eventPassId: Scalars['String'];
  /** An object relationship */
  eventPassPricing?: Maybe<EventPassPricing>;
  id: Scalars['uuid'];
  /** Indicates whether the QR code pass for the event pass NFT has been revealed by the owner. This field is essential for tracking and managing the reveal status within the platform. */
  isRevealed: Scalars['Boolean'];
  /** An object relationship */
  lastNftTransfer?: Maybe<NftTransfer>;
  /** Reference `id` to the latest `nftTransfer` entry, detailing the most recent transaction for this event pass NFT. */
  lastNftTransferId?: Maybe<Scalars['uuid']>;
  /** The structured metadata parsed from the token URI. This contains a variety of details regarding the event pass NFT. */
  metadata: Scalars['jsonb'];
  /** An array relationship */
  nftTransfers: Array<NftTransfer>;
  /** An aggregate relationship */
  nftTransfers_aggregate: NftTransfer_Aggregate;
  /** Ties the event pass NFT to a specific organizer within the platform */
  organizerId: Scalars['String'];
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId: Scalars['bigint'];
  /** The designated URI for the event pass NFT's metadata blob, providing a stable reference for data extraction. */
  tokenUri?: Maybe<Scalars['String']>;
  updated_at: Scalars['timestamptz'];
};


/** The eventPassNft model is designed to consolidate and store the metadata associated with each event pass NFT. It centralizes fixed metadata, enabling the system to retrieve NFT details without frequently querying external APIs. It integrates with the existing nftTransfer model, providing a holistic view of each event pass NFT's journey and characteristics within the platform. */
export type EventPassNftEventPassArgs = {
  locales?: Array<Locale>;
  stage?: Stage;
};


/** The eventPassNft model is designed to consolidate and store the metadata associated with each event pass NFT. It centralizes fixed metadata, enabling the system to retrieve NFT details without frequently querying external APIs. It integrates with the existing nftTransfer model, providing a holistic view of each event pass NFT's journey and characteristics within the platform. */
export type EventPassNftMetadataArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** The eventPassNft model is designed to consolidate and store the metadata associated with each event pass NFT. It centralizes fixed metadata, enabling the system to retrieve NFT details without frequently querying external APIs. It integrates with the existing nftTransfer model, providing a holistic view of each event pass NFT's journey and characteristics within the platform. */
export type EventPassNftNftTransfersArgs = {
  distinct_on?: InputMaybe<Array<NftTransfer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<NftTransfer_Order_By>>;
  where?: InputMaybe<NftTransfer_Bool_Exp>;
};


/** The eventPassNft model is designed to consolidate and store the metadata associated with each event pass NFT. It centralizes fixed metadata, enabling the system to retrieve NFT details without frequently querying external APIs. It integrates with the existing nftTransfer model, providing a holistic view of each event pass NFT's journey and characteristics within the platform. */
export type EventPassNftNftTransfers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<NftTransfer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<NftTransfer_Order_By>>;
  where?: InputMaybe<NftTransfer_Bool_Exp>;
};

/** The eventPassNftContract model is designed to store metadata associated with NFT contracts linked to specific event passes. This table captures critical, immutable details from the ERC-721 standard, such as the chainId and contractAddress, ensuring accurate tracking and referencing of NFT contracts. Additionally, this table includes information specific to each event pass, like the eventPassId and organizerId, allowing for precise management and interaction with NFT contracts tied to individual event passes. By centralizing this information, our system can effectively manage, reference, and interact with NFT contracts related to particular event passes. */
export type EventPassNftContract = {
  __typename?: 'eventPassNftContract';
  chainId: Scalars['String'];
  contractAddress: Scalars['String'];
  eventId: Scalars['String'];
  eventPassId: Scalars['String'];
  /** An array relationship */
  eventPassNfts: Array<EventPassNft>;
  /** An aggregate relationship */
  eventPassNfts_aggregate: EventPassNft_Aggregate;
  /** An object relationship */
  eventPassOrderSums?: Maybe<EventPassOrderSums>;
  /** An array relationship */
  eventPassOrders: Array<EventPassOrder>;
  /** An aggregate relationship */
  eventPassOrders_aggregate: EventPassOrder_Aggregate;
  /** An object relationship */
  eventPassPricing?: Maybe<EventPassPricing>;
  id: Scalars['uuid'];
  organizerId: Scalars['String'];
};


/** The eventPassNftContract model is designed to store metadata associated with NFT contracts linked to specific event passes. This table captures critical, immutable details from the ERC-721 standard, such as the chainId and contractAddress, ensuring accurate tracking and referencing of NFT contracts. Additionally, this table includes information specific to each event pass, like the eventPassId and organizerId, allowing for precise management and interaction with NFT contracts tied to individual event passes. By centralizing this information, our system can effectively manage, reference, and interact with NFT contracts related to particular event passes. */
export type EventPassNftContractEventPassNftsArgs = {
  distinct_on?: InputMaybe<Array<EventPassNft_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassNft_Order_By>>;
  where?: InputMaybe<EventPassNft_Bool_Exp>;
};


/** The eventPassNftContract model is designed to store metadata associated with NFT contracts linked to specific event passes. This table captures critical, immutable details from the ERC-721 standard, such as the chainId and contractAddress, ensuring accurate tracking and referencing of NFT contracts. Additionally, this table includes information specific to each event pass, like the eventPassId and organizerId, allowing for precise management and interaction with NFT contracts tied to individual event passes. By centralizing this information, our system can effectively manage, reference, and interact with NFT contracts related to particular event passes. */
export type EventPassNftContractEventPassNfts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<EventPassNft_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassNft_Order_By>>;
  where?: InputMaybe<EventPassNft_Bool_Exp>;
};


/** The eventPassNftContract model is designed to store metadata associated with NFT contracts linked to specific event passes. This table captures critical, immutable details from the ERC-721 standard, such as the chainId and contractAddress, ensuring accurate tracking and referencing of NFT contracts. Additionally, this table includes information specific to each event pass, like the eventPassId and organizerId, allowing for precise management and interaction with NFT contracts tied to individual event passes. By centralizing this information, our system can effectively manage, reference, and interact with NFT contracts related to particular event passes. */
export type EventPassNftContractEventPassOrdersArgs = {
  distinct_on?: InputMaybe<Array<EventPassOrder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassOrder_Order_By>>;
  where?: InputMaybe<EventPassOrder_Bool_Exp>;
};


/** The eventPassNftContract model is designed to store metadata associated with NFT contracts linked to specific event passes. This table captures critical, immutable details from the ERC-721 standard, such as the chainId and contractAddress, ensuring accurate tracking and referencing of NFT contracts. Additionally, this table includes information specific to each event pass, like the eventPassId and organizerId, allowing for precise management and interaction with NFT contracts tied to individual event passes. By centralizing this information, our system can effectively manage, reference, and interact with NFT contracts related to particular event passes. */
export type EventPassNftContractEventPassOrders_AggregateArgs = {
  distinct_on?: InputMaybe<Array<EventPassOrder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassOrder_Order_By>>;
  where?: InputMaybe<EventPassOrder_Bool_Exp>;
};

/** aggregated selection of "eventPassNftContract" */
export type EventPassNftContract_Aggregate = {
  __typename?: 'eventPassNftContract_aggregate';
  aggregate?: Maybe<EventPassNftContract_Aggregate_Fields>;
  nodes: Array<EventPassNftContract>;
};

export type EventPassNftContract_Aggregate_Bool_Exp = {
  count?: InputMaybe<EventPassNftContract_Aggregate_Bool_Exp_Count>;
};

export type EventPassNftContract_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<EventPassNftContract_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<EventPassNftContract_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "eventPassNftContract" */
export type EventPassNftContract_Aggregate_Fields = {
  __typename?: 'eventPassNftContract_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<EventPassNftContract_Max_Fields>;
  min?: Maybe<EventPassNftContract_Min_Fields>;
};


/** aggregate fields of "eventPassNftContract" */
export type EventPassNftContract_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<EventPassNftContract_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "eventPassNftContract" */
export type EventPassNftContract_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<EventPassNftContract_Max_Order_By>;
  min?: InputMaybe<EventPassNftContract_Min_Order_By>;
};

/** input type for inserting array relation for remote table "eventPassNftContract" */
export type EventPassNftContract_Arr_Rel_Insert_Input = {
  data: Array<EventPassNftContract_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<EventPassNftContract_On_Conflict>;
};

/** Boolean expression to filter rows from the table "eventPassNftContract". All fields are combined with a logical 'AND'. */
export type EventPassNftContract_Bool_Exp = {
  _and?: InputMaybe<Array<EventPassNftContract_Bool_Exp>>;
  _not?: InputMaybe<EventPassNftContract_Bool_Exp>;
  _or?: InputMaybe<Array<EventPassNftContract_Bool_Exp>>;
  chainId?: InputMaybe<String_Comparison_Exp>;
  contractAddress?: InputMaybe<String_Comparison_Exp>;
  eventId?: InputMaybe<String_Comparison_Exp>;
  eventPassId?: InputMaybe<String_Comparison_Exp>;
  eventPassNfts?: InputMaybe<EventPassNft_Bool_Exp>;
  eventPassNfts_aggregate?: InputMaybe<EventPassNft_Aggregate_Bool_Exp>;
  eventPassOrderSums?: InputMaybe<EventPassOrderSums_Bool_Exp>;
  eventPassOrders?: InputMaybe<EventPassOrder_Bool_Exp>;
  eventPassOrders_aggregate?: InputMaybe<EventPassOrder_Aggregate_Bool_Exp>;
  eventPassPricing?: InputMaybe<EventPassPricing_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  organizerId?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "eventPassNftContract" */
export const enum EventPassNftContract_Constraint {
  /** unique or primary key constraint on columns "contractAddress", "chainId" */
  EventPassNftContractContractAddressChainIdKey = 'eventPassNftContract_contractAddress_chainId_key'
};

/** input type for inserting data into table "eventPassNftContract" */
export type EventPassNftContract_Insert_Input = {
  chainId?: InputMaybe<Scalars['String']>;
  contractAddress?: InputMaybe<Scalars['String']>;
  eventId?: InputMaybe<Scalars['String']>;
  eventPassId?: InputMaybe<Scalars['String']>;
  eventPassNfts?: InputMaybe<EventPassNft_Arr_Rel_Insert_Input>;
  eventPassOrderSums?: InputMaybe<EventPassOrderSums_Obj_Rel_Insert_Input>;
  eventPassOrders?: InputMaybe<EventPassOrder_Arr_Rel_Insert_Input>;
  eventPassPricing?: InputMaybe<EventPassPricing_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['uuid']>;
  organizerId?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type EventPassNftContract_Max_Fields = {
  __typename?: 'eventPassNftContract_max_fields';
  chainId?: Maybe<Scalars['String']>;
  contractAddress?: Maybe<Scalars['String']>;
  eventId?: Maybe<Scalars['String']>;
  eventPassId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  organizerId?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "eventPassNftContract" */
export type EventPassNftContract_Max_Order_By = {
  chainId?: InputMaybe<Order_By>;
  contractAddress?: InputMaybe<Order_By>;
  eventId?: InputMaybe<Order_By>;
  eventPassId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organizerId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type EventPassNftContract_Min_Fields = {
  __typename?: 'eventPassNftContract_min_fields';
  chainId?: Maybe<Scalars['String']>;
  contractAddress?: Maybe<Scalars['String']>;
  eventId?: Maybe<Scalars['String']>;
  eventPassId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  organizerId?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "eventPassNftContract" */
export type EventPassNftContract_Min_Order_By = {
  chainId?: InputMaybe<Order_By>;
  contractAddress?: InputMaybe<Order_By>;
  eventId?: InputMaybe<Order_By>;
  eventPassId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organizerId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "eventPassNftContract" */
export type EventPassNftContract_Mutation_Response = {
  __typename?: 'eventPassNftContract_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<EventPassNftContract>;
};

/** on_conflict condition type for table "eventPassNftContract" */
export type EventPassNftContract_On_Conflict = {
  constraint: EventPassNftContract_Constraint;
  update_columns?: Array<EventPassNftContract_Update_Column>;
  where?: InputMaybe<EventPassNftContract_Bool_Exp>;
};

/** Ordering options when selecting data from "eventPassNftContract". */
export type EventPassNftContract_Order_By = {
  chainId?: InputMaybe<Order_By>;
  contractAddress?: InputMaybe<Order_By>;
  eventId?: InputMaybe<Order_By>;
  eventPassId?: InputMaybe<Order_By>;
  eventPassNfts_aggregate?: InputMaybe<EventPassNft_Aggregate_Order_By>;
  eventPassOrderSums?: InputMaybe<EventPassOrderSums_Order_By>;
  eventPassOrders_aggregate?: InputMaybe<EventPassOrder_Aggregate_Order_By>;
  eventPassPricing?: InputMaybe<EventPassPricing_Order_By>;
  id?: InputMaybe<Order_By>;
  organizerId?: InputMaybe<Order_By>;
};

/** select columns of table "eventPassNftContract" */
export const enum EventPassNftContract_Select_Column {
  /** column name */
  ChainId = 'chainId',
  /** column name */
  ContractAddress = 'contractAddress',
  /** column name */
  EventId = 'eventId',
  /** column name */
  EventPassId = 'eventPassId',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizerId = 'organizerId'
};

/** input type for updating data in table "eventPassNftContract" */
export type EventPassNftContract_Set_Input = {
  chainId?: InputMaybe<Scalars['String']>;
  contractAddress?: InputMaybe<Scalars['String']>;
  eventId?: InputMaybe<Scalars['String']>;
  eventPassId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  organizerId?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "eventPassNftContract" */
export type EventPassNftContract_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: EventPassNftContract_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type EventPassNftContract_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['String']>;
  contractAddress?: InputMaybe<Scalars['String']>;
  eventId?: InputMaybe<Scalars['String']>;
  eventPassId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  organizerId?: InputMaybe<Scalars['String']>;
};

/** update columns of table "eventPassNftContract" */
export const enum EventPassNftContract_Update_Column {
  /** column name */
  ChainId = 'chainId',
  /** column name */
  ContractAddress = 'contractAddress',
  /** column name */
  EventId = 'eventId',
  /** column name */
  EventPassId = 'eventPassId',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizerId = 'organizerId'
};

export type EventPassNftContract_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<EventPassNftContract_Set_Input>;
  /** filter the rows which have to be updated */
  where: EventPassNftContract_Bool_Exp;
};

/** aggregated selection of "eventPassNft" */
export type EventPassNft_Aggregate = {
  __typename?: 'eventPassNft_aggregate';
  aggregate?: Maybe<EventPassNft_Aggregate_Fields>;
  nodes: Array<EventPassNft>;
};

export type EventPassNft_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<EventPassNft_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<EventPassNft_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<EventPassNft_Aggregate_Bool_Exp_Count>;
};

export type EventPassNft_Aggregate_Bool_Exp_Bool_And = {
  arguments: EventPassNft_Select_Column_EventPassNft_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<EventPassNft_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type EventPassNft_Aggregate_Bool_Exp_Bool_Or = {
  arguments: EventPassNft_Select_Column_EventPassNft_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<EventPassNft_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type EventPassNft_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<EventPassNft_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<EventPassNft_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "eventPassNft" */
export type EventPassNft_Aggregate_Fields = {
  __typename?: 'eventPassNft_aggregate_fields';
  avg?: Maybe<EventPassNft_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<EventPassNft_Max_Fields>;
  min?: Maybe<EventPassNft_Min_Fields>;
  stddev?: Maybe<EventPassNft_Stddev_Fields>;
  stddev_pop?: Maybe<EventPassNft_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<EventPassNft_Stddev_Samp_Fields>;
  sum?: Maybe<EventPassNft_Sum_Fields>;
  var_pop?: Maybe<EventPassNft_Var_Pop_Fields>;
  var_samp?: Maybe<EventPassNft_Var_Samp_Fields>;
  variance?: Maybe<EventPassNft_Variance_Fields>;
};


/** aggregate fields of "eventPassNft" */
export type EventPassNft_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<EventPassNft_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "eventPassNft" */
export type EventPassNft_Aggregate_Order_By = {
  avg?: InputMaybe<EventPassNft_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<EventPassNft_Max_Order_By>;
  min?: InputMaybe<EventPassNft_Min_Order_By>;
  stddev?: InputMaybe<EventPassNft_Stddev_Order_By>;
  stddev_pop?: InputMaybe<EventPassNft_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<EventPassNft_Stddev_Samp_Order_By>;
  sum?: InputMaybe<EventPassNft_Sum_Order_By>;
  var_pop?: InputMaybe<EventPassNft_Var_Pop_Order_By>;
  var_samp?: InputMaybe<EventPassNft_Var_Samp_Order_By>;
  variance?: InputMaybe<EventPassNft_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type EventPassNft_Append_Input = {
  /** The structured metadata parsed from the token URI. This contains a variety of details regarding the event pass NFT. */
  metadata?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "eventPassNft" */
export type EventPassNft_Arr_Rel_Insert_Input = {
  data: Array<EventPassNft_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<EventPassNft_On_Conflict>;
};

/** aggregate avg on columns */
export type EventPassNft_Avg_Fields = {
  __typename?: 'eventPassNft_avg_fields';
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "eventPassNft" */
export type EventPassNft_Avg_Order_By = {
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "eventPassNft". All fields are combined with a logical 'AND'. */
export type EventPassNft_Bool_Exp = {
  _and?: InputMaybe<Array<EventPassNft_Bool_Exp>>;
  _not?: InputMaybe<EventPassNft_Bool_Exp>;
  _or?: InputMaybe<Array<EventPassNft_Bool_Exp>>;
  chainId?: InputMaybe<String_Comparison_Exp>;
  contractAddress?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  currentOwnerAddress?: InputMaybe<String_Comparison_Exp>;
  error?: InputMaybe<String_Comparison_Exp>;
  eventId?: InputMaybe<String_Comparison_Exp>;
  eventPassId?: InputMaybe<String_Comparison_Exp>;
  eventPassPricing?: InputMaybe<EventPassPricing_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  isRevealed?: InputMaybe<Boolean_Comparison_Exp>;
  lastNftTransfer?: InputMaybe<NftTransfer_Bool_Exp>;
  lastNftTransferId?: InputMaybe<Uuid_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  nftTransfers?: InputMaybe<NftTransfer_Bool_Exp>;
  nftTransfers_aggregate?: InputMaybe<NftTransfer_Aggregate_Bool_Exp>;
  organizerId?: InputMaybe<String_Comparison_Exp>;
  tokenId?: InputMaybe<Bigint_Comparison_Exp>;
  tokenUri?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "eventPassNft" */
export const enum EventPassNft_Constraint {
  /** unique or primary key constraint on columns "tokenId", "contractAddress", "chainId" */
  EventPassNftContractAddressTokenIdChainIdKey = 'eventPassNft_contractAddress_tokenId_chainId_key',
  /** unique or primary key constraint on columns "id" */
  EventPassNftPkey = 'eventPassNft_pkey',
  /** unique or primary key constraint on columns "tokenId", "contractAddress", "chainId" */
  EventPassNftUniqueNft = 'event_pass_nft_unique_nft'
};

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type EventPassNft_Delete_At_Path_Input = {
  /** The structured metadata parsed from the token URI. This contains a variety of details regarding the event pass NFT. */
  metadata?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type EventPassNft_Delete_Elem_Input = {
  /** The structured metadata parsed from the token URI. This contains a variety of details regarding the event pass NFT. */
  metadata?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type EventPassNft_Delete_Key_Input = {
  /** The structured metadata parsed from the token URI. This contains a variety of details regarding the event pass NFT. */
  metadata?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "eventPassNft" */
export type EventPassNft_Inc_Input = {
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: InputMaybe<Scalars['bigint']>;
};

/** input type for inserting data into table "eventPassNft" */
export type EventPassNft_Insert_Input = {
  /** Denotes the specific blockchain or network of the event pass NFT */
  chainId?: InputMaybe<Scalars['String']>;
  /** Identifies the smart contract associated with the event pass NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** The address currently holding the event pass NFT, allowing tracking of ownership */
  currentOwnerAddress?: InputMaybe<Scalars['String']>;
  /** Contains any error message related to metadata retrieval, ensuring transparency in the data extraction process. */
  error?: InputMaybe<Scalars['String']>;
  /** A reference to the event associated with the event pass NFT */
  eventId?: InputMaybe<Scalars['String']>;
  /** Directly relates to a specific Event Pass within the system */
  eventPassId?: InputMaybe<Scalars['String']>;
  eventPassPricing?: InputMaybe<EventPassPricing_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['uuid']>;
  /** Indicates whether the QR code pass for the event pass NFT has been revealed by the owner. This field is essential for tracking and managing the reveal status within the platform. */
  isRevealed?: InputMaybe<Scalars['Boolean']>;
  lastNftTransfer?: InputMaybe<NftTransfer_Obj_Rel_Insert_Input>;
  /** Reference `id` to the latest `nftTransfer` entry, detailing the most recent transaction for this event pass NFT. */
  lastNftTransferId?: InputMaybe<Scalars['uuid']>;
  /** The structured metadata parsed from the token URI. This contains a variety of details regarding the event pass NFT. */
  metadata?: InputMaybe<Scalars['jsonb']>;
  nftTransfers?: InputMaybe<NftTransfer_Arr_Rel_Insert_Input>;
  /** Ties the event pass NFT to a specific organizer within the platform */
  organizerId?: InputMaybe<Scalars['String']>;
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: InputMaybe<Scalars['bigint']>;
  /** The designated URI for the event pass NFT's metadata blob, providing a stable reference for data extraction. */
  tokenUri?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type EventPassNft_Max_Fields = {
  __typename?: 'eventPassNft_max_fields';
  /** Denotes the specific blockchain or network of the event pass NFT */
  chainId?: Maybe<Scalars['String']>;
  /** Identifies the smart contract associated with the event pass NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  /** The address currently holding the event pass NFT, allowing tracking of ownership */
  currentOwnerAddress?: Maybe<Scalars['String']>;
  /** Contains any error message related to metadata retrieval, ensuring transparency in the data extraction process. */
  error?: Maybe<Scalars['String']>;
  /** A reference to the event associated with the event pass NFT */
  eventId?: Maybe<Scalars['String']>;
  /** Directly relates to a specific Event Pass within the system */
  eventPassId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  /** Reference `id` to the latest `nftTransfer` entry, detailing the most recent transaction for this event pass NFT. */
  lastNftTransferId?: Maybe<Scalars['uuid']>;
  /** Ties the event pass NFT to a specific organizer within the platform */
  organizerId?: Maybe<Scalars['String']>;
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: Maybe<Scalars['bigint']>;
  /** The designated URI for the event pass NFT's metadata blob, providing a stable reference for data extraction. */
  tokenUri?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "eventPassNft" */
export type EventPassNft_Max_Order_By = {
  /** Denotes the specific blockchain or network of the event pass NFT */
  chainId?: InputMaybe<Order_By>;
  /** Identifies the smart contract associated with the event pass NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** The address currently holding the event pass NFT, allowing tracking of ownership */
  currentOwnerAddress?: InputMaybe<Order_By>;
  /** Contains any error message related to metadata retrieval, ensuring transparency in the data extraction process. */
  error?: InputMaybe<Order_By>;
  /** A reference to the event associated with the event pass NFT */
  eventId?: InputMaybe<Order_By>;
  /** Directly relates to a specific Event Pass within the system */
  eventPassId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Reference `id` to the latest `nftTransfer` entry, detailing the most recent transaction for this event pass NFT. */
  lastNftTransferId?: InputMaybe<Order_By>;
  /** Ties the event pass NFT to a specific organizer within the platform */
  organizerId?: InputMaybe<Order_By>;
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: InputMaybe<Order_By>;
  /** The designated URI for the event pass NFT's metadata blob, providing a stable reference for data extraction. */
  tokenUri?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type EventPassNft_Min_Fields = {
  __typename?: 'eventPassNft_min_fields';
  /** Denotes the specific blockchain or network of the event pass NFT */
  chainId?: Maybe<Scalars['String']>;
  /** Identifies the smart contract associated with the event pass NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  /** The address currently holding the event pass NFT, allowing tracking of ownership */
  currentOwnerAddress?: Maybe<Scalars['String']>;
  /** Contains any error message related to metadata retrieval, ensuring transparency in the data extraction process. */
  error?: Maybe<Scalars['String']>;
  /** A reference to the event associated with the event pass NFT */
  eventId?: Maybe<Scalars['String']>;
  /** Directly relates to a specific Event Pass within the system */
  eventPassId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  /** Reference `id` to the latest `nftTransfer` entry, detailing the most recent transaction for this event pass NFT. */
  lastNftTransferId?: Maybe<Scalars['uuid']>;
  /** Ties the event pass NFT to a specific organizer within the platform */
  organizerId?: Maybe<Scalars['String']>;
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: Maybe<Scalars['bigint']>;
  /** The designated URI for the event pass NFT's metadata blob, providing a stable reference for data extraction. */
  tokenUri?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "eventPassNft" */
export type EventPassNft_Min_Order_By = {
  /** Denotes the specific blockchain or network of the event pass NFT */
  chainId?: InputMaybe<Order_By>;
  /** Identifies the smart contract associated with the event pass NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** The address currently holding the event pass NFT, allowing tracking of ownership */
  currentOwnerAddress?: InputMaybe<Order_By>;
  /** Contains any error message related to metadata retrieval, ensuring transparency in the data extraction process. */
  error?: InputMaybe<Order_By>;
  /** A reference to the event associated with the event pass NFT */
  eventId?: InputMaybe<Order_By>;
  /** Directly relates to a specific Event Pass within the system */
  eventPassId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Reference `id` to the latest `nftTransfer` entry, detailing the most recent transaction for this event pass NFT. */
  lastNftTransferId?: InputMaybe<Order_By>;
  /** Ties the event pass NFT to a specific organizer within the platform */
  organizerId?: InputMaybe<Order_By>;
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: InputMaybe<Order_By>;
  /** The designated URI for the event pass NFT's metadata blob, providing a stable reference for data extraction. */
  tokenUri?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "eventPassNft" */
export type EventPassNft_Mutation_Response = {
  __typename?: 'eventPassNft_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<EventPassNft>;
};

/** on_conflict condition type for table "eventPassNft" */
export type EventPassNft_On_Conflict = {
  constraint: EventPassNft_Constraint;
  update_columns?: Array<EventPassNft_Update_Column>;
  where?: InputMaybe<EventPassNft_Bool_Exp>;
};

/** Ordering options when selecting data from "eventPassNft". */
export type EventPassNft_Order_By = {
  chainId?: InputMaybe<Order_By>;
  contractAddress?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  currentOwnerAddress?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  eventId?: InputMaybe<Order_By>;
  eventPassId?: InputMaybe<Order_By>;
  eventPassPricing?: InputMaybe<EventPassPricing_Order_By>;
  id?: InputMaybe<Order_By>;
  isRevealed?: InputMaybe<Order_By>;
  lastNftTransfer?: InputMaybe<NftTransfer_Order_By>;
  lastNftTransferId?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  nftTransfers_aggregate?: InputMaybe<NftTransfer_Aggregate_Order_By>;
  organizerId?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
  tokenUri?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: eventPassNft */
export type EventPassNft_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type EventPassNft_Prepend_Input = {
  /** The structured metadata parsed from the token URI. This contains a variety of details regarding the event pass NFT. */
  metadata?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "eventPassNft" */
export const enum EventPassNft_Select_Column {
  /** column name */
  ChainId = 'chainId',
  /** column name */
  ContractAddress = 'contractAddress',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CurrentOwnerAddress = 'currentOwnerAddress',
  /** column name */
  Error = 'error',
  /** column name */
  EventId = 'eventId',
  /** column name */
  EventPassId = 'eventPassId',
  /** column name */
  Id = 'id',
  /** column name */
  IsRevealed = 'isRevealed',
  /** column name */
  LastNftTransferId = 'lastNftTransferId',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  OrganizerId = 'organizerId',
  /** column name */
  TokenId = 'tokenId',
  /** column name */
  TokenUri = 'tokenUri',
  /** column name */
  UpdatedAt = 'updated_at'
};

/** select "eventPassNft_aggregate_bool_exp_bool_and_arguments_columns" columns of table "eventPassNft" */
export const enum EventPassNft_Select_Column_EventPassNft_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsRevealed = 'isRevealed'
};

/** select "eventPassNft_aggregate_bool_exp_bool_or_arguments_columns" columns of table "eventPassNft" */
export const enum EventPassNft_Select_Column_EventPassNft_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsRevealed = 'isRevealed'
};

/** input type for updating data in table "eventPassNft" */
export type EventPassNft_Set_Input = {
  /** Denotes the specific blockchain or network of the event pass NFT */
  chainId?: InputMaybe<Scalars['String']>;
  /** Identifies the smart contract associated with the event pass NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** The address currently holding the event pass NFT, allowing tracking of ownership */
  currentOwnerAddress?: InputMaybe<Scalars['String']>;
  /** Contains any error message related to metadata retrieval, ensuring transparency in the data extraction process. */
  error?: InputMaybe<Scalars['String']>;
  /** A reference to the event associated with the event pass NFT */
  eventId?: InputMaybe<Scalars['String']>;
  /** Directly relates to a specific Event Pass within the system */
  eventPassId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  /** Indicates whether the QR code pass for the event pass NFT has been revealed by the owner. This field is essential for tracking and managing the reveal status within the platform. */
  isRevealed?: InputMaybe<Scalars['Boolean']>;
  /** Reference `id` to the latest `nftTransfer` entry, detailing the most recent transaction for this event pass NFT. */
  lastNftTransferId?: InputMaybe<Scalars['uuid']>;
  /** The structured metadata parsed from the token URI. This contains a variety of details regarding the event pass NFT. */
  metadata?: InputMaybe<Scalars['jsonb']>;
  /** Ties the event pass NFT to a specific organizer within the platform */
  organizerId?: InputMaybe<Scalars['String']>;
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: InputMaybe<Scalars['bigint']>;
  /** The designated URI for the event pass NFT's metadata blob, providing a stable reference for data extraction. */
  tokenUri?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type EventPassNft_Stddev_Fields = {
  __typename?: 'eventPassNft_stddev_fields';
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "eventPassNft" */
export type EventPassNft_Stddev_Order_By = {
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type EventPassNft_Stddev_Pop_Fields = {
  __typename?: 'eventPassNft_stddev_pop_fields';
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "eventPassNft" */
export type EventPassNft_Stddev_Pop_Order_By = {
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type EventPassNft_Stddev_Samp_Fields = {
  __typename?: 'eventPassNft_stddev_samp_fields';
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "eventPassNft" */
export type EventPassNft_Stddev_Samp_Order_By = {
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "eventPassNft" */
export type EventPassNft_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: EventPassNft_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type EventPassNft_Stream_Cursor_Value_Input = {
  /** Denotes the specific blockchain or network of the event pass NFT */
  chainId?: InputMaybe<Scalars['String']>;
  /** Identifies the smart contract associated with the event pass NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** The address currently holding the event pass NFT, allowing tracking of ownership */
  currentOwnerAddress?: InputMaybe<Scalars['String']>;
  /** Contains any error message related to metadata retrieval, ensuring transparency in the data extraction process. */
  error?: InputMaybe<Scalars['String']>;
  /** A reference to the event associated with the event pass NFT */
  eventId?: InputMaybe<Scalars['String']>;
  /** Directly relates to a specific Event Pass within the system */
  eventPassId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  /** Indicates whether the QR code pass for the event pass NFT has been revealed by the owner. This field is essential for tracking and managing the reveal status within the platform. */
  isRevealed?: InputMaybe<Scalars['Boolean']>;
  /** Reference `id` to the latest `nftTransfer` entry, detailing the most recent transaction for this event pass NFT. */
  lastNftTransferId?: InputMaybe<Scalars['uuid']>;
  /** The structured metadata parsed from the token URI. This contains a variety of details regarding the event pass NFT. */
  metadata?: InputMaybe<Scalars['jsonb']>;
  /** Ties the event pass NFT to a specific organizer within the platform */
  organizerId?: InputMaybe<Scalars['String']>;
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: InputMaybe<Scalars['bigint']>;
  /** The designated URI for the event pass NFT's metadata blob, providing a stable reference for data extraction. */
  tokenUri?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate sum on columns */
export type EventPassNft_Sum_Fields = {
  __typename?: 'eventPassNft_sum_fields';
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: Maybe<Scalars['bigint']>;
};

/** order by sum() on columns of table "eventPassNft" */
export type EventPassNft_Sum_Order_By = {
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: InputMaybe<Order_By>;
};

/** update columns of table "eventPassNft" */
export const enum EventPassNft_Update_Column {
  /** column name */
  ChainId = 'chainId',
  /** column name */
  ContractAddress = 'contractAddress',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CurrentOwnerAddress = 'currentOwnerAddress',
  /** column name */
  Error = 'error',
  /** column name */
  EventId = 'eventId',
  /** column name */
  EventPassId = 'eventPassId',
  /** column name */
  Id = 'id',
  /** column name */
  IsRevealed = 'isRevealed',
  /** column name */
  LastNftTransferId = 'lastNftTransferId',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  OrganizerId = 'organizerId',
  /** column name */
  TokenId = 'tokenId',
  /** column name */
  TokenUri = 'tokenUri',
  /** column name */
  UpdatedAt = 'updated_at'
};

export type EventPassNft_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<EventPassNft_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<EventPassNft_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<EventPassNft_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<EventPassNft_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<EventPassNft_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<EventPassNft_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<EventPassNft_Set_Input>;
  /** filter the rows which have to be updated */
  where: EventPassNft_Bool_Exp;
};

/** aggregate var_pop on columns */
export type EventPassNft_Var_Pop_Fields = {
  __typename?: 'eventPassNft_var_pop_fields';
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "eventPassNft" */
export type EventPassNft_Var_Pop_Order_By = {
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type EventPassNft_Var_Samp_Fields = {
  __typename?: 'eventPassNft_var_samp_fields';
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "eventPassNft" */
export type EventPassNft_Var_Samp_Order_By = {
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type EventPassNft_Variance_Fields = {
  __typename?: 'eventPassNft_variance_fields';
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "eventPassNft" */
export type EventPassNft_Variance_Order_By = {
  /** The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: InputMaybe<Order_By>;
};

/** Order with as quantity for Event Pass (linked to Hygraph model EventPass) and associated to an Account */
export type EventPassOrder = {
  __typename?: 'eventPassOrder';
  /** An object relationship */
  account?: Maybe<Account>;
  accountId: Scalars['uuid'];
  created_at: Scalars['timestamptz'];
  eventPass?: Maybe<EventPass>;
  eventPassId: Scalars['String'];
  /** An object relationship */
  eventPassPricing?: Maybe<EventPassPricing>;
  id: Scalars['uuid'];
  quantity: Scalars['Int'];
  status: OrderStatus_Enum;
  updated_at: Scalars['timestamptz'];
};


/** Order with as quantity for Event Pass (linked to Hygraph model EventPass) and associated to an Account */
export type EventPassOrderEventPassArgs = {
  locales?: Array<Locale>;
  stage?: Stage;
};

/** Hold the sums for the Event Pass Orders */
export type EventPassOrderSums = {
  __typename?: 'eventPassOrderSums';
  eventPassId: Scalars['String'];
  totalReserved: Scalars['Int'];
};

/** aggregated selection of "eventPassOrderSums" */
export type EventPassOrderSums_Aggregate = {
  __typename?: 'eventPassOrderSums_aggregate';
  aggregate?: Maybe<EventPassOrderSums_Aggregate_Fields>;
  nodes: Array<EventPassOrderSums>;
};

/** aggregate fields of "eventPassOrderSums" */
export type EventPassOrderSums_Aggregate_Fields = {
  __typename?: 'eventPassOrderSums_aggregate_fields';
  avg?: Maybe<EventPassOrderSums_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<EventPassOrderSums_Max_Fields>;
  min?: Maybe<EventPassOrderSums_Min_Fields>;
  stddev?: Maybe<EventPassOrderSums_Stddev_Fields>;
  stddev_pop?: Maybe<EventPassOrderSums_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<EventPassOrderSums_Stddev_Samp_Fields>;
  sum?: Maybe<EventPassOrderSums_Sum_Fields>;
  var_pop?: Maybe<EventPassOrderSums_Var_Pop_Fields>;
  var_samp?: Maybe<EventPassOrderSums_Var_Samp_Fields>;
  variance?: Maybe<EventPassOrderSums_Variance_Fields>;
};


/** aggregate fields of "eventPassOrderSums" */
export type EventPassOrderSums_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<EventPassOrderSums_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type EventPassOrderSums_Avg_Fields = {
  __typename?: 'eventPassOrderSums_avg_fields';
  totalReserved?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "eventPassOrderSums". All fields are combined with a logical 'AND'. */
export type EventPassOrderSums_Bool_Exp = {
  _and?: InputMaybe<Array<EventPassOrderSums_Bool_Exp>>;
  _not?: InputMaybe<EventPassOrderSums_Bool_Exp>;
  _or?: InputMaybe<Array<EventPassOrderSums_Bool_Exp>>;
  eventPassId?: InputMaybe<String_Comparison_Exp>;
  totalReserved?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "eventPassOrderSums" */
export const enum EventPassOrderSums_Constraint {
  /** unique or primary key constraint on columns "eventPassId" */
  EventPassOrderSumsPkey = 'eventPassOrderSums_pkey'
};

/** input type for incrementing numeric columns in table "eventPassOrderSums" */
export type EventPassOrderSums_Inc_Input = {
  totalReserved?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "eventPassOrderSums" */
export type EventPassOrderSums_Insert_Input = {
  eventPassId?: InputMaybe<Scalars['String']>;
  totalReserved?: InputMaybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type EventPassOrderSums_Max_Fields = {
  __typename?: 'eventPassOrderSums_max_fields';
  eventPassId?: Maybe<Scalars['String']>;
  totalReserved?: Maybe<Scalars['Int']>;
};

/** aggregate min on columns */
export type EventPassOrderSums_Min_Fields = {
  __typename?: 'eventPassOrderSums_min_fields';
  eventPassId?: Maybe<Scalars['String']>;
  totalReserved?: Maybe<Scalars['Int']>;
};

/** response of any mutation on the table "eventPassOrderSums" */
export type EventPassOrderSums_Mutation_Response = {
  __typename?: 'eventPassOrderSums_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<EventPassOrderSums>;
};

/** input type for inserting object relation for remote table "eventPassOrderSums" */
export type EventPassOrderSums_Obj_Rel_Insert_Input = {
  data: EventPassOrderSums_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<EventPassOrderSums_On_Conflict>;
};

/** on_conflict condition type for table "eventPassOrderSums" */
export type EventPassOrderSums_On_Conflict = {
  constraint: EventPassOrderSums_Constraint;
  update_columns?: Array<EventPassOrderSums_Update_Column>;
  where?: InputMaybe<EventPassOrderSums_Bool_Exp>;
};

/** Ordering options when selecting data from "eventPassOrderSums". */
export type EventPassOrderSums_Order_By = {
  eventPassId?: InputMaybe<Order_By>;
  totalReserved?: InputMaybe<Order_By>;
};

/** primary key columns input for table: eventPassOrderSums */
export type EventPassOrderSums_Pk_Columns_Input = {
  eventPassId: Scalars['String'];
};

/** select columns of table "eventPassOrderSums" */
export const enum EventPassOrderSums_Select_Column {
  /** column name */
  EventPassId = 'eventPassId',
  /** column name */
  TotalReserved = 'totalReserved'
};

/** input type for updating data in table "eventPassOrderSums" */
export type EventPassOrderSums_Set_Input = {
  eventPassId?: InputMaybe<Scalars['String']>;
  totalReserved?: InputMaybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type EventPassOrderSums_Stddev_Fields = {
  __typename?: 'eventPassOrderSums_stddev_fields';
  totalReserved?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type EventPassOrderSums_Stddev_Pop_Fields = {
  __typename?: 'eventPassOrderSums_stddev_pop_fields';
  totalReserved?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type EventPassOrderSums_Stddev_Samp_Fields = {
  __typename?: 'eventPassOrderSums_stddev_samp_fields';
  totalReserved?: Maybe<Scalars['Float']>;
};

/** Streaming cursor of the table "eventPassOrderSums" */
export type EventPassOrderSums_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: EventPassOrderSums_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type EventPassOrderSums_Stream_Cursor_Value_Input = {
  eventPassId?: InputMaybe<Scalars['String']>;
  totalReserved?: InputMaybe<Scalars['Int']>;
};

/** aggregate sum on columns */
export type EventPassOrderSums_Sum_Fields = {
  __typename?: 'eventPassOrderSums_sum_fields';
  totalReserved?: Maybe<Scalars['Int']>;
};

/** update columns of table "eventPassOrderSums" */
export const enum EventPassOrderSums_Update_Column {
  /** column name */
  EventPassId = 'eventPassId',
  /** column name */
  TotalReserved = 'totalReserved'
};

export type EventPassOrderSums_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<EventPassOrderSums_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<EventPassOrderSums_Set_Input>;
  /** filter the rows which have to be updated */
  where: EventPassOrderSums_Bool_Exp;
};

/** aggregate var_pop on columns */
export type EventPassOrderSums_Var_Pop_Fields = {
  __typename?: 'eventPassOrderSums_var_pop_fields';
  totalReserved?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type EventPassOrderSums_Var_Samp_Fields = {
  __typename?: 'eventPassOrderSums_var_samp_fields';
  totalReserved?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type EventPassOrderSums_Variance_Fields = {
  __typename?: 'eventPassOrderSums_variance_fields';
  totalReserved?: Maybe<Scalars['Float']>;
};

/** aggregated selection of "eventPassOrder" */
export type EventPassOrder_Aggregate = {
  __typename?: 'eventPassOrder_aggregate';
  aggregate?: Maybe<EventPassOrder_Aggregate_Fields>;
  nodes: Array<EventPassOrder>;
};

export type EventPassOrder_Aggregate_Bool_Exp = {
  count?: InputMaybe<EventPassOrder_Aggregate_Bool_Exp_Count>;
};

export type EventPassOrder_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<EventPassOrder_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<EventPassOrder_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "eventPassOrder" */
export type EventPassOrder_Aggregate_Fields = {
  __typename?: 'eventPassOrder_aggregate_fields';
  avg?: Maybe<EventPassOrder_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<EventPassOrder_Max_Fields>;
  min?: Maybe<EventPassOrder_Min_Fields>;
  stddev?: Maybe<EventPassOrder_Stddev_Fields>;
  stddev_pop?: Maybe<EventPassOrder_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<EventPassOrder_Stddev_Samp_Fields>;
  sum?: Maybe<EventPassOrder_Sum_Fields>;
  var_pop?: Maybe<EventPassOrder_Var_Pop_Fields>;
  var_samp?: Maybe<EventPassOrder_Var_Samp_Fields>;
  variance?: Maybe<EventPassOrder_Variance_Fields>;
};


/** aggregate fields of "eventPassOrder" */
export type EventPassOrder_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<EventPassOrder_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "eventPassOrder" */
export type EventPassOrder_Aggregate_Order_By = {
  avg?: InputMaybe<EventPassOrder_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<EventPassOrder_Max_Order_By>;
  min?: InputMaybe<EventPassOrder_Min_Order_By>;
  stddev?: InputMaybe<EventPassOrder_Stddev_Order_By>;
  stddev_pop?: InputMaybe<EventPassOrder_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<EventPassOrder_Stddev_Samp_Order_By>;
  sum?: InputMaybe<EventPassOrder_Sum_Order_By>;
  var_pop?: InputMaybe<EventPassOrder_Var_Pop_Order_By>;
  var_samp?: InputMaybe<EventPassOrder_Var_Samp_Order_By>;
  variance?: InputMaybe<EventPassOrder_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "eventPassOrder" */
export type EventPassOrder_Arr_Rel_Insert_Input = {
  data: Array<EventPassOrder_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<EventPassOrder_On_Conflict>;
};

/** aggregate avg on columns */
export type EventPassOrder_Avg_Fields = {
  __typename?: 'eventPassOrder_avg_fields';
  quantity?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "eventPassOrder" */
export type EventPassOrder_Avg_Order_By = {
  quantity?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "eventPassOrder". All fields are combined with a logical 'AND'. */
export type EventPassOrder_Bool_Exp = {
  _and?: InputMaybe<Array<EventPassOrder_Bool_Exp>>;
  _not?: InputMaybe<EventPassOrder_Bool_Exp>;
  _or?: InputMaybe<Array<EventPassOrder_Bool_Exp>>;
  account?: InputMaybe<Account_Bool_Exp>;
  accountId?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  eventPassId?: InputMaybe<String_Comparison_Exp>;
  eventPassPricing?: InputMaybe<EventPassPricing_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  quantity?: InputMaybe<Int_Comparison_Exp>;
  status?: InputMaybe<OrderStatus_Enum_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "eventPassOrder" */
export const enum EventPassOrder_Constraint {
  /** unique or primary key constraint on columns "id" */
  EventPassOrderPkey = 'eventPassOrder_pkey'
};

/** input type for incrementing numeric columns in table "eventPassOrder" */
export type EventPassOrder_Inc_Input = {
  quantity?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "eventPassOrder" */
export type EventPassOrder_Insert_Input = {
  account?: InputMaybe<Account_Obj_Rel_Insert_Input>;
  accountId?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  eventPassId?: InputMaybe<Scalars['String']>;
  eventPassPricing?: InputMaybe<EventPassPricing_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['uuid']>;
  quantity?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<OrderStatus_Enum>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type EventPassOrder_Max_Fields = {
  __typename?: 'eventPassOrder_max_fields';
  accountId?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  eventPassId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  quantity?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "eventPassOrder" */
export type EventPassOrder_Max_Order_By = {
  accountId?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  eventPassId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type EventPassOrder_Min_Fields = {
  __typename?: 'eventPassOrder_min_fields';
  accountId?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  eventPassId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  quantity?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "eventPassOrder" */
export type EventPassOrder_Min_Order_By = {
  accountId?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  eventPassId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "eventPassOrder" */
export type EventPassOrder_Mutation_Response = {
  __typename?: 'eventPassOrder_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<EventPassOrder>;
};

/** on_conflict condition type for table "eventPassOrder" */
export type EventPassOrder_On_Conflict = {
  constraint: EventPassOrder_Constraint;
  update_columns?: Array<EventPassOrder_Update_Column>;
  where?: InputMaybe<EventPassOrder_Bool_Exp>;
};

/** Ordering options when selecting data from "eventPassOrder". */
export type EventPassOrder_Order_By = {
  account?: InputMaybe<Account_Order_By>;
  accountId?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  eventPassId?: InputMaybe<Order_By>;
  eventPassPricing?: InputMaybe<EventPassPricing_Order_By>;
  id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: eventPassOrder */
export type EventPassOrder_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "eventPassOrder" */
export const enum EventPassOrder_Select_Column {
  /** column name */
  AccountId = 'accountId',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EventPassId = 'eventPassId',
  /** column name */
  Id = 'id',
  /** column name */
  Quantity = 'quantity',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
};

/** input type for updating data in table "eventPassOrder" */
export type EventPassOrder_Set_Input = {
  accountId?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  eventPassId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  quantity?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<OrderStatus_Enum>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type EventPassOrder_Stddev_Fields = {
  __typename?: 'eventPassOrder_stddev_fields';
  quantity?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "eventPassOrder" */
export type EventPassOrder_Stddev_Order_By = {
  quantity?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type EventPassOrder_Stddev_Pop_Fields = {
  __typename?: 'eventPassOrder_stddev_pop_fields';
  quantity?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "eventPassOrder" */
export type EventPassOrder_Stddev_Pop_Order_By = {
  quantity?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type EventPassOrder_Stddev_Samp_Fields = {
  __typename?: 'eventPassOrder_stddev_samp_fields';
  quantity?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "eventPassOrder" */
export type EventPassOrder_Stddev_Samp_Order_By = {
  quantity?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "eventPassOrder" */
export type EventPassOrder_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: EventPassOrder_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type EventPassOrder_Stream_Cursor_Value_Input = {
  accountId?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  eventPassId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  quantity?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<OrderStatus_Enum>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate sum on columns */
export type EventPassOrder_Sum_Fields = {
  __typename?: 'eventPassOrder_sum_fields';
  quantity?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "eventPassOrder" */
export type EventPassOrder_Sum_Order_By = {
  quantity?: InputMaybe<Order_By>;
};

/** update columns of table "eventPassOrder" */
export const enum EventPassOrder_Update_Column {
  /** column name */
  AccountId = 'accountId',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EventPassId = 'eventPassId',
  /** column name */
  Id = 'id',
  /** column name */
  Quantity = 'quantity',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
};

export type EventPassOrder_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<EventPassOrder_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<EventPassOrder_Set_Input>;
  /** filter the rows which have to be updated */
  where: EventPassOrder_Bool_Exp;
};

/** aggregate var_pop on columns */
export type EventPassOrder_Var_Pop_Fields = {
  __typename?: 'eventPassOrder_var_pop_fields';
  quantity?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "eventPassOrder" */
export type EventPassOrder_Var_Pop_Order_By = {
  quantity?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type EventPassOrder_Var_Samp_Fields = {
  __typename?: 'eventPassOrder_var_samp_fields';
  quantity?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "eventPassOrder" */
export type EventPassOrder_Var_Samp_Order_By = {
  quantity?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type EventPassOrder_Variance_Fields = {
  __typename?: 'eventPassOrder_variance_fields';
  quantity?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "eventPassOrder" */
export type EventPassOrder_Variance_Order_By = {
  quantity?: InputMaybe<Order_By>;
};

/**
 * Pending Order with as quantity for Event Pass (linked to Hygraph model EventPass) and associated to an Account.
 *   Those orders are time bound and are automatically destroyed given an amount of time to preserve access to the event for other users.
 */
export type EventPassPendingOrder = {
  __typename?: 'eventPassPendingOrder';
  /** An object relationship */
  account?: Maybe<Account>;
  accountId: Scalars['uuid'];
  created_at: Scalars['timestamptz'];
  eventPass?: Maybe<EventPass>;
  eventPassId: Scalars['String'];
  /** An object relationship */
  eventPassPricing?: Maybe<EventPassPricing>;
  id: Scalars['uuid'];
  quantity: Scalars['Int'];
};


/**
 * Pending Order with as quantity for Event Pass (linked to Hygraph model EventPass) and associated to an Account.
 *   Those orders are time bound and are automatically destroyed given an amount of time to preserve access to the event for other users.
 */
export type EventPassPendingOrderEventPassArgs = {
  locales?: Array<Locale>;
  stage?: Stage;
};

/** aggregated selection of "eventPassPendingOrder" */
export type EventPassPendingOrder_Aggregate = {
  __typename?: 'eventPassPendingOrder_aggregate';
  aggregate?: Maybe<EventPassPendingOrder_Aggregate_Fields>;
  nodes: Array<EventPassPendingOrder>;
};

/** aggregate fields of "eventPassPendingOrder" */
export type EventPassPendingOrder_Aggregate_Fields = {
  __typename?: 'eventPassPendingOrder_aggregate_fields';
  avg?: Maybe<EventPassPendingOrder_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<EventPassPendingOrder_Max_Fields>;
  min?: Maybe<EventPassPendingOrder_Min_Fields>;
  stddev?: Maybe<EventPassPendingOrder_Stddev_Fields>;
  stddev_pop?: Maybe<EventPassPendingOrder_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<EventPassPendingOrder_Stddev_Samp_Fields>;
  sum?: Maybe<EventPassPendingOrder_Sum_Fields>;
  var_pop?: Maybe<EventPassPendingOrder_Var_Pop_Fields>;
  var_samp?: Maybe<EventPassPendingOrder_Var_Samp_Fields>;
  variance?: Maybe<EventPassPendingOrder_Variance_Fields>;
};


/** aggregate fields of "eventPassPendingOrder" */
export type EventPassPendingOrder_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<EventPassPendingOrder_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type EventPassPendingOrder_Avg_Fields = {
  __typename?: 'eventPassPendingOrder_avg_fields';
  quantity?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "eventPassPendingOrder". All fields are combined with a logical 'AND'. */
export type EventPassPendingOrder_Bool_Exp = {
  _and?: InputMaybe<Array<EventPassPendingOrder_Bool_Exp>>;
  _not?: InputMaybe<EventPassPendingOrder_Bool_Exp>;
  _or?: InputMaybe<Array<EventPassPendingOrder_Bool_Exp>>;
  account?: InputMaybe<Account_Bool_Exp>;
  accountId?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  eventPassId?: InputMaybe<String_Comparison_Exp>;
  eventPassPricing?: InputMaybe<EventPassPricing_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  quantity?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "eventPassPendingOrder" */
export const enum EventPassPendingOrder_Constraint {
  /** unique or primary key constraint on columns "accountId", "eventPassId" */
  EventPassPendingOrderEventPassIdAccountIdKey = 'eventPassPendingOrder_eventPassId_accountId_key',
  /** unique or primary key constraint on columns "id" */
  EventPassPendingOrderPkey = 'eventPassPendingOrder_pkey'
};

/** input type for incrementing numeric columns in table "eventPassPendingOrder" */
export type EventPassPendingOrder_Inc_Input = {
  quantity?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "eventPassPendingOrder" */
export type EventPassPendingOrder_Insert_Input = {
  account?: InputMaybe<Account_Obj_Rel_Insert_Input>;
  accountId?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  eventPassId?: InputMaybe<Scalars['String']>;
  eventPassPricing?: InputMaybe<EventPassPricing_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['uuid']>;
  quantity?: InputMaybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type EventPassPendingOrder_Max_Fields = {
  __typename?: 'eventPassPendingOrder_max_fields';
  accountId?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  eventPassId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  quantity?: Maybe<Scalars['Int']>;
};

/** aggregate min on columns */
export type EventPassPendingOrder_Min_Fields = {
  __typename?: 'eventPassPendingOrder_min_fields';
  accountId?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  eventPassId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  quantity?: Maybe<Scalars['Int']>;
};

/** response of any mutation on the table "eventPassPendingOrder" */
export type EventPassPendingOrder_Mutation_Response = {
  __typename?: 'eventPassPendingOrder_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<EventPassPendingOrder>;
};

/** on_conflict condition type for table "eventPassPendingOrder" */
export type EventPassPendingOrder_On_Conflict = {
  constraint: EventPassPendingOrder_Constraint;
  update_columns?: Array<EventPassPendingOrder_Update_Column>;
  where?: InputMaybe<EventPassPendingOrder_Bool_Exp>;
};

/** Ordering options when selecting data from "eventPassPendingOrder". */
export type EventPassPendingOrder_Order_By = {
  account?: InputMaybe<Account_Order_By>;
  accountId?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  eventPassId?: InputMaybe<Order_By>;
  eventPassPricing?: InputMaybe<EventPassPricing_Order_By>;
  id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
};

/** primary key columns input for table: eventPassPendingOrder */
export type EventPassPendingOrder_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "eventPassPendingOrder" */
export const enum EventPassPendingOrder_Select_Column {
  /** column name */
  AccountId = 'accountId',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EventPassId = 'eventPassId',
  /** column name */
  Id = 'id',
  /** column name */
  Quantity = 'quantity'
};

/** input type for updating data in table "eventPassPendingOrder" */
export type EventPassPendingOrder_Set_Input = {
  accountId?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  eventPassId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  quantity?: InputMaybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type EventPassPendingOrder_Stddev_Fields = {
  __typename?: 'eventPassPendingOrder_stddev_fields';
  quantity?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type EventPassPendingOrder_Stddev_Pop_Fields = {
  __typename?: 'eventPassPendingOrder_stddev_pop_fields';
  quantity?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type EventPassPendingOrder_Stddev_Samp_Fields = {
  __typename?: 'eventPassPendingOrder_stddev_samp_fields';
  quantity?: Maybe<Scalars['Float']>;
};

/** Streaming cursor of the table "eventPassPendingOrder" */
export type EventPassPendingOrder_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: EventPassPendingOrder_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type EventPassPendingOrder_Stream_Cursor_Value_Input = {
  accountId?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  eventPassId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  quantity?: InputMaybe<Scalars['Int']>;
};

/** aggregate sum on columns */
export type EventPassPendingOrder_Sum_Fields = {
  __typename?: 'eventPassPendingOrder_sum_fields';
  quantity?: Maybe<Scalars['Int']>;
};

/** update columns of table "eventPassPendingOrder" */
export const enum EventPassPendingOrder_Update_Column {
  /** column name */
  AccountId = 'accountId',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EventPassId = 'eventPassId',
  /** column name */
  Id = 'id',
  /** column name */
  Quantity = 'quantity'
};

export type EventPassPendingOrder_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<EventPassPendingOrder_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<EventPassPendingOrder_Set_Input>;
  /** filter the rows which have to be updated */
  where: EventPassPendingOrder_Bool_Exp;
};

/** aggregate var_pop on columns */
export type EventPassPendingOrder_Var_Pop_Fields = {
  __typename?: 'eventPassPendingOrder_var_pop_fields';
  quantity?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type EventPassPendingOrder_Var_Samp_Fields = {
  __typename?: 'eventPassPendingOrder_var_samp_fields';
  quantity?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type EventPassPendingOrder_Variance_Fields = {
  __typename?: 'eventPassPendingOrder_variance_fields';
  quantity?: Maybe<Scalars['Float']>;
};

/** The EventPassPricing table stores pricing information related to each Event Pass. It includes the price amount, the currency in which the price is denoted, and the maximum quantity that can be ordered both overall and per user. Each row in the table represents a unique combination of these attributes for a specific Event Pass. This table is key in managing the sales and availability of Event Passes. */
export type EventPassPricing = {
  __typename?: 'eventPassPricing';
  created_at: Scalars['timestamptz'];
  eventPassId: Scalars['String'];
  id: Scalars['uuid'];
  maxAmount: Scalars['Int'];
  maxAmountPerUser?: Maybe<Scalars['Int']>;
  priceAmount: Scalars['Int'];
  priceCurrency: Currency_Enum;
  timeBeforeDelete: Scalars['Int'];
  updated_at: Scalars['timestamptz'];
};

/** aggregated selection of "eventPassPricing" */
export type EventPassPricing_Aggregate = {
  __typename?: 'eventPassPricing_aggregate';
  aggregate?: Maybe<EventPassPricing_Aggregate_Fields>;
  nodes: Array<EventPassPricing>;
};

/** aggregate fields of "eventPassPricing" */
export type EventPassPricing_Aggregate_Fields = {
  __typename?: 'eventPassPricing_aggregate_fields';
  avg?: Maybe<EventPassPricing_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<EventPassPricing_Max_Fields>;
  min?: Maybe<EventPassPricing_Min_Fields>;
  stddev?: Maybe<EventPassPricing_Stddev_Fields>;
  stddev_pop?: Maybe<EventPassPricing_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<EventPassPricing_Stddev_Samp_Fields>;
  sum?: Maybe<EventPassPricing_Sum_Fields>;
  var_pop?: Maybe<EventPassPricing_Var_Pop_Fields>;
  var_samp?: Maybe<EventPassPricing_Var_Samp_Fields>;
  variance?: Maybe<EventPassPricing_Variance_Fields>;
};


/** aggregate fields of "eventPassPricing" */
export type EventPassPricing_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<EventPassPricing_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type EventPassPricing_Avg_Fields = {
  __typename?: 'eventPassPricing_avg_fields';
  maxAmount?: Maybe<Scalars['Float']>;
  maxAmountPerUser?: Maybe<Scalars['Float']>;
  priceAmount?: Maybe<Scalars['Float']>;
  timeBeforeDelete?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "eventPassPricing". All fields are combined with a logical 'AND'. */
export type EventPassPricing_Bool_Exp = {
  _and?: InputMaybe<Array<EventPassPricing_Bool_Exp>>;
  _not?: InputMaybe<EventPassPricing_Bool_Exp>;
  _or?: InputMaybe<Array<EventPassPricing_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  eventPassId?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  maxAmount?: InputMaybe<Int_Comparison_Exp>;
  maxAmountPerUser?: InputMaybe<Int_Comparison_Exp>;
  priceAmount?: InputMaybe<Int_Comparison_Exp>;
  priceCurrency?: InputMaybe<Currency_Enum_Comparison_Exp>;
  timeBeforeDelete?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "eventPassPricing" */
export const enum EventPassPricing_Constraint {
  /** unique or primary key constraint on columns "eventPassId" */
  EventPassPricingEventPassIdKey = 'eventPassPricing_eventPassId_key',
  /** unique or primary key constraint on columns "id" */
  EventPassPricingPkey = 'eventPassPricing_pkey'
};

/** input type for incrementing numeric columns in table "eventPassPricing" */
export type EventPassPricing_Inc_Input = {
  maxAmount?: InputMaybe<Scalars['Int']>;
  maxAmountPerUser?: InputMaybe<Scalars['Int']>;
  priceAmount?: InputMaybe<Scalars['Int']>;
  timeBeforeDelete?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "eventPassPricing" */
export type EventPassPricing_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  eventPassId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  maxAmount?: InputMaybe<Scalars['Int']>;
  maxAmountPerUser?: InputMaybe<Scalars['Int']>;
  priceAmount?: InputMaybe<Scalars['Int']>;
  priceCurrency?: InputMaybe<Currency_Enum>;
  timeBeforeDelete?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type EventPassPricing_Max_Fields = {
  __typename?: 'eventPassPricing_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  eventPassId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  maxAmount?: Maybe<Scalars['Int']>;
  maxAmountPerUser?: Maybe<Scalars['Int']>;
  priceAmount?: Maybe<Scalars['Int']>;
  timeBeforeDelete?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type EventPassPricing_Min_Fields = {
  __typename?: 'eventPassPricing_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  eventPassId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  maxAmount?: Maybe<Scalars['Int']>;
  maxAmountPerUser?: Maybe<Scalars['Int']>;
  priceAmount?: Maybe<Scalars['Int']>;
  timeBeforeDelete?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "eventPassPricing" */
export type EventPassPricing_Mutation_Response = {
  __typename?: 'eventPassPricing_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<EventPassPricing>;
};

/** input type for inserting object relation for remote table "eventPassPricing" */
export type EventPassPricing_Obj_Rel_Insert_Input = {
  data: EventPassPricing_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<EventPassPricing_On_Conflict>;
};

/** on_conflict condition type for table "eventPassPricing" */
export type EventPassPricing_On_Conflict = {
  constraint: EventPassPricing_Constraint;
  update_columns?: Array<EventPassPricing_Update_Column>;
  where?: InputMaybe<EventPassPricing_Bool_Exp>;
};

/** Ordering options when selecting data from "eventPassPricing". */
export type EventPassPricing_Order_By = {
  created_at?: InputMaybe<Order_By>;
  eventPassId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  maxAmount?: InputMaybe<Order_By>;
  maxAmountPerUser?: InputMaybe<Order_By>;
  priceAmount?: InputMaybe<Order_By>;
  priceCurrency?: InputMaybe<Order_By>;
  timeBeforeDelete?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: eventPassPricing */
export type EventPassPricing_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "eventPassPricing" */
export const enum EventPassPricing_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EventPassId = 'eventPassId',
  /** column name */
  Id = 'id',
  /** column name */
  MaxAmount = 'maxAmount',
  /** column name */
  MaxAmountPerUser = 'maxAmountPerUser',
  /** column name */
  PriceAmount = 'priceAmount',
  /** column name */
  PriceCurrency = 'priceCurrency',
  /** column name */
  TimeBeforeDelete = 'timeBeforeDelete',
  /** column name */
  UpdatedAt = 'updated_at'
};

/** input type for updating data in table "eventPassPricing" */
export type EventPassPricing_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  eventPassId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  maxAmount?: InputMaybe<Scalars['Int']>;
  maxAmountPerUser?: InputMaybe<Scalars['Int']>;
  priceAmount?: InputMaybe<Scalars['Int']>;
  priceCurrency?: InputMaybe<Currency_Enum>;
  timeBeforeDelete?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type EventPassPricing_Stddev_Fields = {
  __typename?: 'eventPassPricing_stddev_fields';
  maxAmount?: Maybe<Scalars['Float']>;
  maxAmountPerUser?: Maybe<Scalars['Float']>;
  priceAmount?: Maybe<Scalars['Float']>;
  timeBeforeDelete?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type EventPassPricing_Stddev_Pop_Fields = {
  __typename?: 'eventPassPricing_stddev_pop_fields';
  maxAmount?: Maybe<Scalars['Float']>;
  maxAmountPerUser?: Maybe<Scalars['Float']>;
  priceAmount?: Maybe<Scalars['Float']>;
  timeBeforeDelete?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type EventPassPricing_Stddev_Samp_Fields = {
  __typename?: 'eventPassPricing_stddev_samp_fields';
  maxAmount?: Maybe<Scalars['Float']>;
  maxAmountPerUser?: Maybe<Scalars['Float']>;
  priceAmount?: Maybe<Scalars['Float']>;
  timeBeforeDelete?: Maybe<Scalars['Float']>;
};

/** Streaming cursor of the table "eventPassPricing" */
export type EventPassPricing_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: EventPassPricing_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type EventPassPricing_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  eventPassId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  maxAmount?: InputMaybe<Scalars['Int']>;
  maxAmountPerUser?: InputMaybe<Scalars['Int']>;
  priceAmount?: InputMaybe<Scalars['Int']>;
  priceCurrency?: InputMaybe<Currency_Enum>;
  timeBeforeDelete?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate sum on columns */
export type EventPassPricing_Sum_Fields = {
  __typename?: 'eventPassPricing_sum_fields';
  maxAmount?: Maybe<Scalars['Int']>;
  maxAmountPerUser?: Maybe<Scalars['Int']>;
  priceAmount?: Maybe<Scalars['Int']>;
  timeBeforeDelete?: Maybe<Scalars['Int']>;
};

/** update columns of table "eventPassPricing" */
export const enum EventPassPricing_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EventPassId = 'eventPassId',
  /** column name */
  Id = 'id',
  /** column name */
  MaxAmount = 'maxAmount',
  /** column name */
  MaxAmountPerUser = 'maxAmountPerUser',
  /** column name */
  PriceAmount = 'priceAmount',
  /** column name */
  PriceCurrency = 'priceCurrency',
  /** column name */
  TimeBeforeDelete = 'timeBeforeDelete',
  /** column name */
  UpdatedAt = 'updated_at'
};

export type EventPassPricing_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<EventPassPricing_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<EventPassPricing_Set_Input>;
  /** filter the rows which have to be updated */
  where: EventPassPricing_Bool_Exp;
};

/** aggregate var_pop on columns */
export type EventPassPricing_Var_Pop_Fields = {
  __typename?: 'eventPassPricing_var_pop_fields';
  maxAmount?: Maybe<Scalars['Float']>;
  maxAmountPerUser?: Maybe<Scalars['Float']>;
  priceAmount?: Maybe<Scalars['Float']>;
  timeBeforeDelete?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type EventPassPricing_Var_Samp_Fields = {
  __typename?: 'eventPassPricing_var_samp_fields';
  maxAmount?: Maybe<Scalars['Float']>;
  maxAmountPerUser?: Maybe<Scalars['Float']>;
  priceAmount?: Maybe<Scalars['Float']>;
  timeBeforeDelete?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type EventPassPricing_Variance_Fields = {
  __typename?: 'eventPassPricing_variance_fields';
  maxAmount?: Maybe<Scalars['Float']>;
  maxAmountPerUser?: Maybe<Scalars['Float']>;
  priceAmount?: Maybe<Scalars['Float']>;
  timeBeforeDelete?: Maybe<Scalars['Float']>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']>;
  _eq?: InputMaybe<Scalars['jsonb']>;
  _gt?: InputMaybe<Scalars['jsonb']>;
  _gte?: InputMaybe<Scalars['jsonb']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['jsonb']>;
  _lte?: InputMaybe<Scalars['jsonb']>;
  _neq?: InputMaybe<Scalars['jsonb']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']>>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** Create one asset */
  createAsset?: Maybe<Asset>;
  /** Create one event */
  createEvent?: Maybe<Event>;
  /** Create one eventPass */
  createEventPass?: Maybe<EventPass>;
  /** Create one organizer */
  createOrganizer?: Maybe<Organizer>;
  /** Create one scheduledRelease */
  createScheduledRelease?: Maybe<ScheduledRelease>;
  /** Delete one asset from _all_ existing stages. Returns deleted document. */
  deleteAsset?: Maybe<Asset>;
  /** Delete one event from _all_ existing stages. Returns deleted document. */
  deleteEvent?: Maybe<Event>;
  /** Delete one eventPass from _all_ existing stages. Returns deleted document. */
  deleteEventPass?: Maybe<EventPass>;
  /** Delete many Asset documents */
  deleteManyAssets: BatchPayload;
  /** Delete many Asset documents, return deleted documents */
  deleteManyAssetsConnection: AssetConnection;
  /** Delete many EventPass documents */
  deleteManyEventPasses: BatchPayload;
  /** Delete many EventPass documents, return deleted documents */
  deleteManyEventPassesConnection: EventPassConnection;
  /** Delete many Event documents */
  deleteManyEvents: BatchPayload;
  /** Delete many Event documents, return deleted documents */
  deleteManyEventsConnection: EventConnection;
  /** Delete many Organizer documents */
  deleteManyOrganizers: BatchPayload;
  /** Delete many Organizer documents, return deleted documents */
  deleteManyOrganizersConnection: OrganizerConnection;
  /** Delete one organizer from _all_ existing stages. Returns deleted document. */
  deleteOrganizer?: Maybe<Organizer>;
  /** Delete and return scheduled operation */
  deleteScheduledOperation?: Maybe<ScheduledOperation>;
  /** Delete one scheduledRelease from _all_ existing stages. Returns deleted document. */
  deleteScheduledRelease?: Maybe<ScheduledRelease>;
  /** delete data from the table: "account" */
  delete_account?: Maybe<Account_Mutation_Response>;
  /** delete single row from the table: "account" */
  delete_account_by_pk?: Maybe<Account>;
  /** delete data from the table: "currency" */
  delete_currency?: Maybe<Currency_Mutation_Response>;
  /** delete single row from the table: "currency" */
  delete_currency_by_pk?: Maybe<Currency>;
  /** delete data from the table: "eventParameters" */
  delete_eventParameters?: Maybe<EventParameters_Mutation_Response>;
  /** delete single row from the table: "eventParameters" */
  delete_eventParameters_by_pk?: Maybe<EventParameters>;
  /** delete data from the table: "eventPassNft" */
  delete_eventPassNft?: Maybe<EventPassNft_Mutation_Response>;
  /** delete data from the table: "eventPassNftContract" */
  delete_eventPassNftContract?: Maybe<EventPassNftContract_Mutation_Response>;
  /** delete single row from the table: "eventPassNft" */
  delete_eventPassNft_by_pk?: Maybe<EventPassNft>;
  /** delete data from the table: "eventPassOrder" */
  delete_eventPassOrder?: Maybe<EventPassOrder_Mutation_Response>;
  /** delete data from the table: "eventPassOrderSums" */
  delete_eventPassOrderSums?: Maybe<EventPassOrderSums_Mutation_Response>;
  /** delete single row from the table: "eventPassOrderSums" */
  delete_eventPassOrderSums_by_pk?: Maybe<EventPassOrderSums>;
  /** delete single row from the table: "eventPassOrder" */
  delete_eventPassOrder_by_pk?: Maybe<EventPassOrder>;
  /** delete data from the table: "eventPassPendingOrder" */
  delete_eventPassPendingOrder?: Maybe<EventPassPendingOrder_Mutation_Response>;
  /** delete single row from the table: "eventPassPendingOrder" */
  delete_eventPassPendingOrder_by_pk?: Maybe<EventPassPendingOrder>;
  /** delete data from the table: "eventPassPricing" */
  delete_eventPassPricing?: Maybe<EventPassPricing_Mutation_Response>;
  /** delete single row from the table: "eventPassPricing" */
  delete_eventPassPricing_by_pk?: Maybe<EventPassPricing>;
  /** delete data from the table: "nftTransfer" */
  delete_nftTransfer?: Maybe<NftTransfer_Mutation_Response>;
  /** delete single row from the table: "nftTransfer" */
  delete_nftTransfer_by_pk?: Maybe<NftTransfer>;
  /** delete data from the table: "nftWithMetadata" */
  delete_nftWithMetadata?: Maybe<NftWithMetadata_Mutation_Response>;
  /** delete single row from the table: "nftWithMetadata" */
  delete_nftWithMetadata_by_pk?: Maybe<NftWithMetadata>;
  /** delete data from the table: "orderStatus" */
  delete_orderStatus?: Maybe<OrderStatus_Mutation_Response>;
  /** delete single row from the table: "orderStatus" */
  delete_orderStatus_by_pk?: Maybe<OrderStatus>;
  /** insert data into the table: "account" */
  insert_account?: Maybe<Account_Mutation_Response>;
  /** insert a single row into the table: "account" */
  insert_account_one?: Maybe<Account>;
  /** insert data into the table: "currency" */
  insert_currency?: Maybe<Currency_Mutation_Response>;
  /** insert a single row into the table: "currency" */
  insert_currency_one?: Maybe<Currency>;
  /** insert data into the table: "eventParameters" */
  insert_eventParameters?: Maybe<EventParameters_Mutation_Response>;
  /** insert a single row into the table: "eventParameters" */
  insert_eventParameters_one?: Maybe<EventParameters>;
  /** insert data into the table: "eventPassNft" */
  insert_eventPassNft?: Maybe<EventPassNft_Mutation_Response>;
  /** insert data into the table: "eventPassNftContract" */
  insert_eventPassNftContract?: Maybe<EventPassNftContract_Mutation_Response>;
  /** insert a single row into the table: "eventPassNftContract" */
  insert_eventPassNftContract_one?: Maybe<EventPassNftContract>;
  /** insert a single row into the table: "eventPassNft" */
  insert_eventPassNft_one?: Maybe<EventPassNft>;
  /** insert data into the table: "eventPassOrder" */
  insert_eventPassOrder?: Maybe<EventPassOrder_Mutation_Response>;
  /** insert data into the table: "eventPassOrderSums" */
  insert_eventPassOrderSums?: Maybe<EventPassOrderSums_Mutation_Response>;
  /** insert a single row into the table: "eventPassOrderSums" */
  insert_eventPassOrderSums_one?: Maybe<EventPassOrderSums>;
  /** insert a single row into the table: "eventPassOrder" */
  insert_eventPassOrder_one?: Maybe<EventPassOrder>;
  /** insert data into the table: "eventPassPendingOrder" */
  insert_eventPassPendingOrder?: Maybe<EventPassPendingOrder_Mutation_Response>;
  /** insert a single row into the table: "eventPassPendingOrder" */
  insert_eventPassPendingOrder_one?: Maybe<EventPassPendingOrder>;
  /** insert data into the table: "eventPassPricing" */
  insert_eventPassPricing?: Maybe<EventPassPricing_Mutation_Response>;
  /** insert a single row into the table: "eventPassPricing" */
  insert_eventPassPricing_one?: Maybe<EventPassPricing>;
  /** insert data into the table: "nftTransfer" */
  insert_nftTransfer?: Maybe<NftTransfer_Mutation_Response>;
  /** insert a single row into the table: "nftTransfer" */
  insert_nftTransfer_one?: Maybe<NftTransfer>;
  /** insert data into the table: "nftWithMetadata" */
  insert_nftWithMetadata?: Maybe<NftWithMetadata_Mutation_Response>;
  /** insert a single row into the table: "nftWithMetadata" */
  insert_nftWithMetadata_one?: Maybe<NftWithMetadata>;
  /** insert data into the table: "orderStatus" */
  insert_orderStatus?: Maybe<OrderStatus_Mutation_Response>;
  /** insert a single row into the table: "orderStatus" */
  insert_orderStatus_one?: Maybe<OrderStatus>;
  /** Publish one asset */
  publishAsset?: Maybe<Asset>;
  /** Publish one event */
  publishEvent?: Maybe<Event>;
  /** Publish one eventPass */
  publishEventPass?: Maybe<EventPass>;
  /** Publish many Asset documents */
  publishManyAssets: BatchPayload;
  /** Publish many Asset documents */
  publishManyAssetsConnection: AssetConnection;
  /** Publish many EventPass documents */
  publishManyEventPasses: BatchPayload;
  /** Publish many EventPass documents */
  publishManyEventPassesConnection: EventPassConnection;
  /** Publish many Event documents */
  publishManyEvents: BatchPayload;
  /** Publish many Event documents */
  publishManyEventsConnection: EventConnection;
  /** Publish many Organizer documents */
  publishManyOrganizers: BatchPayload;
  /** Publish many Organizer documents */
  publishManyOrganizersConnection: OrganizerConnection;
  /** Publish one organizer */
  publishOrganizer?: Maybe<Organizer>;
  /** Schedule to publish one asset */
  schedulePublishAsset?: Maybe<Asset>;
  /** Schedule to publish one event */
  schedulePublishEvent?: Maybe<Event>;
  /** Schedule to publish one eventPass */
  schedulePublishEventPass?: Maybe<EventPass>;
  /** Schedule to publish one organizer */
  schedulePublishOrganizer?: Maybe<Organizer>;
  /** Unpublish one asset from selected stages. Unpublish either the complete document with its relations, localizations and base data or specific localizations only. */
  scheduleUnpublishAsset?: Maybe<Asset>;
  /** Unpublish one event from selected stages. Unpublish either the complete document with its relations, localizations and base data or specific localizations only. */
  scheduleUnpublishEvent?: Maybe<Event>;
  /** Unpublish one eventPass from selected stages. Unpublish either the complete document with its relations, localizations and base data or specific localizations only. */
  scheduleUnpublishEventPass?: Maybe<EventPass>;
  /** Unpublish one organizer from selected stages. Unpublish either the complete document with its relations, localizations and base data or specific localizations only. */
  scheduleUnpublishOrganizer?: Maybe<Organizer>;
  /** Unpublish one asset from selected stages. Unpublish either the complete document with its relations, localizations and base data or specific localizations only. */
  unpublishAsset?: Maybe<Asset>;
  /** Unpublish one event from selected stages. Unpublish either the complete document with its relations, localizations and base data or specific localizations only. */
  unpublishEvent?: Maybe<Event>;
  /** Unpublish one eventPass from selected stages. Unpublish either the complete document with its relations, localizations and base data or specific localizations only. */
  unpublishEventPass?: Maybe<EventPass>;
  /** Unpublish many Asset documents */
  unpublishManyAssets: BatchPayload;
  /** Find many Asset documents that match criteria in specified stage and unpublish from target stages */
  unpublishManyAssetsConnection: AssetConnection;
  /** Unpublish many EventPass documents */
  unpublishManyEventPasses: BatchPayload;
  /** Find many EventPass documents that match criteria in specified stage and unpublish from target stages */
  unpublishManyEventPassesConnection: EventPassConnection;
  /** Unpublish many Event documents */
  unpublishManyEvents: BatchPayload;
  /** Find many Event documents that match criteria in specified stage and unpublish from target stages */
  unpublishManyEventsConnection: EventConnection;
  /** Unpublish many Organizer documents */
  unpublishManyOrganizers: BatchPayload;
  /** Find many Organizer documents that match criteria in specified stage and unpublish from target stages */
  unpublishManyOrganizersConnection: OrganizerConnection;
  /** Unpublish one organizer from selected stages. Unpublish either the complete document with its relations, localizations and base data or specific localizations only. */
  unpublishOrganizer?: Maybe<Organizer>;
  /** Update one asset */
  updateAsset?: Maybe<Asset>;
  /** Update one event */
  updateEvent?: Maybe<Event>;
  /** Update one eventPass */
  updateEventPass?: Maybe<EventPass>;
  /** Update many assets */
  updateManyAssets: BatchPayload;
  /** Update many Asset documents */
  updateManyAssetsConnection: AssetConnection;
  /** Update many eventPasses */
  updateManyEventPasses: BatchPayload;
  /** Update many EventPass documents */
  updateManyEventPassesConnection: EventPassConnection;
  /** Update many events */
  updateManyEvents: BatchPayload;
  /** Update many Event documents */
  updateManyEventsConnection: EventConnection;
  /** Update many organizers */
  updateManyOrganizers: BatchPayload;
  /** Update many Organizer documents */
  updateManyOrganizersConnection: OrganizerConnection;
  /** Update one organizer */
  updateOrganizer?: Maybe<Organizer>;
  /** Update one scheduledRelease */
  updateScheduledRelease?: Maybe<ScheduledRelease>;
  /** update data of the table: "account" */
  update_account?: Maybe<Account_Mutation_Response>;
  /** update single row of the table: "account" */
  update_account_by_pk?: Maybe<Account>;
  /** update multiples rows of table: "account" */
  update_account_many?: Maybe<Array<Maybe<Account_Mutation_Response>>>;
  /** update data of the table: "currency" */
  update_currency?: Maybe<Currency_Mutation_Response>;
  /** update single row of the table: "currency" */
  update_currency_by_pk?: Maybe<Currency>;
  /** update multiples rows of table: "currency" */
  update_currency_many?: Maybe<Array<Maybe<Currency_Mutation_Response>>>;
  /** update data of the table: "eventParameters" */
  update_eventParameters?: Maybe<EventParameters_Mutation_Response>;
  /** update single row of the table: "eventParameters" */
  update_eventParameters_by_pk?: Maybe<EventParameters>;
  /** update multiples rows of table: "eventParameters" */
  update_eventParameters_many?: Maybe<Array<Maybe<EventParameters_Mutation_Response>>>;
  /** update data of the table: "eventPassNft" */
  update_eventPassNft?: Maybe<EventPassNft_Mutation_Response>;
  /** update data of the table: "eventPassNftContract" */
  update_eventPassNftContract?: Maybe<EventPassNftContract_Mutation_Response>;
  /** update multiples rows of table: "eventPassNftContract" */
  update_eventPassNftContract_many?: Maybe<Array<Maybe<EventPassNftContract_Mutation_Response>>>;
  /** update single row of the table: "eventPassNft" */
  update_eventPassNft_by_pk?: Maybe<EventPassNft>;
  /** update multiples rows of table: "eventPassNft" */
  update_eventPassNft_many?: Maybe<Array<Maybe<EventPassNft_Mutation_Response>>>;
  /** update data of the table: "eventPassOrder" */
  update_eventPassOrder?: Maybe<EventPassOrder_Mutation_Response>;
  /** update data of the table: "eventPassOrderSums" */
  update_eventPassOrderSums?: Maybe<EventPassOrderSums_Mutation_Response>;
  /** update single row of the table: "eventPassOrderSums" */
  update_eventPassOrderSums_by_pk?: Maybe<EventPassOrderSums>;
  /** update multiples rows of table: "eventPassOrderSums" */
  update_eventPassOrderSums_many?: Maybe<Array<Maybe<EventPassOrderSums_Mutation_Response>>>;
  /** update single row of the table: "eventPassOrder" */
  update_eventPassOrder_by_pk?: Maybe<EventPassOrder>;
  /** update multiples rows of table: "eventPassOrder" */
  update_eventPassOrder_many?: Maybe<Array<Maybe<EventPassOrder_Mutation_Response>>>;
  /** update data of the table: "eventPassPendingOrder" */
  update_eventPassPendingOrder?: Maybe<EventPassPendingOrder_Mutation_Response>;
  /** update single row of the table: "eventPassPendingOrder" */
  update_eventPassPendingOrder_by_pk?: Maybe<EventPassPendingOrder>;
  /** update multiples rows of table: "eventPassPendingOrder" */
  update_eventPassPendingOrder_many?: Maybe<Array<Maybe<EventPassPendingOrder_Mutation_Response>>>;
  /** update data of the table: "eventPassPricing" */
  update_eventPassPricing?: Maybe<EventPassPricing_Mutation_Response>;
  /** update single row of the table: "eventPassPricing" */
  update_eventPassPricing_by_pk?: Maybe<EventPassPricing>;
  /** update multiples rows of table: "eventPassPricing" */
  update_eventPassPricing_many?: Maybe<Array<Maybe<EventPassPricing_Mutation_Response>>>;
  /** update data of the table: "nftTransfer" */
  update_nftTransfer?: Maybe<NftTransfer_Mutation_Response>;
  /** update single row of the table: "nftTransfer" */
  update_nftTransfer_by_pk?: Maybe<NftTransfer>;
  /** update multiples rows of table: "nftTransfer" */
  update_nftTransfer_many?: Maybe<Array<Maybe<NftTransfer_Mutation_Response>>>;
  /** update data of the table: "nftWithMetadata" */
  update_nftWithMetadata?: Maybe<NftWithMetadata_Mutation_Response>;
  /** update single row of the table: "nftWithMetadata" */
  update_nftWithMetadata_by_pk?: Maybe<NftWithMetadata>;
  /** update multiples rows of table: "nftWithMetadata" */
  update_nftWithMetadata_many?: Maybe<Array<Maybe<NftWithMetadata_Mutation_Response>>>;
  /** update data of the table: "orderStatus" */
  update_orderStatus?: Maybe<OrderStatus_Mutation_Response>;
  /** update single row of the table: "orderStatus" */
  update_orderStatus_by_pk?: Maybe<OrderStatus>;
  /** update multiples rows of table: "orderStatus" */
  update_orderStatus_many?: Maybe<Array<Maybe<OrderStatus_Mutation_Response>>>;
  /** Upsert one asset */
  upsertAsset?: Maybe<Asset>;
  /** Upsert one event */
  upsertEvent?: Maybe<Event>;
  /** Upsert one eventPass */
  upsertEventPass?: Maybe<EventPass>;
  /** Upsert one organizer */
  upsertOrganizer?: Maybe<Organizer>;
};


/** mutation root */
export type Mutation_RootCreateAssetArgs = {
  data: AssetCreateInput;
};


/** mutation root */
export type Mutation_RootCreateEventArgs = {
  data: EventCreateInput;
};


/** mutation root */
export type Mutation_RootCreateEventPassArgs = {
  data: EventPassCreateInput;
};


/** mutation root */
export type Mutation_RootCreateOrganizerArgs = {
  data: OrganizerCreateInput;
};


/** mutation root */
export type Mutation_RootCreateScheduledReleaseArgs = {
  data: ScheduledReleaseCreateInput;
};


/** mutation root */
export type Mutation_RootDeleteAssetArgs = {
  where: AssetWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootDeleteEventArgs = {
  where: EventWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootDeleteEventPassArgs = {
  where: EventPassWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootDeleteManyAssetsArgs = {
  where?: InputMaybe<AssetManyWhereInput>;
};


/** mutation root */
export type Mutation_RootDeleteManyAssetsConnectionArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<AssetManyWhereInput>;
};


/** mutation root */
export type Mutation_RootDeleteManyEventPassesArgs = {
  where?: InputMaybe<EventPassManyWhereInput>;
};


/** mutation root */
export type Mutation_RootDeleteManyEventPassesConnectionArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EventPassManyWhereInput>;
};


/** mutation root */
export type Mutation_RootDeleteManyEventsArgs = {
  where?: InputMaybe<EventManyWhereInput>;
};


/** mutation root */
export type Mutation_RootDeleteManyEventsConnectionArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EventManyWhereInput>;
};


/** mutation root */
export type Mutation_RootDeleteManyOrganizersArgs = {
  where?: InputMaybe<OrganizerManyWhereInput>;
};


/** mutation root */
export type Mutation_RootDeleteManyOrganizersConnectionArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OrganizerManyWhereInput>;
};


/** mutation root */
export type Mutation_RootDeleteOrganizerArgs = {
  where: OrganizerWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootDeleteScheduledOperationArgs = {
  where: ScheduledOperationWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootDeleteScheduledReleaseArgs = {
  where: ScheduledReleaseWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootDelete_AccountArgs = {
  where: Account_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Account_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_CurrencyArgs = {
  where: Currency_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Currency_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_EventParametersArgs = {
  where: EventParameters_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_EventParameters_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_EventPassNftArgs = {
  where: EventPassNft_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_EventPassNftContractArgs = {
  where: EventPassNftContract_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_EventPassNft_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_EventPassOrderArgs = {
  where: EventPassOrder_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_EventPassOrderSumsArgs = {
  where: EventPassOrderSums_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_EventPassOrderSums_By_PkArgs = {
  eventPassId: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_EventPassOrder_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_EventPassPendingOrderArgs = {
  where: EventPassPendingOrder_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_EventPassPendingOrder_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_EventPassPricingArgs = {
  where: EventPassPricing_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_EventPassPricing_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_NftTransferArgs = {
  where: NftTransfer_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_NftTransfer_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_NftWithMetadataArgs = {
  where: NftWithMetadata_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_NftWithMetadata_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_OrderStatusArgs = {
  where: OrderStatus_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_OrderStatus_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootInsert_AccountArgs = {
  objects: Array<Account_Insert_Input>;
  on_conflict?: InputMaybe<Account_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Account_OneArgs = {
  object: Account_Insert_Input;
  on_conflict?: InputMaybe<Account_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_CurrencyArgs = {
  objects: Array<Currency_Insert_Input>;
  on_conflict?: InputMaybe<Currency_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Currency_OneArgs = {
  object: Currency_Insert_Input;
  on_conflict?: InputMaybe<Currency_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_EventParametersArgs = {
  objects: Array<EventParameters_Insert_Input>;
  on_conflict?: InputMaybe<EventParameters_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_EventParameters_OneArgs = {
  object: EventParameters_Insert_Input;
  on_conflict?: InputMaybe<EventParameters_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_EventPassNftArgs = {
  objects: Array<EventPassNft_Insert_Input>;
  on_conflict?: InputMaybe<EventPassNft_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_EventPassNftContractArgs = {
  objects: Array<EventPassNftContract_Insert_Input>;
  on_conflict?: InputMaybe<EventPassNftContract_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_EventPassNftContract_OneArgs = {
  object: EventPassNftContract_Insert_Input;
  on_conflict?: InputMaybe<EventPassNftContract_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_EventPassNft_OneArgs = {
  object: EventPassNft_Insert_Input;
  on_conflict?: InputMaybe<EventPassNft_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_EventPassOrderArgs = {
  objects: Array<EventPassOrder_Insert_Input>;
  on_conflict?: InputMaybe<EventPassOrder_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_EventPassOrderSumsArgs = {
  objects: Array<EventPassOrderSums_Insert_Input>;
  on_conflict?: InputMaybe<EventPassOrderSums_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_EventPassOrderSums_OneArgs = {
  object: EventPassOrderSums_Insert_Input;
  on_conflict?: InputMaybe<EventPassOrderSums_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_EventPassOrder_OneArgs = {
  object: EventPassOrder_Insert_Input;
  on_conflict?: InputMaybe<EventPassOrder_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_EventPassPendingOrderArgs = {
  objects: Array<EventPassPendingOrder_Insert_Input>;
  on_conflict?: InputMaybe<EventPassPendingOrder_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_EventPassPendingOrder_OneArgs = {
  object: EventPassPendingOrder_Insert_Input;
  on_conflict?: InputMaybe<EventPassPendingOrder_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_EventPassPricingArgs = {
  objects: Array<EventPassPricing_Insert_Input>;
  on_conflict?: InputMaybe<EventPassPricing_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_EventPassPricing_OneArgs = {
  object: EventPassPricing_Insert_Input;
  on_conflict?: InputMaybe<EventPassPricing_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_NftTransferArgs = {
  objects: Array<NftTransfer_Insert_Input>;
  on_conflict?: InputMaybe<NftTransfer_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_NftTransfer_OneArgs = {
  object: NftTransfer_Insert_Input;
  on_conflict?: InputMaybe<NftTransfer_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_NftWithMetadataArgs = {
  objects: Array<NftWithMetadata_Insert_Input>;
  on_conflict?: InputMaybe<NftWithMetadata_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_NftWithMetadata_OneArgs = {
  object: NftWithMetadata_Insert_Input;
  on_conflict?: InputMaybe<NftWithMetadata_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_OrderStatusArgs = {
  objects: Array<OrderStatus_Insert_Input>;
  on_conflict?: InputMaybe<OrderStatus_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_OrderStatus_OneArgs = {
  object: OrderStatus_Insert_Input;
  on_conflict?: InputMaybe<OrderStatus_On_Conflict>;
};


/** mutation root */
export type Mutation_RootPublishAssetArgs = {
  locales?: InputMaybe<Array<Locale>>;
  publishBase?: InputMaybe<Scalars['Boolean']>;
  to?: Array<Stage>;
  where: AssetWhereUniqueInput;
  withDefaultLocale?: InputMaybe<Scalars['Boolean']>;
};


/** mutation root */
export type Mutation_RootPublishEventArgs = {
  locales?: InputMaybe<Array<Locale>>;
  publishBase?: InputMaybe<Scalars['Boolean']>;
  to?: Array<Stage>;
  where: EventWhereUniqueInput;
  withDefaultLocale?: InputMaybe<Scalars['Boolean']>;
};


/** mutation root */
export type Mutation_RootPublishEventPassArgs = {
  locales?: InputMaybe<Array<Locale>>;
  publishBase?: InputMaybe<Scalars['Boolean']>;
  to?: Array<Stage>;
  where: EventPassWhereUniqueInput;
  withDefaultLocale?: InputMaybe<Scalars['Boolean']>;
};


/** mutation root */
export type Mutation_RootPublishManyAssetsArgs = {
  locales?: InputMaybe<Array<Locale>>;
  publishBase?: InputMaybe<Scalars['Boolean']>;
  to?: Array<Stage>;
  where?: InputMaybe<AssetManyWhereInput>;
  withDefaultLocale?: InputMaybe<Scalars['Boolean']>;
};


/** mutation root */
export type Mutation_RootPublishManyAssetsConnectionArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  from?: InputMaybe<Stage>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: InputMaybe<Array<Locale>>;
  publishBase?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  to?: Array<Stage>;
  where?: InputMaybe<AssetManyWhereInput>;
  withDefaultLocale?: InputMaybe<Scalars['Boolean']>;
};


/** mutation root */
export type Mutation_RootPublishManyEventPassesArgs = {
  locales?: InputMaybe<Array<Locale>>;
  publishBase?: InputMaybe<Scalars['Boolean']>;
  to?: Array<Stage>;
  where?: InputMaybe<EventPassManyWhereInput>;
  withDefaultLocale?: InputMaybe<Scalars['Boolean']>;
};


/** mutation root */
export type Mutation_RootPublishManyEventPassesConnectionArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  from?: InputMaybe<Stage>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: InputMaybe<Array<Locale>>;
  publishBase?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  to?: Array<Stage>;
  where?: InputMaybe<EventPassManyWhereInput>;
  withDefaultLocale?: InputMaybe<Scalars['Boolean']>;
};


/** mutation root */
export type Mutation_RootPublishManyEventsArgs = {
  locales?: InputMaybe<Array<Locale>>;
  publishBase?: InputMaybe<Scalars['Boolean']>;
  to?: Array<Stage>;
  where?: InputMaybe<EventManyWhereInput>;
  withDefaultLocale?: InputMaybe<Scalars['Boolean']>;
};


/** mutation root */
export type Mutation_RootPublishManyEventsConnectionArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  from?: InputMaybe<Stage>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: InputMaybe<Array<Locale>>;
  publishBase?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  to?: Array<Stage>;
  where?: InputMaybe<EventManyWhereInput>;
  withDefaultLocale?: InputMaybe<Scalars['Boolean']>;
};


/** mutation root */
export type Mutation_RootPublishManyOrganizersArgs = {
  locales?: InputMaybe<Array<Locale>>;
  publishBase?: InputMaybe<Scalars['Boolean']>;
  to?: Array<Stage>;
  where?: InputMaybe<OrganizerManyWhereInput>;
  withDefaultLocale?: InputMaybe<Scalars['Boolean']>;
};


/** mutation root */
export type Mutation_RootPublishManyOrganizersConnectionArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  from?: InputMaybe<Stage>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: InputMaybe<Array<Locale>>;
  publishBase?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  to?: Array<Stage>;
  where?: InputMaybe<OrganizerManyWhereInput>;
  withDefaultLocale?: InputMaybe<Scalars['Boolean']>;
};


/** mutation root */
export type Mutation_RootPublishOrganizerArgs = {
  locales?: InputMaybe<Array<Locale>>;
  publishBase?: InputMaybe<Scalars['Boolean']>;
  to?: Array<Stage>;
  where: OrganizerWhereUniqueInput;
  withDefaultLocale?: InputMaybe<Scalars['Boolean']>;
};


/** mutation root */
export type Mutation_RootSchedulePublishAssetArgs = {
  locales?: InputMaybe<Array<Locale>>;
  publishBase?: InputMaybe<Scalars['Boolean']>;
  releaseAt?: InputMaybe<Scalars['DateTime']>;
  releaseId?: InputMaybe<Scalars['String']>;
  to?: Array<Stage>;
  where: AssetWhereUniqueInput;
  withDefaultLocale?: InputMaybe<Scalars['Boolean']>;
};


/** mutation root */
export type Mutation_RootSchedulePublishEventArgs = {
  locales?: InputMaybe<Array<Locale>>;
  publishBase?: InputMaybe<Scalars['Boolean']>;
  releaseAt?: InputMaybe<Scalars['DateTime']>;
  releaseId?: InputMaybe<Scalars['String']>;
  to?: Array<Stage>;
  where: EventWhereUniqueInput;
  withDefaultLocale?: InputMaybe<Scalars['Boolean']>;
};


/** mutation root */
export type Mutation_RootSchedulePublishEventPassArgs = {
  locales?: InputMaybe<Array<Locale>>;
  publishBase?: InputMaybe<Scalars['Boolean']>;
  releaseAt?: InputMaybe<Scalars['DateTime']>;
  releaseId?: InputMaybe<Scalars['String']>;
  to?: Array<Stage>;
  where: EventPassWhereUniqueInput;
  withDefaultLocale?: InputMaybe<Scalars['Boolean']>;
};


/** mutation root */
export type Mutation_RootSchedulePublishOrganizerArgs = {
  locales?: InputMaybe<Array<Locale>>;
  publishBase?: InputMaybe<Scalars['Boolean']>;
  releaseAt?: InputMaybe<Scalars['DateTime']>;
  releaseId?: InputMaybe<Scalars['String']>;
  to?: Array<Stage>;
  where: OrganizerWhereUniqueInput;
  withDefaultLocale?: InputMaybe<Scalars['Boolean']>;
};


/** mutation root */
export type Mutation_RootScheduleUnpublishAssetArgs = {
  from?: Array<Stage>;
  locales?: InputMaybe<Array<Locale>>;
  releaseAt?: InputMaybe<Scalars['DateTime']>;
  releaseId?: InputMaybe<Scalars['String']>;
  unpublishBase?: InputMaybe<Scalars['Boolean']>;
  where: AssetWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootScheduleUnpublishEventArgs = {
  from?: Array<Stage>;
  locales?: InputMaybe<Array<Locale>>;
  releaseAt?: InputMaybe<Scalars['DateTime']>;
  releaseId?: InputMaybe<Scalars['String']>;
  unpublishBase?: InputMaybe<Scalars['Boolean']>;
  where: EventWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootScheduleUnpublishEventPassArgs = {
  from?: Array<Stage>;
  locales?: InputMaybe<Array<Locale>>;
  releaseAt?: InputMaybe<Scalars['DateTime']>;
  releaseId?: InputMaybe<Scalars['String']>;
  unpublishBase?: InputMaybe<Scalars['Boolean']>;
  where: EventPassWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootScheduleUnpublishOrganizerArgs = {
  from?: Array<Stage>;
  locales?: InputMaybe<Array<Locale>>;
  releaseAt?: InputMaybe<Scalars['DateTime']>;
  releaseId?: InputMaybe<Scalars['String']>;
  unpublishBase?: InputMaybe<Scalars['Boolean']>;
  where: OrganizerWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootUnpublishAssetArgs = {
  from?: Array<Stage>;
  locales?: InputMaybe<Array<Locale>>;
  unpublishBase?: InputMaybe<Scalars['Boolean']>;
  where: AssetWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootUnpublishEventArgs = {
  from?: Array<Stage>;
  locales?: InputMaybe<Array<Locale>>;
  unpublishBase?: InputMaybe<Scalars['Boolean']>;
  where: EventWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootUnpublishEventPassArgs = {
  from?: Array<Stage>;
  locales?: InputMaybe<Array<Locale>>;
  unpublishBase?: InputMaybe<Scalars['Boolean']>;
  where: EventPassWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootUnpublishManyAssetsArgs = {
  from?: Array<Stage>;
  locales?: InputMaybe<Array<Locale>>;
  unpublishBase?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<AssetManyWhereInput>;
};


/** mutation root */
export type Mutation_RootUnpublishManyAssetsConnectionArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  from?: Array<Stage>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: InputMaybe<Array<Locale>>;
  skip?: InputMaybe<Scalars['Int']>;
  stage?: InputMaybe<Stage>;
  unpublishBase?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<AssetManyWhereInput>;
};


/** mutation root */
export type Mutation_RootUnpublishManyEventPassesArgs = {
  from?: Array<Stage>;
  locales?: InputMaybe<Array<Locale>>;
  unpublishBase?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<EventPassManyWhereInput>;
};


/** mutation root */
export type Mutation_RootUnpublishManyEventPassesConnectionArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  from?: Array<Stage>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: InputMaybe<Array<Locale>>;
  skip?: InputMaybe<Scalars['Int']>;
  stage?: InputMaybe<Stage>;
  unpublishBase?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<EventPassManyWhereInput>;
};


/** mutation root */
export type Mutation_RootUnpublishManyEventsArgs = {
  from?: Array<Stage>;
  locales?: InputMaybe<Array<Locale>>;
  unpublishBase?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<EventManyWhereInput>;
};


/** mutation root */
export type Mutation_RootUnpublishManyEventsConnectionArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  from?: Array<Stage>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: InputMaybe<Array<Locale>>;
  skip?: InputMaybe<Scalars['Int']>;
  stage?: InputMaybe<Stage>;
  unpublishBase?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<EventManyWhereInput>;
};


/** mutation root */
export type Mutation_RootUnpublishManyOrganizersArgs = {
  from?: Array<Stage>;
  locales?: InputMaybe<Array<Locale>>;
  unpublishBase?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<OrganizerManyWhereInput>;
};


/** mutation root */
export type Mutation_RootUnpublishManyOrganizersConnectionArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  from?: Array<Stage>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: InputMaybe<Array<Locale>>;
  skip?: InputMaybe<Scalars['Int']>;
  stage?: InputMaybe<Stage>;
  unpublishBase?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<OrganizerManyWhereInput>;
};


/** mutation root */
export type Mutation_RootUnpublishOrganizerArgs = {
  from?: Array<Stage>;
  locales?: InputMaybe<Array<Locale>>;
  unpublishBase?: InputMaybe<Scalars['Boolean']>;
  where: OrganizerWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootUpdateAssetArgs = {
  data: AssetUpdateInput;
  where: AssetWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootUpdateEventArgs = {
  data: EventUpdateInput;
  where: EventWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootUpdateEventPassArgs = {
  data: EventPassUpdateInput;
  where: EventPassWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootUpdateManyAssetsArgs = {
  data: AssetUpdateManyInput;
  where?: InputMaybe<AssetManyWhereInput>;
};


/** mutation root */
export type Mutation_RootUpdateManyAssetsConnectionArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  data: AssetUpdateManyInput;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<AssetManyWhereInput>;
};


/** mutation root */
export type Mutation_RootUpdateManyEventPassesArgs = {
  data: EventPassUpdateManyInput;
  where?: InputMaybe<EventPassManyWhereInput>;
};


/** mutation root */
export type Mutation_RootUpdateManyEventPassesConnectionArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  data: EventPassUpdateManyInput;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EventPassManyWhereInput>;
};


/** mutation root */
export type Mutation_RootUpdateManyEventsArgs = {
  data: EventUpdateManyInput;
  where?: InputMaybe<EventManyWhereInput>;
};


/** mutation root */
export type Mutation_RootUpdateManyEventsConnectionArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  data: EventUpdateManyInput;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EventManyWhereInput>;
};


/** mutation root */
export type Mutation_RootUpdateManyOrganizersArgs = {
  data: OrganizerUpdateManyInput;
  where?: InputMaybe<OrganizerManyWhereInput>;
};


/** mutation root */
export type Mutation_RootUpdateManyOrganizersConnectionArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  data: OrganizerUpdateManyInput;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OrganizerManyWhereInput>;
};


/** mutation root */
export type Mutation_RootUpdateOrganizerArgs = {
  data: OrganizerUpdateInput;
  where: OrganizerWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootUpdateScheduledReleaseArgs = {
  data: ScheduledReleaseUpdateInput;
  where: ScheduledReleaseWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootUpdate_AccountArgs = {
  _set?: InputMaybe<Account_Set_Input>;
  where: Account_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Account_By_PkArgs = {
  _set?: InputMaybe<Account_Set_Input>;
  pk_columns: Account_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Account_ManyArgs = {
  updates: Array<Account_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_CurrencyArgs = {
  _set?: InputMaybe<Currency_Set_Input>;
  where: Currency_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Currency_By_PkArgs = {
  _set?: InputMaybe<Currency_Set_Input>;
  pk_columns: Currency_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Currency_ManyArgs = {
  updates: Array<Currency_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_EventParametersArgs = {
  _set?: InputMaybe<EventParameters_Set_Input>;
  where: EventParameters_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_EventParameters_By_PkArgs = {
  _set?: InputMaybe<EventParameters_Set_Input>;
  pk_columns: EventParameters_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_EventParameters_ManyArgs = {
  updates: Array<EventParameters_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_EventPassNftArgs = {
  _append?: InputMaybe<EventPassNft_Append_Input>;
  _delete_at_path?: InputMaybe<EventPassNft_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<EventPassNft_Delete_Elem_Input>;
  _delete_key?: InputMaybe<EventPassNft_Delete_Key_Input>;
  _inc?: InputMaybe<EventPassNft_Inc_Input>;
  _prepend?: InputMaybe<EventPassNft_Prepend_Input>;
  _set?: InputMaybe<EventPassNft_Set_Input>;
  where: EventPassNft_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_EventPassNftContractArgs = {
  _set?: InputMaybe<EventPassNftContract_Set_Input>;
  where: EventPassNftContract_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_EventPassNftContract_ManyArgs = {
  updates: Array<EventPassNftContract_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_EventPassNft_By_PkArgs = {
  _append?: InputMaybe<EventPassNft_Append_Input>;
  _delete_at_path?: InputMaybe<EventPassNft_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<EventPassNft_Delete_Elem_Input>;
  _delete_key?: InputMaybe<EventPassNft_Delete_Key_Input>;
  _inc?: InputMaybe<EventPassNft_Inc_Input>;
  _prepend?: InputMaybe<EventPassNft_Prepend_Input>;
  _set?: InputMaybe<EventPassNft_Set_Input>;
  pk_columns: EventPassNft_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_EventPassNft_ManyArgs = {
  updates: Array<EventPassNft_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_EventPassOrderArgs = {
  _inc?: InputMaybe<EventPassOrder_Inc_Input>;
  _set?: InputMaybe<EventPassOrder_Set_Input>;
  where: EventPassOrder_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_EventPassOrderSumsArgs = {
  _inc?: InputMaybe<EventPassOrderSums_Inc_Input>;
  _set?: InputMaybe<EventPassOrderSums_Set_Input>;
  where: EventPassOrderSums_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_EventPassOrderSums_By_PkArgs = {
  _inc?: InputMaybe<EventPassOrderSums_Inc_Input>;
  _set?: InputMaybe<EventPassOrderSums_Set_Input>;
  pk_columns: EventPassOrderSums_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_EventPassOrderSums_ManyArgs = {
  updates: Array<EventPassOrderSums_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_EventPassOrder_By_PkArgs = {
  _inc?: InputMaybe<EventPassOrder_Inc_Input>;
  _set?: InputMaybe<EventPassOrder_Set_Input>;
  pk_columns: EventPassOrder_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_EventPassOrder_ManyArgs = {
  updates: Array<EventPassOrder_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_EventPassPendingOrderArgs = {
  _inc?: InputMaybe<EventPassPendingOrder_Inc_Input>;
  _set?: InputMaybe<EventPassPendingOrder_Set_Input>;
  where: EventPassPendingOrder_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_EventPassPendingOrder_By_PkArgs = {
  _inc?: InputMaybe<EventPassPendingOrder_Inc_Input>;
  _set?: InputMaybe<EventPassPendingOrder_Set_Input>;
  pk_columns: EventPassPendingOrder_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_EventPassPendingOrder_ManyArgs = {
  updates: Array<EventPassPendingOrder_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_EventPassPricingArgs = {
  _inc?: InputMaybe<EventPassPricing_Inc_Input>;
  _set?: InputMaybe<EventPassPricing_Set_Input>;
  where: EventPassPricing_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_EventPassPricing_By_PkArgs = {
  _inc?: InputMaybe<EventPassPricing_Inc_Input>;
  _set?: InputMaybe<EventPassPricing_Set_Input>;
  pk_columns: EventPassPricing_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_EventPassPricing_ManyArgs = {
  updates: Array<EventPassPricing_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_NftTransferArgs = {
  _inc?: InputMaybe<NftTransfer_Inc_Input>;
  _set?: InputMaybe<NftTransfer_Set_Input>;
  where: NftTransfer_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_NftTransfer_By_PkArgs = {
  _inc?: InputMaybe<NftTransfer_Inc_Input>;
  _set?: InputMaybe<NftTransfer_Set_Input>;
  pk_columns: NftTransfer_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_NftTransfer_ManyArgs = {
  updates: Array<NftTransfer_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_NftWithMetadataArgs = {
  _append?: InputMaybe<NftWithMetadata_Append_Input>;
  _delete_at_path?: InputMaybe<NftWithMetadata_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<NftWithMetadata_Delete_Elem_Input>;
  _delete_key?: InputMaybe<NftWithMetadata_Delete_Key_Input>;
  _inc?: InputMaybe<NftWithMetadata_Inc_Input>;
  _prepend?: InputMaybe<NftWithMetadata_Prepend_Input>;
  _set?: InputMaybe<NftWithMetadata_Set_Input>;
  where: NftWithMetadata_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_NftWithMetadata_By_PkArgs = {
  _append?: InputMaybe<NftWithMetadata_Append_Input>;
  _delete_at_path?: InputMaybe<NftWithMetadata_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<NftWithMetadata_Delete_Elem_Input>;
  _delete_key?: InputMaybe<NftWithMetadata_Delete_Key_Input>;
  _inc?: InputMaybe<NftWithMetadata_Inc_Input>;
  _prepend?: InputMaybe<NftWithMetadata_Prepend_Input>;
  _set?: InputMaybe<NftWithMetadata_Set_Input>;
  pk_columns: NftWithMetadata_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_NftWithMetadata_ManyArgs = {
  updates: Array<NftWithMetadata_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_OrderStatusArgs = {
  _set?: InputMaybe<OrderStatus_Set_Input>;
  where: OrderStatus_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_OrderStatus_By_PkArgs = {
  _set?: InputMaybe<OrderStatus_Set_Input>;
  pk_columns: OrderStatus_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_OrderStatus_ManyArgs = {
  updates: Array<OrderStatus_Updates>;
};


/** mutation root */
export type Mutation_RootUpsertAssetArgs = {
  upsert: AssetUpsertInput;
  where: AssetWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootUpsertEventArgs = {
  upsert: EventUpsertInput;
  where: EventWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootUpsertEventPassArgs = {
  upsert: EventPassUpsertInput;
  where: EventPassWhereUniqueInput;
};


/** mutation root */
export type Mutation_RootUpsertOrganizerArgs = {
  upsert: OrganizerUpsertInput;
  where: OrganizerWhereUniqueInput;
};

/** The nftTransfer model is built to record and chronicle the transfer of NFTs between addresses. This model is crucial in tracing the movement of an NFT, especially when validating that an event pass has reached its intended recipient. Such a system facilitates debugging and reduces the need for excessive querying of our indexer. Entries in this table are populated through two primary avenues: either via an activity webhook responding to real-time NFT transfers or through a regular cron job as a failsafe, ensuring data integrity even if the webhook fails to capture certain events. */
export type NftTransfer = {
  __typename?: 'nftTransfer';
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber: Scalars['bigint'];
  /** Indicates the specific blockchain or network where the NFT resides. Useful in a multi-chain environment to distinguish between various chains. */
  chainId: Scalars['String'];
  /** Identifies the smart contract associated with the NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress: Scalars['String'];
  created_at: Scalars['timestamptz'];
  /** Refers to the associated event ID for which the NFT was transferred. Ties the NFT transfer to a particular event in the platform. */
  eventId: Scalars['String'];
  /** Denotes the specific Event Pass associated with the NFT. Helps in tracking the lifecycle of a particular event pass. */
  eventPassId: Scalars['String'];
  /** Denotes the source address from which the NFT was transferred. Essential to trace the sender in the NFT's movement. */
  fromAddress: Scalars['String'];
  id: Scalars['uuid'];
  /** Identifies the organizer who facilitated the event linked to the NFT transfer. Aids in associating NFT movements with specific organizers. */
  organizerId: Scalars['String'];
  /** Specifies the destination address receiving the NFT. Critical for determining the current holder of the NFT. */
  toAddress: Scalars['String'];
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId: Scalars['bigint'];
  /** Represents the unique hash of the transaction in which the NFT was transferred. Ensures traceability and verification on the blockchain. */
  transactionHash: Scalars['String'];
};

/** aggregated selection of "nftTransfer" */
export type NftTransfer_Aggregate = {
  __typename?: 'nftTransfer_aggregate';
  aggregate?: Maybe<NftTransfer_Aggregate_Fields>;
  nodes: Array<NftTransfer>;
};

export type NftTransfer_Aggregate_Bool_Exp = {
  count?: InputMaybe<NftTransfer_Aggregate_Bool_Exp_Count>;
};

export type NftTransfer_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<NftTransfer_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<NftTransfer_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "nftTransfer" */
export type NftTransfer_Aggregate_Fields = {
  __typename?: 'nftTransfer_aggregate_fields';
  avg?: Maybe<NftTransfer_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<NftTransfer_Max_Fields>;
  min?: Maybe<NftTransfer_Min_Fields>;
  stddev?: Maybe<NftTransfer_Stddev_Fields>;
  stddev_pop?: Maybe<NftTransfer_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<NftTransfer_Stddev_Samp_Fields>;
  sum?: Maybe<NftTransfer_Sum_Fields>;
  var_pop?: Maybe<NftTransfer_Var_Pop_Fields>;
  var_samp?: Maybe<NftTransfer_Var_Samp_Fields>;
  variance?: Maybe<NftTransfer_Variance_Fields>;
};


/** aggregate fields of "nftTransfer" */
export type NftTransfer_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<NftTransfer_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "nftTransfer" */
export type NftTransfer_Aggregate_Order_By = {
  avg?: InputMaybe<NftTransfer_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<NftTransfer_Max_Order_By>;
  min?: InputMaybe<NftTransfer_Min_Order_By>;
  stddev?: InputMaybe<NftTransfer_Stddev_Order_By>;
  stddev_pop?: InputMaybe<NftTransfer_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<NftTransfer_Stddev_Samp_Order_By>;
  sum?: InputMaybe<NftTransfer_Sum_Order_By>;
  var_pop?: InputMaybe<NftTransfer_Var_Pop_Order_By>;
  var_samp?: InputMaybe<NftTransfer_Var_Samp_Order_By>;
  variance?: InputMaybe<NftTransfer_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "nftTransfer" */
export type NftTransfer_Arr_Rel_Insert_Input = {
  data: Array<NftTransfer_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<NftTransfer_On_Conflict>;
};

/** aggregate avg on columns */
export type NftTransfer_Avg_Fields = {
  __typename?: 'nftTransfer_avg_fields';
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: Maybe<Scalars['Float']>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "nftTransfer" */
export type NftTransfer_Avg_Order_By = {
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: InputMaybe<Order_By>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "nftTransfer". All fields are combined with a logical 'AND'. */
export type NftTransfer_Bool_Exp = {
  _and?: InputMaybe<Array<NftTransfer_Bool_Exp>>;
  _not?: InputMaybe<NftTransfer_Bool_Exp>;
  _or?: InputMaybe<Array<NftTransfer_Bool_Exp>>;
  blockNumber?: InputMaybe<Bigint_Comparison_Exp>;
  chainId?: InputMaybe<String_Comparison_Exp>;
  contractAddress?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  eventId?: InputMaybe<String_Comparison_Exp>;
  eventPassId?: InputMaybe<String_Comparison_Exp>;
  fromAddress?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  organizerId?: InputMaybe<String_Comparison_Exp>;
  toAddress?: InputMaybe<String_Comparison_Exp>;
  tokenId?: InputMaybe<Bigint_Comparison_Exp>;
  transactionHash?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "nftTransfer" */
export const enum NftTransfer_Constraint {
  /** unique or primary key constraint on columns "id" */
  NftTransferPkey = 'nftTransfer_pkey',
  /** unique or primary key constraint on columns "tokenId", "contractAddress", "transactionHash" */
  NftTransferUniqueTransfer = 'nft_transfer_unique_transfer'
};

/** input type for incrementing numeric columns in table "nftTransfer" */
export type NftTransfer_Inc_Input = {
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: InputMaybe<Scalars['bigint']>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: InputMaybe<Scalars['bigint']>;
};

/** input type for inserting data into table "nftTransfer" */
export type NftTransfer_Insert_Input = {
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: InputMaybe<Scalars['bigint']>;
  /** Indicates the specific blockchain or network where the NFT resides. Useful in a multi-chain environment to distinguish between various chains. */
  chainId?: InputMaybe<Scalars['String']>;
  /** Identifies the smart contract associated with the NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** Refers to the associated event ID for which the NFT was transferred. Ties the NFT transfer to a particular event in the platform. */
  eventId?: InputMaybe<Scalars['String']>;
  /** Denotes the specific Event Pass associated with the NFT. Helps in tracking the lifecycle of a particular event pass. */
  eventPassId?: InputMaybe<Scalars['String']>;
  /** Denotes the source address from which the NFT was transferred. Essential to trace the sender in the NFT's movement. */
  fromAddress?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  /** Identifies the organizer who facilitated the event linked to the NFT transfer. Aids in associating NFT movements with specific organizers. */
  organizerId?: InputMaybe<Scalars['String']>;
  /** Specifies the destination address receiving the NFT. Critical for determining the current holder of the NFT. */
  toAddress?: InputMaybe<Scalars['String']>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: InputMaybe<Scalars['bigint']>;
  /** Represents the unique hash of the transaction in which the NFT was transferred. Ensures traceability and verification on the blockchain. */
  transactionHash?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type NftTransfer_Max_Fields = {
  __typename?: 'nftTransfer_max_fields';
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: Maybe<Scalars['bigint']>;
  /** Indicates the specific blockchain or network where the NFT resides. Useful in a multi-chain environment to distinguish between various chains. */
  chainId?: Maybe<Scalars['String']>;
  /** Identifies the smart contract associated with the NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  /** Refers to the associated event ID for which the NFT was transferred. Ties the NFT transfer to a particular event in the platform. */
  eventId?: Maybe<Scalars['String']>;
  /** Denotes the specific Event Pass associated with the NFT. Helps in tracking the lifecycle of a particular event pass. */
  eventPassId?: Maybe<Scalars['String']>;
  /** Denotes the source address from which the NFT was transferred. Essential to trace the sender in the NFT's movement. */
  fromAddress?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  /** Identifies the organizer who facilitated the event linked to the NFT transfer. Aids in associating NFT movements with specific organizers. */
  organizerId?: Maybe<Scalars['String']>;
  /** Specifies the destination address receiving the NFT. Critical for determining the current holder of the NFT. */
  toAddress?: Maybe<Scalars['String']>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: Maybe<Scalars['bigint']>;
  /** Represents the unique hash of the transaction in which the NFT was transferred. Ensures traceability and verification on the blockchain. */
  transactionHash?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "nftTransfer" */
export type NftTransfer_Max_Order_By = {
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: InputMaybe<Order_By>;
  /** Indicates the specific blockchain or network where the NFT resides. Useful in a multi-chain environment to distinguish between various chains. */
  chainId?: InputMaybe<Order_By>;
  /** Identifies the smart contract associated with the NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Refers to the associated event ID for which the NFT was transferred. Ties the NFT transfer to a particular event in the platform. */
  eventId?: InputMaybe<Order_By>;
  /** Denotes the specific Event Pass associated with the NFT. Helps in tracking the lifecycle of a particular event pass. */
  eventPassId?: InputMaybe<Order_By>;
  /** Denotes the source address from which the NFT was transferred. Essential to trace the sender in the NFT's movement. */
  fromAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Identifies the organizer who facilitated the event linked to the NFT transfer. Aids in associating NFT movements with specific organizers. */
  organizerId?: InputMaybe<Order_By>;
  /** Specifies the destination address receiving the NFT. Critical for determining the current holder of the NFT. */
  toAddress?: InputMaybe<Order_By>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: InputMaybe<Order_By>;
  /** Represents the unique hash of the transaction in which the NFT was transferred. Ensures traceability and verification on the blockchain. */
  transactionHash?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type NftTransfer_Min_Fields = {
  __typename?: 'nftTransfer_min_fields';
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: Maybe<Scalars['bigint']>;
  /** Indicates the specific blockchain or network where the NFT resides. Useful in a multi-chain environment to distinguish between various chains. */
  chainId?: Maybe<Scalars['String']>;
  /** Identifies the smart contract associated with the NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  /** Refers to the associated event ID for which the NFT was transferred. Ties the NFT transfer to a particular event in the platform. */
  eventId?: Maybe<Scalars['String']>;
  /** Denotes the specific Event Pass associated with the NFT. Helps in tracking the lifecycle of a particular event pass. */
  eventPassId?: Maybe<Scalars['String']>;
  /** Denotes the source address from which the NFT was transferred. Essential to trace the sender in the NFT's movement. */
  fromAddress?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  /** Identifies the organizer who facilitated the event linked to the NFT transfer. Aids in associating NFT movements with specific organizers. */
  organizerId?: Maybe<Scalars['String']>;
  /** Specifies the destination address receiving the NFT. Critical for determining the current holder of the NFT. */
  toAddress?: Maybe<Scalars['String']>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: Maybe<Scalars['bigint']>;
  /** Represents the unique hash of the transaction in which the NFT was transferred. Ensures traceability and verification on the blockchain. */
  transactionHash?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "nftTransfer" */
export type NftTransfer_Min_Order_By = {
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: InputMaybe<Order_By>;
  /** Indicates the specific blockchain or network where the NFT resides. Useful in a multi-chain environment to distinguish between various chains. */
  chainId?: InputMaybe<Order_By>;
  /** Identifies the smart contract associated with the NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Refers to the associated event ID for which the NFT was transferred. Ties the NFT transfer to a particular event in the platform. */
  eventId?: InputMaybe<Order_By>;
  /** Denotes the specific Event Pass associated with the NFT. Helps in tracking the lifecycle of a particular event pass. */
  eventPassId?: InputMaybe<Order_By>;
  /** Denotes the source address from which the NFT was transferred. Essential to trace the sender in the NFT's movement. */
  fromAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Identifies the organizer who facilitated the event linked to the NFT transfer. Aids in associating NFT movements with specific organizers. */
  organizerId?: InputMaybe<Order_By>;
  /** Specifies the destination address receiving the NFT. Critical for determining the current holder of the NFT. */
  toAddress?: InputMaybe<Order_By>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: InputMaybe<Order_By>;
  /** Represents the unique hash of the transaction in which the NFT was transferred. Ensures traceability and verification on the blockchain. */
  transactionHash?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "nftTransfer" */
export type NftTransfer_Mutation_Response = {
  __typename?: 'nftTransfer_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<NftTransfer>;
};

/** input type for inserting object relation for remote table "nftTransfer" */
export type NftTransfer_Obj_Rel_Insert_Input = {
  data: NftTransfer_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<NftTransfer_On_Conflict>;
};

/** on_conflict condition type for table "nftTransfer" */
export type NftTransfer_On_Conflict = {
  constraint: NftTransfer_Constraint;
  update_columns?: Array<NftTransfer_Update_Column>;
  where?: InputMaybe<NftTransfer_Bool_Exp>;
};

/** Ordering options when selecting data from "nftTransfer". */
export type NftTransfer_Order_By = {
  blockNumber?: InputMaybe<Order_By>;
  chainId?: InputMaybe<Order_By>;
  contractAddress?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  eventId?: InputMaybe<Order_By>;
  eventPassId?: InputMaybe<Order_By>;
  fromAddress?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organizerId?: InputMaybe<Order_By>;
  toAddress?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
  transactionHash?: InputMaybe<Order_By>;
};

/** primary key columns input for table: nftTransfer */
export type NftTransfer_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "nftTransfer" */
export const enum NftTransfer_Select_Column {
  /** column name */
  BlockNumber = 'blockNumber',
  /** column name */
  ChainId = 'chainId',
  /** column name */
  ContractAddress = 'contractAddress',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EventId = 'eventId',
  /** column name */
  EventPassId = 'eventPassId',
  /** column name */
  FromAddress = 'fromAddress',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizerId = 'organizerId',
  /** column name */
  ToAddress = 'toAddress',
  /** column name */
  TokenId = 'tokenId',
  /** column name */
  TransactionHash = 'transactionHash'
};

/** input type for updating data in table "nftTransfer" */
export type NftTransfer_Set_Input = {
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: InputMaybe<Scalars['bigint']>;
  /** Indicates the specific blockchain or network where the NFT resides. Useful in a multi-chain environment to distinguish between various chains. */
  chainId?: InputMaybe<Scalars['String']>;
  /** Identifies the smart contract associated with the NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** Refers to the associated event ID for which the NFT was transferred. Ties the NFT transfer to a particular event in the platform. */
  eventId?: InputMaybe<Scalars['String']>;
  /** Denotes the specific Event Pass associated with the NFT. Helps in tracking the lifecycle of a particular event pass. */
  eventPassId?: InputMaybe<Scalars['String']>;
  /** Denotes the source address from which the NFT was transferred. Essential to trace the sender in the NFT's movement. */
  fromAddress?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  /** Identifies the organizer who facilitated the event linked to the NFT transfer. Aids in associating NFT movements with specific organizers. */
  organizerId?: InputMaybe<Scalars['String']>;
  /** Specifies the destination address receiving the NFT. Critical for determining the current holder of the NFT. */
  toAddress?: InputMaybe<Scalars['String']>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: InputMaybe<Scalars['bigint']>;
  /** Represents the unique hash of the transaction in which the NFT was transferred. Ensures traceability and verification on the blockchain. */
  transactionHash?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type NftTransfer_Stddev_Fields = {
  __typename?: 'nftTransfer_stddev_fields';
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: Maybe<Scalars['Float']>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "nftTransfer" */
export type NftTransfer_Stddev_Order_By = {
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: InputMaybe<Order_By>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type NftTransfer_Stddev_Pop_Fields = {
  __typename?: 'nftTransfer_stddev_pop_fields';
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: Maybe<Scalars['Float']>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "nftTransfer" */
export type NftTransfer_Stddev_Pop_Order_By = {
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: InputMaybe<Order_By>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type NftTransfer_Stddev_Samp_Fields = {
  __typename?: 'nftTransfer_stddev_samp_fields';
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: Maybe<Scalars['Float']>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "nftTransfer" */
export type NftTransfer_Stddev_Samp_Order_By = {
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: InputMaybe<Order_By>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "nftTransfer" */
export type NftTransfer_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: NftTransfer_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type NftTransfer_Stream_Cursor_Value_Input = {
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: InputMaybe<Scalars['bigint']>;
  /** Indicates the specific blockchain or network where the NFT resides. Useful in a multi-chain environment to distinguish between various chains. */
  chainId?: InputMaybe<Scalars['String']>;
  /** Identifies the smart contract associated with the NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** Refers to the associated event ID for which the NFT was transferred. Ties the NFT transfer to a particular event in the platform. */
  eventId?: InputMaybe<Scalars['String']>;
  /** Denotes the specific Event Pass associated with the NFT. Helps in tracking the lifecycle of a particular event pass. */
  eventPassId?: InputMaybe<Scalars['String']>;
  /** Denotes the source address from which the NFT was transferred. Essential to trace the sender in the NFT's movement. */
  fromAddress?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  /** Identifies the organizer who facilitated the event linked to the NFT transfer. Aids in associating NFT movements with specific organizers. */
  organizerId?: InputMaybe<Scalars['String']>;
  /** Specifies the destination address receiving the NFT. Critical for determining the current holder of the NFT. */
  toAddress?: InputMaybe<Scalars['String']>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: InputMaybe<Scalars['bigint']>;
  /** Represents the unique hash of the transaction in which the NFT was transferred. Ensures traceability and verification on the blockchain. */
  transactionHash?: InputMaybe<Scalars['String']>;
};

/** aggregate sum on columns */
export type NftTransfer_Sum_Fields = {
  __typename?: 'nftTransfer_sum_fields';
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: Maybe<Scalars['bigint']>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: Maybe<Scalars['bigint']>;
};

/** order by sum() on columns of table "nftTransfer" */
export type NftTransfer_Sum_Order_By = {
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: InputMaybe<Order_By>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: InputMaybe<Order_By>;
};

/** update columns of table "nftTransfer" */
export const enum NftTransfer_Update_Column {
  /** column name */
  BlockNumber = 'blockNumber',
  /** column name */
  ChainId = 'chainId',
  /** column name */
  ContractAddress = 'contractAddress',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EventId = 'eventId',
  /** column name */
  EventPassId = 'eventPassId',
  /** column name */
  FromAddress = 'fromAddress',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizerId = 'organizerId',
  /** column name */
  ToAddress = 'toAddress',
  /** column name */
  TokenId = 'tokenId',
  /** column name */
  TransactionHash = 'transactionHash'
};

export type NftTransfer_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<NftTransfer_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<NftTransfer_Set_Input>;
  /** filter the rows which have to be updated */
  where: NftTransfer_Bool_Exp;
};

/** aggregate var_pop on columns */
export type NftTransfer_Var_Pop_Fields = {
  __typename?: 'nftTransfer_var_pop_fields';
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: Maybe<Scalars['Float']>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "nftTransfer" */
export type NftTransfer_Var_Pop_Order_By = {
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: InputMaybe<Order_By>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type NftTransfer_Var_Samp_Fields = {
  __typename?: 'nftTransfer_var_samp_fields';
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: Maybe<Scalars['Float']>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "nftTransfer" */
export type NftTransfer_Var_Samp_Order_By = {
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: InputMaybe<Order_By>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type NftTransfer_Variance_Fields = {
  __typename?: 'nftTransfer_variance_fields';
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: Maybe<Scalars['Float']>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "nftTransfer" */
export type NftTransfer_Variance_Order_By = {
  /** The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain's history. */
  blockNumber?: InputMaybe<Order_By>;
  /** The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms. */
  tokenId?: InputMaybe<Order_By>;
};

/** The nftWithMetadata model is designed to consolidate and store the metadata associated with each NFT. It leverages a structure resembling the alchemy-sdk, ensuring streamlined data extraction and management. This model centralizes fixed metadata, enabling the system to retrieve NFT details without frequently querying external APIs. Furthermore, the table is intended to integrate seamlessly with the existing nftTransfer model, providing a holistic view of each NFT's journey and characteristics within the platform. */
export type NftWithMetadata = {
  __typename?: 'nftWithMetadata';
  /** Denotes the specific blockchain or network of the NFT */
  chainId: Scalars['String'];
  /** Identifies the smart contract associated with the NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress: Scalars['String'];
  created_at: Scalars['timestamptz'];
  /** The address currently holding the NFT, allowing tracking of ownership */
  currentOwnerAddress: Scalars['String'];
  /** Contains any error message related to metadata retrieval, ensuring transparency in the data extraction process. */
  error?: Maybe<Scalars['String']>;
  /** A reference to the event associated with the NFT */
  eventId: Scalars['String'];
  /** Directly relates to a specific Event Pass within the system */
  eventPassId: Scalars['String'];
  id: Scalars['uuid'];
  /** Reference `id` to the latest `nftTransfer` entry, detailing the most recent transaction for this NFT. */
  lastNftTransfer?: Maybe<Scalars['uuid']>;
  /** The structured metadata parsed from the raw token URI. This contains a variety of details regarding the NFT. */
  metadata: Scalars['jsonb'];
  /** Ties the NFT to a specific organizer within the platform */
  organizerId: Scalars['String'];
  /** The unique identifier of the NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId: Scalars['bigint'];
  /** The designated URI for the NFT's metadata blob, providing a stable reference for data extraction. */
  tokenUri?: Maybe<Scalars['String']>;
  updated_at: Scalars['timestamptz'];
};


/** The nftWithMetadata model is designed to consolidate and store the metadata associated with each NFT. It leverages a structure resembling the alchemy-sdk, ensuring streamlined data extraction and management. This model centralizes fixed metadata, enabling the system to retrieve NFT details without frequently querying external APIs. Furthermore, the table is intended to integrate seamlessly with the existing nftTransfer model, providing a holistic view of each NFT's journey and characteristics within the platform. */
export type NftWithMetadataMetadataArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "nftWithMetadata" */
export type NftWithMetadata_Aggregate = {
  __typename?: 'nftWithMetadata_aggregate';
  aggregate?: Maybe<NftWithMetadata_Aggregate_Fields>;
  nodes: Array<NftWithMetadata>;
};

/** aggregate fields of "nftWithMetadata" */
export type NftWithMetadata_Aggregate_Fields = {
  __typename?: 'nftWithMetadata_aggregate_fields';
  avg?: Maybe<NftWithMetadata_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<NftWithMetadata_Max_Fields>;
  min?: Maybe<NftWithMetadata_Min_Fields>;
  stddev?: Maybe<NftWithMetadata_Stddev_Fields>;
  stddev_pop?: Maybe<NftWithMetadata_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<NftWithMetadata_Stddev_Samp_Fields>;
  sum?: Maybe<NftWithMetadata_Sum_Fields>;
  var_pop?: Maybe<NftWithMetadata_Var_Pop_Fields>;
  var_samp?: Maybe<NftWithMetadata_Var_Samp_Fields>;
  variance?: Maybe<NftWithMetadata_Variance_Fields>;
};


/** aggregate fields of "nftWithMetadata" */
export type NftWithMetadata_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<NftWithMetadata_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type NftWithMetadata_Append_Input = {
  /** The structured metadata parsed from the raw token URI. This contains a variety of details regarding the NFT. */
  metadata?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate avg on columns */
export type NftWithMetadata_Avg_Fields = {
  __typename?: 'nftWithMetadata_avg_fields';
  /** The unique identifier of the NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "nftWithMetadata". All fields are combined with a logical 'AND'. */
export type NftWithMetadata_Bool_Exp = {
  _and?: InputMaybe<Array<NftWithMetadata_Bool_Exp>>;
  _not?: InputMaybe<NftWithMetadata_Bool_Exp>;
  _or?: InputMaybe<Array<NftWithMetadata_Bool_Exp>>;
  chainId?: InputMaybe<String_Comparison_Exp>;
  contractAddress?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  currentOwnerAddress?: InputMaybe<String_Comparison_Exp>;
  error?: InputMaybe<String_Comparison_Exp>;
  eventId?: InputMaybe<String_Comparison_Exp>;
  eventPassId?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  lastNftTransfer?: InputMaybe<Uuid_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  organizerId?: InputMaybe<String_Comparison_Exp>;
  tokenId?: InputMaybe<Bigint_Comparison_Exp>;
  tokenUri?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "nftWithMetadata" */
export const enum NftWithMetadata_Constraint {
  /** unique or primary key constraint on columns "id" */
  NftWithMetadataPkey = 'nftWithMetadata_pkey'
};

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type NftWithMetadata_Delete_At_Path_Input = {
  /** The structured metadata parsed from the raw token URI. This contains a variety of details regarding the NFT. */
  metadata?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type NftWithMetadata_Delete_Elem_Input = {
  /** The structured metadata parsed from the raw token URI. This contains a variety of details regarding the NFT. */
  metadata?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type NftWithMetadata_Delete_Key_Input = {
  /** The structured metadata parsed from the raw token URI. This contains a variety of details regarding the NFT. */
  metadata?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "nftWithMetadata" */
export type NftWithMetadata_Inc_Input = {
  /** The unique identifier of the NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: InputMaybe<Scalars['bigint']>;
};

/** input type for inserting data into table "nftWithMetadata" */
export type NftWithMetadata_Insert_Input = {
  /** Denotes the specific blockchain or network of the NFT */
  chainId?: InputMaybe<Scalars['String']>;
  /** Identifies the smart contract associated with the NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** The address currently holding the NFT, allowing tracking of ownership */
  currentOwnerAddress?: InputMaybe<Scalars['String']>;
  /** Contains any error message related to metadata retrieval, ensuring transparency in the data extraction process. */
  error?: InputMaybe<Scalars['String']>;
  /** A reference to the event associated with the NFT */
  eventId?: InputMaybe<Scalars['String']>;
  /** Directly relates to a specific Event Pass within the system */
  eventPassId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  /** Reference `id` to the latest `nftTransfer` entry, detailing the most recent transaction for this NFT. */
  lastNftTransfer?: InputMaybe<Scalars['uuid']>;
  /** The structured metadata parsed from the raw token URI. This contains a variety of details regarding the NFT. */
  metadata?: InputMaybe<Scalars['jsonb']>;
  /** Ties the NFT to a specific organizer within the platform */
  organizerId?: InputMaybe<Scalars['String']>;
  /** The unique identifier of the NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: InputMaybe<Scalars['bigint']>;
  /** The designated URI for the NFT's metadata blob, providing a stable reference for data extraction. */
  tokenUri?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type NftWithMetadata_Max_Fields = {
  __typename?: 'nftWithMetadata_max_fields';
  /** Denotes the specific blockchain or network of the NFT */
  chainId?: Maybe<Scalars['String']>;
  /** Identifies the smart contract associated with the NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  /** The address currently holding the NFT, allowing tracking of ownership */
  currentOwnerAddress?: Maybe<Scalars['String']>;
  /** Contains any error message related to metadata retrieval, ensuring transparency in the data extraction process. */
  error?: Maybe<Scalars['String']>;
  /** A reference to the event associated with the NFT */
  eventId?: Maybe<Scalars['String']>;
  /** Directly relates to a specific Event Pass within the system */
  eventPassId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  /** Reference `id` to the latest `nftTransfer` entry, detailing the most recent transaction for this NFT. */
  lastNftTransfer?: Maybe<Scalars['uuid']>;
  /** Ties the NFT to a specific organizer within the platform */
  organizerId?: Maybe<Scalars['String']>;
  /** The unique identifier of the NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: Maybe<Scalars['bigint']>;
  /** The designated URI for the NFT's metadata blob, providing a stable reference for data extraction. */
  tokenUri?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type NftWithMetadata_Min_Fields = {
  __typename?: 'nftWithMetadata_min_fields';
  /** Denotes the specific blockchain or network of the NFT */
  chainId?: Maybe<Scalars['String']>;
  /** Identifies the smart contract associated with the NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  /** The address currently holding the NFT, allowing tracking of ownership */
  currentOwnerAddress?: Maybe<Scalars['String']>;
  /** Contains any error message related to metadata retrieval, ensuring transparency in the data extraction process. */
  error?: Maybe<Scalars['String']>;
  /** A reference to the event associated with the NFT */
  eventId?: Maybe<Scalars['String']>;
  /** Directly relates to a specific Event Pass within the system */
  eventPassId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  /** Reference `id` to the latest `nftTransfer` entry, detailing the most recent transaction for this NFT. */
  lastNftTransfer?: Maybe<Scalars['uuid']>;
  /** Ties the NFT to a specific organizer within the platform */
  organizerId?: Maybe<Scalars['String']>;
  /** The unique identifier of the NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: Maybe<Scalars['bigint']>;
  /** The designated URI for the NFT's metadata blob, providing a stable reference for data extraction. */
  tokenUri?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "nftWithMetadata" */
export type NftWithMetadata_Mutation_Response = {
  __typename?: 'nftWithMetadata_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<NftWithMetadata>;
};

/** on_conflict condition type for table "nftWithMetadata" */
export type NftWithMetadata_On_Conflict = {
  constraint: NftWithMetadata_Constraint;
  update_columns?: Array<NftWithMetadata_Update_Column>;
  where?: InputMaybe<NftWithMetadata_Bool_Exp>;
};

/** Ordering options when selecting data from "nftWithMetadata". */
export type NftWithMetadata_Order_By = {
  chainId?: InputMaybe<Order_By>;
  contractAddress?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  currentOwnerAddress?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  eventId?: InputMaybe<Order_By>;
  eventPassId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lastNftTransfer?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  organizerId?: InputMaybe<Order_By>;
  tokenId?: InputMaybe<Order_By>;
  tokenUri?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: nftWithMetadata */
export type NftWithMetadata_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type NftWithMetadata_Prepend_Input = {
  /** The structured metadata parsed from the raw token URI. This contains a variety of details regarding the NFT. */
  metadata?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "nftWithMetadata" */
export const enum NftWithMetadata_Select_Column {
  /** column name */
  ChainId = 'chainId',
  /** column name */
  ContractAddress = 'contractAddress',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CurrentOwnerAddress = 'currentOwnerAddress',
  /** column name */
  Error = 'error',
  /** column name */
  EventId = 'eventId',
  /** column name */
  EventPassId = 'eventPassId',
  /** column name */
  Id = 'id',
  /** column name */
  LastNftTransfer = 'lastNftTransfer',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  OrganizerId = 'organizerId',
  /** column name */
  TokenId = 'tokenId',
  /** column name */
  TokenUri = 'tokenUri',
  /** column name */
  UpdatedAt = 'updated_at'
};

/** input type for updating data in table "nftWithMetadata" */
export type NftWithMetadata_Set_Input = {
  /** Denotes the specific blockchain or network of the NFT */
  chainId?: InputMaybe<Scalars['String']>;
  /** Identifies the smart contract associated with the NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** The address currently holding the NFT, allowing tracking of ownership */
  currentOwnerAddress?: InputMaybe<Scalars['String']>;
  /** Contains any error message related to metadata retrieval, ensuring transparency in the data extraction process. */
  error?: InputMaybe<Scalars['String']>;
  /** A reference to the event associated with the NFT */
  eventId?: InputMaybe<Scalars['String']>;
  /** Directly relates to a specific Event Pass within the system */
  eventPassId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  /** Reference `id` to the latest `nftTransfer` entry, detailing the most recent transaction for this NFT. */
  lastNftTransfer?: InputMaybe<Scalars['uuid']>;
  /** The structured metadata parsed from the raw token URI. This contains a variety of details regarding the NFT. */
  metadata?: InputMaybe<Scalars['jsonb']>;
  /** Ties the NFT to a specific organizer within the platform */
  organizerId?: InputMaybe<Scalars['String']>;
  /** The unique identifier of the NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: InputMaybe<Scalars['bigint']>;
  /** The designated URI for the NFT's metadata blob, providing a stable reference for data extraction. */
  tokenUri?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type NftWithMetadata_Stddev_Fields = {
  __typename?: 'nftWithMetadata_stddev_fields';
  /** The unique identifier of the NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type NftWithMetadata_Stddev_Pop_Fields = {
  __typename?: 'nftWithMetadata_stddev_pop_fields';
  /** The unique identifier of the NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type NftWithMetadata_Stddev_Samp_Fields = {
  __typename?: 'nftWithMetadata_stddev_samp_fields';
  /** The unique identifier of the NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: Maybe<Scalars['Float']>;
};

/** Streaming cursor of the table "nftWithMetadata" */
export type NftWithMetadata_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: NftWithMetadata_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type NftWithMetadata_Stream_Cursor_Value_Input = {
  /** Denotes the specific blockchain or network of the NFT */
  chainId?: InputMaybe<Scalars['String']>;
  /** Identifies the smart contract associated with the NFT. This provides a direct link to the NFT's origin and behavior on the blockchain. */
  contractAddress?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** The address currently holding the NFT, allowing tracking of ownership */
  currentOwnerAddress?: InputMaybe<Scalars['String']>;
  /** Contains any error message related to metadata retrieval, ensuring transparency in the data extraction process. */
  error?: InputMaybe<Scalars['String']>;
  /** A reference to the event associated with the NFT */
  eventId?: InputMaybe<Scalars['String']>;
  /** Directly relates to a specific Event Pass within the system */
  eventPassId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  /** Reference `id` to the latest `nftTransfer` entry, detailing the most recent transaction for this NFT. */
  lastNftTransfer?: InputMaybe<Scalars['uuid']>;
  /** The structured metadata parsed from the raw token URI. This contains a variety of details regarding the NFT. */
  metadata?: InputMaybe<Scalars['jsonb']>;
  /** Ties the NFT to a specific organizer within the platform */
  organizerId?: InputMaybe<Scalars['String']>;
  /** The unique identifier of the NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: InputMaybe<Scalars['bigint']>;
  /** The designated URI for the NFT's metadata blob, providing a stable reference for data extraction. */
  tokenUri?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate sum on columns */
export type NftWithMetadata_Sum_Fields = {
  __typename?: 'nftWithMetadata_sum_fields';
  /** The unique identifier of the NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: Maybe<Scalars['bigint']>;
};

/** update columns of table "nftWithMetadata" */
export const enum NftWithMetadata_Update_Column {
  /** column name */
  ChainId = 'chainId',
  /** column name */
  ContractAddress = 'contractAddress',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CurrentOwnerAddress = 'currentOwnerAddress',
  /** column name */
  Error = 'error',
  /** column name */
  EventId = 'eventId',
  /** column name */
  EventPassId = 'eventPassId',
  /** column name */
  Id = 'id',
  /** column name */
  LastNftTransfer = 'lastNftTransfer',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  OrganizerId = 'organizerId',
  /** column name */
  TokenId = 'tokenId',
  /** column name */
  TokenUri = 'tokenUri',
  /** column name */
  UpdatedAt = 'updated_at'
};

export type NftWithMetadata_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<NftWithMetadata_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<NftWithMetadata_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<NftWithMetadata_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<NftWithMetadata_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<NftWithMetadata_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<NftWithMetadata_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<NftWithMetadata_Set_Input>;
  /** filter the rows which have to be updated */
  where: NftWithMetadata_Bool_Exp;
};

/** aggregate var_pop on columns */
export type NftWithMetadata_Var_Pop_Fields = {
  __typename?: 'nftWithMetadata_var_pop_fields';
  /** The unique identifier of the NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type NftWithMetadata_Var_Samp_Fields = {
  __typename?: 'nftWithMetadata_var_samp_fields';
  /** The unique identifier of the NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type NftWithMetadata_Variance_Fields = {
  __typename?: 'nftWithMetadata_variance_fields';
  /** The unique identifier of the NFT within its specific collection or contract. This remains constant across various platforms. */
  tokenId?: Maybe<Scalars['Float']>;
};

/** columns and relationships of "orderStatus" */
export type OrderStatus = {
  __typename?: 'orderStatus';
  value: Scalars['String'];
};

/** aggregated selection of "orderStatus" */
export type OrderStatus_Aggregate = {
  __typename?: 'orderStatus_aggregate';
  aggregate?: Maybe<OrderStatus_Aggregate_Fields>;
  nodes: Array<OrderStatus>;
};

/** aggregate fields of "orderStatus" */
export type OrderStatus_Aggregate_Fields = {
  __typename?: 'orderStatus_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<OrderStatus_Max_Fields>;
  min?: Maybe<OrderStatus_Min_Fields>;
};


/** aggregate fields of "orderStatus" */
export type OrderStatus_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<OrderStatus_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "orderStatus". All fields are combined with a logical 'AND'. */
export type OrderStatus_Bool_Exp = {
  _and?: InputMaybe<Array<OrderStatus_Bool_Exp>>;
  _not?: InputMaybe<OrderStatus_Bool_Exp>;
  _or?: InputMaybe<Array<OrderStatus_Bool_Exp>>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "orderStatus" */
export const enum OrderStatus_Constraint {
  /** unique or primary key constraint on columns "value" */
  OrderStatusPkey = 'orderStatus_pkey'
};

export const enum OrderStatus_Enum {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Confirmed = 'CONFIRMED'
};

/** Boolean expression to compare columns of type "orderStatus_enum". All fields are combined with logical 'AND'. */
export type OrderStatus_Enum_Comparison_Exp = {
  _eq?: InputMaybe<OrderStatus_Enum>;
  _in?: InputMaybe<Array<OrderStatus_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<OrderStatus_Enum>;
  _nin?: InputMaybe<Array<OrderStatus_Enum>>;
};

/** input type for inserting data into table "orderStatus" */
export type OrderStatus_Insert_Input = {
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type OrderStatus_Max_Fields = {
  __typename?: 'orderStatus_max_fields';
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type OrderStatus_Min_Fields = {
  __typename?: 'orderStatus_min_fields';
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "orderStatus" */
export type OrderStatus_Mutation_Response = {
  __typename?: 'orderStatus_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<OrderStatus>;
};

/** on_conflict condition type for table "orderStatus" */
export type OrderStatus_On_Conflict = {
  constraint: OrderStatus_Constraint;
  update_columns?: Array<OrderStatus_Update_Column>;
  where?: InputMaybe<OrderStatus_Bool_Exp>;
};

/** Ordering options when selecting data from "orderStatus". */
export type OrderStatus_Order_By = {
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: orderStatus */
export type OrderStatus_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "orderStatus" */
export const enum OrderStatus_Select_Column {
  /** column name */
  Value = 'value'
};

/** input type for updating data in table "orderStatus" */
export type OrderStatus_Set_Input = {
  value?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "orderStatus" */
export type OrderStatus_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: OrderStatus_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type OrderStatus_Stream_Cursor_Value_Input = {
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "orderStatus" */
export const enum OrderStatus_Update_Column {
  /** column name */
  Value = 'value'
};

export type OrderStatus_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<OrderStatus_Set_Input>;
  /** filter the rows which have to be updated */
  where: OrderStatus_Bool_Exp;
};

/** column ordering options */
export const enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
};

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "account" */
  account: Array<Account>;
  /** fetch aggregated fields from the table: "account" */
  account_aggregate: Account_Aggregate;
  /** fetch data from the table: "account" using primary key columns */
  account_by_pk?: Maybe<Account>;
  /** Retrieve a single asset */
  asset?: Maybe<Asset>;
  /** Retrieve document version */
  assetVersion?: Maybe<DocumentVersion>;
  /** Retrieve multiple assets */
  assets: Array<Asset>;
  /** Retrieve multiple assets using the Relay connection interface */
  assetsConnection: AssetConnection;
  /** fetch data from the table: "currency" */
  currency: Array<Currency>;
  /** fetch aggregated fields from the table: "currency" */
  currency_aggregate: Currency_Aggregate;
  /** fetch data from the table: "currency" using primary key columns */
  currency_by_pk?: Maybe<Currency>;
  /** Retrieve a single event */
  event?: Maybe<Event>;
  /** fetch data from the table: "eventParameters" */
  eventParameters: Array<EventParameters>;
  /** fetch aggregated fields from the table: "eventParameters" */
  eventParameters_aggregate: EventParameters_Aggregate;
  /** fetch data from the table: "eventParameters" using primary key columns */
  eventParameters_by_pk?: Maybe<EventParameters>;
  /** Retrieve a single eventPass */
  eventPass?: Maybe<EventPass>;
  /** fetch data from the table: "eventPassNft" */
  eventPassNft: Array<EventPassNft>;
  /** fetch data from the table: "eventPassNftContract" */
  eventPassNftContract: Array<EventPassNftContract>;
  /** fetch aggregated fields from the table: "eventPassNftContract" */
  eventPassNftContract_aggregate: EventPassNftContract_Aggregate;
  /** fetch aggregated fields from the table: "eventPassNft" */
  eventPassNft_aggregate: EventPassNft_Aggregate;
  /** fetch data from the table: "eventPassNft" using primary key columns */
  eventPassNft_by_pk?: Maybe<EventPassNft>;
  /** fetch data from the table: "eventPassOrder" */
  eventPassOrder: Array<EventPassOrder>;
  /** fetch data from the table: "eventPassOrderSums" */
  eventPassOrderSums: Array<EventPassOrderSums>;
  /** fetch aggregated fields from the table: "eventPassOrderSums" */
  eventPassOrderSums_aggregate: EventPassOrderSums_Aggregate;
  /** fetch data from the table: "eventPassOrderSums" using primary key columns */
  eventPassOrderSums_by_pk?: Maybe<EventPassOrderSums>;
  /** fetch aggregated fields from the table: "eventPassOrder" */
  eventPassOrder_aggregate: EventPassOrder_Aggregate;
  /** fetch data from the table: "eventPassOrder" using primary key columns */
  eventPassOrder_by_pk?: Maybe<EventPassOrder>;
  /** fetch data from the table: "eventPassPendingOrder" */
  eventPassPendingOrder: Array<EventPassPendingOrder>;
  /** fetch aggregated fields from the table: "eventPassPendingOrder" */
  eventPassPendingOrder_aggregate: EventPassPendingOrder_Aggregate;
  /** fetch data from the table: "eventPassPendingOrder" using primary key columns */
  eventPassPendingOrder_by_pk?: Maybe<EventPassPendingOrder>;
  /** fetch data from the table: "eventPassPricing" */
  eventPassPricing: Array<EventPassPricing>;
  /** fetch aggregated fields from the table: "eventPassPricing" */
  eventPassPricing_aggregate: EventPassPricing_Aggregate;
  /** fetch data from the table: "eventPassPricing" using primary key columns */
  eventPassPricing_by_pk?: Maybe<EventPassPricing>;
  /** Retrieve document version */
  eventPassVersion?: Maybe<DocumentVersion>;
  /** Retrieve multiple eventPasses */
  eventPasses: Array<EventPass>;
  /** Retrieve multiple eventPasses using the Relay connection interface */
  eventPassesConnection: EventPassConnection;
  /** Retrieve document version */
  eventVersion?: Maybe<DocumentVersion>;
  /** Retrieve multiple events */
  events: Array<Event>;
  /** Retrieve multiple events using the Relay connection interface */
  eventsConnection: EventConnection;
  /** fetch data from the table: "nftTransfer" */
  nftTransfer: Array<NftTransfer>;
  /** fetch aggregated fields from the table: "nftTransfer" */
  nftTransfer_aggregate: NftTransfer_Aggregate;
  /** fetch data from the table: "nftTransfer" using primary key columns */
  nftTransfer_by_pk?: Maybe<NftTransfer>;
  /** fetch data from the table: "nftWithMetadata" */
  nftWithMetadata: Array<NftWithMetadata>;
  /** fetch aggregated fields from the table: "nftWithMetadata" */
  nftWithMetadata_aggregate: NftWithMetadata_Aggregate;
  /** fetch data from the table: "nftWithMetadata" using primary key columns */
  nftWithMetadata_by_pk?: Maybe<NftWithMetadata>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** fetch data from the table: "orderStatus" */
  orderStatus: Array<OrderStatus>;
  /** fetch aggregated fields from the table: "orderStatus" */
  orderStatus_aggregate: OrderStatus_Aggregate;
  /** fetch data from the table: "orderStatus" using primary key columns */
  orderStatus_by_pk?: Maybe<OrderStatus>;
  /** Retrieve a single organizer */
  organizer?: Maybe<Organizer>;
  /** Retrieve document version */
  organizerVersion?: Maybe<DocumentVersion>;
  /** Retrieve multiple organizers */
  organizers: Array<Organizer>;
  /** Retrieve multiple organizers using the Relay connection interface */
  organizersConnection: OrganizerConnection;
  /** Retrieve a single scheduledOperation */
  scheduledOperation?: Maybe<ScheduledOperation>;
  /** Retrieve multiple scheduledOperations */
  scheduledOperations: Array<ScheduledOperation>;
  /** Retrieve multiple scheduledOperations using the Relay connection interface */
  scheduledOperationsConnection: ScheduledOperationConnection;
  /** Retrieve a single scheduledRelease */
  scheduledRelease?: Maybe<ScheduledRelease>;
  /** Retrieve multiple scheduledReleases */
  scheduledReleases: Array<ScheduledRelease>;
  /** Retrieve multiple scheduledReleases using the Relay connection interface */
  scheduledReleasesConnection: ScheduledReleaseConnection;
  /** Retrieve a single user */
  user?: Maybe<User>;
  /** Retrieve multiple users */
  users: Array<User>;
  /** Retrieve multiple users using the Relay connection interface */
  usersConnection: UserConnection;
};


export type Query_RootAccountArgs = {
  distinct_on?: InputMaybe<Array<Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Account_Order_By>>;
  where?: InputMaybe<Account_Bool_Exp>;
};


export type Query_RootAccount_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Account_Order_By>>;
  where?: InputMaybe<Account_Bool_Exp>;
};


export type Query_RootAccount_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootAssetArgs = {
  locales?: Array<Locale>;
  stage?: Stage;
  where: AssetWhereUniqueInput;
};


export type Query_RootAssetVersionArgs = {
  where: VersionWhereInput;
};


export type Query_RootAssetsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: Array<Locale>;
  orderBy?: InputMaybe<AssetOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  stage?: Stage;
  where?: InputMaybe<AssetWhereInput>;
};


export type Query_RootAssetsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: Array<Locale>;
  orderBy?: InputMaybe<AssetOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  stage?: Stage;
  where?: InputMaybe<AssetWhereInput>;
};


export type Query_RootCurrencyArgs = {
  distinct_on?: InputMaybe<Array<Currency_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Currency_Order_By>>;
  where?: InputMaybe<Currency_Bool_Exp>;
};


export type Query_RootCurrency_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Currency_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Currency_Order_By>>;
  where?: InputMaybe<Currency_Bool_Exp>;
};


export type Query_RootCurrency_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootEventArgs = {
  locales?: Array<Locale>;
  stage?: Stage;
  where: EventWhereUniqueInput;
};


export type Query_RootEventParametersArgs = {
  distinct_on?: InputMaybe<Array<EventParameters_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventParameters_Order_By>>;
  where?: InputMaybe<EventParameters_Bool_Exp>;
};


export type Query_RootEventParameters_AggregateArgs = {
  distinct_on?: InputMaybe<Array<EventParameters_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventParameters_Order_By>>;
  where?: InputMaybe<EventParameters_Bool_Exp>;
};


export type Query_RootEventParameters_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootEventPassArgs = {
  locales?: Array<Locale>;
  stage?: Stage;
  where: EventPassWhereUniqueInput;
};


export type Query_RootEventPassNftArgs = {
  distinct_on?: InputMaybe<Array<EventPassNft_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassNft_Order_By>>;
  where?: InputMaybe<EventPassNft_Bool_Exp>;
};


export type Query_RootEventPassNftContractArgs = {
  distinct_on?: InputMaybe<Array<EventPassNftContract_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassNftContract_Order_By>>;
  where?: InputMaybe<EventPassNftContract_Bool_Exp>;
};


export type Query_RootEventPassNftContract_AggregateArgs = {
  distinct_on?: InputMaybe<Array<EventPassNftContract_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassNftContract_Order_By>>;
  where?: InputMaybe<EventPassNftContract_Bool_Exp>;
};


export type Query_RootEventPassNft_AggregateArgs = {
  distinct_on?: InputMaybe<Array<EventPassNft_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassNft_Order_By>>;
  where?: InputMaybe<EventPassNft_Bool_Exp>;
};


export type Query_RootEventPassNft_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootEventPassOrderArgs = {
  distinct_on?: InputMaybe<Array<EventPassOrder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassOrder_Order_By>>;
  where?: InputMaybe<EventPassOrder_Bool_Exp>;
};


export type Query_RootEventPassOrderSumsArgs = {
  distinct_on?: InputMaybe<Array<EventPassOrderSums_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassOrderSums_Order_By>>;
  where?: InputMaybe<EventPassOrderSums_Bool_Exp>;
};


export type Query_RootEventPassOrderSums_AggregateArgs = {
  distinct_on?: InputMaybe<Array<EventPassOrderSums_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassOrderSums_Order_By>>;
  where?: InputMaybe<EventPassOrderSums_Bool_Exp>;
};


export type Query_RootEventPassOrderSums_By_PkArgs = {
  eventPassId: Scalars['String'];
};


export type Query_RootEventPassOrder_AggregateArgs = {
  distinct_on?: InputMaybe<Array<EventPassOrder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassOrder_Order_By>>;
  where?: InputMaybe<EventPassOrder_Bool_Exp>;
};


export type Query_RootEventPassOrder_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootEventPassPendingOrderArgs = {
  distinct_on?: InputMaybe<Array<EventPassPendingOrder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassPendingOrder_Order_By>>;
  where?: InputMaybe<EventPassPendingOrder_Bool_Exp>;
};


export type Query_RootEventPassPendingOrder_AggregateArgs = {
  distinct_on?: InputMaybe<Array<EventPassPendingOrder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassPendingOrder_Order_By>>;
  where?: InputMaybe<EventPassPendingOrder_Bool_Exp>;
};


export type Query_RootEventPassPendingOrder_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootEventPassPricingArgs = {
  distinct_on?: InputMaybe<Array<EventPassPricing_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassPricing_Order_By>>;
  where?: InputMaybe<EventPassPricing_Bool_Exp>;
};


export type Query_RootEventPassPricing_AggregateArgs = {
  distinct_on?: InputMaybe<Array<EventPassPricing_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassPricing_Order_By>>;
  where?: InputMaybe<EventPassPricing_Bool_Exp>;
};


export type Query_RootEventPassPricing_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootEventPassVersionArgs = {
  where: VersionWhereInput;
};


export type Query_RootEventPassesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: Array<Locale>;
  orderBy?: InputMaybe<EventPassOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  stage?: Stage;
  where?: InputMaybe<EventPassWhereInput>;
};


export type Query_RootEventPassesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: Array<Locale>;
  orderBy?: InputMaybe<EventPassOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  stage?: Stage;
  where?: InputMaybe<EventPassWhereInput>;
};


export type Query_RootEventVersionArgs = {
  where: VersionWhereInput;
};


export type Query_RootEventsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: Array<Locale>;
  orderBy?: InputMaybe<EventOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  stage?: Stage;
  where?: InputMaybe<EventWhereInput>;
};


export type Query_RootEventsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: Array<Locale>;
  orderBy?: InputMaybe<EventOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  stage?: Stage;
  where?: InputMaybe<EventWhereInput>;
};


export type Query_RootNftTransferArgs = {
  distinct_on?: InputMaybe<Array<NftTransfer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<NftTransfer_Order_By>>;
  where?: InputMaybe<NftTransfer_Bool_Exp>;
};


export type Query_RootNftTransfer_AggregateArgs = {
  distinct_on?: InputMaybe<Array<NftTransfer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<NftTransfer_Order_By>>;
  where?: InputMaybe<NftTransfer_Bool_Exp>;
};


export type Query_RootNftTransfer_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootNftWithMetadataArgs = {
  distinct_on?: InputMaybe<Array<NftWithMetadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<NftWithMetadata_Order_By>>;
  where?: InputMaybe<NftWithMetadata_Bool_Exp>;
};


export type Query_RootNftWithMetadata_AggregateArgs = {
  distinct_on?: InputMaybe<Array<NftWithMetadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<NftWithMetadata_Order_By>>;
  where?: InputMaybe<NftWithMetadata_Bool_Exp>;
};


export type Query_RootNftWithMetadata_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootNodeArgs = {
  id: Scalars['ID'];
  locales?: Array<Locale>;
  stage?: Stage;
};


export type Query_RootOrderStatusArgs = {
  distinct_on?: InputMaybe<Array<OrderStatus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<OrderStatus_Order_By>>;
  where?: InputMaybe<OrderStatus_Bool_Exp>;
};


export type Query_RootOrderStatus_AggregateArgs = {
  distinct_on?: InputMaybe<Array<OrderStatus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<OrderStatus_Order_By>>;
  where?: InputMaybe<OrderStatus_Bool_Exp>;
};


export type Query_RootOrderStatus_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootOrganizerArgs = {
  locales?: Array<Locale>;
  stage?: Stage;
  where: OrganizerWhereUniqueInput;
};


export type Query_RootOrganizerVersionArgs = {
  where: VersionWhereInput;
};


export type Query_RootOrganizersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: Array<Locale>;
  orderBy?: InputMaybe<OrganizerOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  stage?: Stage;
  where?: InputMaybe<OrganizerWhereInput>;
};


export type Query_RootOrganizersConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: Array<Locale>;
  orderBy?: InputMaybe<OrganizerOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  stage?: Stage;
  where?: InputMaybe<OrganizerWhereInput>;
};


export type Query_RootScheduledOperationArgs = {
  locales?: Array<Locale>;
  stage?: Stage;
  where: ScheduledOperationWhereUniqueInput;
};


export type Query_RootScheduledOperationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: Array<Locale>;
  orderBy?: InputMaybe<ScheduledOperationOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  stage?: Stage;
  where?: InputMaybe<ScheduledOperationWhereInput>;
};


export type Query_RootScheduledOperationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: Array<Locale>;
  orderBy?: InputMaybe<ScheduledOperationOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  stage?: Stage;
  where?: InputMaybe<ScheduledOperationWhereInput>;
};


export type Query_RootScheduledReleaseArgs = {
  locales?: Array<Locale>;
  stage?: Stage;
  where: ScheduledReleaseWhereUniqueInput;
};


export type Query_RootScheduledReleasesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: Array<Locale>;
  orderBy?: InputMaybe<ScheduledReleaseOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  stage?: Stage;
  where?: InputMaybe<ScheduledReleaseWhereInput>;
};


export type Query_RootScheduledReleasesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: Array<Locale>;
  orderBy?: InputMaybe<ScheduledReleaseOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  stage?: Stage;
  where?: InputMaybe<ScheduledReleaseWhereInput>;
};


export type Query_RootUserArgs = {
  locales?: Array<Locale>;
  stage?: Stage;
  where: UserWhereUniqueInput;
};


export type Query_RootUsersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: Array<Locale>;
  orderBy?: InputMaybe<UserOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  stage?: Stage;
  where?: InputMaybe<UserWhereInput>;
};


export type Query_RootUsersConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  locales?: Array<Locale>;
  orderBy?: InputMaybe<UserOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  stage?: Stage;
  where?: InputMaybe<UserWhereInput>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "account" */
  account: Array<Account>;
  /** fetch aggregated fields from the table: "account" */
  account_aggregate: Account_Aggregate;
  /** fetch data from the table: "account" using primary key columns */
  account_by_pk?: Maybe<Account>;
  /** fetch data from the table in a streaming manner: "account" */
  account_stream: Array<Account>;
  /** fetch data from the table: "currency" */
  currency: Array<Currency>;
  /** fetch aggregated fields from the table: "currency" */
  currency_aggregate: Currency_Aggregate;
  /** fetch data from the table: "currency" using primary key columns */
  currency_by_pk?: Maybe<Currency>;
  /** fetch data from the table in a streaming manner: "currency" */
  currency_stream: Array<Currency>;
  /** fetch data from the table: "eventParameters" */
  eventParameters: Array<EventParameters>;
  /** fetch aggregated fields from the table: "eventParameters" */
  eventParameters_aggregate: EventParameters_Aggregate;
  /** fetch data from the table: "eventParameters" using primary key columns */
  eventParameters_by_pk?: Maybe<EventParameters>;
  /** fetch data from the table in a streaming manner: "eventParameters" */
  eventParameters_stream: Array<EventParameters>;
  /** fetch data from the table: "eventPassNft" */
  eventPassNft: Array<EventPassNft>;
  /** fetch data from the table: "eventPassNftContract" */
  eventPassNftContract: Array<EventPassNftContract>;
  /** fetch aggregated fields from the table: "eventPassNftContract" */
  eventPassNftContract_aggregate: EventPassNftContract_Aggregate;
  /** fetch data from the table in a streaming manner: "eventPassNftContract" */
  eventPassNftContract_stream: Array<EventPassNftContract>;
  /** fetch aggregated fields from the table: "eventPassNft" */
  eventPassNft_aggregate: EventPassNft_Aggregate;
  /** fetch data from the table: "eventPassNft" using primary key columns */
  eventPassNft_by_pk?: Maybe<EventPassNft>;
  /** fetch data from the table in a streaming manner: "eventPassNft" */
  eventPassNft_stream: Array<EventPassNft>;
  /** fetch data from the table: "eventPassOrder" */
  eventPassOrder: Array<EventPassOrder>;
  /** fetch data from the table: "eventPassOrderSums" */
  eventPassOrderSums: Array<EventPassOrderSums>;
  /** fetch aggregated fields from the table: "eventPassOrderSums" */
  eventPassOrderSums_aggregate: EventPassOrderSums_Aggregate;
  /** fetch data from the table: "eventPassOrderSums" using primary key columns */
  eventPassOrderSums_by_pk?: Maybe<EventPassOrderSums>;
  /** fetch data from the table in a streaming manner: "eventPassOrderSums" */
  eventPassOrderSums_stream: Array<EventPassOrderSums>;
  /** fetch aggregated fields from the table: "eventPassOrder" */
  eventPassOrder_aggregate: EventPassOrder_Aggregate;
  /** fetch data from the table: "eventPassOrder" using primary key columns */
  eventPassOrder_by_pk?: Maybe<EventPassOrder>;
  /** fetch data from the table in a streaming manner: "eventPassOrder" */
  eventPassOrder_stream: Array<EventPassOrder>;
  /** fetch data from the table: "eventPassPendingOrder" */
  eventPassPendingOrder: Array<EventPassPendingOrder>;
  /** fetch aggregated fields from the table: "eventPassPendingOrder" */
  eventPassPendingOrder_aggregate: EventPassPendingOrder_Aggregate;
  /** fetch data from the table: "eventPassPendingOrder" using primary key columns */
  eventPassPendingOrder_by_pk?: Maybe<EventPassPendingOrder>;
  /** fetch data from the table in a streaming manner: "eventPassPendingOrder" */
  eventPassPendingOrder_stream: Array<EventPassPendingOrder>;
  /** fetch data from the table: "eventPassPricing" */
  eventPassPricing: Array<EventPassPricing>;
  /** fetch aggregated fields from the table: "eventPassPricing" */
  eventPassPricing_aggregate: EventPassPricing_Aggregate;
  /** fetch data from the table: "eventPassPricing" using primary key columns */
  eventPassPricing_by_pk?: Maybe<EventPassPricing>;
  /** fetch data from the table in a streaming manner: "eventPassPricing" */
  eventPassPricing_stream: Array<EventPassPricing>;
  /** fetch data from the table: "nftTransfer" */
  nftTransfer: Array<NftTransfer>;
  /** fetch aggregated fields from the table: "nftTransfer" */
  nftTransfer_aggregate: NftTransfer_Aggregate;
  /** fetch data from the table: "nftTransfer" using primary key columns */
  nftTransfer_by_pk?: Maybe<NftTransfer>;
  /** fetch data from the table in a streaming manner: "nftTransfer" */
  nftTransfer_stream: Array<NftTransfer>;
  /** fetch data from the table: "nftWithMetadata" */
  nftWithMetadata: Array<NftWithMetadata>;
  /** fetch aggregated fields from the table: "nftWithMetadata" */
  nftWithMetadata_aggregate: NftWithMetadata_Aggregate;
  /** fetch data from the table: "nftWithMetadata" using primary key columns */
  nftWithMetadata_by_pk?: Maybe<NftWithMetadata>;
  /** fetch data from the table in a streaming manner: "nftWithMetadata" */
  nftWithMetadata_stream: Array<NftWithMetadata>;
  /** fetch data from the table: "orderStatus" */
  orderStatus: Array<OrderStatus>;
  /** fetch aggregated fields from the table: "orderStatus" */
  orderStatus_aggregate: OrderStatus_Aggregate;
  /** fetch data from the table: "orderStatus" using primary key columns */
  orderStatus_by_pk?: Maybe<OrderStatus>;
  /** fetch data from the table in a streaming manner: "orderStatus" */
  orderStatus_stream: Array<OrderStatus>;
};


export type Subscription_RootAccountArgs = {
  distinct_on?: InputMaybe<Array<Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Account_Order_By>>;
  where?: InputMaybe<Account_Bool_Exp>;
};


export type Subscription_RootAccount_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Account_Order_By>>;
  where?: InputMaybe<Account_Bool_Exp>;
};


export type Subscription_RootAccount_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootAccount_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Account_Stream_Cursor_Input>>;
  where?: InputMaybe<Account_Bool_Exp>;
};


export type Subscription_RootCurrencyArgs = {
  distinct_on?: InputMaybe<Array<Currency_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Currency_Order_By>>;
  where?: InputMaybe<Currency_Bool_Exp>;
};


export type Subscription_RootCurrency_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Currency_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Currency_Order_By>>;
  where?: InputMaybe<Currency_Bool_Exp>;
};


export type Subscription_RootCurrency_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootCurrency_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Currency_Stream_Cursor_Input>>;
  where?: InputMaybe<Currency_Bool_Exp>;
};


export type Subscription_RootEventParametersArgs = {
  distinct_on?: InputMaybe<Array<EventParameters_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventParameters_Order_By>>;
  where?: InputMaybe<EventParameters_Bool_Exp>;
};


export type Subscription_RootEventParameters_AggregateArgs = {
  distinct_on?: InputMaybe<Array<EventParameters_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventParameters_Order_By>>;
  where?: InputMaybe<EventParameters_Bool_Exp>;
};


export type Subscription_RootEventParameters_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootEventParameters_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<EventParameters_Stream_Cursor_Input>>;
  where?: InputMaybe<EventParameters_Bool_Exp>;
};


export type Subscription_RootEventPassNftArgs = {
  distinct_on?: InputMaybe<Array<EventPassNft_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassNft_Order_By>>;
  where?: InputMaybe<EventPassNft_Bool_Exp>;
};


export type Subscription_RootEventPassNftContractArgs = {
  distinct_on?: InputMaybe<Array<EventPassNftContract_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassNftContract_Order_By>>;
  where?: InputMaybe<EventPassNftContract_Bool_Exp>;
};


export type Subscription_RootEventPassNftContract_AggregateArgs = {
  distinct_on?: InputMaybe<Array<EventPassNftContract_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassNftContract_Order_By>>;
  where?: InputMaybe<EventPassNftContract_Bool_Exp>;
};


export type Subscription_RootEventPassNftContract_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<EventPassNftContract_Stream_Cursor_Input>>;
  where?: InputMaybe<EventPassNftContract_Bool_Exp>;
};


export type Subscription_RootEventPassNft_AggregateArgs = {
  distinct_on?: InputMaybe<Array<EventPassNft_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassNft_Order_By>>;
  where?: InputMaybe<EventPassNft_Bool_Exp>;
};


export type Subscription_RootEventPassNft_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootEventPassNft_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<EventPassNft_Stream_Cursor_Input>>;
  where?: InputMaybe<EventPassNft_Bool_Exp>;
};


export type Subscription_RootEventPassOrderArgs = {
  distinct_on?: InputMaybe<Array<EventPassOrder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassOrder_Order_By>>;
  where?: InputMaybe<EventPassOrder_Bool_Exp>;
};


export type Subscription_RootEventPassOrderSumsArgs = {
  distinct_on?: InputMaybe<Array<EventPassOrderSums_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassOrderSums_Order_By>>;
  where?: InputMaybe<EventPassOrderSums_Bool_Exp>;
};


export type Subscription_RootEventPassOrderSums_AggregateArgs = {
  distinct_on?: InputMaybe<Array<EventPassOrderSums_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassOrderSums_Order_By>>;
  where?: InputMaybe<EventPassOrderSums_Bool_Exp>;
};


export type Subscription_RootEventPassOrderSums_By_PkArgs = {
  eventPassId: Scalars['String'];
};


export type Subscription_RootEventPassOrderSums_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<EventPassOrderSums_Stream_Cursor_Input>>;
  where?: InputMaybe<EventPassOrderSums_Bool_Exp>;
};


export type Subscription_RootEventPassOrder_AggregateArgs = {
  distinct_on?: InputMaybe<Array<EventPassOrder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassOrder_Order_By>>;
  where?: InputMaybe<EventPassOrder_Bool_Exp>;
};


export type Subscription_RootEventPassOrder_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootEventPassOrder_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<EventPassOrder_Stream_Cursor_Input>>;
  where?: InputMaybe<EventPassOrder_Bool_Exp>;
};


export type Subscription_RootEventPassPendingOrderArgs = {
  distinct_on?: InputMaybe<Array<EventPassPendingOrder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassPendingOrder_Order_By>>;
  where?: InputMaybe<EventPassPendingOrder_Bool_Exp>;
};


export type Subscription_RootEventPassPendingOrder_AggregateArgs = {
  distinct_on?: InputMaybe<Array<EventPassPendingOrder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassPendingOrder_Order_By>>;
  where?: InputMaybe<EventPassPendingOrder_Bool_Exp>;
};


export type Subscription_RootEventPassPendingOrder_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootEventPassPendingOrder_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<EventPassPendingOrder_Stream_Cursor_Input>>;
  where?: InputMaybe<EventPassPendingOrder_Bool_Exp>;
};


export type Subscription_RootEventPassPricingArgs = {
  distinct_on?: InputMaybe<Array<EventPassPricing_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassPricing_Order_By>>;
  where?: InputMaybe<EventPassPricing_Bool_Exp>;
};


export type Subscription_RootEventPassPricing_AggregateArgs = {
  distinct_on?: InputMaybe<Array<EventPassPricing_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<EventPassPricing_Order_By>>;
  where?: InputMaybe<EventPassPricing_Bool_Exp>;
};


export type Subscription_RootEventPassPricing_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootEventPassPricing_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<EventPassPricing_Stream_Cursor_Input>>;
  where?: InputMaybe<EventPassPricing_Bool_Exp>;
};


export type Subscription_RootNftTransferArgs = {
  distinct_on?: InputMaybe<Array<NftTransfer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<NftTransfer_Order_By>>;
  where?: InputMaybe<NftTransfer_Bool_Exp>;
};


export type Subscription_RootNftTransfer_AggregateArgs = {
  distinct_on?: InputMaybe<Array<NftTransfer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<NftTransfer_Order_By>>;
  where?: InputMaybe<NftTransfer_Bool_Exp>;
};


export type Subscription_RootNftTransfer_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootNftTransfer_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<NftTransfer_Stream_Cursor_Input>>;
  where?: InputMaybe<NftTransfer_Bool_Exp>;
};


export type Subscription_RootNftWithMetadataArgs = {
  distinct_on?: InputMaybe<Array<NftWithMetadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<NftWithMetadata_Order_By>>;
  where?: InputMaybe<NftWithMetadata_Bool_Exp>;
};


export type Subscription_RootNftWithMetadata_AggregateArgs = {
  distinct_on?: InputMaybe<Array<NftWithMetadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<NftWithMetadata_Order_By>>;
  where?: InputMaybe<NftWithMetadata_Bool_Exp>;
};


export type Subscription_RootNftWithMetadata_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootNftWithMetadata_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<NftWithMetadata_Stream_Cursor_Input>>;
  where?: InputMaybe<NftWithMetadata_Bool_Exp>;
};


export type Subscription_RootOrderStatusArgs = {
  distinct_on?: InputMaybe<Array<OrderStatus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<OrderStatus_Order_By>>;
  where?: InputMaybe<OrderStatus_Bool_Exp>;
};


export type Subscription_RootOrderStatus_AggregateArgs = {
  distinct_on?: InputMaybe<Array<OrderStatus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<OrderStatus_Order_By>>;
  where?: InputMaybe<OrderStatus_Bool_Exp>;
};


export type Subscription_RootOrderStatus_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootOrderStatus_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<OrderStatus_Stream_Cursor_Input>>;
  where?: InputMaybe<OrderStatus_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']>;
  _gt?: InputMaybe<Scalars['timestamptz']>;
  _gte?: InputMaybe<Scalars['timestamptz']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamptz']>;
  _lte?: InputMaybe<Scalars['timestamptz']>;
  _neq?: InputMaybe<Scalars['timestamptz']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']>;
  _gt?: InputMaybe<Scalars['uuid']>;
  _gte?: InputMaybe<Scalars['uuid']>;
  _in?: InputMaybe<Array<Scalars['uuid']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['uuid']>;
  _lte?: InputMaybe<Scalars['uuid']>;
  _neq?: InputMaybe<Scalars['uuid']>;
  _nin?: InputMaybe<Array<Scalars['uuid']>>;
};
