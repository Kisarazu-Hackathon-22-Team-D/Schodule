<template>

  <v-container justify="center">
    <v-tabs v-model="tab">
      <v-tab>既存のグループに参加</v-tab>
      <v-tab>グループを新規作成</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-row align="center">
          <v-col cols="auto">
            グループID
          </v-col>
          <v-col cols="auto">
            <v-text-field :rules="[groupID!=='']" v-model="groupID">

            </v-text-field>
          </v-col>

        </v-row>
        <v-btn :disabled="groupID===''" @click="join" color="primary">
          参加
        </v-btn>
      </v-tab-item>
      <v-tab-item>
        <v-row align="center">
          <v-col cols="auto">
            グループ名
          </v-col>
          <v-col cols="auto">
            <v-text-field :rules="[groupID!=='']" v-model="groupID">

            </v-text-field>
          </v-col>

        </v-row>
        <v-btn :disabled="groupID===''" @click="create" color="primary">
          追加
        </v-btn>
      </v-tab-item>
    </v-tabs-items>

  </v-container>

</template>

<script lang="js">
import {getAuth} from 'firebase/auth'
import { getFirestore,collection,doc,getDoc, } from "firebase/firestore";
export default {
  name: "addGroup",
  data() {
    return {
      groupID:"",
      tab:null,
    }
  },
  methods: {
    async join(){
      const fs=getFirestore();
      const roomsRef=collection(fs,"rooms")
      const room=await doc(roomsRef,this.$data.groupID).get()
      if (room.exists) {//ルームある

      }else {//ルームない

      }
    },
    async create() {

      //未実装 TODO @Naoki
    }
  }

}
</script>

<style scoped>

</style>
