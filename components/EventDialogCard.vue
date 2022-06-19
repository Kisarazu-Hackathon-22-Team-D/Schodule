<template>

  <v-card>
    <v-card-title>

      <span class="text-h5">課題の<span v-if="$props.editEvent">編集</span><span v-else>追加</span></span>

    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid">
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="課題の名前"
              v-model="name"
              :rules="[ v => !!v || '名前は必須です']"
              required
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="6"
          >
            <v-text-field
              v-model="subject"
              label="教科"
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            sm="6"
            md="6"
          >
            <v-text-field
              v-model="place"
              label="提出場所"
              hint="「教室」やTeamsのURLなど"
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            sm="6"
            md="6"
          >
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="期限"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                locale="ja-jp"
                @input="menu = false"
              >
              </v-date-picker>
            </v-menu>
          </v-col>

          <v-col
            cols="12"
            sm="6"
            md="6"
          >
            <v-select
              v-model="time"
              :items="items"
              item-text="text"
              item-value="id"
              :rules="[ v => v != null || '時限は必須です']"
              label="時限"
              required
            ></v-select>
          </v-col>


          <v-col cols="12">
            <v-textarea
              v-model="memo"
              label="メモ"
            ></v-textarea>
          </v-col>

        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="blue darken-1"
        text
        @click="close"
      >
        閉じる
      </v-btn>
      <v-btn
        color="primary"
        @click="createEvent"
      >
        <span v-if="$props.editEvent">保存</span><span v-else>追加</span>

      </v-btn>
    </v-card-actions>

  </v-card>

</template>

<script>
import { ConstTime, Event } from '~/scripts/event'
import { arrayRemove } from "firebase/firestore"

export default {
  name: "EventDialogCard",

  props: {

    initialDate: {
      type: String,

    },
    editEvent: {
      type: Object,
      default: null
    }
  },
  mounted() {
    const propEvent = this.$props.editEvent
    if (propEvent) {
      this.$data.name = propEvent.name
      this.$data.subject = propEvent.subject
      this.$data.place = propEvent.place
      this.$data.date = propEvent.date
      this.$data.time = propEvent.time
      this.$data.memo = propEvent.memo
    }
  },


  data() {
    return {
      valid: true,

      name: "",
      subject: "",
      place: "",
      date: this.$props.initialDate,
      time: null,
      memo: "",

      items: Object.values(ConstTime),
      menu: false,
    }
  },
  /*watch: {
    show(value) {
      if (value) {
        Object.assign(this.$data, this.$options.data.apply(this))
      }
    }
  },*/
  methods: {
    close() {
      this.$emit("close")
    },

    createEvent() {
      console.log(this.$data.date)
      if (this.$refs.form.validate()) {
        const original=  this.$props.editEvent

        const e = new Event(
          this.$data.name,
          this.$data.date,
          this.$data.time,
          this.$data.subject,
          this.$data.place,
          this.$data.memo)
        if(this.$props.editEvent){
          delete original.start
          delete original.end
          this.$emit("editedEvent", e,original)
        }else this.$emit("createdEvent", e)
        this.close()
      }

    }
  }

}


</script>

<style scoped>

</style>
