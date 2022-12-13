<template>
  <v-card class="text-center" style="margin-top: 20px;padding: 30px">
    <h1>Options</h1>
    <v-divider></v-divider>
    <v-btn
      class="warning"
      @click="restoreHero"
    >
      <v-icon>mdi-restore-alert</v-icon>
      Restore {{ heroSelectedName }}
    </v-btn>
    <v-divider></v-divider>
    <v-btn
      class="success"
      @click="sellHero"
    >
      <v-icon>mdi-currency-usd</v-icon>
      Sell {{ heroSelectedName }}
    </v-btn>
    <v-divider></v-divider>
    <v-btn
      class="success"
      @click="cancelSellingHero"
    >
      <v-icon>mdi-currency-usd-off</v-icon>
      Cancel Selling {{ heroSelectedName }}
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
      {{ gift.action + " " + heroSelectedName }}
    </v-btn>
  </v-card>
</template>

<script>
export default {
  name: "SideBar",
  props: ['restoreHero', 'heroSelectedName', 'cancelSellingHero', 'activeGifts', 'useGift', 'sellHero']
}
</script>

<style scoped>

</style>
