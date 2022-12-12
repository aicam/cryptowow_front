<template>
  <v-container>
    <v-row justify="center" class="row-head">
      <v-btn :class="selectedMenuHome === 0 ? 'warning' : 'dark'" @click="selectedMenuHome = 0">Home</v-btn>
      <v-btn :class="selectedMenuHome === 1 ? 'warning' : 'dark'" @click="selectedMenuHome = 1">Rankigs</v-btn>
    </v-row>
    <v-container fluid style="height: 400px">
      <v-container v-show="selectedMenuHome === 1">
        <Rankings :rankings="rankings" :hero-classes="heroClasses" />
      </v-container>

      <v-container v-show="selectedMenuHome === 0">
        <WelcomeInformation />
      </v-container>
    </v-container>
  </v-container>
</template>

<script>
import Rankings from "@/components/Homepage/Rankings";
import WelcomeInformation from "@/components/Homepage/WelcomeInformation";
export default {
  name: "MainInformation",
  components: {WelcomeInformation, Rankings},
  props: ['rankings', 'heroClasses'],
  data() {
    return {
      selectedMenuHome: 0
    }
  }
}
</script>

<style scoped>
.row-head {
  margin-top: 30px;
  margin-bottom: 3px;
}
</style>
