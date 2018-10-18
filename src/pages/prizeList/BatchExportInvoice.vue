<template>
  <div>
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>批量导出发货单</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button size="medium" type="text" @click="" style="position: absolute;right: 20px;top: 10px;">返回</el-button>
    </div>
    <div class="main">
      <el-table :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}">
        <el-table-column align="center" prop="logistics" label="所属物流"></el-table-column>
        <el-table-column align="center" property="unshippedDeliveryQuantity" label="未发货订单数量"></el-table-column>
        <el-table-column align="center" property="" label="选择开始时间">
          <template slot-scope="scope">
            <el-date-picker v-model="form.beginTime" placeholder="选择开始时间"></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column align="center" property="" label="选择结束时间">
          <template slot-scope="scope">
            <el-date-picker v-model="form.endTime" placeholder="选择结束时间"></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column align="center" property="lastExportTime" label="上次导出时间"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="medium" type="text" @click="">批量导出</el-button>
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
            unshippedDeliveryQuantity: '116件',
            lastExportTime: '2017-05-03 20:00',
          }
        ],
        form: {},
      }
    }
  }
</script>
<style type="text/css" scoped>
  .el-date-picker{width: 60%!important;}
</style>

