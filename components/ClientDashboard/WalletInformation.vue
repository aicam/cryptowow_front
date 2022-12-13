<template>
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
</template>

<script>
export default {
  name: "WalletInformation",
  props: ['wallets']
}
</script>

<style scoped>

</style>
