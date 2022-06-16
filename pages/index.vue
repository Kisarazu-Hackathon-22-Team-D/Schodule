<template>
  <v-container justify="center" >
    <FirebaseAuth></FirebaseAuth>
      <v-calendar  type="week">

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
  </v-container>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      isButtonPushed: false,
      Nanika: "AAAA",
      hogehoge: 12345
    }
  },
  methods:{
    addItem(){
      //イベント追加
    }
  }

}
</script>
