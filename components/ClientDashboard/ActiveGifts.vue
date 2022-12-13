<template>
  <v-container>
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
        <h3>{{ gift.title }}</h3>
        <v-tooltip bottom max-width="200px">
          <template v-slot:activator="{on, attrs}">
            <v-icon v-on="on" v-bind="attrs" large color="red">mdi-help-circle</v-icon>
          </template>
          <p style="color: black;font-size: 15px;font-weight: bold">{{ gift.description }}</p>
        </v-tooltip>
        <h4>{{ gift.condition }}</h4>
      </v-row>
    </v-alert>
  </v-container>
</template>

<script>
export default {
  name: "ActiveGifts",
  props: ['activeGifts']
}
</script>

<style scoped>

</style>
