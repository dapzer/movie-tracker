UPDATE tracking_data td
SET tv_progress = jsonb_set(
  td.tv_progress,
  '{currentSeason}',
  to_jsonb((td.tv_progress->>'currentSeason')::int + 1)
)
FROM media_items mi
JOIN media_details md ON md.id = mi.media_details_id
WHERE td.media_item_id = mi.id
  AND mi.media_type = 'tv'
  AND COALESCE(md.en->'seasons'->0->>'seasonNumber', '1') <> '0';
