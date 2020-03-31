<template>
  <div class>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
       <!-- 搜索添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 思路：已有获取数据事件，利用v-model双向数据绑定把输入内容和请求参数绑定到一起，发送请求即可 -->
          <!-- 1 v-model="queryInfo.query"，提前定义好参数名称query，根据接口文档命名  -->
          <!-- 2 点击button按钮发送请求 -->
          <!-- 3 请求参数和渲染，渲染页面时已提前写好了，调用即可 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table 区域 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="100px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100px"></el-table-column>
        <el-table-column label="创建日期" width="160px">
          <!-- elementui 中使用过滤器 -->
          <template slot-scope="scope">{{scope.row.add_time|formatTimer}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
// 引入过滤器
import { formatTimer } from '../../utils/filters'
import { getGoods, removeGoods } from '../../api/list'
export default {
  name: '',
  data() {
    return {
      // 请求参数，整理成对象，方便后期使用
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 默认总条
      total: 0,
      // 获取到的数据
      goodslist: []
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取渲染数据列表、总条数
    async getGoodsList() {
      const res = await getGoods(this.queryInfo)
      if (res.meta.status !== 200) return this.$message.error('获取数据失败！')
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    // 每页多少条发生变化，修改请求参数，然后发送请求实现页面刷新
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    // 页码值发生变化触发，修改请求参数，然后发送请求实现页面刷新
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    // 根据id删除该条数据
    async removeById(id) {
      const result = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if (result !== 'confirm') return this.$message.info('已取消删除！')
      const res = await removeGoods(id)
      if (res.meta.status !== 200) return this.$message.errror('删除失败！')
      this.$message.success('删除成功！')
      // 刷新数据
      this.getGoodsList()
    },
  // 添加商品 路由跳转方式
    goAddpage() {
      this.$router.push('/add')
    }
  },
  components: {},
  // 过滤器
  filters: {
    // 过滤日期时间
    formatTimer
  }
}
</script>
<style scoped lang="scss">
//
/*.el-table */
.el-table {
  margin: 15px 0;
}
</style>
