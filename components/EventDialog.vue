<template>
  <v-dialog v-model="dialog">
    <v-card>
        <v-card-title>
          <span class="text-h5">課題の追加</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="6"
              >
              <v-text-field
                  label="教科"
              ></v-text-field>
              </v-col>
              
              <v-col
                cols="12"
                sm="6"
                md="6"
              >
              <v-text-field
                  label="提出先"
                  hint="例:教室"
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
                    @input="menu = false"
                    @change="datePick">
                  </v-date-picker>
                </v-menu>
              </v-col>

            <v-col
                cols="12"
                sm="6"
                md="6"
            >
                <v-select
                  :items="['1時限目', '2時限目', '3時限目', '4時限目', '5時限目', '6時限目', '7時限目', '8時限目', '終日']"
                  label="時限"
                  required
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="課題の名前"                  
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  label="メモ欄"
              ></v-textarea>
              </v-col>

            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="primary"            
            @click="dialog = false"
          >
            Save
          </v-btn>
        </v-card-actions>

      </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "EventDialog",
  data() {
    return {
      dialog: true,
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10),
      menu: false,
      }
    }

}
</script>

<style scoped>

</style>
