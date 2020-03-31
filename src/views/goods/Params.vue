<template>
  <div class>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加参数</el-button>
          <!-- 请求回来的动态属性渲染 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, ind) in scope.row.attr_vals"
                  :key="ind"
                  closable
                  @close="handleColsed(ind, scope.row)"
                >{{item}}</el-tag>
                <!-- @keyup.enter.native 键盘抬起，摁下enter键盘才会触发 -->
                <!-- native：使用其他组件时，绑定事件时，需要加上native才会生效 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >修改</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加属性</el-button>
          <!-- 请求回来的静态属性渲染 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, ind) in scope.row.attr_vals"
                  :key="ind"
                  closable
                  @close="handleColsed(ind,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >修改</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框dialog -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框dialog -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCate, getInfo, addParamsInfo, getEditParamsInfo, editParamsInfo, removeParamsInfo, additionParamsInfo } from '../../api/params'
export default {
  name: '',
  data() {
    return {
      // 级联选择框数据源
      catelist: [],
      // 级联选择框配置项
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框双向绑定到的数组
      selectedCateKeys: [],
      // 2 请求参数：绑定值，选中选项卡的 name，默认many
      activeName: 'many',
      // 选中三级分类后，请求回来的many数据
      manyTableData: [],
      // 选中三级分类后，请求回来的only数据
      onlyTableData: [],
      // 控制添加对话框显示隐藏
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      // 控制修改对话框显示隐藏
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [{ required: true, message: '请输入修改名称', trigger: 'blur' }]
      },
      // tag 控制按钮与文本框的切换显示隐藏
      // inputVisible: false,
      // 文本框中输入的内容
      // inputValue: ''
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const res = await getCate()
      if (res.meta.status !== 200) return this.$message.error('获取商品分类数据失败！')
      this.catelist = res.data
    },
    // 1.1 级联选择框选中值变化时触发该函数，需要请求对应三级分类数据
    handleChange(val) {
      this.getParamsData()
    },
    // 1. 2切换 tab 标签触发该函数，切换时需要请求对应三级分类数据
    handleTabClick(tab, event) {
      this.getParamsData()
      console.log(this.activeName)
    },
    // 1 封装函数：级联选择框值为三级分类时发送请求，不为三级分类停止往下执行
    // 1.1 级联选择框发送变化时，发送请求数据
    // 1.2 动态参数按钮，静态属性按钮，被点击时发送请求
    async getParamsData() {
      // 不为三级分类时，停止往下执行，使用length长度去判断，当前选中的是几级分类，不是3级停止往下执行，并清空选中值
      if (this.selectedCateKeys.length !== 3) {
        // 清空所有数据，防止页面会渲染出来
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 为三级分类时发送请求：根据所选分类id，和当前所处的面板，获取对应的参数
      const res = await getInfo(this.cateId, { sel: this.activeName })
      if (res.meta.status !== 200) return this.$message.error('获取三级分类数据失败！')
      // 发送请求时，参数有可以是动态属性many，参数也有可能是静态属性only
      // 响应数据也就有两种，要么是many数据，要么是only数据
      // 通过判断请求的 this.activeName 是 many 还是 only，进行分别在data中赋值，进行页面渲染
      res.data.forEach(item => {
        // 使用split()，返回新数组，''.split(' ')返回[""]，需要处理一下，空字符串时返回空数组
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // tag 控制文本框的显示与隐藏
        item.inputVisible = false
        // tag 文本框中输入的值
        item.inputValue = ''
      })
      this.activeName == 'many' ? (this.manyTableData = res.data) : (this.onlyTableData = res.data)
    },
    // 添加参数对话框关闭时重置表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 发送添加参数请求
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // post 请求参数
        const data = {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        }
        const res = await addParamsInfo(this.cateId, data)
        if (res.meta.status !== 201) return this.$message.error('添加参数失败！')
        this.$message.success('添加参数成功！')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 点击按钮展示修改的对话框
    async showEditDialog(attr_id) {
      // 根据id查询修改数据，进行渲染
      const res = await getEditParamsInfo(this.cateId, attr_id, { attr_sel: this.activeName })
      if (res.meta.status !== 200) return this.message.error('获取参数信息失败！')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 关闭修改对话框重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改对话框发送请求
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 请求参数
        const data = {
          attr_name: this.editForm.attr_name,
          attr_sel: this.editForm.attr_sel,
          attr_vals: this.editForm.attr_vals
        }
        const res = await editParamsInfo(this.cateId, this.editForm.attr_id, data)
        if (res.meta.status !== 200) return this.$message.error('修改参数失败！')
        this.$message.success('修改参数成功！')
        // 刷新参数数据
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 根据id删除参数
    async removeParams(attr_id) {
      // 提示是否删除，取消返回'cancel'，确定返回'confirm'
      const result = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // result !== 'confirm' 证明取消删除，否则发送删除请求
      if (result !== 'confirm') return this.$message.info('已取消删除！')
      const res = await removeParamsInfo(this.cateId, attr_id)
      if (res.meta.status !== 200) return this.$message.error('删除参数失败！')
      this.$message.success('参数删除成功！')
      // 刷新参数数据
      this.getParamsData()
    },
    // tag点击按钮展示文本输入框
    showInput(row) {
      // 显示文本输入框：把row.inputVisible = true页面还没有重新渲染，页面重新渲染后会执行$nextTick()
      row.inputVisible = true
      // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会执行回调函数中的代码
      // 让文本框自动获取焦点
      this.$nextTick(_ => {
        // 获取DOM对象 this.$refs.saveTagInput.$refs
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // tag文本框失去焦点，或按下了Enter键都会触发
    handleInputConfirm(row) {
      // 输入的内容不合法，需要处理情况
      // 没有输入内容，或输入空格是：优化=>文本框去除首尾空格，然后length = 0时，把input的输入值赋值空，隐藏input框
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 输入内容时，把数据push到row.attr_vals中，因为数据是从scope.row中取到的，直接添加到row里，页面就会有该数据
      row.attr_vals.push(row.inputValue.trim())
      // push成功后，input清空
      row.inputValue = ''
      // 然后让input隐藏
      row.inputVisible = false
      // 因为上处理的是添加后，页面即可实现渲染
      // 所以在这里发生请求，进行添加，这样页面再次刷新就会有添加的新数据了
      // 请求参数：要求字符串，需要数组转字符串 toString()
      this.saveAttrVals(row)
    },
    // 发送请求：对 attr_vals的操作，保存到数据库
    async saveAttrVals(row) {
      const data = {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      }
      const res = await additionParamsInfo(this.cateId, row.attr_id, data)
      if (res.meta.status !== 200) return this.$message.error('修改参数项失败！')
      this.$message.success('修改参数项成功！')
    },
    // 删除tag标签，发送请求刷新数据
    handleColsed(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    // 实现按钮是否禁用功能
    // button 禁用 disabled="true" 不禁用 disabled="false"
    // 使用计算属性判断没有选中三级分类时，禁用返回true
    // 选中的是三级分类时，不禁用返回false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) return true
      return false
    },
    // 1 请求参数需要三级分类id，使用计算属性获取
    cateId() {
      // length == 3 时说明是三级分类，使用索引取出第三个参数即可，索引是从0开始
      if (this.selectedCateKeys.length == 3) return this.selectedCateKeys[2]
      return null
    },
    // 添加动态或静态属性时，使用计算属性显示dialog对话框标题
    titleText() {
      return this.activeName == 'many' ? '动态属性' : '静态属性'
    }
  },
  components: {}
}
</script>

<style scoped lang="scss">
.el-alert {
  margin-bottom: 20px;
}
.el-tabs {
  margin-top: 20px;
}
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
}
.input-new-tag {
  width: 200px;
}
</style>
