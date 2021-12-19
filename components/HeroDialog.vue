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
        <v-subheader>{{ heroName }}</v-subheader>
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
          <v-col lg="4">
            <v-list flat>
              <v-list-item-group
                v-model="selectedMenu"
                color="primary"
              >
                <v-list-item
                  v-for="(item, i) in menuItems"
                  :key="i">
                  <v-list-item-content>
                    {{item}}
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
          <v-col lg="8" class="justify-center">
            <v-stepper v-model="selectedMenu" non-linear style="background: transparent;">
              <v-stepper-items>
                <v-stepper-content step="0">
                  <v-row>
                    <h1>adas</h1>
                  </v-row>
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
    export default {
        middleware: 'auth',
        name: "HeroDialog",
        props: ["dialog", "heroName", "closeFunc"],
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
                        this.class = respData.class;
                        this.equippedCache = respData.equipment_cache;
                        const eqsplitted = this.equippedCache.split(" ");
                        for (let i = 0; i < eqsplitted.length; i += 2) {
                            this.items.push(eqsplitted[i])
                        }
                        if (this.race == 2 || this.race == 5 || this.race == 6 || this.race == 10 || this.race == 8)
                            this.backgroundImage = require("~/static/hero_dialogs/orgrimmar_blur.png");
                        else
                            this.backgroundImage = require("~/static/hero_dialogs/stormwind_blur.png");
                        const parseItemId = async (itemID) => {
                            var requestOptions = {
                                method: 'GET',
                                redirect: 'follow',
                            };
                            let iteminfo = {};
                            await fetch("http://localhost:44297/https://www.wowhead.com/item=" + itemID + "&xml", requestOptions)
                                .then(response => response.text())
                                .then(result => {
                                    // console.log(result);
                                    const parser = new DOMParser();
                                    let xmlDoc = parser.parseFromString(result,"text/xml");
                                    iteminfo.name = xmlDoc.getElementsByTagName("name")[0].innerHTML
                                        .replaceAll("<![CDATA[", "")
                                        .replaceAll("]]>", "");
                                    iteminfo.level = xmlDoc.getElementsByTagName("level")[0].innerHTML;
                                    iteminfo.icon = 'https://wow.zamimg.com/images/wow/icons/large/' + xmlDoc.getElementsByTagName("icon")[0].innerHTML;
                                })
                                .catch(error => console.log('error', error));
                            return iteminfo
                        };
                        // for (let i = 0; i < 8; i++) {
                        //     let r1 = await parseItemId(this.items[i]);
                        //     this.leftItems.push(r1);
                        //     let r2 = await parseItemId(this.items[i + 8]);
                        //     this.rightItems.push(r2);
                        // }
                        for (let i = 15; i < 19; i++) {
                            if (this.items[i] != "0") {
                                console.log(this.items[i]);
                                let r3 = await parseItemId(this.items[i]);
                                this.bottomItems.push(r3)
                            }
                        }
                        console.log(this.bottomItems);
                        console.log(this.leftItems);
                        console.log(this.rightItems);
                        console.log(this.items);
                        this.loading = false;
                    })
                }
            }
        },
        mounted() {
        },
        methods: {
            closeDialog() {
                this.$emit("close-func")
            }
        },
        data() {
            return {
                heroID: 0,
                race: 0,
                gender: false,
                level: 0,
                class: 0,
                equippedCache: "",
                items: [],
                leftItems: [],
                rightItems: [],
                bottomItems: [],
                selectedMenu: 0,
                menuItems: ["Hero Equipments", "Achievements", "Reputation", "Mounts", "Pets"],
                backgroundImage: "",
                loading: true,
                notifications: false,
                sound: true,
                widgets: false,
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
</style>
