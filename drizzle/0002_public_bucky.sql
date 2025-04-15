ALTER TABLE "image" RENAME COLUMN "creation_at" TO "created_at";--> statement-breakpoint
ALTER TABLE "chat" DROP CONSTRAINT "fk_chat_user";
--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "fk_chat_user" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;