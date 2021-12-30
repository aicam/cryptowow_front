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
            @click="closeDia()"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Events</v-toolbar-title>
          <v-spacer></v-spacer>

        </v-toolbar>
        <v-banner class="justify-center text-center">
          <p style="font-weight: bolder; font-size: 20px;">Active Events</p>
        </v-banner>
        <v-card v-for="event in eventsList" v-bind:key="event.title" class="event_body">
          <v-row>
            <v-col sm="3">
              <v-img :src="event.icon" max-width="300"/>
            </v-col>
            <v-col sm="9">
              <p style="font-size: 30px; color: #47494e; font-family: 'DejaVu Serif';">
                <v-icon x-large color="#D0BD73">mdi-halloween</v-icon>
                {{event.conditions}}
              </p>
              <p style="font-size: 25px; color: black;">{{event.description}}</p>
              <p style="font-size: 25px;"><v-icon x-large>mdi-gift</v-icon> {{event.gift}}</p>
              <Countdown :end="getCountdownTime(event.end_date)" style="color: orangered;"></Countdown>
            </v-col>
          </v-row>
        </v-card>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
    import Countdown from 'vuejs-countdown'

    export default {
        props: ['dialog'],
        components: {Countdown},
        mounted() {
          this.$axios.get("/events").then(response => {
              console.log(response.data);
              this.eventsList = response.data;
          })
        },
        methods: {
            closeDia() {
                console.log("closeDia called");
                this.$emit('clicked');
                // this.dialog = false
            },
            getCountdownTime(newTime){
                console.log(newTime);
                newTime = new Date(newTime);
                console.log(newTime);
                const month = newTime.toDateString().split(' ')[1];
                const day = newTime.toDateString().split(' ')[2] + ',';
                const year = newTime.toDateString().split(' ')[3];
                console.log(month + ' ' + day + ' ' + year);
                return month + ' ' + day + ' ' + year;
            }
        },
        data() {
            return {
                notifications: false,
                sound: true,
                widgets: false,
                eventsList: []
            }
        },
    }
</script>

<style scoped>
  .event_body {
    margin: 30px;
    padding: 20px;
    background-color: darkgray;
  }

  .title_container {
    margin-top: 30px;
    justify-content: center;
    align-content: center;
    justify-items: center;
    align-items: center;
    text-align: center;
  }

  .title_text {
    font-size: 40px;
    color: #47494E;
    font-weight: bold;
    font-family: 'Nimbus Roman No9 L';
  }
</style>
