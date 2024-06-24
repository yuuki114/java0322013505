<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>分类参数</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card class="box-card">
    <el-alert show-icon title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" />
    <el-row class="cat_opt">
      <el-col class="align-left">
        <span>选择商品分类：</span>
        <el-cascader expand-trigger="hover" :options="cateList" :props="cateProps" v-model="selectedCateKeys" @change="handleChange"></el-cascader>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import {ElMessage} from "element-plus";

export default {
  data(){
    return{
      cateList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: []
    }
  },
  created(){
    this.getCateList();
  },
  methods:{
    getCateList(){
      this.$axios.get('/categories').then(res=>{
        if(res.data.meta.status !== 200){
          ElMessage.error('获取商品分类失败');
        }
        this.cateList = res.data.data;
      })
    },
    handleChange(){
      if(this.selectedCateKeys.length !== 3){
        this.selectedCateKeys = []
        ElMessage.error('只允许为第三级分类设置相关参数');
      }
    }
  }
}
</script>

<style scoped lang="less">
.box-card{
  margin-top: 20px;
}
.cat_opt{
  margin: 15px 0;
}
.align-left {
  text-align: left;
}
</style>