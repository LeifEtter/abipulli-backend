ALTER TABLE "images" ADD COLUMN "file_env" varchar DEFAULT 'production' NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "image_width" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "image_height" integer NOT NULL;