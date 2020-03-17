<template>
  <div class>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="roleslist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <!-- <pre>{{scope.row.children}}</pre> -->
            <el-row
              :class="['bdbottom', ind1 == 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, ind1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级 -->
              <el-col :span="6">
                <el-tag closable @close="removeById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级三级 -->
              <el-col :span="18">
                <el-row
                  :class="[ind2 == 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, ind2) in item1.children"
                  :key="ind2"
                >
                  <!-- 二级 -->
                  <el-col :span="7">
                    <el-tag
                      closable
                      type="success"
                      @close="removeById(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="17">
                    <el-tag
                      type="warning"
                      v-for="(item3, ind3) in item2.children"
                      :key="ind3"
                      closable
                      @close="removeById(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- dialog 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%">
      <!-- 树形控件 -->
      <el-tree
        ref="treeRef"
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        @close="setRightDialogClosed"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, removeRoles, getRights, setRoles } from '../../api/roles'
export default {
  name: '',
  data() {
    return {
      roleslist: [],
      // 控制分配权限对话框显示隐藏
      setRightDialogVisible: false,
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // tree控件默认选中的的节点key的数组
      defKeys: [],
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色权限数据列表
    async getRolesList() {
      const res = await getRoles()
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.roleslist = res.data
    },
    // 删除权限
    async removeById(row, rightId) {
      // 弹框提示用户
      const confirmresult = await this.$confirm('此操作将永久删除权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmresult !== 'confirm') return this.$message.info('已取消删除')
      const res = await removeRoles(row.id, rightId)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败！')
      // 删除成功会响应新的权限数据，把传过来的整行数据中的权限数据重新赋值，即可实现权限数据刷新，比整个页面数据刷新体验好
      row.children = res.data
      this.$message.success('删除权限成功！')
      console.log(res.data)
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有的权限数据，绑定到data中，渲染到dialog
      const res = await getRights()
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败！')
      this.rightslist = res.data
      // 获取三级节点id
      this.recursionKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // dialog 关闭是清空
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    recursionKeys(data, ary) {
      // 数据格式：数组包对象，对象包数组，判断没有clidren为三级节点，添加到默认勾选的数组中
      if (!data.children) return ary.push(data.id)
      data.children.forEach(item => this.recursionKeys(item, ary))
    },
    // 分配权限请求
    async allotRights() {
      // 使用tree组件的方法：获取半选和全选key
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      // 请求参数要求字符串，把数组转字符串
      const idStr = keys.join(',')
      const res = await setRoles(this.roleId, idStr)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('分配权限成功！')
      // 刷新页面数据
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  },
  components: {}
}
</script>

<style scoped lang="scss">
.el-table {
  margin-top: 15px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
