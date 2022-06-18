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
            <v-text-field :rules="[groupID!=='',this.$data.state[0]!==4]" v-model="groupID">

            </v-text-field>
          </v-col>

        </v-row>
        <v-btn :disabled="!groupID" v-if="this.$data.state[0]!==4" @click="join" color="primary">
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
    <v-container v-if="$data.state[0]!==0">
      <div>{{ $data.state[1] }}</div>
    </v-container>
  </v-container>

</template>

<script lang="js">
import { getAuth, } from 'firebase/auth'
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import error from '~/layouts/error'

const RoomState = {
  None: [0, null],
  Created: [1, "作成しました！"],
  CreateError: [2, "グループ作成中にエラーが発生しました"],
  Joined: [3, "参加しました！"],
  GroupIDDontExists: [4, "グループが見つかりませんでした"],
  JoinError: [5, "参加中にエラーが発生しました"],
  AlreadyJoin: [6, "すでに参加しています"]
}
export default {
  name: "addGroup",
  data() {
    return {
      state: RoomState.None,
      groupID: this.$route.query.id,
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
        const roomsCollectionRef = collection(fs, "groups")
        const roomRef = doc(roomsCollectionRef, this.$data.groupID)
        const room = await getDoc(roomRef)
        const usersRef = collection(fs, "users")
        let userData = await getDoc(doc(usersRef, user.uid))
        if (userData.data()?.groups?.includes(this.$data.groupID)) {
          //もう参加してるよー
          return RoomState.AlreadyJoin
        } else if (room.exists()) { //ルームある
          console.log("room a", room.data())
          await setDoc(roomRef, {
            users: {
              [user.uid]: user.displayName
            }
          }, { merge: true })// Dont use update
          await setDoc(doc(usersRef, user.uid), {
            groups: arrayUnion(this.$data.groupID)
          }, { merge: true })

        } else {//ルームない
          console.log("room None")
          return RoomState.GroupIDDontExists
        }
      }
      af().then((state) => {
        console.log(state)
        if (state) {
          this.$data.state = state
        } else {
          this.$data.state = RoomState.Joined
        }

      }).catch((reason) => {
        console.log("WTF ", reason)
        this.$data.state = RoomState.JoinError
      })

    },
    create() {
      const af = async () => {
        const user = getAuth().currentUser
        const fs = getFirestore();
        const roomsRef = collection(fs, "groups")
        const usersRef = collection(fs, "users")
        const roomDoc = doc(roomsRef)
        await setDoc(roomDoc, {
          roomName: this.$data.groupName,
          users: {
            [user.uid]: user.displayName
          }
        })

        await setDoc(doc(usersRef, user.uid), {
          groups: arrayUnion(roomDoc.id)
        }, { merge: true })
        console.log(roomDoc)
      }
      af().then((state) => {
        if (state) {
          this.$data.state = state
        } else {
          this.$data.state = RoomState.Created
        }
      }).catch((e) => {
        console.error(e)
        this.$data.state = RoomState.CreateError
      })
    }
  }

}
</script>

<style scoped>

</style>
