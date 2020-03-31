<template>
  <div class>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表区域 -->
      <el-table :data="orderlist" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="200"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="90"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款"></el-table-column>
        <el-table-column label="是否发货">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_send == 0">未付款</el-tag>
            <el-tag type="danger" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="160px">
          <template slot-scope="scope">{{scope.row.create_time | formatTimer}}</template>
        </el-table-column>
        <el-table-column prop label="操作" width="120px">
          <template slot-scope>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgresssBox"></el-button>
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
      ></el-pagination>
    </el-card>
    <!-- dialog 修改地址 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
      <el-form
        :model="addressForm"
        status-icon
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
            :collapse-tags="true"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- dialog 物流进度 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(item, ind) in progressInfo"
          :key="ind"
          :timestamp="item.time"
        >{{item.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
// 引入省市县三级
import cityData from './citydata'
import { formatTimer } from '../../utils/filters'
import { getOrders, getProgress } from '../../api/order'
export default {
  name: '',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      orderlist: [],
      // 控制修改地址的dialog显示隐藏
      addressVisible: false,
      // 请求参数
      addressForm: {
        // 因为是级联选择器所以定义成数组
        address1: [],
        // 文本输入框定义成字符串
        address2: ''
      },
      addressFormRules: {
        address1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]
      },
      // 省市县三级数据js
      cityData,
      // 控制物流进度的dialog显示隐藏
      progressVisible: false,
      // 响应的物流数据
      progressInfo: []
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    // 获取订单数据列表
    async getOrdersList() {
      const res = await getOrders(this.queryInfo)
      if (res.meta.status !== 200) return this.$message.error('获取数据失败！')
      this.total = res.data.total
      this.orderlist = res.data.goods
    },
    // 没有多少条发生变化触发这个函数，重新赋值新的条数，重新获取数据
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getOrdersList()
    },
    // 页码值发生变化触发这个函数，重新赋值新的页码值，重新获取数据
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getOrdersList()
    },
    // 展示修改地址的对话框
    showBox() {
      this.addressVisible = true
    },
    // 级联选框值发生变化触发这个函数
    handleChange() {
      console.log(this.addressForm.address1)
    },
    // 关闭对话框后重置表单
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    // 点击按钮，获取物流数据，显示物流进度对话框
    async showProgresssBox() {
      const res = await getProgress()
      if (res.meta.status !== 200) return this.$message.errror('获取物流数据失败！')
      console.log(res)
      this.progressInfo = res.data
      this.progressVisible = true
    }
  },
  components: {},
  // 过滤器
  filters: {
    formatTimer
  }
}
</script>

<style scoped lang="scss">
.el-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
