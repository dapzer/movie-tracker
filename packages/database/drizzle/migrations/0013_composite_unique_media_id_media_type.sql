ALTER TABLE "media_details" DROP CONSTRAINT "media_details_media_id_unique";--> statement-breakpoint
DROP INDEX "media_items_media_id_media_list_id_key";--> statement-breakpoint
DROP INDEX "release_subscriptions_media_id_user_id_key";--> statement-breakpoint
CREATE UNIQUE INDEX "media_details_media_id_media_type_key" ON "media_details" USING btree ("media_id","media_type");--> statement-breakpoint
CREATE UNIQUE INDEX "media_items_media_id_media_type_media_list_id_key" ON "media_items" USING btree ("media_id","media_type","media_list_id");--> statement-breakpoint
CREATE UNIQUE INDEX "release_subscriptions_media_id_media_type_user_id_key" ON "release_subscriptions" USING btree ("media_id","media_type","user_id");