<template>
  <div>
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>批量导入发货单</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button size="medium" type="text" @click="" style="position: absolute;right: 20px;top: 10px;">返回</el-button>
    </div>
    <div class="main">


      <el-table :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}">
        <el-table-column align="center" prop="logistics" label="所属物流"></el-table-column>
        <el-table-column align="center" property="lastImportTime" label="上次导入时间"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="medium" type="text" @click="">批量导入</el-button>
          </template>
        </el-table-column>
      </el-table>


    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {

        tableData: [
          {
            logistics: '太和自营',
            lastImportTime: '2017-05-03 20:00',
          }
        ],
      }
    }
  }
</script>
<style type="text/css" scoped>
</style>

