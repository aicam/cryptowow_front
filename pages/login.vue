<template>
  <v-row class="fill-height" style="margin-top: 5%">
    <v-snackbar
      v-model="snackbar"
    >
      {{snacktext}}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="red"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <!-- /Snack bars -->

    <v-row align="center" justify="center">
      <v-card style="padding: 50px;" >
        <img src="~/static/login_wallpaper.jpg" style="width: 500px;"/>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="username"
            :rules="nameRules"
            label="Username"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            required
          ></v-text-field>

          <v-btn
            v-if="!loginStarted"
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="login"
          >
            Login
          </v-btn>
          <v-progress-circular
            v-if="loginStarted"
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>


          <v-btn
            color="error"
            class="mr-4"
            @click="forgot"
          >
            Forgot Password
          </v-btn>
        </v-form>
      </v-card>
    </v-row>
  </v-row>
</template>

<script>
    export default {
        name: "login",
        data: () => ({
            loginStarted: false,
            snackbar: false,
            snacktext: "Enter your username",
            valid: true,
            username: '',
            nameRules: [
                v => !!v || 'Username is required',
                v => (v && v.length <= 10) || 'Username must be less than 10 characters',
            ],
            password: '',
        }),
        methods: {
            async login() {
                if (!this.username) {
                    this.snackbar = true;
                    return
                }
                this.loginStarted = true;
                try {
                    let response = await this.$auth.loginWith('local', { data: {
                            username: this.username,
                            password: this.password
                        }
                    }).then(response => {
                        if (response.data.status === 1) {
                            this.snacktext = "Login successful";
                            this.snackbar = true;
                            setTimeout(() => {
                                window.location.href = '/inspire';
                            }, 3000)
                        } else {
                            this.snacktext = response.data.body;
                            this.snackbar = true;
                            this.loginStarted = false;
                        }
                    });
                    console.log(response)
                } catch (e) {
                    this.loginStarted = false;
                    console.log(e)
                }
            },
            forgot() {
                if (!this.username) {
                    this.snackbar = true;
                }
                this.$refs.form.reset()
            },
        },
    }
</script>

<style scoped>

</style>
