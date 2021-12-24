<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="closeDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Hero Full Inspection</v-toolbar-title>
        </v-toolbar>
        <v-subheader class="text-center justify-center"
                     style="font-size: 40px; font-weight: bold; font-family: 'DejaVu Math TeX Gyre',fantasy;">
          {{heroName}}
        </v-subheader>
        <v-sheet
          v-if="loading"
          class="pa-3"
        >
          <v-row>
            <v-col lg="4">
              <v-skeleton-loader
                class="mx-auto"
                type="card"
              ></v-skeleton-loader>
              <v-skeleton-loader
                class="mx-auto"
                type="card"
              ></v-skeleton-loader>
            </v-col>
            <v-col lg="8">
              <v-skeleton-loader
                class="mx-auto"
                type="card"
              ></v-skeleton-loader>
              <v-skeleton-loader
                class="mx-auto"
                type="card"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
        </v-sheet>
        <v-row v-if="!loading" class="flex" justify="start">
          <span class="bg" :style="{background: 'url(\'' + backgroundImage + '\')'}"></span>
          <v-col lg="3">
            <v-row justify="center">
              <v-img class="wow_icons my-10" max-width="55px"
                     :src="heroClasses[heroClass].icon"/>
              <v-img class="wow_icons my-10" max-width="55px"
                     :src="heroRaces[race][gender == true ? 1 : 0]"/>
            </v-row>
            <v-list flat>
              <v-list-item-group
                v-model="selectedMenu"
                color="primary"
              >
                <v-list-item
                  v-for="(item, i) in menuItems"
                  :key="i">
                  <v-list-item-content @click="changeMenu(i)">
                    {{item}}
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
          <v-col lg="9" class="justify-center">
            <v-stepper v-model="selectedMenu" non-linear style="background: transparent;">
              <v-stepper-items>

                <!-- Equipments section -->
                <v-stepper-content step="0">
                  <v-row>
                    <v-col lg="4">
                      <v-list flat style="background: transparent;">
                        <v-list-item-group>
                          <v-list-item v-for="(item, i) in leftItems"
                                       :key="i"
                                       style="padding: 0; margin-bottom: -26px;">
                            <v-list-item-icon>
                              <a href="#" :data-wowhead="`item=${item.id}`">
                                <v-img style="border: 1px solid orange;" width="44px" :src="item.icon"/>
                              </a>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <a href="#" :data-wowhead="`item=${item.id}`">
                                <p style="font-size: 12px; color: white;">{{item.name}}</p>
                              </a>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-col>

                    <!-- Staff, Sword, ... -->
                    <v-col lg="4" style="margin-top: 45%">
                      <v-list flat style="background: transparent;">
                        <v-list-item-group>
                          <v-list-item v-for="(item, i) in bottomItems"
                                       :key="i"
                                       style="padding: 0; margin-bottom: -26px;">
                            <v-list-item-icon>
                              <a href="#" :data-wowhead="`item=${item.id}`">
                                <v-img style="border: 1px solid orange;" width="44px" :src="item.icon"/>
                              </a>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <a href="#" :data-wowhead="`item=${item.id}`">
                                <p style="font-size: 12px; color: white;">{{item.name}}</p>
                              </a>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-col>

                    <!-- Right items -->
                    <v-col lg="4">
                      <v-list flat style="background: transparent;">
                        <v-list-item-group>
                          <v-list-item v-for="(item, i) in rightItems"
                                       :key="i"
                                       style="padding: 0; margin-bottom: -26px;">
                            <v-list-item-content class="justify-lg-end text-end">
                              <a href="#" :data-wowhead="`item=${item.id}`">
                                <p style="font-size: 12px; color: white;" class="text-end">{{item.name}}</p>
                              </a>
                            </v-list-item-content>
                            <v-list-item-icon>
                              <a href="#" :data-wowhead="`item=${item.id}`">
                                <v-img style="border: 1px solid orange;" width="44px" :src="item.icon"/>
                              </a>
                            </v-list-item-icon>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-col>
                  </v-row>
                </v-stepper-content>

                <!-- Achievements Section -->
                <v-stepper-content step="1">
                  <v-card style="padding: 25px; background: transparent;">
                    <h1 class="text-center" style="font-weight: bold;">Number of achievements:
                      {{achievements.length}}</h1>
                    <v-sheet
                      v-if="!achievements.length"
                      class="pa-3"
                    >
                      <v-skeleton-loader
                        class="mx-auto"
                        type="card"
                      ></v-skeleton-loader>
                    </v-sheet>
                    <v-virtual-scroll v-if="achievements.length"
                                      :items="achievements"
                                      height="500"
                                      item-height="80"
                    >
                      <template v-slot:default="{item}">
                        <v-list-item :key="item.id">
                          <v-list-item-content>
                            <v-list-item-title style="color: orange;">
                              Name: {{item.name}}
                            </v-list-item-title>
                            Description: {{item.description}}
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-virtual-scroll>
                  </v-card>
                </v-stepper-content>

                <!-- Reputation section -->
                <v-stepper-content step="2">
                  <h2>Wrath of The Lich King</h2>
                  <v-card style="padding: 25px; background: transparent;">
                    <v-row
                      v-for="(rep, i) in reputations"
                      :key="rep.name">
                      {{rep.name}}
                      <v-progress-linear
                        v-model="rep.standing"
                        :color="horde ? '#AC2020' : 'blue-grey'"
                        height="25"
                      >
                        <template v-slot:default="{ value }">
                          <strong>{{ value }}/{{ rep.max }}</strong>
                        </template>
                      </v-progress-linear>
                    </v-row>
                  </v-card>
                </v-stepper-content>

                <!-- Mounts section -->
                <v-stepper-content step="3">
                  <v-card style="padding: 25px; background: transparent;">
                    <v-sheet
                      v-if="mountsLoading"
                      class="pa-3"
                    >
                      <v-skeleton-loader
                        class="mx-auto"
                        type="card"
                      ></v-skeleton-loader>
                    </v-sheet>
                    <v-row style="max-width: 600px;">
                      <v-col
                        style="margin: 5px;"
                        lg="3"
                        v-for="(mount, i) in mountsData"
                        :key="i">
                        <v-row>
                          <a :href="`https://www.wowhead.com/item=${mount.id}`" style="border: 2px solid #7F828B" :data-wowhead="`item=${mount.id}`" target="_blank">
                            <v-img :src="mount.icon"/>
                          </a>
                          <a :href="`https://www.wowhead.com/item=${mount.id}`" style="font-weight: bold;color: white;" :data-wowhead="`item=${mount.id}`" target="_blank">
                            {{mount.name}}
                          </a>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-stepper-content>

                <!-- Companions section -->
                <v-stepper-content step="4">
                  <v-card style="padding: 25px; background: transparent;">
                    <v-sheet
                      v-if="companionsLoading"
                      class="pa-3"
                    >
                      <v-skeleton-loader
                        class="mx-auto"
                        type="card"
                      ></v-skeleton-loader>
                    </v-sheet>
                    <v-row style="max-width: 600px;">
                      <v-col
                        style="margin: 5px;"
                        lg="3"
                        v-for="(companion, i) in companionsData"
                        :key="i">
                        <v-row>
                          <a :href="`https://www.wowhead.com/item=${companion.id}`" style="border: 2px solid #7F828B" :data-wowhead="`item=${companion.id}`" target="_blank">
                            <v-img :src="companion.icon"/>
                          </a>
                          <a :href="`https://www.wowhead.com/item=${companion.id}`" style="font-weight: bold;color: white;" :data-wowhead="`item=${companion.id}`" target="_blank">
                            {{companion.name}}
                          </a>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-stepper-content>

              </v-stepper-items>
            </v-stepper>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
    import {wowDicts} from '../components/wowDicts'

    export default {
        middleware: 'auth',
        name: "HeroDialog",
        props: ["dialog", "heroName", "closeFunc"],
        head: {
            script: [{
                src: 'https://wow.zamimg.com/widgets/power.js'
            }]
        },
        watch: {
            dialog(visible) {
                if (visible) {
                    console.log(this.heroName);
                    this.$axios.get("/wow/hero_info/" + this.heroName).then(async (response) => {
                        const respData = response.data;
                        console.log(respData);
                        this.heroID = respData.id;
                        this.race = respData.race;
                        this.gender = respData.gender;
                        this.level = respData.level;
                        this.heroClass = respData.class;
                        this.equippedCache = respData.equipment_cache;
                        this.achievementsIDs = respData.achievements;
                        this.mounts = respData.mounts;
                        this.companions = respData.companions;
                        const eqsplitted = this.equippedCache.split(" ");

                        // Reputation array
                        this.wotlkReputations.map(item => {
                            let standing = 0;
                            respData.reputations.map(rep => {
                                if (rep.faction == item.id)
                                    standing = rep.standing
                            });
                            this.reputations.push({name: item.name, standing: standing, max: item.max});
                        });

                        for (let i = 0; i < eqsplitted.length; i += 2) {
                            this.items.push(eqsplitted[i])
                        }
                        if (this.race == 2 || this.race == 5 || this.race == 6 || this.race == 10 || this.race == 8) {
                            this.backgroundImage = require("~/static/hero_dialogs/orgrimmar_blur.png");
                            this.horde = true;
                        } else {
                            this.backgroundImage = require("~/static/hero_dialogs/stormwind_blur.png");
                            this.horde = false;
                        }

                        // parse items
                        for (let i = 0; i < 8; i++) {
                            let r1 = await this.parseItemId(this.items[i]);
                            this.leftItems.push(r1);
                            let r2 = await this.parseItemId(this.items[i + 8]);
                            this.rightItems.push(r2);
                        }
                        for (let i = 15; i < 19; i++) {
                            if (this.items[i] != "0") {
                                console.log(this.items[i]);
                                let r3 = await this.parseItemId(this.items[i]);
                                this.bottomItems.push(r3)
                            }
                        }
                        console.log(this.heroClass);
                        console.log(this.heroClasses);
                        this.loading = false;
                    })
                } else {
                    Object.assign(this.$data, this.$options.data())
                }
            }
        },
        mounted() {
        },
        methods: {
            parseItemId: async (itemID) => {
                var requestOptions = {
                    method: 'GET',
                    redirect: 'follow',
                };
                let iteminfo = {};
                if (itemID == "0") {
                    iteminfo.icon = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg"
                    iteminfo.name = "No item";
                    iteminfo.id = "0";
                    iteminfo.level = "0";
                    return iteminfo;
                }
                const storageInfo = localStorage.getItem(itemID);
                // Cache system
                if (storageInfo !== null) {
                    return JSON.parse(storageInfo);
                }
                await fetch("http://localhost:44297/https://www.wowhead.com/item=" + itemID + "&xml", requestOptions)
                    .then(response => response.text())
                    .then(result => {
                        // console.log(result);
                        const parser = new DOMParser();
                        let xmlDoc = parser.parseFromString(result, "text/xml");
                        iteminfo.id = itemID;
                        iteminfo.name = xmlDoc.getElementsByTagName("name")[0].innerHTML
                            .replaceAll("<![CDATA[", "")
                            .replaceAll("]]>", "");
                        iteminfo.level = xmlDoc.getElementsByTagName("level")[0].innerHTML;
                        iteminfo.icon = 'https://wow.zamimg.com/images/wow/icons/large/' + xmlDoc.getElementsByTagName("icon")[0].innerHTML + '.jpg';

                        // Cache system
                        localStorage.setItem(itemID, JSON.stringify(iteminfo))
                    })
                    .catch(error => console.log('error', error));
                return iteminfo
            },
            closeDialog() {
                this.$emit("close-func")
            },
            async changeMenu(step) {
                this.selectedMenu = step.toString();
                if (step == 1) {
                    this.achievementLoading = true;
                    // Parse achievements
                    const parseAchievementID = async (aID) => {
                        var requestOptions = {
                            method: 'GET',
                            redirect: 'follow',
                        };
                        let aInfo = {};

                        const storageInfo = localStorage.getItem(aID + 'a');
                        // Cache system
                        if (storageInfo !== null) {
                            return JSON.parse(storageInfo);
                        }
                        await fetch("http://localhost:44297/https://www.wowhead.com/achievement=" + aID, requestOptions)
                            .then(response => response.text())
                            .then(result => {
                                const rigidInfo = JSON.parse(result.split('<script type="application/ld+json">')[1].split("<\/script>")[0]);
                                aInfo.id = aID;
                                aInfo.name = rigidInfo.name;
                                aInfo.description = rigidInfo.description.replace('In the Character Achievements category. Always up to date with the latest patch (9.1.5).', '')
                                    .replace('Always up to date with the latest patch (9.1.5).', '');

                                // cache system
                                localStorage.setItem(aID + 'a', JSON.stringify(aInfo))
                            });
                        return aInfo
                    };
                    if (this.achievements.length == 0)
                        for (let i = 0; i < this.achievementsIDs.length; i++)
                            this.achievements.push(await parseAchievementID(this.achievementsIDs[i]));
                    this.achievementLoading = false;
                }

                if (step == 3) {
                    if (this.mountsData.length > 0) {
                        this.mountsLoading = false;
                        return
                    }
                    this.mountsLoading = true;
                    this.mounts.map(async (item) => {
                        let itemInfo = await this.parseItemId(item.id);
                        this.mountsData.push(itemInfo);
                    });
                    this.mountsLoading = false;
                }

                if (step == 4) {
                    if (this.companionsData.length > 0) {
                        this.companionsLoading = false;
                        return
                    }
                    this.companionsLoading = true;
                    this.companions.map(async (item) => {
                        let itemInfo = await this.parseItemId(item);
                        this.companionsData.push(itemInfo);
                    });
                    this.companionsLoading = false;
                }
            }
        },
        data() {
            return {
                heroID: 0,
                race: 0,
                gender: false,
                level: 0,
                heroClass: 0,
                equippedCache: "",
                horde: false,
                items: [],
                leftItems: [],
                rightItems: [],
                bottomItems: [],
                achievementsIDs: [],
                achievements: [],
                reputations: [],
                selectedMenu: 0,
                menuItems: ["Equipments", "Achievements", "Reputation", "Mounts", "Pets"],
                backgroundImage: "",
                loading: true,
                notifications: false,
                sound: true,
                widgets: false,
                heroClasses: wowDicts.heroClasses,
                heroRaces: wowDicts.heroRaces,
                wotlkReputations: wowDicts.wotlkReputations,
                achievementLoading: true,
                mounts: [],
                mountsData: [],
                mountsLoading: true,
                companions: [],
                companionsData: [],
                companionsLoading: true
            }
        },
    }
</script>

<style scoped>
  .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 30px;
    left: 0;
    /*background: url("~/static/hero_dialogs/stormwind_blur.png");*/
    background-size: cover;
    transform: scale(1);
  }

  .wow_icons {
    border: 1px solid darkmagenta;
  }

  .v-image__image--contain {
    background-position: left center !important;
  }
</style>
