<template>
  <v-row justify="end" align="center" style="margin-top: 10px;">
    <HeroDialog :dialog="dialog" :hero-name="inpsectingHeroName" v-on:close-func="closeDialog"
                :note="note"></HeroDialog>

    <v-dialog
      v-if="buyDialog"
      v-model="buyDialog"
      transition="dialog-bottom-transition"
      width="500"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-1">You are buying {{buyingHero.hero_name}}</v-card-title>
        <v-card-text>
          <v-row justify="center" style="margin-top: 30px; margin-bottom: 10px;">
            <h4>{{Math.floor(buyingHero.money / 10000)}}</h4>
            <v-img max-width="22px" style="border: 1px solid #F5F5F5;"
                   src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_02.jpg"/>
          </v-row>
          <v-row justify="center" style="margin-bottom: 40px">
            <v-img class="wow_icons" max-width="70px"
                   :src="heroRaces[buyingHero.race][buyingHero.gender == true ? 1 : 0]"/>
            <v-img class="wow_icons" max-width="70px"
                   :src="heroClasses[buyingHero.class].icon"/>
          </v-row>
          <v-divider></v-divider>
          <h3>Please select the currency you want to pay with:</h3>
          <v-select
            :items="buyingHero.price.split('&')"
            v-model="selectedCurrency"
          >
            <template v-slot:selection="{item, index}">
              {{item.split('-')[0]}}
              <v-divider></v-divider>
              <v-img max-width="24px" :src="require(`~/static/currencies/${item.split('-')[1]}.png`)"/>
            </template>
            <template v-slot:item="{item}">
              {{item.split('-')[0]}}
              <v-divider></v-divider>
              <v-img max-width="24px" :src="require(`~/static/currencies/${item.split('-')[1]}.png`)"/>
            </template>
          </v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="white"
            text
            @click="buyHero"
          >
            Buy
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
              {{hero.hero_name}}
            </td>
            <td>
              {{hero.level}}
            </td>
            <td>
              <v-row>
                <v-img max-width="22px" style="border: 1px solid #F5F5F5;"
                       src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_02.jpg"/>
                {{Math.floor(hero.money / 10000)}}
              </v-row>
            </td>
            <td>
              <v-row>
                {{hero.total_time > 86400 ? `${Math.floor(hero.total_time / 86400)} days` :
                `${Math.floor(hero.total_time / 3600)} hours`}}
              </v-row>
            </td>
            <td>
              {{hero.total_kills}}
            </td>
            <td>
              <v-select
                :items="hero.price.split('&')"
                v-model="hero.price.split('&')[0]"
                style="max-width: 100px;">
                <template v-slot:selection="{item, index}">
                  {{item.split('-')[0]}}
                  <v-divider></v-divider>
                  <v-img max-width="24px" :src="require(`~/static/currencies/${item.split('-')[1]}.png`)"/>
                </template>
                <template v-slot:item="{item}">
                  {{item.split('-')[0]}}
                  <v-divider></v-divider>
                  <v-img max-width="24px" :src="require(`~/static/currencies/${item.split('-')[1]}.png`)"/>
                </template>
              </v-select>
            </td>
            <td>
              <v-row>
                <v-btn
                  @click="() => {inpsectingHeroName = hero.hero_name; note = hero.note; dialog = true;}"
                  x-small>
                  Inspect
                </v-btn>
                <v-btn
                  :disabled="hero.username === $auth.user.username"
                  @click="() => {buyDialog = true; buyingHero = hero}"
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
    <v-snackbar
      v-model="snackbar">
      {{snackbarText}}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="red"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>

<script>
    import {wowDicts} from '../components/wowDicts'

    export default {
        name: "buy_hero",
        middleware: 'auth',
        mounted() {
            console.log(this.$auth.user.username);
            this.$axios.get("/wow/selling_heros").then(response => {
                this.sellingHeros = response.data.body;
            });
        },
        methods: {
            closeDialog() {
                this.dialog = false;
            },
            buyHero() {
              if (this.selectedCurrency === null) {
                  this.snackbarText = "Select a payment currency";
                  this.snackbar = true;
                  return
              }
              this.$axios.post("/wow/buy_hero", JSON.stringify({selected_currency: this.selectedCurrency.split('-')[1],
              hero_info: this.buyingHero})).then(response => {
                  this.snackbarText = response.data.body;
                  this.snackbar = true;
                  this.buyDialog = false;
              })
            }
        },
        data() {
            return ({
                heroClasses: wowDicts.heroClasses,
                heroRaces: wowDicts.heroRaces,
                sellingHeros: null,
                dialog: false,
                inpsectingHeroName: "",
                buyDialog: false,
                buyingHero: null,
                selectedCurrency: null,
                snackbar: false,
                snackbarText: ""
            })
        }
    }
</script>

<style scoped>
  .wow_icons {
    border: 1px solid #F5F5F5;
  }
</style>
