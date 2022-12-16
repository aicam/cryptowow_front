<template>
  <v-row justify="end" align="center" style="margin-top: 10px;">
    <HeroDialog :dialog="dialog" :hero-name="inpsectingHeroName" v-on:close-func="closeDialog"
                :note="note"></HeroDialog>

    <PurchaseHeroDialog
      :buyDialog="buyDialog"
      :buyingHero="buyingHero"
      :showSnack="showSnack"
      v-on:close="buyDialog = false" />

    <HerosList
      :buyDialog="buyDialog"
      :showHeroDialog="showHeroDialog"
      :showBuyHeroDialog="showBuyHeroDialog"
      />

    <v-snackbar
      v-model="snackbar">
      {{ snackbarText }}
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
import PurchaseHeroDialog from "@/components/Shop/PurchaseHeroDialog";
import HerosList from "@/components/Shop/HerosList";

export default {
  name: "buy_hero",
  components: {HerosList, PurchaseHeroDialog},
  middleware: 'auth',
  methods: {
    closeDialog() {
      this.dialog = false;
    },
    showSnack(txt) {
      this.snackbarText = txt;
      this.snackbar = true;
      this.buyDialog = false;
    },
    showHeroDialog(hero) {
      this.inpsectingHeroName = hero.hero_name
      this.note = hero.note
      this.dialog = true
    },
    showBuyHeroDialog(hero) {
      this.buyDialog = true
      this.buyingHero = hero
    }
  },
  data() {
    return {
      heroClasses: wowDicts.heroClasses,
      heroRaces: wowDicts.heroRaces,
      sellingHeros: null,
      dialog: false,
      inpsectingHeroName: "",
      buyDialog: false,
      buyingHero: null,
      selectedCurrency: null,
      snackbar: false,
      snackbarText: "",
      note: ""
    }
  }
}
</script>

<style scoped>
.wow_icons {
  border: 1px solid #F5F5F5;
}
</style>
