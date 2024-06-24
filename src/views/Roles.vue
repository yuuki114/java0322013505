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
            <el-button type="primary" icon="Edit" @click="showEditRole(scope.row)">编辑</el-button>
            <el-button type="danger" icon="Delete" @click="delRole(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="Setting" @click="showSetRole(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
        v-model="addRoleDialogVisible"
        title="添加角色"
        width="40%"
    >
      <el-form class="addRoleForm" :model="roleInfo" label-width="120px">
        <el-form-item label="角色名称">
          <el-input size="large" prefix-icon="UserFilled" v-model="roleInfo.roleName"/>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input size="large" prefix-icon="Tickets" v-model="roleInfo.roleDesc"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addRoleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addRole">确认</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
        v-model="editRoleDialogVisible"
        title="编辑权限"
        width="40%"
    >
      <el-form class="addRoleForm" :model="roleInfo" label-width="120px">
        <el-form-item label="角色名称">
          <el-input size="large" prefix-icon="UserFilled" v-model="roleInfo.roleName"/>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input size="large" prefix-icon="Tickets" v-model="roleInfo.roleDesc"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editRoleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editRole">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {ElMessage} from "element-plus";

export default {
  data() {
    return {
      roleList: [],
      addRoleDialogVisible: false,
      editRoleDialogVisible: false,
      roleInfo: {
        roleName: '',
        roleDesc: ''
      },
    }
  },
  created() {
    this.getRoleList();
  },
  methods: {
    getRoleList() {
      this.$axios.get('roles').then(res => {
        this.roleList = res.data.data;
      })
    },
    addRole() {
      this.$axios.post('roles', this.roleInfo).then((res) => {
        if (res.data.meta.status === 201) {
          ElMessage.success('添加角色成功');
          this.getRoleList();
        } else {
          ElMessage.error('添加角色失败：' + res.data.meta.msg);
        }
      })
      this.addRoleDialogVisible = false;
    },
    showEditRole(roleInfo) {
      this.roleInfo = roleInfo;
      this.editRoleDialogVisible = true;
    },
    editRole() {
      this.$axios.put('roles/' + this.roleInfo.id, this.roleInfo).then((res) => {
        if (res.data.meta.status === 200) {
          ElMessage.success('编辑角色成功');
          this.getRoleList();
        } else {
          ElMessage.error('编辑角色失败：' + res.data.meta.msg);
        }
      })
      this.editRoleDialogVisible = false;
    },
  }
}
</script>

<style scoped lang="less">
.box-card {
  margin-top: 20px;

  .btn-addRole {
    margin-bottom: 10px;
  }
}

.addRoleForm {
  .el-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  .el-form-item {
    margin-right: 60px;
  }
}
</style>