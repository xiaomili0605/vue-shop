<template>
  <div class="">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {}
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  },
  components: {}
}
</script>

<style scoped lang="less">
</style>
