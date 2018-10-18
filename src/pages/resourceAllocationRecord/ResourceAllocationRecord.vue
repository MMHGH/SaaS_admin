<template>
  <div class="order-management-wrapper">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限后台</el-breadcrumb-item>
        <el-breadcrumb-item>资源分配记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">

      <el-form ref="filterForm" :model="filterForm" inline size="small" label-position="right" label-width="100px" label-suffix="：" :rules="filterFormRules">
        <el-form-item label="账号" prop="account">
          <el-input v-model="filterForm.account" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="filterForm.startTime" placeholder="选择开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="filterForm.endTime" placeholder="选择结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 1em;width: 6em;" native-type="submit" type="primary" size="medium" @click.stop.prevent="searchData">筛选</el-button>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 1em;" type="text" size="medium" @click.stop.prevent="clearData">清空筛选条件</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}" :cell-style="tableCellStyle">
        <el-table-column align="center" prop="user" label="分配人"></el-table-column>
        <el-table-column align="center" property="time" label="分配时间"></el-table-column>
        <el-table-column align="center" property="account" label="分配至账号"></el-table-column>
        <el-table-column align="center" label="详情">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="resourceAllocationRecordDetail">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        filterForm: {
          account: '',
          startTime: '',
          endTime: '',
        },
        filterFormRules: {},
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    },
    methods:{
      tableCellStyle({row, column, rowIndex, columnIndex}) {
        if(column.property === 'account' || column.property === 'price') {
          return {color: '#409EFF'}
        }
      },
      // 跳转到详情页面
      resourceAllocationRecordDetail(){
        this.$router.push({name: 'ResourceAllocationRecordDetail'})
      },
      // 筛选
      searchData(){
        this.pageNum = 1
        // this.$refs['filterForm'].validate((valid, object)=>{
        //   if(valid){}
        // })
      },
      clearData(){
        this.$refs[formName].resetFields();
      },
      handleSizeChange(val){
        this.pageSize = val;
      },
      handleCurrentChange(val){
        this.pageNum = val;
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

