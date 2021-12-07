<template>
  <v-row align="center" justify="center" style="margin-top: 50px;">
    <v-card style="padding: 30px; width: 50%;" class="justify-center">
      <v-row class="justify-center">
      <img src="~/static/login_wallpaper.jpg" style="width: 500px;" class="mx-auto"/>
      </v-row>
      <v-form
        style="margin-top: 20px;"
        ref="form"
        lazy-validation
      >
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>
        <v-text-field
          v-model="username"
          :counter="10"
          label="Username"
          required
        ></v-text-field>


        <v-select
          v-model="walletType"
          :items="availableWallets"
          :rules="[v => !!v || 'Item is required']"
          label="Wallet"
          required
        ></v-select>
        <v-text-field
          v-model="walletAddress"
          label="Wallet Address"
          placeholder="Ex. 0xDE4C72835bcC0041Dd1B446BfD0D85bE346BC0A2"
          required
        ></v-text-field>


        <v-btn
          color="success"
          class="mr-4"
          @click="validate"
        >
          Sign Up
        </v-btn>
      </v-form>
    </v-card>
  </v-row>
</template>

<script>
    export default {
        name: "register",
        data: () => ({
            email: "",
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            username: "",
            password: "",
            walletType: "",
            walletAddress: "",
            availableWallets: "",
        }),
        mounted() {
            this.$axios.get("/get_available_wallets")
                .then(response => {
                    this.availableWallets = response.data.wallets;
                })
        }
    }
</script>

<style scoped>

</style>
