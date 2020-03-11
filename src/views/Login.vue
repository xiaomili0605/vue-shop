<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form :model="loginFrom" :rules="loginFormRules" class="login" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input v-model="loginFrom.username" placeholder="请输入邮箱" prefix-icon="iconfont iconuser"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginFrom.password" placeholder="请输入密码" prefix-icon="iconfont iconpassword"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '../api/login.js'
export default {
  name: '',
  data() {
    return {
      // 登录数据
      loginFrom: {
        username: 'admin',
        password: '123456'
      },
      // 表单校验
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        // 检验失败时valid为false，停止往下执行，为true时发送登录请求
        if (!valid) return
        const res = await login(this.loginFrom)
        // 登录失败
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        // 登录成功
        this.$message.success('登录成功!')
        // token 保存到sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  },
  components: {}
}
</script>

<style scoped lang="scss">
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: relative;
    .avatar_box {
      width: 130px;
      height: 130px;
      box-sizing: border-box;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px #ddd;
      background: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #eee;
      }
    }
  }
}
.login {
  margin: 80px 15px 0;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>

