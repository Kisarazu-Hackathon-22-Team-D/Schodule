<template>
  <v-dialog v-model="_model">
    <v-card>
        <v-card-title>
          <span class="text-h5">課題の追加</span>
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
                  :rules="[ v => !!v || '時限は必須です']"
                  label="時限"
                  required
                ></v-select>
              </v-col>



              <v-col cols="12">
                <v-textarea
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
            @click="_model = false"
          >
            閉じる
          </v-btn>
          <v-btn
            color="primary"
            @click="createEvent"
          >
            追加
          </v-btn>
        </v-card-actions>

      </v-card>
  </v-dialog>
</template>

<script>
import { ConstTime, Event } from '~/scripts/event'

export default {
  name: "EventDialog",
  model: {
    prop: 'model',
    event: 'change'
  },
  props: {
    model: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    _model: {
      get () {
        return this.model
      },
      set (value) {
        this.$emit('change', value)
      }
    }
  },
  data() {
    return {
      valid: true,

      name:"",
      subject:"",
      place:"",
      items:Object.values(ConstTime),
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10),
      time:null,
      memo:"",
      menu: false,
      }
    },
  methods:{
    createEvent(){
      if (this.$refs.form.validate()) {
        const e=new Event(
          this.$data.name,
          this.$data.date,
          this.$data.time,
          this.$data.subject,
          this.$data.place,
          this.$data.memo)
        this.$emit("createdEvent",e)
        this.$emit('change', false)
      }

    }
  }

}
</script>

<style scoped>

</style>
