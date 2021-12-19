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
          <v-col lg="4">

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
                    this.$axios.get("/wow/hero_info/" + this.heroName).then(response => {
                        const respData = response.data;
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
                loading: true,
                notifications: false,
                sound: true,
                widgets: false,
            }
        },
    }
</script>

<style scoped>

</style>
