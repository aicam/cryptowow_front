<template>
  <v-dialog
    v-model="dialog"
    @click:outside="$emit('close-func')"
    width="600">
    <v-card>
      <v-card-title style="padding: 20px">How to connect to DecentraWoW server?</v-card-title>
      <v-card-text>
        <v-row>
          <h3>First, you need to download world of warcraft client game with respect to patch you want to play.
            Currently,
            you need patch 3.3.5a to play
            in the server.</h3>
        </v-row>
        <v-row justify="space-around">
          <h3 style="color: #41b38a"><a href="https://mega.nz/folder/jPIUFArR#iVHWu5AUz9s6-lCSYPHMfw" target="_blank">Windows
            client</a></h3>
          <h3 style="color: #41b38a"><a href="https://download.sunwell.pl/WoW-3.3.5-Mac.zip" target="_blank">MacOS
            client</a></h3>
        </v-row>
        <v-row>
          <h3>After downloading the world of warcraft client you need to set server address in your wow.</h3>
          <h3>You need to replace &nbsp;</h3>
          <p style="color: orange">/Data/enUS/realmlist.txt</p>
          <h3> &nbsp;and &nbsp;</h3>
          <p style="color: orange">/WTF/config.txt</p>
          <h3> &nbsp; with &nbsp;</h3>
          <p style="color: orange">set realmlist wow.cryptowow.com</p>
        </v-row>
        <v-row>
          <h3>Finally you can open wow.exe to play in CryptoWoW server.</h3>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          @click="$emit('close-func')"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ManualDialog",
  props: ['dialog'],
}
</script>

<style scoped>

</style>
