CREATE TABLE "public"."eventParameters" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "eventId" text NOT NULL,
    "activityWebhookId" text NOT NULL,
    PRIMARY KEY ("id"),
    UNIQUE ("activityWebhookId"),
    UNIQUE ("eventId")
);

COMMENT ON TABLE "public"."eventParameters" IS E'The eventParameters model is designed to define properties on an event involving all event passes. This table includes critical details like the eventId and activityWebhookId, which aids in monitoring and processing events or changes related to the event parameters. By centralizing this information, our system can effectively manage and control parameters tied to specific events, enhancing the overall functionality and flexibility of event handling.';
