-- Create apiKeyStatus table
CREATE TABLE public."apiKeyStatus"(
  value text NOT NULL
);

ALTER TABLE ONLY public."apiKeyStatus"
  ADD CONSTRAINT "apiKeyStatus_pkey" PRIMARY KEY (value);

INSERT INTO public."apiKeyStatus"(value)
  VALUES ('ACTIVE'), -- The key is active and usable
('DISABLED'), -- The key has been manually disabled
('EXPIRED');

-- The key has expired based on the expiresAt timestamp
COMMENT ON TABLE "public"."apiKeyStatus" IS E'The apiKeyStatus table defines the possible status values for API keys. It ensures data integrity and provides a centralized reference for the status field in the publishableApiKey and secretApiKey tables.';

COMMENT ON COLUMN "public"."apiKeyStatus"."value" IS E'The status value for API keys. It can be "ACTIVE" (default), "DISABLED", or "EXPIRED".';

-- Create apiKeyType table
CREATE TABLE public."apiKeyType"(
  value text NOT NULL
);

ALTER TABLE ONLY public."apiKeyType"
  ADD CONSTRAINT "apiKeyType_pkey" PRIMARY KEY (value);

INSERT INTO public."apiKeyType"(value)
  VALUES ('SHOPIFY'), -- The secret API key is used for Shopify integration
('EXTERNAL');

-- The secret API key is used for external integrations
COMMENT ON TABLE "public"."apiKeyType" IS E'The apiKeyType table defines the possible types of API keys. It ensures data integrity and provides a centralized reference for the type field in the api key tables.';

COMMENT ON COLUMN "public"."apiKeyType"."value" IS E'The type of the API key';

-- Create publishableApiKey table
CREATE TABLE "public"."publishableApiKey"(
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text DEFAULT 'Publishable API Key',
  "apiKey" text NOT NULL,
  "allowlist" text NOT NULL DEFAULT '*',
  "organizerId" text NOT NULL,
  "expiresAt" timestamptz,
  "status" text DEFAULT 'ACTIVE' REFERENCES "public"."apiKeyStatus"("value") ON UPDATE NO ACTION ON DELETE NO ACTION,
  "type" text NOT NULL DEFAULT 'SHOPIFY' REFERENCES "public"."apiKeyType"("value") ON UPDATE NO ACTION ON DELETE NO ACTION,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  UNIQUE ("apiKey")
);

COMMENT ON TABLE "public"."publishableApiKey" IS E'The publishableApiKey table stores the publishable API keys used for querying data from the server externally. It includes fields for management and security, such as an allowlist, expiration timestamp, and status.';

COMMENT ON COLUMN "public"."publishableApiKey"."name" IS E'A user-defined name for the publishable API key, providing a human-readable identifier for the key.';

COMMENT ON COLUMN "public"."publishableApiKey"."apiKey" IS E'The publishable API key used for identification when querying data from the server externally.';

COMMENT ON COLUMN "public"."publishableApiKey"."allowlist" IS E'A comma-separated list of allowed domains or IP addresses that are permitted to use the publishable API key, restricting usage to authorized sources.';

COMMENT ON COLUMN "public"."publishableApiKey"."organizerId" IS E'The unique identifier of the organizer associated with the publishable API key, establishing a link between the key and the organizer it belongs to.';

COMMENT ON COLUMN "public"."publishableApiKey"."expiresAt" IS E'The expiration timestamp for the publishable API key, specifying the validity period after which the key becomes invalid and cannot be used.';

COMMENT ON COLUMN "public"."publishableApiKey"."status" IS E'The current status of the publishable API key, referencing the apiKeyStatus table. It can be "ACTIVE" (default), "DISABLED", or "EXPIRED".';

-- Create trigger to set updated_at column on updates for publishableApiKey
CREATE TRIGGER set_publishableApiKey_updated_at
  BEFORE UPDATE ON "public"."publishableApiKey"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Create secretApiKey table
CREATE TABLE "public"."secretApiKey"(
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text DEFAULT 'Secret API Key',
  "apiKey" text NOT NULL,
  "hashedOriginSecret" text,
  "originSecretSalt" text,
  "encryptedIntegritySecret" text,
  "organizerId" text NOT NULL,
  "allowlist" text NOT NULL DEFAULT '*',
  "expiresAt" timestamptz,
  "status" text DEFAULT 'ACTIVE' REFERENCES "public"."apiKeyStatus"("value") ON UPDATE NO ACTION ON DELETE NO ACTION,
  "type" text NOT NULL DEFAULT 'SHOPIFY' REFERENCES "public"."apiKeyType"("value") ON UPDATE NO ACTION ON DELETE NO ACTION,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  UNIQUE ("apiKey")
);

COMMENT ON TABLE "public"."secretApiKey" IS E'The secretApiKey table stores the secret API keys used for querying sensitive data and performing mutations. It includes additional fields for security and management, such as hashed origin secret, encrypted integrity secret, expiration timestamp, and status.';

COMMENT ON COLUMN "public"."secretApiKey"."name" IS E'A user-defined name for the secret API key, providing a human-readable identifier for the key.';

COMMENT ON COLUMN "public"."secretApiKey"."apiKey" IS E'The secret API key used for authentication and identification when querying sensitive data and performing mutations.';

COMMENT ON COLUMN "public"."secretApiKey"."hashedOriginSecret" IS E'The hashed secret used for verifying the origin of the request. The origin secret is hashed using a secure hashing algorithm and a unique salt before storing it in the database.';

COMMENT ON COLUMN "public"."secretApiKey"."originSecretSalt" IS E'The unique salt value used during the hashing process for the origin secret. It enhances security by making it more difficult to crack the hashed origin secret.';

COMMENT ON COLUMN "public"."secretApiKey"."encryptedIntegritySecret" IS E'The encrypted secret used for verifying the integrity of the request data. The integrity secret is encrypted using a secure encryption algorithm and a salt before storing it in the database.';

COMMENT ON COLUMN "public"."secretApiKey"."organizerId" IS E'The unique identifier of the organizer associated with the secret API key, establishing a link between the key and the organizer it belongs to.';

COMMENT ON COLUMN "public"."secretApiKey"."allowlist" IS E'A comma-separated list of allowed domains or IP addresses that are permitted to use the secret API key, restricting usage to authorized sources.';

COMMENT ON COLUMN "public"."secretApiKey"."expiresAt" IS E'The expiration timestamp for the secret API key, specifying the validity period after which the key becomes invalid and cannot be used.';

COMMENT ON COLUMN "public"."secretApiKey"."status" IS E'The current status of the secret API key, referencing the apiKeyStatus table. It can be "ACTIVE" (default), "DISABLED", or "EXPIRED".';

COMMENT ON COLUMN "public"."secretApiKey"."type" IS E'The type of the secret API key, referencing the apiKeyType table. It determines how the secret is verified and what scope/routes of query are accessible. It can be "SHOPIFY" or "EXTERNAL".';

-- Create trigger to set updated_at column on updates for secretApiKey
CREATE TRIGGER set_secretApiKey_updated_at
  BEFORE UPDATE ON "public"."secretApiKey"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

