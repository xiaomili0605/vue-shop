<template>
  <div class>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always">
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- vue-table-with-tree-grid 区域 -->
      <!-- 1 :data="catelist" 绑定数据  
           2 :columns="columns" 配置每列要展示的数据   
           3 :selection-type="false" 去掉复选框   
           4 :expand-type="false" 不显示展开行   
           5 :show-index="true" 索引列
           6 index-text="#"添加符号索引名称  
           7 border 显示纵向分割线   
           8 show-row-hover 鼠标悬停时，是否高亮当前行   
      9 在columns指定模板，作为展示内容-->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :show-index="true"
        border
        show-row-hover
        :expand-type="false"
        :selection-type="false"
      >
        <!-- 第二列渲染使用模板： isok是传给子组件的，scope是重子组件中获取到该行数据 -->
        <template slot="isok" slot-scope="scope">
          <i
            style="color: lightgreen;"
            class="el-icon-success"
            v-if="scope.row.cat_deleted == false"
          ></i>
          <i style="color: red;" class="el-icon-error" v-else></i>
        </template>
        <!-- 第三列渲染使用模板： order是传给子组件的，scope是重子组件中获取到该行数据 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level == 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 第四列渲染使用模板： opt是传给子组件的，scope是重子组件中获取到该行数据 -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- dialog 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        status-icon
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input type="text" v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="cat_name">
          <!-- 1. :options="parentCateList" 指定数据源 -->
          <!-- 1.2 :props 配置项: 就是安装该配置渲染 -->
          <!-- 1.3 v-model="selectedKeys" 选中的值存在 v-model 中，必须是个数组 -->
          <!-- 1.4 @change="parentCateChange" 监听选中值发生变化 -->
          <!-- 1.5 :clearable="true" 清空功能 -->
          <!-- 1.6 在 props中配置 checkStrictly: true 可选任意一级或多级 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            :clearable="true"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 可以全局注册组件，也可以局部注册组件，使用率不高选择局部注册
import treeTable from 'vue-table-with-tree-grid'
import { getCate, getParentCate, addCateInfo } from '../../api/cate.js'
export default {
  name: '',
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      // 商品分类的数据列表
      catelist: [],
      // 配置每列需要展示的数据，lable是该列名称，prop是该列数据
      columns: [
        // 第一列渲染
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        // 第二列渲染，特殊渲染时使用作用域插槽，'isok'为模拟名称
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        // 第三列渲染，还是使用模板
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        // 第四列渲染，还是使用模板
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 控制添加分类对话框的显示隐藏
      addCateDialogVisible: false,
      // 添加分类的请求参数，这样写可以实现双向数据绑定，也方法发送请求时直接当做参数
      // 注意：发送请求时直接看接口文档定义的名称
      addCateForm: {
        // 将要添加的分类名称
        cat_name: '',
        // 父级分类ID
        cat_pid: 0,
        // 分类的等级，默认添加的是一级分类
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入添加的分类名称', trigger: 'blur' }]
      },
      // 请求到的父级分类数据
      parentCateList: [],
      // 级联选择器配置项
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      // 级联选择框选中的值
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const res = await getCate(this.queryInfo)
      if (res.meta.status !== 200) return this.$message.error('获取商品分类列表失败！')
      this.catelist = res.data.result
      this.total = res.data.total
    },
    // 每页多少条发生变化时触发，val为当前每页条数
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getCateList()
    },
    // 页码值发生变化时触发，val为当前页面值
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getCateList()
    },
    // 点击添加分类按钮，展示对话框，并获取到父级分类数据绑定到data上
    showAddCateDialog() {
      this.addCateDialogVisible = true
      this.getParentCateList()
    },
    // 请求获取父级分类数据
    async getParentCateList() {
      const res = await getParentCate()
      if (res.meta.status !== 200) return this.$message.error('获取分类数据失败！')
      this.parentCateList = res.data
    },
    // 监听级联选择框选中值变化 按照接口文档处理参数 addCateForm
    parentCateChange() {
      // 如果selectedKeys 数组中的 length 大于 0 ，证明选中了父级分类，反之就是没有选中
      if (this.selectedKeys.length > 0) {
        // 为当前父类id赋值
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        // 级联选择框没有选中值的时候赋值0即可
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类对话框关闭时重置表单
    addCateDialogClosed() {
      // 表单重置
      this.$refs.addCateFormRef.resetFields()
      // 级联选择框重置为空
      this.selectedKeys = []
      // 请求参数也赋值为0
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 发送添加分类请求
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        // 校验失败，停止往下执行
        if (!valid) return
        const res = await addCateInfo(this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败！')
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    }
  },
  components: {
    treeTable
  }
}
</script>

<style scoped lang="scss">
.treeTable {
  margin-top: 15px;
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
