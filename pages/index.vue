<template>
  <v-row>
    <ManualDialog :dialog="manualDialog" v-on:close-func="manualDialog = false"/>
    <EventsDialog :dialog="eventsDialogShow" @clicked="this.closeDialog"/>
    <v-row>
      <v-col lg="9">
        <v-row justify="center" style="margin-top: 40px;margin-bottom: 3px;">
          <v-btn :class="selectedMenuHome === 0 ? 'warning' : 'dark'" @click="selectedMenuHome = 0">Home</v-btn>
          <v-btn :class="selectedMenuHome === 1 ? 'warning' : 'dark'" @click="selectedMenuHome = 1">Rankigs</v-btn>
        </v-row>

        <v-row v-show="selectedMenuHome === 1">
          <v-card style="background-color:rgba(0, 0, 0, 0.5);">
            <v-simple-table style="background-color:rgba(0, 0, 0, 0.5);">
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-left">
                    Rank
                  </th>
                  <th class="text-left">
                    Top Today Honor
                  </th>
                  <th class="text-left">
                    Top Today Killers
                  </th>
                  <th class="text-left">
                    Top Overall Killers
                  </th>
                  <th class="text-left">
                    Top Online Players
                  </th>
                  <th class="text-left">
                    Richest
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr
                  v-for="(rank, i) in rankings"
                  :key="i">
                  <th>
                    {{i + 1}}
                  </th>
                  <th>
                    {{rank.today_honor}}
                  </th>
                  <th>
                    {{rank.today_kills}}
                  </th>
                  <th>
                    {{rank.total_kills}}
                  </th>
                  <th>
                    {{rank.total_time}}
                  </th>
                  <th>
                    {{rank.money}}
                  </th>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
        </v-row>


        <v-row v-show="selectedMenuHome === 0"
               justify="center" style="background-color:rgba(0, 0, 0, 0.5);">
          <v-col lg="3">
            <img style="opacity: 0.7;" src="~/static/lich_king.jpeg" height="200vh"/>
          </v-col>
          <v-col lg="3">
            <VuetifyLogo style="opacity: 0.5;"/>
          </v-col>
          <v-card style="padding: 25px;">
            <p class="font-weight-bold card_title"> Play World of Warcraft with Cryptocurrency Payment </p>
            <p>Are you one of old fans of World of Warcraft? if yes you sure know Lich King and definitely know about cryptocurrencies and Bitcoin.
            This server provides cash out system by cryptocurrency, so you can play and earn at the same time. This is what we call Cryptocurrency World of
            Warcraft (CryptoWoW)</p>
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
      </v-col>
      <v-col lg="3">
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
            <v-btn class="success" @click="manualDialog = true">Manual</v-btn>
          </v-row>
          <v-card-title>Server Status</v-card-title>
          <v-card-text v-show="serverStatus">
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
    import ManualDialog from "../components/ManualDialog";

    export default {
        mounted() {
            this.$axios.get("/server_status").then(response => {
                this.serverStatus = response.data.status;
                this.rankings = response.data.body;
            })
        },
        data: function () {
            return ({
                eventsDialogShow: false,
                manualDialog: false,
                selectedItem: 1,
                serverStatus: {online: 0, total: 0},
                selectedMenuHome: 0,
                rankings: null,
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
        components: {ManualDialog, EventsDialog},
    }
</script>
