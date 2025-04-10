-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"age" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "image_to_design" (
	"image_id" bigint NOT NULL,
	"design_id" bigint NOT NULL,
	"position" bigint
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" bigint NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"school" varchar,
	"role_id" bigint
);
--> statement-breakpoint
CREATE TABLE "chat" (
	"id" bigint NOT NULL,
	"content" text,
	"user_id" varchar,
	"last_message_at" timestamp,
	"created_at" bigint,
	"order_id" bigint
);
--> statement-breakpoint
CREATE TABLE "design" (
	"id" bigint NOT NULL,
	"order_id" bigint,
	"customer_id" bigint
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" bigint NOT NULL,
	"chat_id" bigint,
	"sender_id" bigint,
	"content" bigint
);
--> statement-breakpoint
CREATE TABLE "design_suggestion" (
	"id" bigint NOT NULL,
	"chat_id" bigint,
	"design_id" bigint,
	"accepted" bigint,
	"denied" bigint
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" bigint NOT NULL,
	"title" varchar,
	"content" text,
	"user_id" smallint,
	"created_at" timestamp,
	"deadline" timestamp
);
--> statement-breakpoint
CREATE TABLE "image" (
	"id" bigint NOT NULL,
	"creation_at" timestamp NOT NULL,
	"creation_cost" smallint,
	"origin" bigint,
	"generated" boolean,
	"prompt" bigint,
	"user_id" bigint,
	"order_id" bigint
);
--> statement-breakpoint
CREATE TABLE "role" (
	"id" bigint NOT NULL,
	"role_name" varchar NOT NULL,
	"role_power" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "image_to_design" ADD CONSTRAINT "fk_image_to_design_image_id_image_id" FOREIGN KEY ("image_id") REFERENCES "public"."image"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image_to_design" ADD CONSTRAINT "fk_image_to_design_design_id_design_id" FOREIGN KEY ("design_id") REFERENCES "public"."design"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "fk_user_role_id_role_id" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "fk_chat_order_id_order_id" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design" ADD CONSTRAINT "fk_design_order_id_order_id" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design" ADD CONSTRAINT "fk_design_customer_id_user_id" FOREIGN KEY ("customer_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "fk_message_sender_id_user_id" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "fk_message_chat_id_chat_id" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design_suggestion" ADD CONSTRAINT "fk_design_suggestion_design_id_design_id" FOREIGN KEY ("design_id") REFERENCES "public"."design"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design_suggestion" ADD CONSTRAINT "fk_design_suggestion_chat_id_chat_id" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "fk_order_user_id_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image" ADD CONSTRAINT "fk_image_order_id_order_id" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image" ADD CONSTRAINT "fk_image_user_id_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "image_index_1" ON "image" USING btree ("generated" bool_ops);
*/