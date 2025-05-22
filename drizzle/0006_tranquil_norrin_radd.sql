ALTER TABLE "design_suggestions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "design_suggestions" CASCADE;--> statement-breakpoint
ALTER TABLE "designs" ALTER COLUMN "preferred_pullover_id" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "designs" ALTER COLUMN "preferred_pullover_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ALTER COLUMN "creation_cost" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "images" ALTER COLUMN "creation_cost" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pullovers" ADD COLUMN "color" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "designs" DROP COLUMN "pullover_color";--> statement-breakpoint
ALTER TABLE "designs" DROP COLUMN "pullover_model";--> statement-breakpoint
ALTER TABLE "images" DROP COLUMN "origin";--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN "updated_at";