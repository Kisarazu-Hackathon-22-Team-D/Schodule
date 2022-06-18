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
          v-for="group in groups"
          :key="group.id"
          :to="'/group/'+group.id"
          router
          exact
        >

          <v-list-item-title>
            <v-list-item-title v-text="group.name"/>
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
      <v-app-bar-nav-icon @click="drawer = !drawer"/>

      <v-toolbar-title>Schodule</v-toolbar-title>
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
        ログインしていません
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
import { onSnapshot, doc, getFirestore,getDocs ,getDoc,collection,query,where} from 'firebase/firestore'

export default {
  name: 'DefaultLayout',
  created() {
    this.$nuxt.$on('openDrawer', this.openMenu)
  },
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
    const db = getFirestore()
    const auth = getAuth()

    let unsubscribe;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.$data.user = {
          uid: user.uid,
          displayName: user.displayName
        }

        unsubscribe = onSnapshot(doc(db, "users", user.uid), (d) => {
          const data = d.data()

          console.log(data)
          if (data?.groups) {
            const groups = data.groups//GIDのArray
            this.$data.groups=[]
            groups.forEach((it)=>{
              getDoc(doc(db,"groups",it)).then((userDoc)=>{
                console.log(userDoc.data())
                this.$data.groups.push({id:it,name:userDoc.data().roomName})
              })
            })
          }
        });


      } else {
        this.$data.user = {
          uid: null,
          displayName: null
        }
        this.$router.push("/")
        unsubscribe?.()
      }
    })
  },
  methods: {
    openMenu(){
      this.$data.drawer=true
    },
    logout() {
      if (getAuth().currentUser) {
        getAuth().signOut();
      }
    }
  }
}
</script>
