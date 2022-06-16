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
            <v-text-field :rules="[groupID!=='',this.$data.state!==4]" v-model="groupID">

            </v-text-field>
          </v-col>

        </v-row>
        <v-btn :disabled="groupID===''" v-if="this.$data.state!==4" @click="join" color="primary">
          参加
        </v-btn>
        <v-btn v-else @click="tab=1">
          作成画面へ
        </v-btn>

      </v-tab-item>
      <v-tab-item>
        <v-row align="center">
          <v-col cols="auto">
            グループ名
          </v-col>
          <v-col cols="auto">
            <v-text-field :rules="[groupName!=='']" v-model="groupName">

            </v-text-field>
          </v-col>

        </v-row>
        <v-btn :disabled="groupName===''" @click="create" color="primary">
          追加
        </v-btn>
      </v-tab-item>
    </v-tabs-items>

  </v-container>

</template>

<script lang="js">
import { getAuth, } from 'firebase/auth'
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc,arrayUnion } from "firebase/firestore";
import error from '~/layouts/error'

const RoomState = {
  None: 0,
  Created: 1,
  CreateError: 2,
  Joined: 3,
  RoomIDDontExists: 4,
  JoinError: 5,
  AlreadyJoin: 6
}
export default {
  name: "addGroup",
  data() {
    return {
      state: RoomState.None,
      groupID: "",
      groupName: "",
      tab: null,
    }
  },
  methods: {
    //参加処理
    join(reference, data) {
      let af = async () => {
        const user = getAuth().currentUser
        const fs = getFirestore();
        const roomsCollectionRef = collection(fs, "rooms")
        const roomRef = doc(roomsCollectionRef, this.$data.groupID)
        const room = await getDoc(roomRef)
        const usersRef = collection(fs, "users")
        let userData = await getDoc(doc(usersRef, user.uid))
        if (userData.data().groups.includes(this.$data.groupID)) {
          return RoomState.AlreadyJoin
        } else if (room.exists()) {//ルームある
          console.log("room a", room.data())
          await setDoc(roomRef, {
            users: {
              [user.uid]: user.displayName
            }
          }, { merge: true })// Dont use update
          await updateDoc(doc(usersRef, user.uid),{
            groups: arrayUnion(this.$data.groupID)
          })

        } else {//ルームない
          console.log("room None")
          return RoomState.RoomIDDontExists
        }
      }
      af().then((state) => {
        if (state) {
          this.$data.state = state
        } else {
          this.$data.state = RoomState.Joined
        }

      }).catch(() => {
        this.$data.state = RoomState.JoinError
      })

    },
    async create() {
      const user = getAuth().currentUser
      const fs = getFirestore();
      const roomsRef = collection(fs, "rooms")


      const roomDoc = await setDoc(doc(roomsRef), {
        roomName: this.$data.groupName,
        users: {
          [user.uid]: user.displayName
        }
      })
      console.log(roomDoc)
    }
  }

}
</script>

<style scoped>

</style>
