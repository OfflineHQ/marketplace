-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- -- Create contentSpaceStatus table
-- CREATE TABLE public."contentSpaceStatus"(
--   value text NOT NULL
-- );
--
-- ALTER TABLE ONLY public."contentSpaceStatus"
--   ADD CONSTRAINT "contentSpaceStatus_pkey" PRIMARY KEY (value);
--
-- INSERT INTO public."contentSpaceStatus"(value)
--   VALUES ('DRAFT'),
-- ('PUBLISHED');
--
-- -- Create contentSpaceParameters table
-- CREATE TABLE "public"."contentSpaceParameters" (
--   "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   "contentSpaceId" text NOT NULL UNIQUE,
--   "status" text DEFAULT 'DRAFT' REFERENCES "public"."contentSpaceStatus"("value") ON UPDATE NO action ON DELETE NO action,
--   "created_at" timestamptz NOT NULL DEFAULT now(),
--   "updated_at" timestamptz NOT NULL DEFAULT now(),
--   "organizerId" text NOT NULL
-- );
--
-- COMMENT ON TABLE "public"."contentSpaceParameters" IS E'The contentSpaceParameters model is designed to define properties specifically for content spaces. This table includes essential details like the contentSpaceId, which links to the specific content space. By centralizing this information, our system can effectively manage and control parameters tied to each content space, enhancing functionality and flexibility.';
--
-- COMMENT ON COLUMN "public"."contentSpaceParameters"."contentSpaceId" IS E'It stores the identifier for the content space. This ID is crucial for managing and linking specific parameters to each content space, ensuring accurate and efficient handling of content space-related data.';
--
-- -- Create trigger for contentSpaceParameters
-- CREATE TRIGGER set_contentSpaceParameters_updated_at
--   BEFORE UPDATE ON "public"."contentSpaceParameters"
--   FOR EACH ROW
--   EXECUTE FUNCTION public.set_current_timestamp_updated_at();
