<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-if="item.show"
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"/>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          exact
        >
          <v-btn
            v-if="isLoggedIn"
            @click="logoutUser">
            Logout
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-switch

      <v-spacer/>
      <img src="~/static/title_banner.png" height="110px" style="margin-top: 40px;"/>
      <v-spacer/>

    </v-app-bar>
    <v-main>
      <span class="bg"></span>
      <v-container>
        <Nuxt/>
      </v-container>
    </v-main>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

  </v-app>
</template>
<style>
  .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: url('https://wallpapercave.com/wp/HWtnBHH.jpg') no-repeat center center;
    background-size: cover;
    transform: scale(1.1);
  }
</style>
<script>
    export default {
        // computed() {
        //     // $colorMode.preference = color
        // },
        methods: {
            logoutUser: function () {
                this.$auth.logout();
                window.location.href = '/';
            },
            // isLoggedIn: function () {
            //     console.log('checked ' + this.$auth.loggedIn);
            //     return this.$auth.loggedIn
            // }
        },
        data() {
            return {
                isLoggedIn: this.$auth.loggedIn,
                clipped: false,
                drawer: false,
                fixed: false,
                items: [
                    {
                        icon: 'mdi-apps',
                        title: 'Welcome',
                        to: '/',
                        show: true,
                    },
                    {
                        icon: 'mdi-chart-bubble',
                        title: 'Dashboard',
                        to: '/inspire',
                        show: this.$auth.loggedIn
                    },
                    {
                        icon: 'mdi-account-arrow-left',
                        title: 'Login',
                        to: '/login',
                        show: !this.$auth.loggedIn
                    },
                    {
                        icon: "mdi-account-plus",
                        title: 'Sign Up',
                        to: '/register',
                        show: !this.$auth.loggedIn
                    }
                ],
                miniVariant: false,
                right: true,
                rightDrawer: false,
                title: 'Vuetify.js'
            }
        }
    }
</script>
