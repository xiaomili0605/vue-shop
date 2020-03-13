<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div class="img_box">
        <img src="../assets/images/user.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <!-- 动态控制width，折叠64px，展开200px -->
      <!-- 1 解决点击高亮 bug  -->
      <!-- 1.1 :default-active="activePath" -->
      <!-- 1.2 点击二级标签时绑定事件 @click="saveNaState('' + item2.path)" -->
      <!-- 1.3 data 中 activePath: '' -->
      <!-- 1.4 create中 this.activePath = window.sessionStorage.getItem('activePath') -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#393F4C"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="activePath"
          router
        >
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-submenu :index="'' + item1.id" v-for="item1 in menulist" :key="item1.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <i :class="iconObj[item1.id]" style="margin-right: 5px;"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item :index="'' + item2.path" v-for="item2 in item1.children" :key="item2.id" @click="saveNaState('' + item2.path)">
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <!-- 根据项目情况是否渲染icon -->
                <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenus } from '../api/home'
export default {
  name: '',
  data() {
    return {
      menulist: [],
      // icon
      iconObj: {
        125: 'iconfont iconuser',
        103: 'iconfont iconlifangti2',
        101: 'iconfont iconwriting',
        102: 'iconfont icondingdanguanli',
        145: 'iconfont iconshujutongji'
      },
      // 是否折叠，默认不折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出
    logout() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    // 获取左侧菜单栏数据
    async getMenuList() {
      const res = await getMenus()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    // 点击按钮切换左侧菜单栏的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 1.2 保存链接激活状态
    saveNaState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
  components: {}
}
</script>

<style scoped lang="scss">
.el-container {
  height: 100%;
}
.el-header {
  background: #3f4648;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .img_box {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
    img {
      height: 48px;
      width: 48px;
      border-radius: 50%;
      margin-right: 15px;
    }
  }
}
.el-aside {
  background: #393f4c;
}
.el-main {
  background: #ecf0f2;
}
.el-menu {
  border: 0;
}
.toggle-button {
  color: #fff;
  cursor: pointer;
  background: #4a5064;
  text-align: center;
  line-height: 24px;
  font-size: 14px;
  letter-spacing: 0.2em;
}
</style>
