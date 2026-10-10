CREATE TABLE "tv_episode_watches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"watch_cycle_id" uuid NOT NULL,
	"media_id" integer NOT NULL,
	"media_details_id" uuid,
	"season_number" integer NOT NULL,
	"episode_number" integer NOT NULL,
	"watched_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tv_watch_cycles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"media_item_id" uuid NOT NULL,
	"media_id" integer NOT NULL,
	"cycle_number" integer NOT NULL,
	"finished_at" timestamp (3) with time zone,
	"started_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tv_episode_watches" ADD CONSTRAINT "tv_episode_watches_watch_cycle_id_tv_watch_cycles_id_fk" FOREIGN KEY ("watch_cycle_id") REFERENCES "public"."tv_watch_cycles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tv_episode_watches" ADD CONSTRAINT "tv_episode_watches_media_details_id_media_details_id_fk" FOREIGN KEY ("media_details_id") REFERENCES "public"."media_details"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tv_watch_cycles" ADD CONSTRAINT "tv_watch_cycles_media_item_id_media_items_id_fk" FOREIGN KEY ("media_item_id") REFERENCES "public"."media_items"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "tv_episode_watches_cycle_season_episode_key" ON "tv_episode_watches" USING btree ("watch_cycle_id","season_number","episode_number");--> statement-breakpoint
CREATE INDEX "tv_episode_watches_media_id_idx" ON "tv_episode_watches" USING btree ("media_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tv_watch_cycles_media_item_id_cycle_number_key" ON "tv_watch_cycles" USING btree ("media_item_id","cycle_number");--> statement-breakpoint
CREATE UNIQUE INDEX "tv_watch_cycles_one_active_per_media_item" ON "tv_watch_cycles" USING btree ("media_item_id") WHERE "tv_watch_cycles"."finished_at" is null;--> statement-breakpoint
CREATE INDEX "tv_watch_cycles_media_id_idx" ON "tv_watch_cycles" USING btree ("media_id");--> statement-breakpoint
-- Backfill: create watch cycle #1 for every existing TV media item
INSERT INTO "tv_watch_cycles" ("media_item_id", "media_id", "cycle_number", "started_at")
SELECT mi."id", mi."media_id", 1, mi."created_at"
FROM "media_items" mi
WHERE mi."media_type" = 'tv';--> statement-breakpoint
-- Backfill: mark all episodes up to the last known "tv_progress" position as watched.
-- Rows with the untouched default {"currentSeason": 1, "currentEpisode": 1} are skipped
-- to avoid marking S1E1 as watched for items whose progress was never set.
INSERT INTO "tv_episode_watches" ("watch_cycle_id", "media_id", "media_details_id", "season_number", "episode_number", "watched_at")
SELECT c."id", mi."media_id", mi."media_details_id", (s.value ->> 'seasonNumber')::int, e.episode_number, td."updated_at"
FROM "media_items" mi
JOIN "tracking_data" td ON td."media_item_id" = mi."id"
JOIN "tv_watch_cycles" c ON c."media_item_id" = mi."id" AND c."cycle_number" = 1
JOIN "media_details" md ON md."id" = mi."media_details_id"
CROSS JOIN LATERAL jsonb_array_elements(md."en" -> 'seasons') AS s(value)
CROSS JOIN LATERAL generate_series(1, (s.value ->> 'episodeCount')::int) AS e(episode_number)
WHERE mi."media_type" = 'tv'
	AND td."tv_progress" IS NOT NULL
	AND td."tv_progress" <> '{"currentSeason": 1, "currentEpisode": 1}'::jsonb
	AND (s.value ->> 'seasonNumber')::int >= 1
	AND (
		(s.value ->> 'seasonNumber')::int < (td."tv_progress" ->> 'currentSeason')::int
		OR (
			(s.value ->> 'seasonNumber')::int = (td."tv_progress" ->> 'currentSeason')::int
			AND e.episode_number <= (td."tv_progress" ->> 'currentEpisode')::int
		)
	);--> statement-breakpoint
ALTER TABLE "tracking_data" DROP COLUMN "tv_progress";