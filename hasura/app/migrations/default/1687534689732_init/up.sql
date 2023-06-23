SET check_function_bodies = false;
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.account (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    address text NOT NULL,
    email text,
    "emailVerified" boolean DEFAULT false NOT NULL,
    "isOrganizer" boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    "organizerId" text
);
COMMENT ON TABLE public.account IS 'An account can represent an user or organizer. It store essential informations and is used as the root class for relationships with other tables';
CREATE TABLE public."orderStatusEnum" (
    value text NOT NULL
);
ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_address_key UNIQUE (address);
ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public."orderStatusEnum"
    ADD CONSTRAINT "orderStatusEnum_pkey" PRIMARY KEY (value);
CREATE TRIGGER set_public_account_updated_at BEFORE UPDATE ON public.account FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_account_updated_at ON public.account IS 'trigger to set value of column "updated_at" to current timestamp on row update';
