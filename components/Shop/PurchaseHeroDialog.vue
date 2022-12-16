<template>
  <v-dialog
    v-if="buyDialog"
    v-model="buyDialog"
    transition="dialog-bottom-transition"
    width="500"
    v-on:click:outside="$emit('close')"
  >
    <v-card>
      <v-card-title class="text-h5 grey lighten-1">You are buying {{buyingHero.hero_name}}</v-card-title>
      <v-card-text>
        <v-row justify="center" class="row-head">
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
</template>

<script>
import {wowDicts} from "@/components/wowDicts";

export default {
  name: "PurchaseHeroDialog",
  props: ['buyDialog', 'buyingHero', 'showSnack'],
  data() {
    return {
      heroClasses: wowDicts.heroClasses,
      heroRaces: wowDicts.heroRaces,
      selectedCurrency: ""
    }
  },
  methods: {
    buyHero() {
      if (this.selectedCurrency === null) {
        this.showSnack("Select a payment currency")
        return
      }
      this.$store.dispatch("hero/buyHero", {
        info: {
          currency: this.selectedCurrency.split('-')[1],
          hero: this.buyingHero
        }
      }).then(response => {
          this.showSnack(response.data.body)
      })
    }
  }
}
</script>

<style scoped>
.row-head {
  margin-top: 30px;
  margin-bottom: 10px;
}
</style>
