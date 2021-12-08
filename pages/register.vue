<template>
  <v-row align="center" justify="center" style="margin-top: 50px;">
    <v-stepper v-model="stepper">
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card style="padding: 30px;" class="justify-center">
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
              <p style="color: orangered; margin-bottom: -10px;">Note: this username is used to log in in the game</p>
              <v-text-field
                v-model="username"
                :counter="10"
                label="Username"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                type="password"
                label="Password"
                required
              ></v-text-field>


              <v-select
                v-if="!!availableWallets"
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
                v-if="!registerStarted"
                color="success"
                class="mr-4"
                @click="signup"
              >
                Sign Up
              </v-btn>
              <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
                v-if="registerStarted"
              ></v-progress-circular>
            </v-form>
          </v-card>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-alert
            type="success">
            You have signed up successfully, now you can login with your email to website and login with your username in game.
          </v-alert>
          <v-btn class="success" to="/login">
            Login Now
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>


    <v-snackbar
      v-model="snackbar"
    >
      {{ snacktxt }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog
      v-model="dialog"
      width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Privacy Policy
        </v-card-title>

        <v-card-text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="signup"
          >
            I accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
    export default {
        name: "register",
        data: () => ({
            registerStarted: false,
            stepper: 1,
            dialog: false,
            snackbar: false,
            snacktxt: "",
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
        },
        methods: {
            signup: function () {
                if (!this.email || !this.username || !this.password) {
                    this.snacktxt = "Email, username and password must filled";
                    this.snackbar = true;
                    return
                }
                if (this.dialog === true) {
                    this.dialog = false;
                    this.$axios.post("/register", JSON.stringify({
                        email: this.email,
                        username: this.username,
                        password: this.password,
                        wallet: this.walletType,
                        wallet_id: this.walletAddress
                    })).then(response => {
                        if (response.data.status_code === 0) {
                            this.snacktxt = "Username already exist, please choose another username";
                            this.snackbar = true;
                        } else if (response.data.status_code === 1) {
                            this.registerStarted = true;
                            this.snacktxt = "Your registration is almost done!";
                            this.snackbar = true;
                            setTimeout(() => {this.stepper = 2}, 3000);
                        }
                    });
                    return;
                }
                this.dialog = true;
            }
        }
    }
</script>

<style scoped>

</style>
