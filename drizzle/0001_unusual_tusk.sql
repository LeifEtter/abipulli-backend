ALTER TABLE "orders" ALTER COLUMN "school_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "gender" varchar DEFAULT 'divers' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "mobile_country_code" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "mobile_number" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "birthdate" timestamp;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "school_country_code" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "school_city" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "graduation_year" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "current_grade" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "school";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "destination_country";