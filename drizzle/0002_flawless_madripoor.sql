ALTER TABLE "pullovers" DROP CONSTRAINT "fk_pullover_image";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "birthdate" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pullovers" ADD COLUMN "front_image_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "pullovers" ADD COLUMN "back_image_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "pullovers" ADD CONSTRAINT "fk_pullover_front_image" FOREIGN KEY ("front_image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pullovers" ADD CONSTRAINT "fk_pullover_back_image" FOREIGN KEY ("back_image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pullovers" DROP COLUMN "image_id";