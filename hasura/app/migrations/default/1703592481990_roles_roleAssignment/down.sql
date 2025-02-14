-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- -- Create the roles table to store different user roles
-- CREATE TABLE "public"."roles"(
--   "value" text NOT NULL,
--   PRIMARY KEY ("value")
-- );
--
-- COMMENT ON TABLE "public"."roles" IS 'Stores user roles defining access levels and permissions within the Offline platform.';
--
-- -- Insert default roles into the roles table
-- INSERT INTO "public"."roles"("value")
--   VALUES ('organizer_super_admin'),
-- ('organizer_admin'),
-- ('organizer_operations_manager'),
-- ('organizer_finance_manager'),
-- ('organizer_content_manager'),
-- ('organizer_validator'),
-- ('organizer_auditor'),
-- ('organizer_guest'),
-- ('organizer_human_resources');
--
-- -- Add comments to describe each role
-- COMMENT ON COLUMN "public"."roles"."value" IS 'The name of the role for access control.';
--
-- COMMENT ON CONSTRAINT "roles_pkey" ON "public"."roles" IS 'Primary key constraint ensuring unique values for roles.';
--
-- -- Comments describing individual roles
-- COMMENT ON COLUMN "public"."roles"."value" IS $$
--     organizer_super_admin: Full Read & Write permissions on web2 and web3 components. Can assign roles and access system configurations.
--     organizer_admin: Full Read & Write permissions on web2 and web3 components.
--     organizer_operations_manager: Read & Write access to web2 components. Handles event setup, monitoring, analytics, etc.
--     organizer_finance_manager: Read & Write access to web3 components. Manages fund transfers, balance checks, and transaction approvals within limits.
--     organizer_content_manager: Read & Write access to web2 components. Manages content creation, editing, media uploads, and metadata modifications.
--     organizer_validator: Read & Write access on web2 and web3. Updates NFT traits and validates tickets and exclusive access during events.
--     organizer_auditor: Read-only access on web2 and web3. Conducts compliance checks and reviews transactions and operations.
--     organizer_guest: Limited access to web2. Can view public content without web3 permissions.
--     organizer_human_resources: Administrative permissions. Can invite new members for the organization and assign roles (except super admin and human resources).
-- $$;
--
-- -- Migration script for roleAssignment
-- CREATE TABLE "public"."roleAssignment"(
--   id uuid DEFAULT gen_random_uuid() NOT NULL,
--   "accountId" uuid REFERENCES account(id) NOT NULL,
--   "invitedById" uuid REFERENCES account(id) NOT NULL,
--   role text REFERENCES roles("value") NOT NULL, -- use the role value enum from roles column
--   "organizerId" text NOT NULL,
--   "eventId" text NOT NULL DEFAULT '',
--   created_at timestamptz NOT NULL DEFAULT now(),
--   CONSTRAINT unique_role_assignment UNIQUE ("accountId", ROLE, "organizerId", "eventId")
-- );
--
-- -- Comment explaining the purpose of the table and its design
-- COMMENT ON TABLE "public"."roleAssignment" IS 'Table to assign roles to accounts, allowing a many-to-many relationship. Each account can have multiple roles and each role can be assigned to multiple accounts. This is part of the RBAC system integration.';
--
-- SELECT
--   audit.audit_table('"roleAssignment"', TRUE, -- audit_rows: Record each row change
--     TRUE -- audit_query_text: Record the SQL text
-- );
