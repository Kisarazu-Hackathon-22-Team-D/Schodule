<template>
  <v-container justify="center">
    <p class="text-h2">Kadai-Kanri</p>
    <p class="text-h4 ">課題を管理しよう</p>
    <FirebaseAuth v-if="!user"></FirebaseAuth>

    <div v-else>
      <p class="text-h3">ようこそ、{{user.displayName}} さん</p>
      <div>ユーザーID:{{user.uid}}</div>
      <v-btn @click="$nuxt.$emit('openDrawer')" color="primary">
        始める
      </v-btn>
    </div>
    <!--<v-calendar type="week">

    </v-calendar>
    <v-btn
      @click="addItem"
      color="primary"
      elevation="5"
      fab
      fixed bottom right
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <EventDialog></EventDialog> Moved to group/_slug.vue-->
  </v-container>
</template>

<script>

import { initFirebaseAuth } from '~/scripts/fireauthutils'

export default {
  name: 'IndexPage',
  data() {
    return {}
  },
  methods: {
  },
  async asyncData() {
    const user = await initFirebaseAuth()
    if (user){
      return {
        user:{
          uid: user.uid,
          displayName: user.displayName
        }
      }
    }else{
      return {user:null}
    }
  }
}
</script>
