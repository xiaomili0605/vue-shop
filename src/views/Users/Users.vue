<template>
  <div class>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <!-- 搜索 添加用户区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- 2 switch 开关 -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 1. 分页区域 -->
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
    <!-- 3 dialog 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close="addDialogClose">
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model.number="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 4 dialog 修改用户信息 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model.number="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 7 dialog 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClose">
      <div>
        <p>当前用户信息：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { validateEmail, validateMobile } from '../../utils/validate'
import { getUser, editUser, addUserInfo, getEditUser, editUserInfo, removeUser, getRoles, editRole } from '../../api/user'
export default {
  name: '',
  data() {
    // 验证邮箱
    const checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入邮箱'))
      } else if (!validateEmail(value)) {
        return callback(new Error('请输入合法邮箱'))
      } else {
        callback()
      }
    }
    // 手机号验证
    const checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入手机号'))
      } else if (!validateMobile(value)) {
        return callback(new Error('请输入合法手机号'))
      } else {
        callback()
      }
    }
    return {
      // 请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      userlist: [],
      // 控制对话框显示隐藏
      addDialogVisible: false,
      // 添加用户表单
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 验证添加用户表单
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [{ required: true, validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, validator: checkMobile, trigger: 'blur' }]
      },
      // 控制修改用户对话框显示隐藏
      editDialogVisible: false,
      // 修改用户表单
      editForm: {},
      // 验证修改用户表单
      editFormRules: {
        username: [
          { message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        email: [{ required: true, validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, validator: checkMobile, trigger: 'blur' }]
      },
      userId: '',
      // 控制分配角色对话框显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 选中的id
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取数据列表
    async getUserList() {
      const res = await getUser(this.queryInfo)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 2 监听 switch 开关状态的改变，拿到最新的状态，调用 API 接口把这次最新的状态保存到数据库中
    async userStateChanged(row) {
      const res = await editUser(row.id, row.mg_state)
      if (res.meta.status !== 200) {
        this.$message.error('更改用户状态失败！')
        row.mg_state = !row.mg_state
        return
      } else {
        this.$message.success('更改用户状态成功！')
      }
    },
    // 1 每页多少条发生变化，重新发送请求获取数据
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    // 1 页面值发生变化，重新发送请求获取数据
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    // 3 关闭添加用户对话框时：重置表单
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 3 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        // 校验失败停止往下执行
        if (!valid) return
        // 校验成功发送请求
        const res = await addUserInfo(this.addForm)
        // 失败提示用户，停止往下执行
        if (res.meta.status !== 201) return this.$message.error('添加用户失败！')
        // 成功提示，对话框隐藏，从新获取数据
        this.$message.success('添加用户成功！')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // 4 根据id获取要修改用户信息，绑定到data中
    async showEditDialog(row) {
      this.userId = row.id
      this.editDialogVisible = true
      const res = await getEditUser(row.id)
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败！')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 4 关闭修改用户对话框时：重置表单
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 5 发送修改用户信息请求
    modifyUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 请求参数单独定义更加方便直观
        const data = {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        }
        // dialog不能获取数据时，想办法把数据先保存到data中，然后在使用
        const res = await editUserInfo(this.userId, data)
        if (res.meta.status !== 200) return this.$message.error('修改用户信息失败！')
        // 成功时关闭对话框，刷新数据，提示用户
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('修改用户信息成功！')
      })
    },
    // 6 根据id删除用户
    async removeUser(id) {
      const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消删除，则返回值为字符串 cancel
      if (result !== 'confirm') return this.$message.info('已取消删除')
      // 发起删除请求，失败停止往下执行并提示用户。删除成功提示用户，刷新数据
      const res = await removeUser(id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败！')
      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    // 7 显示分配角色信息，显示dialog，获取该行数据渲染，还需要发送请求单独获取角色列表数据
    async setRole(userInfo) {
      this.userInfo = userInfo
      // 展示对话框之前，获取所有角色的列表
      const res = await getRoles()
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    // 7 发送分配角色请求
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }
      // 参数：之前的角色ID，现在选择的角色ID，发送修改请求
      const res = await editRole(this.userInfo.id, this.selectedRoleId)
      if (res.meta.status !== 200) return this.$message.error('修改用户角色失败！')
      this.$message.success('修改用户角色成功！')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    // 7 关闭 dialog 时，清空selectedRoleId和userInfo
    setRoleDialogClose() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  },
  components: {}
}
</script>

<style scoped lang="scss">
.el-table {
  margin-top: 18px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
/deep/.el-dialog__body {
  padding-right: 30px;
}
</style>
