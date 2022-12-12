<template>
  <v-container>
    <ManualDialog :dialog="manualDialog" v-on:close-func="manualDialog = false"/>
    <EventsDialog :dialog="eventsDialogShow" @clicked="eventsDialogShow = false"/>
    <v-row>
      <v-col lg="9">
        <MainInformation :rankings="rankings" :heroClasses="heroClasses"/>
      </v-col>
      <v-col lg="3">
        <SideBar :serverStatus="serverStatus"
                 :items="items"
                 :selectedItem="selectedItem"
                 v-on:eventsDialogShowClick="(val) => {eventsDialogShow = val}"
                 v-on:manualDialogClick="(val) => {manualDialog = val}" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EventsDialog from "../components/EventsDialog";
import ManualDialog from "../components/Homepage/ManualDialog";
import {wowDicts} from "@/components/wowDicts";
import MainInformation from "@/components/Homepage/MainInformation";
import SideBar from "@/components/Homepage/SideBar";

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
    return {
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
    }
  },
  methods: {},
  components: {SideBar, MainInformation, ManualDialog, EventsDialog},
}
</script>
