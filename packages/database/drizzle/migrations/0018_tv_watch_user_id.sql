DROP INDEX "tv_episode_watches_media_id_idx";--> statement-breakpoint
DROP INDEX "tv_watch_cycles_media_id_idx";--> statement-breakpoint
ALTER TABLE "tv_episode_watches" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "tv_watch_cycles" ADD COLUMN "user_id" uuid;--> statement-breakpoint
-- Backfill: copy owner user id from the media item's media list
UPDATE "tv_watch_cycles" c
SET "user_id" = ml."user_id"
FROM "media_items" mi
JOIN "media_lists" ml ON ml."id" = mi."media_list_id"
WHERE mi."id" = c."media_item_id";--> statement-breakpoint
UPDATE "tv_episode_watches" w
SET "user_id" = c."user_id"
FROM "tv_watch_cycles" c
WHERE c."id" = w."watch_cycle_id";--> statement-breakpoint
ALTER TABLE "tv_episode_watches" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tv_watch_cycles" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tv_episode_watches" ADD CONSTRAINT "tv_episode_watches_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tv_watch_cycles" ADD CONSTRAINT "tv_watch_cycles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "tv_episode_watches_user_id_media_id_idx" ON "tv_episode_watches" USING btree ("user_id","media_id");--> statement-breakpoint
CREATE INDEX "tv_watch_cycles_user_id_media_id_idx" ON "tv_watch_cycles" USING btree ("user_id","media_id");
