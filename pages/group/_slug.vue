<template>

</template>

<script>
export default {
  async asyncData({ params }) {
    const slug = params.slug // "/abc" パスにアクセスすると、slug は "abc" になります。
    console.log(slug)
    return { slug }
  }
}
</script>

<style scoped>

</style>
