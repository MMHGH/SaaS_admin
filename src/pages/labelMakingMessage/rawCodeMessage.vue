<template>
  <div class="label-making-message-wrapper">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>客户留言</el-breadcrumb-item>
        <el-breadcrumb-item>生码域名定制留言</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form ref="filterForm" :model="filterForm" inline size="small" label-position="right" label-width="100px" label-suffix="：">
            <el-row>
              <el-col :span="24">
                <el-form-item label="开始时间" prop="beginDate">
                  <el-date-picker v-model="filterForm.beginDate" placeholder="选择开始时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="endDate">
                  <el-date-picker v-model="filterForm.endDate" placeholder="选择结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                  <el-select v-model="filterForm.status">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="已联系" value="Y"></el-option>
                    <el-option label="未联系" value="N"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="filter">
                  <el-button native-type="submit" type="primary" size="medium" @click.stop.prevent="filter">筛选</el-button>
                  <el-button type="text" size="medium" @click="resetForm">清空筛选条件</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table empty-text="暂无数据" :data="tableData" size="medium"
                    :header-cell-style="{backgroundColor: '#f2f2f2'}" :cell-style="tableCellStyle">
            <el-table-column align="center" prop="account" label="用户账号"></el-table-column>
            <el-table-column align="center" property="organName" label="企业名称"></el-table-column>
            <el-table-column align="center" property="contacts" label="联系人姓名"></el-table-column>
            <el-table-column align="center" property="phone" label="联系方式"></el-table-column>
            <el-table-column align="center" property="createdTime" label="留言时间">
              <template slot-scope="scope">
                {{$timestamp.getDateByTimestamp(scope.row.createdTime)}}
              </template>
            </el-table-column>
            <el-table-column align="center" property="remark" label="留言内容"></el-table-column>
            <el-table-column align="center" property="status" label="状态">
              <template slot-scope="scope">
                {{scope.row.status === 'Y' ? '已联系' : '未联系'}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button size="medium" type="primary" @click="labelMakingMessageDetail(scope.row.id)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination class="pagination" background popper-class="pagination-popper"
              :current-page="currentPageNumber" :page-size="currentPageSize"
              :page-sizes="[5, 10, 20, 50, 100]" :total="currentTotal"
              layout="prev, pager, next, total, sizes, jumper"
              @current-change="pageNumberChange" @prev-clicke="pageNumberChange"
              @next-click="pageNumberChange" @size-change="pageSizeChange"></el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        filterForm: {
          status: '',
          beginDate: null,
          endDate: null,
        },
        tableData: [],
        currentPageNumber: 1,
        currentPageSize: 10,
        currentTotal: null,
      }
    },
    methods:{
      // 获取留言列表
      getDomainFeedbackList(){
        this.$service.post({
          url: this.$api.labelMakingMessage.getDomainFeedbackList,
          params: {
            type:1,
            status: this.filterForm.status,
            beginDate: this.$timestamp.getTimeByTimestamp(this.filterForm.beginDate && this.filterForm.beginDate.getTime()),
            endDate: this.$timestamp.getTimeByTimestamp(this.filterForm.endDate && (this.filterForm.endDate.getTime() + 24*60*60*1000 - 1)),
            pageNum: this.currentPageNumber,
            pageSize: this.currentPageSize,
          },
          successHook: (data) => {
            this.tableData = data.list
            this.currentPageNumber = data.pageNum
            this.currentPageSize = data.pageSize
            this.currentTotal = data.total
          }
        })
      },
      // 提交筛选条件
      filter(){
        this.$refs['filterForm'].validate((valid, object)=>{
          if(valid){
            this.currentPageNumber = 1
            this.getDomainFeedbackList()
          }
        })
      },
      // 清空筛选条件
      resetForm(){
        this.$refs['filterForm'].resetFields()
      },
      // 表格列样式设置
      tableCellStyle({row, column, rowIndex, columnIndex}){
        if(column.property === 'contacts' || column.property === 'status') {
          return {color: '#409EFF'}
        }
      },
      // 当前页码改变刷新列表
      pageNumberChange(pageNumber){
        this.currentPageNumber = pageNumber
        this.getDomainFeedbackList()
      },
      // 当前每页数量改变刷新列表
      pageSizeChange(pageSize){
        this.currentPageNumber = 1
        this.currentPageSize = pageSize
        this.getDomainFeedbackList()
      },
      // 跳转到标签详情
      labelMakingMessageDetail(id){
        this.$router.push({path: 'labelMakingMessageDetail', query: {
          currentId: id,
          page:'domain'
        }})
      }
    },
    created(){
      this.getDomainFeedbackList();
    }
  }
</script>
<style type="text/css">
  .label-making-message-wrapper .el-form--inline .el-form-item__content{width: calc(100% - 100px);}
  .label-making-message-wrapper .el-input--suffix .el-input__inner{padding: 0 15px;}
  /*.label-making-message-wrapper .el-form--inline .filter.el-form-item{width: 100%;padding-left: 15px;}*/
  .label-making-message-wrapper .el-form--inline .filter.el-form-item .el-form-item__content{width: 100%;}
  .label-making-message-wrapper .el-date-editor.el-input, .el-date-editor.el-input__inner{width: 100%;}
  .label-making-message-wrapper .el-input--suffix.el-date-editor .el-input__inner{text-indent: 20px;}

  .label-making-message-wrapper .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell{padding-left: 0;}
  .label-making-message-wrapper .el-table .cell, .el-table th div{padding-right: 0;white-space: nowrap;}
</style>
<style type="text/css" scoped>
  .el-table{border: none;margin-top: 10px;text-align: center;}
  .el-table:after{background-color: transparent;}
  .el-table th{text-align: center;}
  .el-pagination{text-align: center;padding-top: 20px;padding-bottom: 10px;}
</style>

