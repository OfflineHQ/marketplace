SET check_function_bodies = false;
CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    address text NOT NULL,
    email text NOT NULL,
    "emailVerified" boolean DEFAULT false NOT NULL
);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_address_key UNIQUE (address);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
