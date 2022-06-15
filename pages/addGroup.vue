<template>

  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="text-h4">グループを追加</div>
      <v-row align="center">
        <v-col cols="auto">
          グループ名
        </v-col>
        <v-col cols="auto">
          <!--ここの中に書く-->
          <v-text-field>

          </v-text-field>
        </v-col>

      </v-row>
    </v-col>
  </v-row>

</template>

<script>
export default {
  name: "addGroup",
  data() {
    return {}
  },
  methods: {
    submit() {
      //未実装 TODO @Naoki
    }
  }

}
</script>

<style scoped>

</style>
