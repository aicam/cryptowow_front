<template>
  <v-row justify="end" align="center">

    <!-- None display -->
    <v-dialog
      v-model="sellingDialog"
      width="1000">
      <v-card style="padding: 50px;">
        <v-card-title style="margin-bottom: 10px;" class="text-h2 lighten-1">
          Selling {{heroSelectedName}}
        </v-card-title>
        <v-stepper v-model="sellingSteps" justify="space-between">
          <v-stepper-content step="0">
            <h4>Add new price based on available cryptocurrencies</h4>
            <h4 style="color: orangered;font-weight: bold">Note: customers will choose to buy with currency they prefer.</h4>
            <h4>You can write price both in float (0.0025) or exponent of 10 (25e-4)</h4>
            <v-row style="margin-bottom: 10px; border-bottom: 2px solid orangered;">
              <v-col lg="4">
                <v-text-field
                  v-model="cPrice"
                  label="Price"></v-text-field>
              </v-col>
              <v-col lg="4">
                <v-select v-model="cCrypto" :items="currencies">
                  <template v-slot:selection="{item, index}">
                    {{item}}
                    <v-divider></v-divider>
                    <v-img max-width="48px" :src="require(`~/static/currencies/${item}.png`)"/>
                  </template>
                  <template v-slot:item="{item}">
                    {{item}}
                    <v-divider></v-divider>
                    <v-img max-width="48px" :src="require(`~/static/currencies/${item}.png`)"/>
                  </template>
                </v-select>
              </v-col>
              <v-col lg="4">
                <v-btn
                  @click="addPrice"
                >
                  Add
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-for="(price, i) in prices" :key="i">
              <v-col lg="3" class="justify-center text-center">
                <h4>{{price.value}}</h4>
              </v-col>
              <v-col lg="3">
                <h4>{{price.name}}</h4>
              </v-col>
              <v-col lg="2">
                <v-img max-width="48" :src="require(`~/static/currencies/${price.name}.png`)"/>
              </v-col>
              <v-col lg="2">
                <v-btn
                  outlined
                  color="red"
                  @click="prices = prices.filter(obj => {return obj.name !== price.name})">
                  Delete
                </v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-content step="1">
            <h4>Write a note about your hero to justify its price and value (less than 300 characters).</h4>
            <h4>Your hero information same as the "inspect" option for your hero will be available for shopper, in
              addition, hero gold, total kill and your note
              will be added to this information.</h4>
            <v-textarea
              filled
              name="input-7-1"
              label="Note"
              hint="Mention hero distinguishable options, achievements, guild and ..."
              counter="300"
              v-model="note"
            ></v-textarea>
          </v-stepper-content>
        </v-stepper>
        <v-card-actions class="justify-end">
          <v-btn
            v-if="sellingSteps === 1"
            color="#AC2020"
            @click="sellingSteps = 0"
          >
            Back
          </v-btn>
          <v-btn
            class="success"
            @click="sellingSteps === 0 ? goNoteStep() : finalizeSell()">
            {{sellingSteps === 0 ? "Next" : "Finish"}}
          </v-btn>
          <v-btn
            class="warning"
            @click="sellingDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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


    <HeroDialog :dialog="dialog" :hero-name="inpsectingHeroName" v-on:close-func="closeHeroDialog"/>
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
          <h3>{{wallet.amount}}</h3>
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
            <h3>{{gift.description}}</h3>
            <h4>{{gift.condition}}</h4>
          </v-row>
        </v-alert>
        <h1>Used Gifts</h1>
        <h3 v-if="!usedGifts.length">You have no used gift currently</h3>
        <!--    <a rel="item=28288">asd</a>-->
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

    export default {
        components: {HeroDialog},
        middleware: 'auth',
        head: {
            script: [{
                src: 'https://wow.zamimg.com/widgets/power.js'
            }]
        },
        methods: {
            closeHeroDialog: function () {
                this.dialog = false;
            },
            restoreHero: function () {
                if (this.heroSelectedName === "") {
                    this.snackbarText = "Please select a hero first!";
                    this.snackbar = true;
                    return
                }
                this.$axios.get("/wow/restore_hero/" + this.heroSelectedName).then(response => {
                    this.snackbarText = response.data.body;
                    this.snackbar = true;
                })
            },
            sellHero: function () {
                this.sellingDialog = true;
            },
            addPrice: function () {
                let exist = false;
                this.prices.map(price => {
                    if (price.name === this.cCrypto) {
                        this.snackbarText = "Pick another currency or delete the existing one";
                        this.snackbar = true;
                        exist = true;
                    }
                });
                if (!exist)
                    this.prices.push({value: this.cPrice, name: this.cCrypto});
            },
            goNoteStep: function () {
                if (this.prices.length < this.currencies.length) {
                    this.snackbarText = "All crypto prices should be specified";
                    this.snackbar = true;
                    return
                }
                this.sellingSteps = 1;
            },
            finalizeSell: function () {
                if (this.note.length > 350) {
                    this.snackbarText = "Please edit your note!!";
                    this.snackbar = true;
                    return
                }
                let priceTxT = "";
                this.prices.map(price => {
                    priceTxT += price.value + '-' + price.name + '&'
                });
                priceTxT = priceTxT.substring(0, priceTxT.length - 1);
                this.$axios.post("/wow/sell_hero", JSON.stringify({
                    hero_name: this.heroSelectedName,
                    hero_price: priceTxT,
                    note: this.note
                }))
                    .then(response => {
                        this.sellingDialog = false;
                        this.snackbarText = response.data.body;
                        this.snackbar = true;
                        if (response.data.status === 1) {
                            this.currentSellingHeros.push(this.heroSelectedName);
                        }
                    });
            },
            cancelSellingHero: function () {
                if (!this.currentSellingHeros.includes(this.heroSelectedName)) {
                    this.snackbarText = "Hero is not for sale already!!";
                    this.snackbar = true;
                    return
                }
                this.$axios.get("/wow/cancel_selling_hero/" + this.heroSelectedName).then(response => {
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
            // console.log(window.WH);
        },
        data() {
            return ({
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
                cPrice: "",
                cCrypto: "",
                prices: [],
                newPrice: "",
                newCrypto: "",
                note: "",
                sellingSteps: 0,
                currentSellingHeros: []
            })
        }
    }
</script>
