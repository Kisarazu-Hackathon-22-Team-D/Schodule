<template>
  <v-container justify="center">
    <p class="text-h2">{{ roomName }}</p>
    <p class="text-h4" v-if="$refs.calendar">{{ $refs.calendar.title }}</p>
    <v-calendar
      ref="calendar"
      :events="events"
      v-model="value"
      type="week"
      color="primary"
      locale="ja-jp"
      @click:event="showEvent"
    >
      <template v-slot:interval="{minute}">

      </template>
      <template v-slot:day-body="{ date, week ,time}">
        <div
          class="v-current-time"
          :class="{ first: date === week[0].date }"
          :style="{ top: nowY }"
        ></div>
      </template>

    </v-calendar>
    <v-btn
      @click="openEventDialog"
      color="primary"
      elevation="5"
      fab
      fixed bottom right
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <EventDialog @createdEvent="addEvent" v-model="dialog"></EventDialog>
  </v-container>
</template>

<script>
import { doc, getFirestore, getDoc, onSnapshot, setDoc, arrayUnion } from "firebase/firestore"
import { getAuth } from 'firebase/auth'
import { initFirebaseAuth } from '~/scripts/fireauthutils'
import { eventConverter, Event, ConstTime } from '~/scripts/event'
import firebase from 'firebase/compat'

export default {
  data() {
    return {
      dialog: false,
      value: '',
      ready: false,
      userNameDictionary: {},
      events: [
        {
          name: '続・羅生門',
          start: '2022-06-17 09:00',
          end: '2022-06-17 11:00',
        },
        {
          name: `Thomas' Birthday`,
          start: '2022-06-17',
        },
        {
          name: 'Mash Potatoes',
          start: '2022-06-16',
          end: '2022-06-16 15:30',
        },
      ],
    }
  },
  computed: {
    cal() {
      return this.ready ? this.$refs.calendar : null
    },
    nowY() {
      return this.cal ? this.cal.timeToY(this.cal.times.now) + 'px' : '-10px'
    },
  },
  mounted() {
    this.ready = true
    this.scrollToTime()
    this.updateTime()
    const db = getFirestore()
    const groupRef = doc(db, "groups", this.$data.groupID)
    onSnapshot(groupRef, (document) => {
      const groupData = document.data()
      if (groupData) {
        const events=groupData.events
        console.log(events)
        const r= events.map((e)=>{
          const tmp=e
          switch (tmp.time) {
            case ConstTime.AllDay.id:{
              tmp.start=tmp.date
              break;
            }
            default:{
              let o=Object.values(ConstTime).find(v=>v.id === tmp.time)
              if (o) {

                tmp.start=tmp.date+" "+o.timeRange[0]
                tmp.end=tmp.date+" "+o.timeRange[1]
              }

            }
          }
          return tmp
        })
        console.log("r->",r)
        this.doUpdate(r,  groupData.users)
      }
    })
  },
  methods: {
    showEvent(){

    },
    addEvent(event) {
      const user = getAuth().currentUser
      const db = getFirestore()
      let writeEvent = event
      writeEvent.editor = user.uid
      writeEvent.finalUpdate = firebase.firestore.Timestamp.now();
      console.log()
      setDoc(doc(db, "groups", this.$data.groupID), {
          events: arrayUnion(Object.assign({}, writeEvent))
        }
        , { merge: true }).then(() => {
        console.log("Done")
      }).catch((e) => {
        console.error(e)
      })


    },
    openEventDialog() {
      this.$data.dialog = true
    },
    getCurrentTime() {
      return this.cal ? this.cal.times.now.hour * 60 + this.cal.times.now.minute : 0
    },
    scrollToTime() {
      const time = this.getCurrentTime()
      const first = Math.max(0, time - (time % 30) - 30)

      this.cal.scrollToTime(first)
    },
    updateTime() {
      setInterval(() => this.cal.updateTimes(), 60 * 1000)
    },
    doUpdate(events,userNameDic){
      this.$data.events=events
      this.$data.userNameDictionary=userNameDic
    }
  },
  async asyncData({ params, error, redirect,app }) {
    //参加認証
    const db = getFirestore()
    const groupID = params.slug
    console.log(groupID)
    if (!groupID) {//groupIDが空
      error({ statusCode: 404, message: 'URLが無効です' })
      return {}
    }


    const groupRef = doc(db, "groups", groupID)
    const d = await getDoc(groupRef)
    if (d.exists()) {
      //あるーーー！！！
      const user = await initFirebaseAuth()
      if (user) {
        // ログインしていれば中通る
        console.log(user); // ユーザー情報が表示される
        if (Object.keys(d.data().users).includes(user.uid)) {//入ってるーー！！
          return { groupID: groupID, roomName: d.data().roomName }
        } else {//まだ入ってないよ～ん
          redirect({ path: '/addGroup', query: { id: groupID } })
        }
      }
    } else {
      error({ statusCode: 404, message: 'そんなグループありません' })
      return {}
    }


  }

}
</script>

<style lang="scss">
.v-current-time {
  height: 2px;
  background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.first::before {
    content: '';
    position: absolute;
    background-color: #ea4335;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: -6.5px;
  }
}

</style>
