<template>
  <div class="user-management-wrapper">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>用户域名管理</el-breadcrumb-item>
        <el-breadcrumb-item>代理商用户域名管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-tree ref="tree" node-key="levelId" :data="treeData" default-expand-all :highlight-current="true" @node-click="getUserListByLevel"></el-tree>
        </el-col>
        <el-col :span="20">
          <el-form ref="filterForm" :model="filterForm" inline size="small" label-position="right" label-width="100px" label-suffix="：" :rules="filterFormRules">
            <el-row>
              <el-col :span="24">
                <el-form-item label="手机号码" prop="phone">
                  <el-input v-model="filterForm.phone" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="开始时间" prop="beginDate">
                  <el-date-picker v-model="filterForm.beginDate" placeholder="选择开始时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="endDate">
                  <el-date-picker popper-class="custom-popper" type="datetime" v-model="filterForm.endDate" placeholder="选择结束时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" default-time="23:59:59"></el-date-picker>
                </el-form-item>
                <el-form-item label="企业关键词" prop="organName">
                  <el-input v-model="filterForm.organName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item class="filter">
                  <el-button native-type="submit" type="primary" size="medium" @click.stop.prevent="searchData">搜索</el-button>
                  <el-button type="text" size="medium" @click="resetForm">清空筛选条件</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table empty-text="暂无数据" :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}" :cell-style="tableCellStyle">
            <el-table-column align="center" prop="account" label="账号"></el-table-column>
            <el-table-column align="center" property="regTime" label="注册时间">
              <template slot-scope="scope">{{$timestamp.getDateByTimestamp(scope.row.regTime)}}</template>
            </el-table-column>
            <el-table-column align="center" property="userLevelName" label="用户类型"></el-table-column>
            <el-table-column align="center" property="organName" label="企业名称" min-width="170"></el-table-column>
            <el-table-column align="center" label="操作" min-width="270">
              <template slot-scope="scope">
                <el-button size="medium" type="text" @click="funConfig(currentLevelId, scope.row)">配置</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination class="pagination" background popper-class="pagination-popper"
                         :current-page="currentPageNumber" :page-size="currentPageSize"
                         :page-sizes="[5, 10, 20, 50, 100]" :total="currentTotal"
                         layout="prev, pager, next, total, sizes, jumper"
                         @current-change="pageNumberChange" @prev-click="pageNumberChange"
                         @next-click="pageNumberChange" @size-change="pageSizeChange"></el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import {co, thunkify} from '@/util/commonFn'
  export default {
    data(){
      return {
        currentLevelId: null,
        currentCategoryId: null,
        currentLevel: null,
        currentCategory: null,
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
          status: null,
          phone: null,
          beginDate: null,
          endDate: null,
          organName: null,
        },
        filterFormRules: {},
        tableData: [],
        currentFilterType: 1, // 0：筛选， 1：全局筛选
      }
    },
    methods:{
      // 获取当前勾选类别和对应类别的用户列表
      getCurrentUserList(){
        if(this.currentLevelId){
          this.currentLevelId && this.$refs['tree'].setCurrentKey(this.currentLevelId)
          let node = this.$refs['tree'].getNode(this.currentLevelId)
          this.currentCategoryId = node && node.parent.data.categoryId
          this.getUserList(this.currentLevelId)
        }
        else{
          for(let i=0; i<this.treeData[0].children.length; i++){
            if(this.treeData[0].children[i].children.length>0){
              let data = this.treeData[0].children[i].children[0]
              let node = this.$refs['tree'].getNode(data)
              this.currentLevelId = node.data.levelId
              this.currentCategoryId = node && node.parent.data.categoryId
              this.currentLevelId && this.$refs['tree'].setCurrentKey(this.currentLevelId)
              this.getUserList(this.currentLevelId)
              break
            }
          }
        }
      },
      // 获取类别列表
      getCategoryList(){
        this.$service.post({
          url: this.$api.getCategoryList,
          successHook: (data) => {
            data.forEach(item => {
              this.treeData[0].children.push({categoryId: item.dictValue, label: item.dictName, children: []})
            })
            let
              vm = this,
              thunk = thunkify(this.getLevelList)
            co(function*(){
              for(let i=0; i<vm.treeData[0].children.length; i++){
                yield thunk(vm.treeData[0].children[i])
              }
              vm.getCurrentUserList()
              return yield Promise.resolve()
            })
          }
        })
      },
      // 获取等级列表
      getLevelList(category, callback){
        this.$service.post({
          url: this.$api.platformUserLevelDefinition.getLevelList,
          params: {userTypeId: category.categoryId},
          successHook: (data) => {
            data.forEach(item => {
              category.children.push({levelId: item.id, label: item.sysUserLevelName})
            })
            this.$nextTick(()=>{
              callback(null)
            })
          }
        })
      },
      // 获取平台用户列表（通过选择平台用户等级）
      getUserListByLevel(data, node, assembly){
        if(!data.children){
          this.currentCategoryId = parseInt(node.parent.data.categoryId);
          this.currentCategory = node.parent.data.label;
          this.currentLevelId = data.levelId;
          this.currentLevel = data.label;
          this.currentPageNumber = 1;
          this.currentPageSize = 10;
          this.currentFilterType = 0
          this.getUserList(this.currentLevelId);
        }
      },
      // 获取平台用户列表
      getUserList(id, status, phone, beginDate, endDate, organName){
        this.$service.post({
          url: this.$api.userManagement.getUserList,
          params: {
            userLevelId: id || null,
            status: status || this.filterForm.status || null,
            phone: phone || this.filterForm.phone || null,
            beginDate: beginDate || this.filterForm.beginDate || null,
            endDate: endDate || this.filterForm.endDate || null,
            organName: organName || this.filterForm.organName || null,
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
      searchData(){
        this.currentPageNumber = 1
        this.currentFilterType = 0
        this.$refs['filterForm'].validate((valid, object)=>{
          if(valid){
            this.getUserList(this.currentLevelId, this.filterForm.status, this.filterForm.phone, this.filterForm.beginDate, this.filterForm.endDate, this.filterForm.organName)
          }
        })
      },
      // 清空筛选条件
      resetForm(){
        this.$refs['filterForm'].resetFields()
      },
      // 跳转到功能配置页面
      funConfig(currentLevelId, row){
        let levelId = row.userLevelId
        this.$router.push({path: 'userDomainConfig', query: {
          userId: row.id
        }})
      },
      // 平台用户列表的列样式设置
      tableCellStyle({row, column, rowIndex, columnIndex}) {
        if(column.property === 'userLevelName') {
          return {color: '#409EFF'}
        }
      },
      // 当前页码改变刷新列表
      pageNumberChange(pageNumber){
        this.currentPageNumber = pageNumber
        switch(this.currentFilterType){
          case 0: this.getUserList(this.currentLevelId); break;
          case 1: this.getUserList(); break;
        }
      },
      // 当前每页数量改变刷新列表
      pageSizeChange(pageSize){
        this.currentPageNumber = 1
        this.currentPageSize = pageSize
        switch(this.currentFilterType){
          case 0: this.getUserList(this.currentLevelId); break;
          case 1: this.getUserList(); break;
        }
      },
    },
    mounted(){
      this.getCategoryList()
    }
  }
</script>
<style type="text/css">
  .user-management-wrapper .el-form--inline .el-form-item__content{width: calc(100% - 100px);}
  .user-management-wrapper .el-input--suffix .el-input__inner{padding: 0 15px;}
  .user-management-wrapper .el-form--inline .filter.el-form-item{width: 100%;padding-left: 15px;}
  .user-management-wrapper .el-form--inline .filter.el-form-item .el-form-item__content{width: 100%;}
  .user-management-wrapper .el-date-editor.el-input, .el-date-editor.el-input__inner{width: 100%;}
  .user-management-wrapper .el-input--suffix.el-date-editor .el-input__inner{text-indent: 20px;}

  .user-management-wrapper .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell{padding-left: 0;}
  .user-management-wrapper .el-table .cell, .el-table th div{padding-right: 0;white-space: nowrap;}

  .custom-popper .el-date-picker__time-header{display: none;}
  .custom-popper .el-button.el-picker-panel__link-btn.el-button--text.el-button--mini{display: none;}
</style>
<style type="text/css" scoped>
  .el-table{border: none;margin-top: 10px;text-align: center;}
  .el-table:after{background-color: transparent;}
  .el-table th{text-align: center;}
  .el-pagination{text-align: center;padding-top: 20px;padding-bottom: 10px;}
</style>

