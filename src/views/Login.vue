<template>
  <div class="login_box">
    <div class="login_center_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="logo" />
      </div>
      <el-form :model="loginForm" label-width="120px">
        <el-form-item label="用户名">
          <el-input size="large" prefix-icon="UserFilled" v-model="loginForm.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input size="large" prefix-icon="Unlock" v-model="loginForm.password" />
        </el-form-item>
        <el-button type="primary" size="large" @click="login">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import {ElMessage} from "element-plus";
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    login() {
      console.log("点击登录了");
      const that = this;
      this.$axios.post('login', this.loginForm).then((res) => {
        console.log(res);
        if (res.data.meta.status === 200) {
          window.sessionStorage.setItem('token', res.data.data.token);
          that.$router.push('/home');
          ElMessage.success('登录成功');
        }
        else {
          ElMessage.error('登录失败：' + res.data.meta.msg);
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_box {
  background-color: #2b4b6b;
  height: 100%;
}
.login_center_box{
  width: 400px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 10px;
  transform: translate(-50%, -50%);
}
.avatar_box{
  height: 130px;
  width: 130px;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  right: 50%;
  transform: translate(-50%, -50%);
  padding: 10px;
}
.avatar_box img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.el-form{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
  box-sizing: border-box;
}
.el-form-item{
  margin-right: 60px;
}
</style>