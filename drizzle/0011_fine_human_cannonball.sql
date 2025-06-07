ALTER TABLE "chats" ALTER COLUMN "order_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "image_to_design" ALTER COLUMN "x_position" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "image_to_design" ALTER COLUMN "x_position" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "image_to_design" ALTER COLUMN "y_position" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "image_to_design" ALTER COLUMN "y_position" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "image_to_design" ADD COLUMN "x_scale" real DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "image_to_design" ADD COLUMN "y_scale" real DEFAULT 1 NOT NULL;