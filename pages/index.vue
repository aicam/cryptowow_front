<template>
  <v-row>
    <EventsDialog :dialog="eventsDialogShow" @clicked="this.closeDialog"/>
    <v-row justify="center" align="center">
      <v-col>
        <v-row class="justify-center">
          <v-banner>
            <img src="~static/wow_horizontal.png" height="130px">
          </v-banner>
        </v-row>
        <v-card class="logo py-4 d-flex justify-center">
          <img src="~/static/lich_king.jpeg" height="200vh"/>
          <VuetifyLogo/>
        </v-card>
        <v-card>
          <v-card-title class="headline justify-center">
            <p class="font-weight-bold card_title"> Play World of Warcraft with Cryptocurrency Payment </p>
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
              to="/register"
            >
              Sign Up
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="2" md="2">
        <v-card>
          <v-row style="padding: 10px;" justify="center" align="center">
            <v-btn block style="background-color: #7F828B;" v-on:click="eventsDialogShow = true">
              <v-icon color="#D0BD73" large>
                mdi-seal
              </v-icon>
              Events
            </v-btn>
          </v-row>
          <v-row style="padding: 10px;" justify="center" align="center">
            <v-btn class="success">Manual</v-btn>
          </v-row>
          <v-card-title>Server Status</v-card-title>
          <v-card-text v-if="serverStatus">
            <div class="row justify-space-between">
              <v-icon class="float-left" color="green">mdi-account-check</v-icon>
              {{serverStatus.online}} Online Players
            </div>
            <div class="row justify-space-between">
              <v-icon color="#535454">mdi-account-check</v-icon>
              {{serverStatus.total}} Players
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
  </v-row>
</template>
<style>
  .card_title {
    font-size: 30px;
  }

  .banner_bg {
    position: absolute;
    top: 0;
    left: 0;
    background-size: cover;
    background-color: red;
    transform: scale(1.1);
  }
</style>
<script>
    import EventsDialog from "../components/EventsDialog";

    export default {
        mounted() {
            this.$axios.get("/server_status").then(response => {
                this.serverStatus = response.data.server_status;
            })
        },
        data: function () {
            return ({
                eventsDialogShow: false,
                selectedItem: 1,
                serverStatus: null,
                items: [
                    {text: 'Bug Tracker', icon: 'mdi-clock'},
                    {text: 'Guide', icon: 'mdi-account'},
                    {text: 'Q&A', icon: 'mdi-flag'},
                ]
            })
        },
        methods: {
            closeDialog: function () {
                this.eventsDialogShow = false
            }
        },
        components: {EventsDialog},
    }
</script>
