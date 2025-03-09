<script setup lang="ts">
import EpisodeCard from "~/entities/episodeCard/ui/EpisodeCard.vue"
import EpisodeCardHorizontal from "~/entities/episodeCard/ui/EpisodeCardHorizontal.vue"
import { getPlaceholderImageUrl } from "~/utils/getPlaceholderImageUrl"

const episode = {
  air_date: "2013-12-02",
  episode_number: 1,
  episode_type: "standard",
  id: 973400,
  name: "Pilot",
  overview: "Rick moves in with his daughter's family and establishes himself as a bad influence on his grandson, Morty.",
  production_code: "RAM100",
  runtime: 22,
  season_number: 1,
  show_id: 60625,
  still_path: "/oWaKdUeMOlVZem3v9DWsdDGlTuY.jpg",
  vote_average: 7.575,
  vote_count: 332,
  crew: [
    {
      job: "Writer",
      department: "Writing",
      credit_id: "5b564d119251416dd102384d",
      adult: false,
      gender: 2,
      id: 57194,
      known_for_department: "Writing",
      name: "Dan Harmon",
      original_name: "Dan Harmon",
      popularity: 7.98,
      profile_path: "/gDwFosoyPTd0pmnKParzGj3kaMg.jpg",
    },
    {
      job: "Director",
      department: "Directing",
      credit_id: "5bccb0c40e0a26015b00cf7c",
      adult: false,
      gender: 2,
      id: 1245733,
      known_for_department: "Acting",
      name: "Justin Roiland",
      original_name: "Justin Roiland",
      popularity: 11.025,
      profile_path: "/wYApP38aXe6ZcEtlBAfNRxJTQQi.jpg",
    },
  ],
  guest_stars: [
    {
      character: "Jessica / Rick's Computer / Customs Announcement (voice)",
      credit_id: "5bccb5e7c3a368285e00d686",
      order: 5,
      adult: false,
      gender: 1,
      id: 116315,
      known_for_department: "Acting",
      name: "Kari Wahlgren",
      original_name: "Kari Wahlgren",
      popularity: 11.448,
      profile_path: "/9phhl0oubAKt8D50xLGAb81KPSb.jpg",
    },
    {
      character: "Frank Palicky / Tom (voice)",
      credit_id: "5bccb5db925141612600c659",
      order: 515,
      adult: false,
      gender: 2,
      id: 1365425,
      known_for_department: "Acting",
      name: "Ryan Ridley",
      original_name: "Ryan Ridley",
      popularity: 3.569,
      profile_path: "/mSFssRpQl6ax2QrYTxBBfluVgy2.jpg",
    },
    {
      character: "Davin / Red Alien / Gromflomite Guard (voice)",
      credit_id: "5bccba14c3a368286d00f2c0",
      order: 516,
      adult: false,
      gender: 2,
      id: 57194,
      known_for_department: "Writing",
      name: "Dan Harmon",
      original_name: "Dan Harmon",
      popularity: 7.98,
      profile_path: "/gDwFosoyPTd0pmnKParzGj3kaMg.jpg",
    },
    {
      character: "Greebybobe / Green Alien / Blob Alien (voice)",
      credit_id: "5e941243ccb15f061c6f8edb",
      order: 557,
      adult: false,
      gender: 2,
      id: 1245733,
      known_for_department: "Acting",
      name: "Justin Roiland",
      original_name: "Justin Roiland",
      popularity: 11.025,
      profile_path: "/wYApP38aXe6ZcEtlBAfNRxJTQQi.jpg",
    },
    {
      character: "Customs Gromflomite / Glen the Gromflomite (voice)",
      credit_id: "5e9412648e87020013cda782",
      order: 558,
      adult: false,
      gender: 2,
      id: 89599,
      known_for_department: "Acting",
      name: "Eric Bauza",
      original_name: "Eric Bauza",
      popularity: 12.611,
      profile_path: "/afOlsVPQxbtkom604MeCemjlwEV.jpg",
    },
    {
      character: "Mr. Goldenfold (voice)",
      credit_id: "5bdc0f4b925141783a0081ca",
      order: 723,
      adult: false,
      gender: 2,
      id: 167411,
      known_for_department: "Acting",
      name: "Brandon Johnson",
      original_name: "Brandon Johnson",
      popularity: 3.765,
      profile_path: "/4hPvsVP7uDBHDgj7JikIY3Wop18.jpg",
    },
    {
      character: "Principal Gene Vagina (voice)",
      credit_id: "60a5f53021621d005a4e914e",
      order: 731,
      adult: false,
      gender: 2,
      id: 181234,
      known_for_department: "Acting",
      name: "Phil Hendrie",
      original_name: "Phil Hendrie",
      popularity: 2.842,
      profile_path: "/qKqWLCGboTHTFuLIlFsGstnY59f.jpg",
    },
  ],
}
</script>

<template>
  <Story
    group="entities"
    title="EpisodeCard"
  >
    <template #default>
      <Variant title="Default">
        <EpisodeCard
          title="Episode name"
          :season="1"
          :episode="1"
          description="Rick and Morty"
          :image-src="getPlaceholderImageUrl(250, 157)"
        />
      </Variant>
      <Variant title="Horizontal">
        <EpisodeCardHorizontal
          :episode="episode"
        />
      </Variant>
    </template>
  </Story>
</template>

<style module lang="scss">

</style>
