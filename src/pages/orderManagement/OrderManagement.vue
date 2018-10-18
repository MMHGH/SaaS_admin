<template>
  <div class="order-management-wrapper">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限后台</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">

      <el-form ref="filterForm" :model="filterForm" inline size="small" label-position="right" label-width="100px" label-suffix="：" :rules="filterFormRules">
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="filterForm.orderNo"></el-input>
        </el-form-item>
        <!-- <el-form-item label="订购项目" prop="project">
          <el-select v-model="filterForm.project">
            <el-option label="全部" value="1"></el-option>
            <el-option label="平台服务费" value="2"></el-option>
            <el-option label="奖品购买" value="3"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="开始时间" prop="beginTime">
          <el-date-picker v-model="filterForm.beginTime" type="date" value-format="yyyy-MM-dd" placeholder="选择开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="filterForm.endTime" type="date" value-format="yyyy-MM-dd" placeholder="选择结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="购买账号" prop="account">
          <el-input v-model="filterForm.account"></el-input>
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="filterForm.status" placeholder="请选择">
            <el-option label="全部" value="">全部</el-option>
            <el-option label="未付款" value="1">未付款</el-option>
            <el-option label="已付款" value="2">已付款</el-option>
            <el-option label="已完成" value="3">已完成</el-option>
            <el-option label="已取消" value="4">已取消</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 1em;width: 6em;" native-type="submit" type="primary" size="medium" @click.stop.prevent="searchData">筛选</el-button>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 6em;" native-type="submit" size="medium" @click.stop.prevent="clearData('filterForm')">清空</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}" :cell-style="tableCellStyle">
        <el-table-column align="center" prop="orderNo" label="订单号"></el-table-column>
        <!-- <el-table-column align="center" property="project" label="订购项目"></el-table-column> -->
        <el-table-column align="center" property="account" label="购买账号"></el-table-column>
        <el-table-column align="center" property="createdTime" label="订单时间">
          <template slot-scope="scope">{{ scope.row.createdTime | filterTime }}</template>
        </el-table-column>
        <el-table-column align="center" property="status" label="订单状态">
          <template slot-scope="scope">{{ scope.row.status | filterStatus }}</template>
        </el-table-column>
        <el-table-column align="center" property="orderExecute" label="执行状态">
          <template slot-scope="scope">{{ scope.row.orderExecute | orderExecuteStatus }}</template>
        </el-table-column>
        <el-table-column align="center" property="dueAmount" label="订单价格">
          <template slot-scope="scope">{{ scope.row.dueAmount?scope.row.dueAmount + '元':''}}</template>
        </el-table-column>
        <el-table-column align="center" label="设置">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="orderDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      class="pagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      popper-class="pagination-popper"
      :current-page="pageNum"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import util from '@/util/commonFn.js'

  export default {
    data(){
      return {
        filterForm: {
          orderNo: '',
          account: '',
          status: '',
          beginTime: '',
          endTime: ''
        },
        filterFormRules: {},
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    },
    mounted(){
      this.getData()
    },
    methods:{
      handleSizeChange(val){
        this.pageSize = val;
        this.getData()
      },
      handleCurrentChange(val){
        this.pageNum = val;
        this.getData();
      },
      tableCellStyle({row, column, rowIndex, columnIndex}) {
        if(column.property === 'account' || column.property === 'price') {
          return {color: '#409EFF'}
        }
      },
      // 跳转到详情页面
      orderDetail(row){
        sessionStorage.setItem('supperManaOrderId',row.orderId);
        this.$router.push({name: 'OrderManagementOrderDetail'})
      },
      // 筛选
      searchData(){
        // this.$refs['filterForm'].validate((valid, object)=>{
        //   if(valid){}
        // })
        this.pageNum = 1
        this.getData()
      },
      clearData(formName){
        this.$refs[formName].resetFields();
      },
      // 初始化
      getData(){
        // 1.sendData
        let sendData = {
          orderNo: this.filterForm.orderNo,
          account: this.filterForm.account,
          status: this.filterForm.status,
          beginTime: this.filterForm.beginTime,
          endTime: this.filterForm.endTime?this.filterForm.endTime+' 23:59:59':this.filterForm.endTime,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        };

        // 2.post
        let vm = this
        this.axios.post(this.$api.orderMana.supperManaListOrder,sendData).then(function(respone){
          let msg = respone.data.message
          let data = respone.data.data
          if(msg == 'ok'){
            vm.tableData = data.list;
            vm.pageNum = data.pageNum;
            vm.total = data.total;
            vm.pageSize = data.pageSize;
          }else{
            vm.tableData = []
            console.error(msg)
          }
        }).catch(function(error){
          console.error(error)
        });
      },
    },
    filters: {
      filterTime(val){
        if(!val){return}
        return util.transTime(val)
      },
      filterStatus(val){
        if(!val){return}
        let status = ''
        switch(val){  //  1未付款 2已付款 3已完成 4已取消
          case 1:
          status = '未付款';
          break;
          case 2:
          status = '已付款';
          break;
          case 3:
          status = '已完成';
          break;
          case 4:
          status = '已取消';
          break;
        }
        return status
      },
      orderExecuteStatus(val){
       let status = '';
         switch(val){
           case 0:
            status="未执行";
           break;
          case 1:
            status="已执行";
           break;
         }
          return status
      }

    }
  }
</script>
<style type="text/css">
  .order-management-wrapper .el-form--inline .el-form-item__content{width: 150px;}
  .order-management-wrapper .el-input--suffix .el-input__inner{padding: 0 15px;}
  .order-management-wrapper .el-form--inline .filter.el-form-item{width: 100%;padding-left: 15px;}
  .order-management-wrapper .el-form--inline .filter.el-form-item .el-form-item__content{width: 100%;}
  .order-management-wrapper .el-date-editor.el-input, .el-date-editor.el-input__inner{width: 100%;}
  .order-management-wrapper .el-input--suffix.el-date-editor .el-input__inner{text-indent: 20px;}

  .order-management-wrapper .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell{padding-left: 0;}
  .order-management-wrapper .el-table .cell, .el-table th div{padding-right: 0;white-space: nowrap;}
</style>
<style type="text/css" scoped>
  .el-table{border: none;margin-top: 10px;text-align: center;}
  .el-table:after{background-color: transparent;}
  .el-table th{text-align: center;}
  .el-pagination{text-align: center;padding-top: 20px;padding-bottom: 10px;}
</style>

