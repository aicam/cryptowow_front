<template>
  <v-container>
    <ManualDialog :dialog="manualDialog" v-on:close-func="manualDialog = false"/>
    <EventsDialog :dialog="eventsDialogShow" @clicked="eventsDialogShow = false"/>
    <v-row>
      <v-col lg="9">
        <v-row justify="center" style="margin-top: 30px; margin-bottom: 3px;">
          <v-btn :class="selectedMenuHome === 0 ? 'warning' : 'dark'" @click="selectedMenuHome = 0">Home</v-btn>
          <v-btn :class="selectedMenuHome === 1 ? 'warning' : 'dark'" @click="selectedMenuHome = 1">Rankigs</v-btn>
        </v-row>
        <v-container fluid style="height: 400px">
          <v-container v-show="selectedMenuHome === 1">
            <v-card style="background-color:rgba(0, 0, 0, 0.5);">
              <v-simple-table>
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
                      <v-img :src="require(`~/static/arena/medals/a1_${++i}.gif`)" width="33px"/>
                    </th>
                    <th>
                      <v-row justify="space-around">
                        {{ rank.today_honor }}
                        <v-img class="wow_icons" max-width="33px"
                               :src="heroClasses[(i*2)%9 + 1].icon"/>
                      </v-row>
                    </th>
                    <th>
                      <v-row justify="space-around">
                        {{ rank.today_kills }}
                        <v-img class="wow_icons" max-width="33px"
                               :src="heroClasses[(i*3)%9 + 1].icon"/>
                      </v-row>
                    </th>
                    <th>
                      <v-row justify="space-around">
                        {{ rank.total_kills }}
                        <v-img class="wow_icons" max-width="33px"
                               :src="heroClasses[(i*4)%9 + 1].icon"/>
                      </v-row>
                    </th>
                    <th>
                      <v-row justify="space-around">
                        {{ rank.total_time }}
                        <v-img class="wow_icons" max-width="33px"
                               :src="heroClasses[(i*5)%9 + 1].icon"/>
                      </v-row>
                    </th>
                    <th>
                      <v-row justify="space-around">
                        {{ rank.money }}
                        <v-img class="wow_icons" max-width="33px"
                               :src="heroClasses[(i*6)%9 + 1].icon"/>
                      </v-row>
                    </th>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-container>

          <v-row v-show="selectedMenuHome === 0"
                 justify="center">
            <v-col lg="3">
              <img style="opacity: 0.7;" src="~/static/lich_king.jpeg" height="200vh"/>
            </v-col>
            <v-col lg="3">
              <VuetifyLogo style="opacity: 0.5;"/>
            </v-col>
            <v-card style="padding: 25px;">
              <p class="font-weight-bold card_title"> Play World of Warcraft with Cryptocurrency Payment </p>
              <p>Are you one of old fans of World of Warcraft? if yes you sure know Lich King and definitely know about
                cryptocurrencies and Bitcoin.
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
        </v-container>
      </v-col>
      <v-col lg="3">
        <v-img class="mx-auto"
               max-width="300"
               tile
               :src="require(`~/static/nav_bg.png`)"
        >
          <v-container style="width: 80%; margin-top: 100px;">
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
                {{ serverStatus.online }} Online Players
              </div>
              <div class="row justify-space-between">
                <v-icon color="#535454">mdi-account-check</v-icon>
                {{ serverStatus.total }} Players
              </div>
            </v-card-text>
            <v-list style="background-color: rgba(0, 0, 0, 0)" dense>
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
          </v-container>
        </v-img>
      </v-col>
    </v-row>
  </v-container>
</template>
<style>
.card_title {
  font-size: 30px;
}

.nav {
  background: url('~/static/nav_bg.png') no-repeat center center fixed !important;
  background-size: cover;
}

.wow_icons {
  border: 1px solid #F5F5F5;
}
</style>
<script>
import EventsDialog from "../components/EventsDialog";
import ManualDialog from "../components/ManualDialog";
import {wowDicts} from "@/components/wowDicts";

export default {
  created() {
    this.$store.dispatch('static/getHomePageInfo').then(
      (result) => {
        this.serverStatus = result[0];
        this.rankings = result[1];
      }
    )
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      setTimeout(() => this.$nuxt.$loading.finish(), 2000)
    })
  },
  data: function () {
    return ({
      heroClasses: wowDicts.heroClasses,
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
  methods: {},
  components: {ManualDialog, EventsDialog},
}
</script>
