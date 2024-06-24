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
      <el-table :data="roleList" border>
        <el-table-column type="expand">
          <template #default="scope">
            <el-row v-for="(Right1, index) in scope.row.children" :key="Right1.id">
              <el-col :span="5">
                <el-tag type="primary" closable @close="removeRightById(scope.row, Right1.id)">{{Right1.authName}}</el-tag>
                <el-icon><CaretRight /></el-icon>
              </el-col>
              <el-col :span="19">
                <el-row :class="[Right2 === 0 ? '' : 'bdtop','vcenter']" v-for="(Right2, index) in Right1.children" :key="Right2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, Right2.id)">{{Right2.authName}}</el-tag>
                    <el-icon><CaretRight /></el-icon>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(Right3, index) in Right2.children" :key="Right3.id" closable @close="removeRightById(scope.row, Right3.id)">
                      {{Right3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="ID"/>
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
import {ElMessage, ElMessageBox} from "element-plus";

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
    delRole(id){
      ElMessageBox.confirm(
          '此操作将彻底删除该角色，确认要删除吗？',
          '警告',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            const that = this;
            this.$axios.delete('roles/' + id).then((res) => {
              if (res.data.meta.status === 200) {
                ElMessage({
                  type: 'success',
                  message: '删除成功',
                })
                that.getRoleList();
              } else {
                ElMessage.error('删除失败：' + res.data.meta.msg);
              }
            })
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '取消删除',
            })
          })
    },
    removeRightById(role, rightId){
      ElMessageBox.confirm(
          '此操作将彻底删除该权限，确认要删除吗？',
          '警告',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            const that = this;
            this.$axios.delete('roles/' + role.id + '/rights/' +  rightId).then((res) => {
              if (res.data.meta.status === 200) {
                ElMessage({
                  type: 'success',
                  message: '删除成功',
                })
              } else {
                ElMessage.error('删除失败：' + res.data.meta.msg);
              }
              role.children = res.data.data
            })
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '取消删除',
            })
          })
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