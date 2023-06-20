SET check_function_bodies = false;
CREATE TABLE public."user" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    address text NOT NULL,
    email text,
    "emailVerified" boolean DEFAULT false NOT NULL
);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_address_key UNIQUE (address);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
