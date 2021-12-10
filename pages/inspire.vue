<template>
  <v-row justify="end" align="center">
    <v-col md="3">
      <v-card style="padding: 5px">
        <h2>Cryptocurrencies</h2>
      </v-card>
    </v-col>
    <v-col md="6">
      <v-card class="text-center align-center justify-space-around" style="margin-top: 20px;padding: 20px">
        <!--    <WoWTooltip text="hello" ><v-img class="tooltip" src="https://wow.zamimg.com/images/wow/icons/large/inv_hand_1h_mawraid_d_01.jpg" max-width="60px" /></WoWTooltip>-->
        <h1>Heros</h1>
        <h4 v-if="!heros.length">You have no heros, go to game with your username and create one</h4>
        <v-simple-table v-if="heros">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-center">
                Class
              </th>
              <th class="text-center">
                Race
              </th>
              <th class="text-center">
                Name
              </th>
              <th class="text-center">
                Level
              </th>
              <th class="text-center">
                Actions
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
              v-for="(hero, i) in heros"
              :key="i"
            >
              <td>
                <v-img class="wow-icons" width="60px"
                       src="https://wow.zamimg.com/images/wow/icons/large/classicon_mage.jpg"/>
              </td>
              <td>
                <v-img class="wow_icons" width="60px" :src="raceImgs[hero.race ? 1 : 0]"/>
              </td>
              <td>
                {{hero.name}}
              </td>
              <td>
                {{hero.level}}
              </td>
              <td>
                <v-btn
                  @click="heroSelectedName = hero.name"
                >
                  Select
                </v-btn>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
        <h1>Active Gifts</h1>
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
            <h3>{{gift.description}}</h3>
            <h4>{{gift.condition}}</h4>
          </v-row>
        </v-alert>
        <h1>Used Gifts</h1>
        <h3 v-if="!usedGifts.length">You have no used gift currently</h3>
        <!--    <a rel="item=28288">asd</a>-->
      </v-card>
    </v-col>
    <v-col md="3">
      <v-card class="text-center" style="margin-top: 20px;padding: 30px">
        <h1>Options</h1>
        <v-divider></v-divider>
        <v-btn
          class="warning"
        >
          <v-icon>mdi-restore-alert</v-icon>
          Restore {{heroSelectedName}}
        </v-btn>
        <v-divider></v-divider>
        <v-btn
          class="success"
        >
          <v-icon>mdi-currency-usd</v-icon>
          Sell {{heroSelectedName}}
        </v-btn>
        <v-row justify="center" style="margin: 10px">
          <v-icon>mdi-gift-outline</v-icon>
          <h1 style="margin-left: 10px;"> Gifts</h1>
        </v-row>
        <h3 v-if="!activeGifts">No gifts</h3>
        <v-btn
          v-if="activeGifts"
          v-for="(gift, i) in activeGifts"
          :key="i">
          {{gift.action + " " + heroSelectedName}}
        </v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>
<style>
  .v-btn {
    text-transform: none !important;
  }

  .wow_icons {

  }
</style>
<script>
    export default {
        middleware: 'auth',
        head: {
            script: [{
                src: 'https://wow.zamimg.com/widgets/power.js'
            }]
        },
        mounted: function () {
            this.$axios.get("/wow/get_info").then(response => {
                this.heros = response.data.heros;
                this.gifts = response.data.gifts;
                response.data.gifts.map(item => {
                    if (item.used)
                        this.usedGifts.push(item);
                    else
                        this.activeGifts.push(item);
                });
                console.log(this.usedGifts.length)
            });
            var x = document.getElementsByClassName("wowhead-tooltip wowhead-tooltip-width-restriction wowhead-tooltip-width-320");

            console.log("DDD");
            // console.log(window.WH);
        },
        data() {
            return ({
                whTooltips: {colorLinks: true, iconizeLinks: true, renameLinks: true},
                heros: [],
                gifts: [],
                activeGifts: [],
                usedGifts: [],
                heroSelectedName: "",
                raceImgs: ['https://wow.zamimg.com/images/wow/icons/large/ui_horde_honorboundmedal.jpg',
                    'https://wow.zamimg.com/images/wow/icons/large/inv_cape_battlepvps1_d_01_alliance.jpg']
            })
        }
    }
</script>
