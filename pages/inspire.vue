<template>
  <v-card class="text-center d-flex align-center justify-space-around">
<!--    <WoWTooltip text="hello" ><v-img class="tooltip" src="https://wow.zamimg.com/images/wow/icons/large/inv_hand_1h_mawraid_d_01.jpg" max-width="60px" /></WoWTooltip>-->
    <a rel="item=28288" class="q3">asd</a>
    <div class="tooltiptext">Hover me</div>

    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          mdi-home
        </v-icon>
      </template>
      <span>Tooltip</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <span
          v-bind="attrs"
          v-on="on"
        >This text has a tooltip</span>
      </template>
      <span>Tooltip</span>
    </v-tooltip>
  </v-card>
</template>
<style>
  .tooltip {
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted black;
  }

  .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: red;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;

    /* Position the tooltip */
    position: absolute;
    z-index: 1;
  }
  .tooltip:hover .tooltiptext {
    visibility: visible;
  }
</style>
<script>
  import WoWTooltip from "../components/WoWTooltip";
  export default {
      head: {
        script: [{
            src: 'https://wow.zamimg.com/widgets/power.js'
        }]
      },
      components: {WoWTooltip},
      data() {
          return({
              whTooltips: {colorLinks: true, iconizeLinks: true, renameLinks: true},
              goldLogo: 'https://wow.zamimg.com/images/icons/money-gold.gif',
              silverLogo: 'https://wow.zamimg.com/images/icons/money-silver.gif',
              copperLogo: 'https://wow.zamimg.com/images/icons/money-copper.gif',
              item_info: {
                  colors: ['purple', 'yellow', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'green', 'white', 'white', 'white', 'white'],
              paragraphs: ['Cruciform Veinripper', 'Item Level 226', 'Binds when picked up', ['One-Hand', 'Fist Weapon'], ['99 - 141 Damage', 'Speed 2.60'],
              '(46.2 damage per second)', '+41 Agility', '+75 Stamina', 'Durability 80 / 80', '\n' +
                  'Equip: While you are behind your enemies, their movement is impaired, or they are suffering from loss-of-control effects, your attacks have a high chance to cause them to bleed for 2072 Physical damage over 6 sec.',
              'Requires Level 60', ['Sell Price: 127', 'G', '61', 'S', '12', 'C'], 'Dropped by: Painsmith Raznal', 'Drop Chance: 0.72%']}
          })
      }
  }
</script>
