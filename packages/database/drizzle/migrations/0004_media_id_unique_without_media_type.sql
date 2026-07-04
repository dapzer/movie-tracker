DROP INDEX "media_details_media_id_media_type_key";--> statement-breakpoint
DROP INDEX "media_items_media_id_media_type_media_list_id_key";--> statement-breakpoint
CREATE UNIQUE INDEX "media_items_media_id_media_list_id_key" ON "media_items" USING btree ("media_id","media_list_id");--> statement-breakpoint
ALTER TABLE "media_details" ADD CONSTRAINT "media_details_media_id_unique" UNIQUE("media_id");