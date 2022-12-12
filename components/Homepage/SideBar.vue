<template>
  <v-img class="mx-auto"
         max-width="300"
         tile
         :src="require(`~/static/nav_bg.png`)"
  >
    <v-container class="container-top">
      <v-row style="padding: 10px;" justify="center" align="center">
        <v-btn block style="background-color: #7F828B;" v-on:click="$emit('eventsDialogShowClick', true)">
          <v-icon color="#D0BD73" large>
            mdi-seal
          </v-icon>
          Events
        </v-btn>
      </v-row>
      <v-row style="padding: 10px;" justify="center" align="center">
        <v-btn class="success" @click="$emit('manualDialogClick', true);">Manual</v-btn>
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
</template>

<script>
export default {
  name: "SideBar",
  props: ['eventsDialogShowClick', 'manualDialog', 'eventsDialogShow', 'serverStatus', 'items', 'selectedItem']
}
</script>

<style scoped>
.container-top {
  width: 80%;
  margin-top: 100px;
}
</style>
