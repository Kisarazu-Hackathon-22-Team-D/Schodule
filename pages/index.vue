<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-calendar type="week"></v-calendar>
      <v-btn
        color="primary"
        elevation="5"
        fab
        fixed bottom right
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-col>
  </v-row>
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

}
</script>
