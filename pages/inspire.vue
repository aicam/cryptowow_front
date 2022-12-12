<template>
  <v-row justify="end" align="center">

    <!-- None display -->
    <SellHeroDialog :sellingDialog="sellingDialog"
                    :heroSelectedName="heroSelectedName"
                    :currencies="currencies"
                    :pushNewHero="(hero) => currentSellingHeros.push(hero)"
                    :snackbarAction="(txt) => {snackbar = true; snackbarText = txt}"
                    v-on:close="() => {sellingDialog = false}"
    />
    <HeroDialog :dialog="dialog" :hero-name="inpsectingHeroName" v-on:close-func="closeHeroDialog"/>

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

    <v-col md="3">
      <v-card style="padding: 25px">
        <v-row justify="space-around">
          <v-tooltip bottom max-width="200px">
            <template v-slot:activator="{on, attrs}">
              <v-icon v-on="on" v-bind="attrs" large color="blue">mdi-help-circle</v-icon>
            </template>
            <p style="color: black;font-size: 15px;font-weight: bold">Here you can find amount of each currencies you
              have earned. You see the list of available
              currencies at the moments. We are doing our best to add more currencies as soon as possible.
              CWT is CryptoWow Token that can be used only in the game and can not be cashed.</p>
          </v-tooltip>
          <h2>Cryptocurrencies</h2>
        </v-row>
        <v-row
          v-for="(wallet, i) in wallets"
          :key="i"
          justify="space-between"
        >
          <h3>{{wallet.currency_id}}</h3>
          <h3>{{wallet.amount.toFixed(6)}}</h3>
        </v-row>
      </v-card>
    </v-col>
    <v-col md="6">
      <v-card class="text-center align-center justify-space-around" style="margin-top: 20px;padding: 20px">
        <!--    <WoWTooltip text="hello" ><v-img class="tooltip" src="https://wow.zamimg.com/images/wow/icons/large/inv_hand_1h_mawraid_d_01.jpg" max-width="60px" /></WoWTooltip>-->
        <h1>Heros</h1>
        <h4 v-if="!heros">You have no heros, go to game with your username and create one</h4>
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
                  @click="heroSelectedName = hero.name"
                  small
                >
                  Select
                </v-btn>
                <v-btn
                  @click="() => {inpsectingHeroName = hero.name; dialog = true;}"
                  small
                >
                  Inspect
                </v-btn>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>

        <!-- Gifts section -->
        <h1>Active Gifts</h1>
        <h3 v-if="!activeGifts.length">You have no active gift currently</h3>
        <v-alert
          v-if="activeGifts.length"
          v-for="(gift, i) in activeGifts"
          :key="i"
          border="top"
          color="blue-grey"
          dark
        >
          <v-row justify="space-around" style="margin-top: 1px;">
            <v-icon large color="#D013C5">mdi-gift</v-icon>
            <h3>{{gift.title}}</h3>
            <v-tooltip bottom max-width="200px">
              <template v-slot:activator="{on, attrs}">
                <v-icon v-on="on" v-bind="attrs" large color="red">mdi-help-circle</v-icon>
              </template>
              <p style="color: black;font-size: 15px;font-weight: bold">{{gift.description}}</p>
            </v-tooltip>
            <h4>{{gift.condition}}</h4>
          </v-row>
        </v-alert>
        <h1>Used Gifts</h1>
        <h3 v-if="!usedGifts.length">You have no used gift currently</h3>
        <v-alert
          v-if="usedGifts.length"
          v-for="(gift, i) in usedGifts"
          :key="i"
          border="top"
          color="green"
          dark
        >
          <v-row justify="space-around" style="margin-top: 1px;">
            <v-icon large color="#D013C5">mdi-gift</v-icon>
            <h3>{{gift.title}}</h3>
            <v-tooltip bottom max-width="200px">
              <template v-slot:activator="{on, attrs}">
                <v-icon v-on="on" v-bind="attrs" large color="red">mdi-help-circle</v-icon>
              </template>
              <p style="color: black;font-size: 15px;font-weight: bold">{{`Gift used for ${gift.used_hero_name}`}}</p>
            </v-tooltip>
            <h4>{{gift.condition}}</h4>
          </v-row>
        </v-alert>
        <!--    <a rel="item=28288">asd</a>-->

        <!-- /Gifts section -->
      </v-card>
    </v-col>
    <v-col md="3">
      <v-card class="text-center" style="margin-top: 20px;padding: 30px">
        <h1>Options</h1>
        <v-divider></v-divider>
        <v-btn
          class="warning"
          @click="restoreHero"
        >
          <v-icon>mdi-restore-alert</v-icon>
          Restore {{heroSelectedName}}
        </v-btn>
        <v-divider></v-divider>
        <v-btn
          class="success"
          @click="sellHero"
        >
          <v-icon>mdi-currency-usd</v-icon>
          Sell {{heroSelectedName}}
        </v-btn>
        <v-divider></v-divider>
        <v-btn
          class="success"
          @click="cancelSellingHero"
        >
          <v-icon>mdi-currency-usd-off</v-icon>
          Cancel Selling {{heroSelectedName}}
        </v-btn>
        <v-row justify="center" style="margin: 10px">
          <v-icon>mdi-gift-outline</v-icon>
          <h1 style="margin-left: 10px;"> Gifts</h1>
        </v-row>
        <h3 v-if="!activeGifts">No gifts</h3>
        <v-btn
          v-if="activeGifts"
          v-for="(gift, i) in activeGifts"
          @click="useGift(gift.gift_id)"
          :key="i">
          {{gift.action + " " + heroSelectedName}}
        </v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>
<style>
  .v-btn {
    text-transform: none !important;
  }

  .wow_icons {
    border: 1px solid #F5F5F5;
  }
</style>
<script>
    import {wowDicts} from '../components/wowDicts'
    import HeroDialog from "../components/HeroDialog";
    import SellHeroDialog from "@/components/ClientDashboard/SellHeroDialog";

    export default {
        components: {SellHeroDialog, HeroDialog},
        middleware: 'auth',
        head: {
            script: [{
                src: 'https://wow.zamimg.com/widgets/power.js'
            }]
        },
        methods: {
            useGift(gift_id) {
              this.$store.dispatch("wowdb/useGift", {gift_id, heroSelectedName: this.heroSelectedName}).then(response => {
                  this.snackbarText = response.data.body;
                  this.snackbar = true;
                  if (response.data.status === 1) {
                      this.$auth.fetchUser().then(rep => {
                          this.activeGifts = [];
                          this.usedGifts = [];
                          this.$auth.user.gifts.map(item => {
                              if (item.used)
                                  this.usedGifts.push(item);
                              else
                                  this.activeGifts.push(item);
                          });
                      })
                  }
              });
            },
            closeHeroDialog: function () {
                this.dialog = false;
            },
            restoreHero: function () {
                if (this.heroSelectedName === "") {
                    this.snackbarText = "Please select a hero first!";
                    this.snackbar = true;
                    return
                }
                this.$store.dispatch("hero/restoreHero", {heroName: this.heroSelectedName}).then(response => {
                    this.snackbarText = response.data.body;
                    this.snackbar = true;
                })
            },
            sellHero: function () {
                this.sellingDialog = true;
            },
            cancelSellingHero: function () {
                if (!this.currentSellingHeros.includes(this.heroSelectedName)) {
                    this.snackbarText = "Hero is not for sale already!!";
                    this.snackbar = true;
                    return
                }
                this.$store.dispatch("hero/cancelSellingHero", {heroName: this.heroSelectedName}).then(response => {
                    this.snackbarText = response.data.body;
                    this.snackbar = true;
                    if (response.data.status === 1) {
                        this.currentSellingHeros = this.currentSellingHeros.filter(obj => {
                            return obj !== this.heroSelectedName;
                        })
                    }
                });
            }
        },
        mounted: function () {
            this.heros = this.$auth.user.heros;
            this.gifts = this.$auth.user.gifts;
            this.$auth.user.gifts.map(item => {
                if (item.used)
                    this.usedGifts.push(item);
                else
                    this.activeGifts.push(item);
            });
            this.currencies = this.$auth.user.currencies;
            this.wallets = [...this.$auth.user.wallets];
            let availableCurrencies = [];
            this.wallets.map(item => {
                availableCurrencies.push(item.currency_id)
            });
            this.currencies.map(item => {
                if (!availableCurrencies.includes(item))
                    this.wallets.push({
                        currency_id: item,
                        amount: 0
                    })
            });
            this.$auth.user.selling_heros.map(item => {
                this.currentSellingHeros.push(item.hero_name);
            })
        },
        data() {
            return {
                dialog: false,
                inpsectingHeroName: "",
                whTooltips: {colorLinks: true, iconizeLinks: true, renameLinks: true},
                heroClasses: wowDicts.heroClasses,
                heroRaces: wowDicts.heroRaces,
                heros: [],
                gifts: [],
                activeGifts: [],
                usedGifts: [],
                currencies: [],
                wallets: [],
                heroSelectedName: "",
                raceImgs: ['https://wow.zamimg.com/images/wow/icons/large/ui_horde_honorboundmedal.jpg',
                    'https://wow.zamimg.com/images/wow/icons/large/inv_cape_battlepvps1_d_01_alliance.jpg'],
                snackbar: false,
                snackbarText: "",
                sellingDialog: false,
                newPrice: "",
                newCrypto: "",
                note: "",
                sellingSteps: 0,
                currentSellingHeros: []
            }
        }
    }
</script>
