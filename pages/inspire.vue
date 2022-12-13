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
    <HeroDialog :dialog="dialog"
                :heroName="inpsectingHeroName"
                v-on:close-func="closeHeroDialog"/>

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

    <v-col md="3">
      <WalletInformation :wallets="wallets"/>
    </v-col>
    <v-col md="6">
      <v-card class="text-center align-center justify-space-around" style="margin-top: 20px;padding: 20px">
        <!--    <WoWTooltip text="hello" ><v-img class="tooltip" src="https://wow.zamimg.com/images/wow/icons/large/inv_hand_1h_mawraid_d_01.jpg" max-width="60px" /></WoWTooltip>-->
        <h1>Heros</h1>
        <h4 v-if="!heros">You have no heros, go to game with your username and create one</h4>
        <HerosTable :currentSellingHeros="currentSellingHeros"
                    :heros="heros"
                    :changeHeroSelected="(name) => {heroSelectedName = name}"
                    :changeInspectingHero="(name) => {inpsectingHeroName = name; dialog = true;}"
        />

        <!-- Gifts section -->
        <h1>Active Gifts</h1>
        <ActiveGifts :activeGifts="activeGifts"/>
        <h1>Used Gifts</h1>
        <UsedGifts :usedGifts="usedGifts"/>
        <!--    <a rel="item=28288">asd</a>-->

        <!-- /Gifts section -->
      </v-card>
    </v-col>
    <v-col md="3">
      <SideBar
        :activeGifts="activeGifts"
        :cancelSellingHero="cancelSellingHero"
        :heroSelectedName="heroSelectedName"
        :restoreHero="restoreHero"
        :useGift="useGift"
        :sellHero="sellHero"
      />
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
import HeroDialog from "../components/HeroDialog";
import SellHeroDialog from "@/components/ClientDashboard/SellHeroDialog";
import WalletInformation from "@/components/ClientDashboard/WalletInformation";
import HerosTable from "@/components/ClientDashboard/HerosTable";
import ActiveGifts from "@/components/ClientDashboard/ActiveGifts";
import UsedGifts from "@/components/ClientDashboard/UsedGifts";
import SideBar from "@/components/ClientDashboard/SideBar";

export default {
  components: {SideBar, UsedGifts, ActiveGifts, HerosTable, WalletInformation, SellHeroDialog, HeroDialog},
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
