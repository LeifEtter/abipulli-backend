CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"school" varchar,
	"role_id" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"destination_country" varchar,
	"student_amount" integer,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"deadline" timestamp,
	"school_name" varchar,
	"motto" varchar
);
--> statement-breakpoint
CREATE TABLE "designs" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"customer_id" integer NOT NULL,
	"pullover_color" varchar,
	"pullover_model" varchar,
	"design_cost" integer,
	"preferred_pullover_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"assigned_admin_id" integer,
	"last_message_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"order_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "design_suggestions" (
	"id" serial PRIMARY KEY NOT NULL,
	"chat_id" integer NOT NULL,
	"design_id" integer NOT NULL,
	"accepted" boolean DEFAULT false,
	"denied" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"creation_cost" smallint,
	"origin" varchar,
	"generated" boolean DEFAULT false,
	"prompt" text,
	"user_id" integer,
	"message_id" integer
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"chat_id" integer NOT NULL,
	"sender_id" integer NOT NULL,
	"content" text,
	"design_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "prompts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"content" varchar NOT NULL,
	"purpose" varchar
);
--> statement-breakpoint
CREATE TABLE "text_elements" (
	"id" serial PRIMARY KEY NOT NULL,
	"design_id" integer,
	"content" varchar NOT NULL,
	"font" varchar,
	"position_x" real,
	"position_y" real
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_name" varchar NOT NULL,
	"role_power" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pullovers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar NOT NULL,
	"base_price" integer NOT NULL,
	"image_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "design" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "design_suggestion" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "image" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "message" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "order" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "role" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "chat" CASCADE;--> statement-breakpoint
DROP TABLE "design" CASCADE;--> statement-breakpoint
DROP TABLE "design_suggestion" CASCADE;--> statement-breakpoint
DROP TABLE "image" CASCADE;--> statement-breakpoint
DROP TABLE "message" CASCADE;--> statement-breakpoint
DROP TABLE "order" CASCADE;--> statement-breakpoint
DROP TABLE "role" CASCADE;--> statement-breakpoint
DROP TABLE "user" CASCADE;--> statement-breakpoint
ALTER TABLE "image_to_design" DROP CONSTRAINT "fk_image_to_design_image";
--> statement-breakpoint
ALTER TABLE "image_to_design" DROP CONSTRAINT "fk_image_to_design_design";
--> statement-breakpoint
ALTER TABLE "image_to_design" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "fk_user_role" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "fk_order_user_id_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "designs" ADD CONSTRAINT "fk_designs_orders" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "designs" ADD CONSTRAINT "fk_design_customer" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "designs" ADD CONSTRAINT "fk_design_preferred_pullover" FOREIGN KEY ("preferred_pullover_id") REFERENCES "public"."pullovers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "fk_chats_orders" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "fk_chats_users" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design_suggestions" ADD CONSTRAINT "fk_design_suggestion_design" FOREIGN KEY ("design_id") REFERENCES "public"."designs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design_suggestions" ADD CONSTRAINT "fk_design_suggestion_chat" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "fk_image_user" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "fk_message_sender_id_user_id" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "fk_message_chat_id_chat_id" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "fk_message_design_id_design_id" FOREIGN KEY ("design_id") REFERENCES "public"."designs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_elements" ADD CONSTRAINT "fk_text_element_design" FOREIGN KEY ("design_id") REFERENCES "public"."designs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pullovers" ADD CONSTRAINT "fk_pullover_image" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "image_index_1" ON "images" USING btree ("generated" bool_ops);--> statement-breakpoint
ALTER TABLE "image_to_design" ADD CONSTRAINT "fk_image_to_design_image" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image_to_design" ADD CONSTRAINT "fk_image_to_design_design" FOREIGN KEY ("design_id") REFERENCES "public"."designs"("id") ON DELETE no action ON UPDATE no action;