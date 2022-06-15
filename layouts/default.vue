<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app

    >
      <v-list>
        <div class="text-center text-h6 ma-1">
          参加しているグループ
        </div>
        <v-list-item
          v-for="(group, i) in groups"
          :key="i"
        >

          <v-list-item-title>
            <v-list-item-title v-text="group.title"/>
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          to="/addGroup"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>
              mdi-plus
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'グループを追加'"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      fixed
      app
    >
      <v-app-bar-nav-icon @click="drawer = true"/>

      <v-toolbar-title>Kadai-Kanri</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-menu
        offset-y
        v-if="user.uid"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>
              mdi-account-circle
            </v-icon>
            {{ user.displayName }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              UID:{{ user.uid }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            @click="logout"
          >
            <v-list-item-content>
              ログアウト
            </v-list-item-content>
          </v-list-item>
        </v-list>

      </v-menu>
      <div v-else>
        ログイン
      </div>

    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt/>
      </v-container>
    </v-main>

    <v-footer
      app
    >
      <span>&copy; {{ new Date().getFullYear() }} - Kisarazu Hackathon Team D</span>
    </v-footer>
  </v-app>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export default {
  name: 'DefaultLayout',
  data() {
    return {
      drawer: false,
      groups: [],
      user: {
        uid: null,
        displayName: null
      }
    }
  },
  mounted() {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        this.$data.user = {
          uid: user.uid,
          displayName: user.displayName
        }


      } else {
        this.$data.user = {
          uid: null,
          displayName: null
        }
      }
    })
  },
  methods: {
    logout() {
      if (getAuth().currentUser) {
        getAuth().signOut();
      }
    }
  }
}
</script>
