<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card class="box-card">
    <el-table :data="rightList" border style="width: 100%">
      <el-table-column prop="id" label="#" width="180"/>
      <el-table-column prop="authName" label="权限名称" width="180"/>
      <el-table-column prop="path" label="路径"/>
      <el-table-column prop="level" label="权限等级">
        <template #default="scope">
          <el-tag type="primary" v-if="scope.row.level === '0'">一级</el-tag>
          <el-tag type="success" v-if="scope.row.level === '1'">二级</el-tag>
          <el-tag type="warning" v-if="scope.row.level === '2'">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data(){
    return{
      rightList: []
    }
  },
  created(){
    this.getRightList()
  },
  methods:{
    getRightList(){
      this.$axios.get('rights/list').then(res=>{
        this.rightList = res.data.data
      })
    }
  }
}
</script>

<style scoped lang="less">
.box-card{
  margin-top: 20px;
}
</style>