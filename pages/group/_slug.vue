<template>
  <v-container justify="center">
    <p class="text-h2">{{ roomName }}
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            @click="copyLink"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon small>
              mdi-content-copy
            </v-icon>
          </v-btn>
        </template>
        <span>招待リンクをコピー</span>
      </v-tooltip>
    </p>
    <v-snackbar
      v-model="snackbar"
      :timeout="2000"
    >
      コピーしました
      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          閉じる
        </v-btn>
      </template>
    </v-snackbar>
    <v-toolbar flat>
      <v-btn
        fab
        text
        small

        @click="prev"
      >
        <v-icon small>
          mdi-chevron-left
        </v-icon>
      </v-btn>
      <v-toolbar-title v-if="$refs.calendar">{{ $refs.calendar.title }}</v-toolbar-title>
      <v-btn
        fab
        small
        text
        @click="next"
      >
        <v-icon small>
          mdi-chevron-right
        </v-icon>
      </v-btn>

    </v-toolbar>
    <v-calendar
      ref="calendar"
      :events="events"
      v-model="value"
      :type="calendarType"

      color="primary"
      :short-intervals="true"

      interval-width="20"
      event-overlap-mode="column"

      interval-height="64"

      @click:event="showEvent"
    >
      <template v-slot:event="{ name,event, timed, eventSummary,timeSummary }">
        <div class="v-calendar-event-custom">{{ event.name }}<br>
          {{ event.subject }}
        </div>
      </template>
      <template v-slot:day-body="{ date, week ,time}">
        <div
          class="v-current-time"
          :class="{ first: date === week[0].date }"
          :style="{ top: nowY }"
        ></div>
      </template>
    </v-calendar>
    <v-menu
      v-model="selectedOpen"
      :close-on-content-click="false"
      :activator="selectedElement"
      offset-x
    >
      <v-card
        color="grey lighten-4"
        flat

      >
        <v-toolbar
          :color="selectedEvent.color"
          dense
          short
          dark
        >
          <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="editStart">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <h3>期限</h3>
          <span v-html="selectedEvent.start"></span><span v-if="selectedEvent.end"> ～ <span
          v-html="selectedEvent.end"></span></span>

          <div v-if="selectedEvent.subject"><h3>教科</h3>
            <span v-html="selectedEvent.subject"></span></div>
          <div v-if="selectedEvent.place"><h3>提出場所</h3>
            <span v-html="selectedEvent.place"></span></div>

          <div v-if="selectedEvent.memo"><h3>メモ</h3>
            <span v-html="selectedEvent.memo"></span></div>

          <div v-if="selectedEvent"><h3>最終編集</h3>

            <span>{{ userNameDictionary[selectedEvent.editor] }}</span><br>
            <span>{{ parseEventTimeStamp(selectedEvent) }}</span>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            color="secondary"
            @click="selectedOpen = false"

          >
            閉じる
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

    <v-dialog
      persistent

      v-model="dialog"
    >
      <template v-slot:activator="{ on, attrs }">

        <v-btn
          @click="openEventDialog"
          color="primary"
          elevation="5"
          fab
          fixed bottom right
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <EventDialogCard v-if="dialog" @createdEvent="addEvent" @editedEvent="editEvent"
                       @close="dialogClosed"
                       :edit-event="editTargetEvent"
                       :initial-date="value"></EventDialogCard>
    </v-dialog>

  </v-container>
</template>

<script>
import {
  doc,
  getFirestore,
  getDoc,
  onSnapshot,
  setDoc,
  arrayUnion,
  arrayRemove,
  writeBatch,
  runTransaction
} from "firebase/firestore"
import { getAuth } from 'firebase/auth'
import { initFirebaseAuth } from '~/scripts/fireauthutils'
import { eventConverter, Event, ConstTime } from '~/scripts/event'
import firebase from 'firebase/compat'

export default {
  data() {
    return {
      dialog: false,

      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,

      editTargetEvent: null,

      snackbar: false,
      calendarType: "week",

      value: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10),
      ready: false,
      userNameDictionary: {},
      events: [],
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
  methods: {
    editStart() {
      this.$data.editTargetEvent = this.$data.selectedEvent
      this.$nextTick(() => {
        this.$data.dialog = true
      })
    },
    dialogClosed() {
      this.$data.dialog = false
      this.$data.editTargetEvent = null
    },
    copyLink() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(location.host + "/addGroup?id=" + this.$data.groupID)
        this.$data.snackbar = true
      }

    },
    handleResize() {
      this.$data.calendarType = window.innerWidth >= 960 ? "week" : "4day"
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    showEvent({ nativeEvent, event }) {
      console.log(event)
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    editEvent(event, original) {
      const user = getAuth().currentUser
      const db = getFirestore()
      let writeEvent = event
      writeEvent.editor = user.uid
      writeEvent.finalUpdate = firebase.firestore.Timestamp.now();
      const groupRef = doc(db, "groups", this.$data.groupID)
      runTransaction(db, async (transaction) => {
        const groupDoc = await transaction.get(groupRef);
        if (!groupDoc.exists()) {
          throw "Document does not exist!";
        }
        const groupData = groupDoc.data()
        const eve = groupData.events.filter((v) => {
          return !(v.name === original.name && v.date === original.date &&
            v.time === original.time && v.subject === original.subject &&
            v.place === original.place && v.memo === original.memo &&
            v.editor === original.editor && v.finalUpdate.toDate().getTime() === original.finalUpdate.toDate().getTime())
        }).map((v) => {
          Object.assign({}, v)
        })
        eve.push(Object.assign({}, writeEvent))
        console.log("eve=>",eve)
        await transaction.update(groupRef, {
            events: eve,
          })
        /*

        transaction.set(doc(db, "groups", this.$data.groupID), {
            events: arrayRemove( Object.assign({}, original)),
          }
          , { merge: true })*/
      }).finally(()=>{
        this.$data.editTargetEvent=null

      });


    },
    addEvent(event) {
      const user = getAuth().currentUser
      const db = getFirestore()
      let writeEvent = event
      writeEvent.editor = user.uid
      writeEvent.finalUpdate = firebase.firestore.Timestamp.now();
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
    doUpdate(events, userNameDic) {
      this.$data.events = events
      this.$data.userNameDictionary = userNameDic
    },
    parseDateTime(event) {
      const tmp = event
      switch (tmp.time) {
        case ConstTime.AllDay.id: {
          tmp.start = tmp.date
          break;
        }
        default: {
          let o = Object.values(ConstTime).find(v => v.id === tmp.time)
          if (o) {

            tmp.start = tmp.date + " " + o.timeRange[0]
            tmp.end = tmp.date + " " + o.timeRange[1]
          }

        }
      }
      return tmp
    },
    parseEventTimeStamp(e) {
      return e?.finalUpdate?.toDate()
    }
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.$refs.calendar.checkChange()
    this.ready = true
    this.scrollToTime()
    this.updateTime()
    const db = getFirestore()
    const groupRef = doc(db, "groups", this.$data.groupID)
    onSnapshot(groupRef, (document) => {
      const groupData = document.data()
      if (groupData) {
        const events = groupData?.events
        console.log(events)
        const r = events?.map((e) => {
          return this.parseDateTime(e)
        })
        console.log("r->", r)
        this.doUpdate(r, groupData.users)
      }
    })
  },
  async asyncData({ params, error, redirect, app }) {
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

.v-calendar-event-custom {
  width: 100%;
  padding: 2px;
}
</style>
