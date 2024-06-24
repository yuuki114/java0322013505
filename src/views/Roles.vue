<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
          <el-button class="btn-addRole" type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
      </el-row>
      <el-table :data="roleList" border style="width: 100%">
        <el-table-column prop="id" label="#" width="180"/>
        <el-table-column prop="roleName" label="角色名称" width="180"/>
        <el-table-column prop="roleDesc" label="角色描述"/>
        <el-table-column label="操作">
          <template #default="scope">
              <el-button type="primary" icon="Edit" @click="showEditUser(scope.row)">编辑</el-button>
              <el-button type="danger" icon="Delete" @click="delUser(scope.row.id)">删除</el-button>
              <el-button type="warning" icon="Setting" @click="showSetRole(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return{
      roleList: [],
      addRoleDialogVisible: false,
    }
  },
  created() {
    this.getRoleList();
  },
  methods:{
    getRoleList(){
      this.$axios.get('roles').then(res=>{
        this.roleList = res.data.data;
      })
    }
  }
}
</script>

<style scoped lang="less">
.box-card{
  margin-top: 20px;
  .btn-addRole{
    margin-bottom: 10px;
  }
}
</style>