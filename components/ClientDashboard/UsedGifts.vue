<template>
  <v-container>
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
        <h3>{{ gift.title }}</h3>
        <v-tooltip bottom max-width="200px">
          <template v-slot:activator="{on, attrs}">
            <v-icon v-on="on" v-bind="attrs" large color="red">mdi-help-circle</v-icon>
          </template>
          <p style="color: black;font-size: 15px;font-weight: bold">{{ `Gift used for ${gift.used_hero_name}` }}</p>
        </v-tooltip>
        <h4>{{ gift.condition }}</h4>
      </v-row>
    </v-alert>
  </v-container>
</template>

<script>
export default {
  name: "UsedGifts",
  props: ['usedGifts']
}
</script>

<style scoped>

</style>
