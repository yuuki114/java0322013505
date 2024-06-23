<template>
  <div>
    <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        background-color="#373d41"
        text-color="#fff"
        unique-opened
    >
      <el-sub-menu :index="menu.id" v-for="(menu, index) in menuList" :key="menu.id">
        <template #title>
          <el-icon>
            <Discount/>
          </el-icon>
          <span>{{ menu.authName }}</span>
        </template>
        <el-menu-item :index="submenu.id" v-for="(submenu, index) in menu.children" :key="submenu.id" @click="goMenu(submenu.path)">
          <el-icon>
            <Menu/>
          </el-icon>
          <span>{{submenu.authName}}</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script>
import {ElMessage} from "element-plus";

export default {
  name: 'LeftMenu',
  data(){
    return {
      menuList:[],
    }
  },
  created() {
    this.getMenuList();
  },
  methods:{
    getMenuList(){
      const that = this;
      this.$axios.get('menus').then((res) => {
        console.log(res);
        if(res.data.meta.status === 200) {
          that.menuList = res.data.data;
        }
        else {
          ElMessage.error('获取菜单列表失败：' + res.data.meta.msg);
        }
      })
    },
    goMenu(path){
      this.$router.push('/' + path);
    }
  }
}
</script>

<style scoped lang="less">
div {
  color: #fff;
}
</style>