ALTER TABLE "image_to_design" DROP CONSTRAINT "fk_image_to_design_image";
--> statement-breakpoint
ALTER TABLE "image_to_design" DROP CONSTRAINT "fk_image_to_design_design";
--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "fk_message_sender_id_user_id";
--> statement-breakpoint
ALTER TABLE "pullovers" DROP CONSTRAINT "fk_pullover_image";
--> statement-breakpoint
ALTER TABLE "prompts" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "image_to_design" ADD CONSTRAINT "fk_image_to_design_image" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image_to_design" ADD CONSTRAINT "fk_image_to_design_design" FOREIGN KEY ("design_id") REFERENCES "public"."designs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "fk_message_sender_id_user_id" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompts" ADD CONSTRAINT "fk_prompt_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pullovers" ADD CONSTRAINT "fk_pullover_image" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;