<template>
  <div class="rebate-condition-custom">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>客户留言</el-breadcrumb-item>
        <el-breadcrumb-item>返利条件定制</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="main">
      <el-form ref="filterForm" :model="filterForm" inline size="small" label-position="right" label-width="100px"
               label-suffix="：">
        <el-form-item label="企业账户">
          <el-input v-model="filterForm.name"></el-input>
        </el-form-item>
        <el-form-item label="企业名称">
          <el-input v-model="filterForm.name"></el-input>
        </el-form-item>
        <el-form-item label="上线时间" prop="beginDate">
          <el-date-picker v-model="filterForm.beginDate" placeholder="选择开始时间"></el-date-picker>
        </el-form-item>
        <span style="display: inline-block;line-height: 33px;">至</span>
        <el-form-item label="" prop="endDate">
          <el-date-picker v-model="filterForm.endDate" style="width: 200px;" placeholder="选择结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="filterForm.status">
            <el-option label="全部" value="A"></el-option>
            <el-option label="已联系" value="Y"></el-option>
            <el-option label="未联系" value="N"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="filter">
          <el-button native-type="submit" type="primary" size="small" @click.stop.prevent="filter">筛选
          </el-button>
          <el-button type="text" size="small" @click="resetForm">清空筛选条件</el-button>
        </el-form-item>
      </el-form>

      <el-table empty-text="暂无数据" :data="tableData" size="medium"
                :header-cell-style="{backgroundColor: '#f2f2f2'}" :cell-style="tableCellStyle">
        <el-table-column align="center" prop="contacts" label="姓名"></el-table-column>
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
            <el-button size="small" type="primary" @click="labelMakingMessageDetail(scope.row.id)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="pagination" background popper-class="pagination-popper"
                     :current-page="currentPageNumber" :page-size="currentPageSize"
                     :page-sizes="[5, 10, 20, 50, 100]" :total="currentTotal"
                     layout="prev, pager, next, total, sizes, jumper"
                     @current-change="pageNumberChange" @prev-clicke="pageNumberChange"
                     @next-click="pageNumberChange" @size-change="pageSizeChange"></el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: "rebateConditionCustom",
    data() {
      return {
        currentPageNumber: 1,
        currentPageSize: 10,
        currentTotal: null,
        treeData: [{
          label: '平台用户等级',
          children: []
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        filterForm: {
          status: 'A',
          beginDate: null,
          endDate: null,
        },
        tableData: [],
      }
    },
    methods: {
      // 获取标签制作留言列表
      getLabelMakingMessageList() {
        this.$service.post({
          url: this.$api.labelMakingMessage.getLabelMakingMessageList,
          params: {
            status: this.filterForm.status,
            beginDate: this.$timestamp.getTimeByTimestamp(this.filterForm.beginDate && this.filterForm.beginDate.getTime()),
            endDate: this.$timestamp.getTimeByTimestamp(this.filterForm.endDate && (this.filterForm.endDate.getTime() + 24 * 60 * 60 * 1000 - 1)),
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
      filter() {
        this.$refs['filterForm'].validate((valid, object) => {
          if (valid) {
            this.currentPageNumber = 1
            this.getLabelMakingMessageList()
          }
        })
      },
      // 清空筛选条件
      resetForm() {
        this.$refs['filterForm'].resetFields()
      },
      // 表格列样式设置
      tableCellStyle({row, column, rowIndex, columnIndex}) {
        if (column.property === 'contacts' || column.property === 'status') {
          return {color: '#409EFF'}
        }
      },
      // 当前页码改变刷新列表
      pageNumberChange(pageNumber) {
        this.currentPageNumber = pageNumber
        this.getLabelMakingMessageList()
      },
      // 当前每页数量改变刷新列表
      pageSizeChange(pageSize) {
        this.currentPageNumber = 1
        this.currentPageSize = pageSize
        this.getLabelMakingMessageList()
      },
      // 跳转到标签详情
      labelMakingMessageDetail(id) {
        console.log(id)
        this.$router.push({
          path: 'labelMakingMessageDetail', query: {
            currentId: id,
            page: 'label'
          }
        })
      }
    },
    created() {
      this.getLabelMakingMessageList()
    }
  }
</script>

<style type="text/css">
  .rebate-condition-custom .el-form--inline .el-form-item__content {
    width: calc(100% - 100px);
  }

  .rebate-condition-custom .el-input--suffix .el-input__inner {
    padding: 0 15px;
  }

  /*.rebate-condition-custom .el-form--inline .filter.el-form-item{width: 100%;padding-left: 15px;}*/
  .rebate-condition-custom .el-form--inline .filter.el-form-item .el-form-item__content {
    width: 100%;
  }

  .rebate-condition-custom .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }

  .rebate-condition-custom .el-input--suffix.el-date-editor .el-input__inner {
    text-indent: 20px;
  }

  .rebate-condition-custom .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
    padding-left: 0;
  }

  .rebate-condition-custom .el-table .cell, .el-table th div {
    padding-right: 0;
    white-space: nowrap;
  }
</style>

<style type="text/css" scoped>
  .el-table {
    border: none;
    margin-top: 10px;
    text-align: center;
  }

  .el-table:after {
    background-color: transparent;
  }

  .el-table th {
    text-align: center;
  }

  .el-pagination {
    text-align: center;
    padding-top: 20px;
    padding-bottom: 10px;
  }
</style>
