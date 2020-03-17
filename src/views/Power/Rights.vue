<template>
  <div class>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <el-table :data="rightslist" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag size="mini" v-if="scope.row.level == 0">一级</el-tag>
            <el-tag type="success" size="mini" v-else-if="scope.row.level == 1">二级</el-tag>
            <el-tag type="warning" size="mini" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRights } from '../../api/rights'
export default {
  name: '',
  data() {
    return {
      rightslist: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const res = await getRights()
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败！')
      this.rightslist = res.data
    }
  },
  components: {}
}
</script>

<style scoped lang="less">
</style>
