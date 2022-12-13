<template>
  <v-simple-table v-if="heros">
    <template v-slot:default>
      <thead>
      <tr>
        <th class="text-left">
          Class
        </th>
        <th class="text-left">
          Race
        </th>
        <th class="text-center">
          Name
        </th>
        <th class="text-center">
          Level
        </th>
        <th class="text-center">
          Actions
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="(hero, i) in heros"
        :key="i"
      >
        <td>
          <v-img class="wow_icons" width="44px"
                 :src="heroClasses[hero.class].icon"/>
        </td>
        <td>
          <v-img class="wow_icons" width="44px"
                 :src="heroRaces[hero.race][hero.gender == true ? 1 : 0]"/>
        </td>
        <td :style="{'color': currentSellingHeros.includes(hero.name) ? 'green': 'white'}">
          <v-icon
            color="green"
            v-if="currentSellingHeros.includes(hero.name)">
            mdi-currency-usd
          </v-icon>
          {{hero.name}}
        </td>
        <td>
          {{hero.level}}
        </td>
        <td>
          <v-btn
            @click="changeHeroSelected(hero.name)"
            small
          >
            Select
          </v-btn>
          <v-btn
            @click="changeInspectingHero(hero.name)"
            small
          >
            Inspect
          </v-btn>
        </td>
      </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import {wowDicts} from "@/components/wowDicts";

export default {
  name: "HerosTable",
  props: ['heros', 'currentSellingHeros', 'changeHeroSelected', 'changeInspectingHero'],
  data() {
    return {
      heroClasses: wowDicts.heroClasses,
      heroRaces: wowDicts.heroRaces,

    }
  }
}
</script>

<style scoped>

</style>
