<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="10" md="10">
      <v-card class="logo py-4 d-flex justify-center">
        <img src="~/static/lich_king.jpeg" height="200px"/>
        <VuetifyLogo/>
      </v-card>
      <v-card>
        <v-card-title class="headline justify-center">
          <p class="font-weight-bold card_title"> Play World of Warcraft with Cryptocurrency payment </p>
        </v-card-title>
        <v-card-text>
          <p>Vuetify is a progressive Material Design component framework for Vue.js. It was designed to empower
            developers to create amazing applications.</p>

        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            color="primary"
            nuxt
            to="/inspire"
          >
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" sm="2" md="2">
      <v-card>
        <v-card-title>Server Status</v-card-title>
        <v-card-text>
          <div class="row justify-space-between">
            <v-icon class="float-left" color="green">mdi-account-check</v-icon> 34 Online Players
          </div>
          <div class="row justify-space-between">
            <v-icon color="#535454">mdi-account-check</v-icon> 341 Players
          </div>
        </v-card-text>
      </v-card>
      <v-card
        class="mx-auto"
        max-width="300"
        tile
      >
        <v-list dense>
          <v-subheader>Quick Links</v-subheader>
          <v-list-item-group
            v-model="selectedItem"
            color="primary"
          >
            <v-list-item
              v-for="(item, i) in items"
              :key="i"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>
<style>
  .card_title {
    font-size: 30px;
  }
</style>
<script>
    export default {
        data: () => ({
            selectedItem: 1,
            items: [
                {text: 'Bug Tracker', icon: 'mdi-clock'},
                {text: 'Guide', icon: 'mdi-account'},
                {text: 'Q&A', icon: 'mdi-flag'},
            ],
        }),
    }
</script>
