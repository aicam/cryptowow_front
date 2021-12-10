<template>
  <v-row justify="end" align="center">
    <v-col md="5">
      <v-card class="text-center d-flex align-center justify-space-around" style="margin-top: 20px;padding: 20px">
        <!--    <WoWTooltip text="hello" ><v-img class="tooltip" src="https://wow.zamimg.com/images/wow/icons/large/inv_hand_1h_mawraid_d_01.jpg" max-width="60px" /></WoWTooltip>-->
        <div>
          <h1>Heros</h1>
          <h4 v-if="!heros">You have no heros, go to game with your username and create one</h4>
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
                    <v-img class="wow-icons" src="https://wow.zamimg.com/images/wow/icons/large/classicon_mage.jpg"/>
                </td>
                <td>
                    <v-img class="wow_icons" :src="raceImgs[hero.race ? 1 : 0]"/>
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
        </div>

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
          Restore {{heroSelectedName}}</v-btn>
        <v-divider></v-divider>
        <v-btn
          class="success"
          >
          <v-icon>mdi-currency-usd</v-icon>
          Sell {{heroSelectedName}}
        </v-btn>

      </v-card>
    </v-col>
  </v-row>
</template>
<style>
  .v-btn {
    text-transform:none !important;
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
            this.$axios.get("/wow/get_heros").then(response => {
                this.heros = response.data;
            });
            var x = document.getElementsByClassName("wowhead-tooltip wowhead-tooltip-width-restriction wowhead-tooltip-width-320");

            console.log("DDD");
            // console.log(window.WH);
        },
        data() {
            return ({
                whTooltips: {colorLinks: true, iconizeLinks: true, renameLinks: true},
                heros: [],
                heroSelectedName: "",
                raceImgs: ['https://wow.zamimg.com/images/wow/icons/large/ui_horde_honorboundmedal.jpg',
                    'https://wow.zamimg.com/images/wow/icons/large/inv_cape_battlepvps1_d_01_alliance.jpg']
            })
        }
    }
</script>
