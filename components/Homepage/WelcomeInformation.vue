<template>
  <v-row justify="center">
    <v-col lg="3">
      <img style="opacity: 0.7;" src="~/static/lich_king.jpeg" height="200vh"/>
    </v-col>
    <v-col lg="3">
      <VuetifyLogo style="opacity: 0.5;"/>
    </v-col>
    <v-card style="padding: 25px;">
      <p class="font-weight-bold card_title"> Play World of Warcraft with Cryptocurrency Payment </p>
      <p>Are you one of old fans of World of Warcraft? if yes you sure know Lich King and definitely know about
        cryptocurrencies.
        This server provides cash out system by cryptocurrency, so you can play and earn at the same time. Our options are being
        developed and the final goal is to create a decentralized world of warcraft server (DecentraWoW).</p>
      <v-spacer/>
      <v-btn
        color="primary"
        nuxt
        to="/register"
      >
        Sign Up
      </v-btn>
    </v-card>
  </v-row>
</template>

<script>
export default {
  name: "WelcomeInformation"
}
</script>

<style scoped>

</style>
