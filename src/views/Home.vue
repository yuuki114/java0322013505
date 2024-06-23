<template>
    <el-container>
      <el-header>
        <h3>电商后台管理系统</h3>
        <el-button @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <LeftMenu/>
        </el-aside>
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
          <el-footer>

          </el-footer>
        </el-container>
      </el-container>
    </el-container>
</template>

<script>
import LeftMenu from "@/components/LeftMenu.vue";

export default {
  name: 'Home',
  components: {LeftMenu},
  methods: {
    logout() {
      window.sessionStorage.removeItem('token');
      this.$router.push('/login');
    }
  },
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    color: #fff;
    .el-button{
      margin: 15px 0 15px 0;
    }
  }
  .el-aside{
    background-color: #373d41;
    height: 100%;
  }
  .el-main{
    background-color: #eaedf1;
    height: 100%;
  }
  .el-footer{
    background-color: #373d41;
  }
}
</style>