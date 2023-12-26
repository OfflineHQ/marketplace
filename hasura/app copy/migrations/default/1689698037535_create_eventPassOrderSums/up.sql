CREATE TABLE "public"."eventPassOrderSums" (
	"eventPassId" text NOT NULL,
	"totalReserved" integer NOT NULL DEFAULT 0,
	"totalSold" integer NOT NULL DEFAULT 0,
	PRIMARY KEY ("eventPassId"),
	UNIQUE ("eventPassId")
);
COMMENT ON TABLE "public"."eventPassOrderSums" IS E'Hold the sums for the Event Pass Orders';