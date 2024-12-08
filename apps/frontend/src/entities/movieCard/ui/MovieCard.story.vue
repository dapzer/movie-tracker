<script setup lang="ts">

import MovieCard from "~/entities/movieCard/ui/MovieCard.vue"
import type { TmdbSearchResponseResultItemType } from "@movie-tracker/types"

const movie = {
  "backdrop_path": "/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
  "id": 157336,
  "title": "Интерстеллар",
  "original_title": "Interstellar",
  "overview": "Когда засуха, пыльные бури и вымирание растений приводят человечество к продовольственному кризису, коллектив исследователей и учёных отправляется сквозь червоточину (которая предположительно соединяет области пространства-времени через большое расстояние) в путешествие, чтобы превзойти прежние ограничения для космических путешествий человека и найти планету с подходящими для человечества условиями.",
  "poster_path": "/vReLRjDV9XPhiOSEW7QWow4DXwf.jpg",
  "media_type": "movie",
  "adult": false,
  "original_language": "en",
  "genre_ids": [
    12,
    18,
    878
  ],
  "popularity": 198.403,
  "release_date": "2014-11-05",
  "video": false,
  "vote_average": 8.438,
  "vote_count": 34829,
} satisfies TmdbSearchResponseResultItemType
</script>

<template>
  <Story
    group="entities"
    title="MovieCard"
  >
    <template #default>
      <MovieCard
        :movie="movie"
      />
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
