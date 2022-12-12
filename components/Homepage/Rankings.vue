<template>
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
</template>

<script>
export default {
  props: ['rankings', 'heroClasses'],
  name: "Rankings"
}
</script>

<style scoped>

</style>
