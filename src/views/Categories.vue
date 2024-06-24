<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card class="box-card">
    <el-row>
      <el-button class="btn-addCategories" type="primary" @click="addCategoriesDialogVisible = true">添加分类
      </el-button>
    </el-row>

    <el-table
        :data="cateList"
        style="width: 100%"
        row-key="id"
        border
        lazy
        :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="cat_name" label="分类名称"/>
      <el-table-column prop="cat_level" label="分类当前层级">
        <template #default="scope">
          <el-tag type="primary" v-if="String(scope.row.cat_level) === '0'">一级</el-tag>
          <el-tag type="success" v-if="String(scope.row.cat_level) === '1'">二级</el-tag>
          <el-tag type="warning" v-if="String(scope.row.cat_level) === '2'">三级</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" icon="Edit">编辑</el-button>
        <el-button type="danger" icon="Delete">删除</el-button>
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
      v-model="addCategoriesDialogVisible"
      title="添加分类"
      width="40%"
  >
    <el-form class="addCateForm" :model="categoriesInfo" label-width="120px">
      <el-form-item label="分类名称">
        <el-input size="large" prefix-icon="UserFilled" v-model="categoriesInfo.cart_name"/>
      </el-form-item>
      <el-form-item label="父级分类">
        <el-input size="large" prefix-icon="Tickets" v-model="categoriesInfo.roleDesc"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addCategoriesDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addCategoriesInfo">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {ElMessage} from "element-plus";

export default {
  data() {
    return {
      addCategoriesDialogVisible: false,
      categoriesInfo: {},
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
    }
  },
  created() {
    this.getCategoriesList();
  },
  methods: {
    getCategoriesList() {
      const that = this;
      this.$axios.get('categories', {
        params: this.queryInfo
      }).then((res) => {
        console.log(res);
        if (res.data.meta.status === 200) {
          that.cateList = res.data.data.result;
          that.total = res.data.data.total;
        } else {
          ElMessage.error('获取用户列表失败：' + res.data.meta.msg);
        }
      })
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getCategoriesList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getCategoriesList();
    },
  }
}
</script>

<style scoped lang="less">
.box-card {
  margin-top: 20px;

  .btn-addCategories {
    margin-bottom: 10px;
  }
}

.addCateForm{
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

.el-pagination{
  margin-top: 10px;
}
</style>