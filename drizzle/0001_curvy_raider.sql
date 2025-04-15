ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "image_to_design" RENAME COLUMN "position" TO "x_position";--> statement-breakpoint
ALTER TABLE "image_to_design" DROP CONSTRAINT "fk_image_to_design_image_id_image_id";
--> statement-breakpoint
ALTER TABLE "image_to_design" DROP CONSTRAINT "fk_image_to_design_design_id_design_id";
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "fk_user_role_id_role_id";
--> statement-breakpoint
ALTER TABLE "chat" DROP CONSTRAINT "fk_chat_order_id_order_id";
--> statement-breakpoint
ALTER TABLE "design" DROP CONSTRAINT "fk_design_order_id_order_id";
--> statement-breakpoint
ALTER TABLE "design" DROP CONSTRAINT "fk_design_customer_id_user_id";
--> statement-breakpoint
ALTER TABLE "design_suggestion" DROP CONSTRAINT "fk_design_suggestion_design_id_design_id";
--> statement-breakpoint
ALTER TABLE "design_suggestion" DROP CONSTRAINT "fk_design_suggestion_chat_id_chat_id";
--> statement-breakpoint
ALTER TABLE "image" DROP CONSTRAINT "fk_image_order_id_order_id";
--> statement-breakpoint
ALTER TABLE "image" DROP CONSTRAINT "fk_image_user_id_user_id";
--> statement-breakpoint
ALTER TABLE "image_to_design" ALTER COLUMN "image_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "image_to_design" ALTER COLUMN "design_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "user" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role_id" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "chat" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "chat" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "chat" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "chat" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "chat" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "chat" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "chat" ALTER COLUMN "order_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "chat" ALTER COLUMN "order_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "design" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "design" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "design" ALTER COLUMN "order_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "design" ALTER COLUMN "order_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "design" ALTER COLUMN "customer_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "design" ALTER COLUMN "customer_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "message" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "chat_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "chat_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "sender_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "sender_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "content" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "design_suggestion" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "design_suggestion" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "design_suggestion" ALTER COLUMN "chat_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "design_suggestion" ALTER COLUMN "chat_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "design_suggestion" ALTER COLUMN "design_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "design_suggestion" ALTER COLUMN "design_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "design_suggestion" ALTER COLUMN "accepted" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "design_suggestion" ALTER COLUMN "accepted" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "design_suggestion" ALTER COLUMN "denied" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "design_suggestion" ALTER COLUMN "denied" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "order" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "image" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "image" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "image" ALTER COLUMN "origin" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "image" ALTER COLUMN "generated" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "image" ALTER COLUMN "prompt" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "image" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "image" ALTER COLUMN "order_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "image" ALTER COLUMN "order_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "role" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "role" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "role" ALTER COLUMN "role_power" SET DATA TYPE smallint;--> statement-breakpoint
ALTER TABLE "image_to_design" ADD COLUMN "y_position" integer;--> statement-breakpoint
ALTER TABLE "image_to_design" ADD CONSTRAINT "fk_image_to_design_image" FOREIGN KEY ("image_id") REFERENCES "public"."image"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image_to_design" ADD CONSTRAINT "fk_image_to_design_design" FOREIGN KEY ("design_id") REFERENCES "public"."design"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "fk_user_role" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "fk_chat_order" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "fk_chat_user" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design" ADD CONSTRAINT "fk_design_order" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design" ADD CONSTRAINT "fk_design_customer" FOREIGN KEY ("customer_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design_suggestion" ADD CONSTRAINT "fk_design_suggestion_design" FOREIGN KEY ("design_id") REFERENCES "public"."design"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design_suggestion" ADD CONSTRAINT "fk_design_suggestion_chat" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image" ADD CONSTRAINT "fk_image_order" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image" ADD CONSTRAINT "fk_image_user" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" DROP COLUMN "content";