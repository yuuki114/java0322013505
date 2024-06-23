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
            placeholder="请输入用户名搜索" size="large"
        >
          <template #append>
            <el-button icon="Search"/>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary">添加用户</el-button>
      </el-col>
    </el-row>
  </el-card>
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
      <el-tooltip
          class="box-item"
          effect="dark"
          content="用户编辑"
          placement="top"
          :enterable="false"
      >
        <el-button type="primary" icon="Edit" circle/>
      </el-tooltip>
      <el-tooltip
          class="box-item"
          effect="dark"
          content="分配角色"
          placement="top"
          :enterable="false"
      >
        <el-button type="warning" icon="Setting" circle/>
      </el-tooltip>
      <el-tooltip
          class="box-item"
          effect="dark"
          content="删除用户"
          placement="top"
          :enterable="false"
      >
        <el-button type="danger" icon="Delete" circle/>
      </el-tooltip>
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
</template>

<script>
import {ElMessage} from "element-plus";

export default {
  data() {
    return {
      userList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },
      total: 0
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
    handleCurrentChange(val){
      this.queryInfo.pagenum = val;
      this.getUserList();
    }
  }
}
</script>

<style scoped lang="less">
.box-card {
  margin-top: 20px;
}
.el-table{
  margin-top: 10px;
}
.el-pagination{
  margin-top: 5px;
}
</style>