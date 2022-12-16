<template>
  <v-card width="950" style="padding: 10px;background: transparent;" class="justify-center">
    <v-progress-circular
      :size="100"
      color="primary"
      v-if="!sellingHeros"
      indeterminate>
    </v-progress-circular>
    <v-simple-table
      style="background-color:rgba(0, 0, 0, 0.5);"
      v-if="sellingHeros">
      <template v-slot:default>
        <thead>
        <tr>
          <th class="text-left">
            Class
          </th>
          <th class="text-left">
            Race
          </th>
          <th class="text-left">
            Name
          </th>
          <th class="text-left">
            Level
          </th>
          <th class="text-left">
            Money
          </th>
          <th class="text-left">
            Time
          </th>
          <th class="text-left">
            Kills
          </th>
          <th class="text-left">
            Price
          </th>
          <th class="text-left">
            Actions
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="(hero, i) in sellingHeros"
          :key="i">
          <td>
            <v-img class="wow_icons" width="44px"
                   :src="heroClasses[hero.class].icon"/>
          </td>
          <td>
            <v-img class="wow_icons" width="44px"
                   :src="heroRaces[hero.race][hero.gender == true ? 1 : 0]"/>
          </td>
          <td :style="{'color': $auth.user.username === hero.username ? '#AAD595': 'white'}">
            <v-icon
              color="green"
              v-if="$auth.user.username === hero.username">
              mdi-currency-usd
            </v-icon>
            {{ hero.hero_name }}
          </td>
          <td>
            {{ hero.level }}
          </td>
          <td>
            <v-row>
              <v-img max-width="22px" style="border: 1px solid #F5F5F5;"
                     src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_02.jpg"/>
              {{ Math.floor(hero.money / 10000) }}
            </v-row>
          </td>
          <td>
            <v-row>
              {{
                hero.total_time > 86400 ? `${Math.floor(hero.total_time / 86400)} days` :
                  `${Math.floor(hero.total_time / 3600)} hours`
              }}
            </v-row>
          </td>
          <td>
            {{ hero.total_kills }}
          </td>
          <td>
            <v-select
              :items="hero.price.split('&')"
              v-model="hero.price.split('&')[0]"
              style="max-width: 100px;">
              <template v-slot:selection="{item, index}">
                {{ item.split('-')[0] }}
                <v-divider></v-divider>
                <v-img max-width="24px" :src="require(`~/static/currencies/${item.split('-')[1]}.png`)"/>
              </template>
              <template v-slot:item="{item}">
                {{ item.split('-')[0] }}
                <v-divider></v-divider>
                <v-img max-width="24px" :src="require(`~/static/currencies/${item.split('-')[1]}.png`)"/>
              </template>
            </v-select>
          </td>
          <td>
            <v-row>
              <v-btn
                @click="() => showHeroDialog(hero)"
                x-small>
                Inspect
              </v-btn>
              <v-btn
                :disabled="hero.username === $auth.user.username"
                @click="() => showBuyHeroDialog(hero)"
                x-small>
                Buy
              </v-btn>
            </v-row>
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
import {wowDicts} from '@/components/wowDicts'

export default {
  name: "HerosList",
  props: ['buyDialog', 'showHeroDialog', 'showBuyHeroDialog'],
  mounted() {
    this.$store.dispatch("hero/listForSaleHeros").then(response => {
      this.sellingHeros = response.data.body;
    });
  },
  data() {
    return {
      heroClasses: wowDicts.heroClasses,
      heroRaces: wowDicts.heroRaces,
      sellingHeros: null,
    }
  }
}
</script>

<style scoped>

</style>
