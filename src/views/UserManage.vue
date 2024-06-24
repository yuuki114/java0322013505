<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <el-card class="box-card">
    <el-row :gutter="20">
      <el-col :span="10">
        <el-input
            placeholder="请输入用户名搜索" size="large" v-model="queryInfo.query" clearable @clear="getUserList"
        >
          <template #append>
            <el-button icon="Search" @click="getUserList"/>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addUserDialogVisible = true">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table :data="userList" border style="width: 100%">
      <el-table-column prop="username" label="用户名" width="180"/>
      <el-table-column prop="mobile" label="手机号" width="180"/>
      <el-table-column prop="email" label="邮箱"/>
      <el-table-column prop="role_name" label="角色"/>
      <el-table-column label="状态">
        <template #default="scope">
          <el-switch v-model="scope.row.mg_state" @click="changeUserState(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-tooltip
              class="box-item"
              effect="dark"
              content="编辑用户"
              placement="top"
              :enterable="false"
          >
            <el-button type="primary" icon="Edit" @click="showEditUser(scope.row)" circle/>
          </el-tooltip>
          <el-tooltip
              class="box-item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
          >
            <el-button type="warning" icon="Setting" @click="showSetRole(scope.row)" circle/>
          </el-tooltip>
          <el-tooltip
              class="box-item"
              effect="dark"
              content="删除用户"
              placement="top"
              :enterable="false"
          >
            <el-button type="danger" icon="Delete" @click="delUser(scope.row.id)" circle/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        v-model:current-page="queryInfo.pagenum"
        v-model:page-size="queryInfo.pagesize"
        :page-sizes="[2, 3, 5, 10]"
        :small="false"
        :disabled="false"
        :background="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </el-card>

  <el-dialog
      v-model="addUserDialogVisible"
      title="添加用户"
      width="40%"
  >
    <el-form class="addElForm" :model="userInfo" :rules="addUserRules" label-width="120px">
      <el-form-item label="用户名" prop="username">
        <el-input size="large" prefix-icon="UserFilled" v-model="userInfo.username"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input size="large" prefix-icon="Unlock" v-model="userInfo.password" type="password"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input size="large" prefix-icon="Message" v-model="userInfo.email"/>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input size="large" prefix-icon="Iphone" v-model="userInfo.mobile"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addUser">确认</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
      v-model="editUserDialogVisible"
      title="编辑用户"
      width="40%"
  >
    <el-form class="editElForm" :model="userInfo" label-width="120px">
      <el-form-item label="用户名">
        <el-input size="large" prefix-icon="UserFilled" v-model="userInfo.username" disabled/>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input size="large" prefix-icon="Message" v-model="userInfo.email"/>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input size="large" prefix-icon="Iphone" v-model="userInfo.mobile"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editUser">确认</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
      v-model="setRoleDialogVisible"
      title="分配角色"
      width="40%"
  >
    <el-form class="setRoleElForm" :model="userInfo" label-width="120px">
      <p>用户：{{userInfo.username}}</p>
      <p>当前角色：{{userInfo.role_name}}</p>
      <p>请选择新的角色：
        <el-select v-model="selectedRoleId" class="m-2" placeholder="请选择" size="large">
          <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"/>
        </el-select>
      </p>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRole">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  data() {
    return {
      userList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },
      total: 0,
      addUserDialogVisible: false,
      editUserDialogVisible: false,
      setRoleDialogVisible: false,
      selectedRoleId: '',
      roleList: [],
      userInfo: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名长度必须为3-10个字符',
            trigger: 'blur'
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '密码长度必须为6-15个字符',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,15}/;
              if (!reg.test(value)) {
                callback(new Error('密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
              if (!reg.test(value)) {
                callback(new Error('请输入正确的邮箱格式'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              const reg = /^1[3-9]\d{9}$/;
              if (!reg.test(value)) {
                callback(new Error('请输入正确的手机号格式'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      const that = this;
      this.$axios.get('users', {
        params: this.queryInfo
      }).then((res) => {
        console.log(res);
        if (res.data.meta.status === 200) {
          that.userList = res.data.data.users;
          that.total = res.data.data.total;
        } else {
          ElMessage.error('获取用户列表失败：' + res.data.meta.msg);
        }
      })
    },
    changeUserState(userInfo) {
      this.$axios.put('users/' + userInfo.id + '/state/' + userInfo.mg_state).then((res) => {
        if (res.data.meta.status === 200) {
          ElMessage.success('修改用户状态成功');
        } else {
          ElMessage.error('修改用户状态失败：' + res.data.meta.msg);
          userInfo.mg_state = !userInfo.mg_state;
        }
      })
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getUserList();
    },
    addUser() {
      this.$axios.post('users', this.userInfo).then((res) => {
        if (res.data.meta.status === 201) {
          ElMessage.success('添加用户成功');
          this.getUserList();
        } else {
          ElMessage.error('添加用户失败：' + res.data.meta.msg);
        }
      })
      this.addUserDialogVisible = false;
    },
    showEditUser(userInfo) {
      this.userInfo = userInfo;
      this.editUserDialogVisible = true;
    },
    editUser() {
      this.$axios.put('users/' + this.userInfo.id, this.userInfo).then((res) => {
        if (res.data.meta.status === 200) {
          ElMessage.success('用户更新成功');
          this.getUserList();
        } else {
          ElMessage.error('用户更新失败：' + res.data.meta.msg);
        }
      })
      this.editUserDialogVisible = false;
    },
    delUser(id) {
      ElMessageBox.confirm(
          '此操作将彻底删除该用户，确认要删除吗？',
          '警告',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            const that = this;
            this.$axios.delete('users/' + id).then((res) => {
              if (res.data.meta.status === 200) {
                ElMessage({
                  type: 'success',
                  message: '删除成功',
                })
                that.getUserList();
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
    showSetRole(userInfo){
      this.setRoleDialogVisible = true;
      this.userInfo = userInfo;
      this.$axios.get('roles').then((res) => {
        if(res.data.meta.status === 200) {
          this.roleList = res.data.data;
        }
        else {
          ElMessage.error('获取角色列表失败：' + res.data.meta.msg);
        }
      })
    },
    saveRole(){
      this.$axios.put('users/' + this.userInfo.id + '/role', {
        rid: this.selectedRoleId
      }).then((res) => {
        if(res.data.meta.status === 200) {
          ElMessage.success('分配角色成功');
          this.getUserList();
        }
        else {
          ElMessage.error('分配角色失败：' + res.data.meta.msg);
        }
      })
      this.setRoleDialogVisible = false;
    },
  }
}
</script>
<style scoped lang="less">
.box-card {
  margin-top: 20px;
}

.el-table {
  margin-top: 10px;
}

.el-pagination {
  margin-top: 5px;
}

.addElForm, .editElForm{
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

.setRoleElForm{
  .el-select{
    width: 130px;
  }
}
</style>