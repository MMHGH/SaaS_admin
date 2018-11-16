<template>
  <div class="user-management-wrapper">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限后台</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-tree ref="tree" node-key="levelId" :data="treeData" default-expand-all
                   :highlight-current="true" @node-click="getUserListByLevel"></el-tree>
        </el-col>
        <el-col :span="20">
          <el-form ref="filterForm" :model="filterForm" inline size="small" label-position="right"
                   label-width="100px" label-suffix="：" :rules="filterFormRules">
            <el-row>
              <el-col :span="24">
                <el-form-item label="手机号码" prop="phone">
                  <el-input v-model="filterForm.phone" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="开始时间" prop="beginDate">
                  <el-date-picker v-model="filterForm.beginDate" placeholder="选择开始时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="endDate">
                  <el-date-picker v-model="filterForm.endDate" placeholder="选择结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="企业关键词" prop="organName">
                  <el-input v-model="filterForm.organName"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                  <el-select v-model="filterForm.status">
                    <el-option label="全部" :value="null"></el-option>
                    <el-option label="启用" value="Y"></el-option>
                    <el-option label="禁用" value="N"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item class="filter">
                  <el-button native-type="submit" type="primary" size="medium" @click.stop.prevent="filterAll">全局筛选</el-button>
                  <el-button native-type="submit" type="primary" size="medium" @click.stop.prevent="filter">筛选</el-button>
                  <el-button type="text" size="medium" @click="resetForm">清空筛选条件</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-button  type="primary" size="medium" @click="addUserAccount">新建账户</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table empty-text="暂无数据" :data="tableData" size="medium"
                    :header-cell-style="{backgroundColor: '#f2f2f2'}" :cell-style="tableCellStyle">
            <el-table-column align="center" prop="account" label="账号"></el-table-column>
            <el-table-column align="center" property="regTime" label="注册时间">
              <template slot-scope="scope">
                {{$timestamp.getDateByTimestamp(scope.row.regTime)}}
              </template>
            </el-table-column>
            <el-table-column align="center" property="userLevelName" label="用户类型"></el-table-column>
            <el-table-column align="center" property="organName" label="企业名称" min-width="170"></el-table-column>
            <el-table-column align="center" property="status" label="当前状态">
              <template slot-scope="scope">
                {{scope.row.status === 'Y' ? '启用' : '禁用'}}
              </template>
            </el-table-column>
            <el-table-column align="center" property="expireTime" label="剩余时间" min-width="120">
              <template slot-scope="scope">
                {{scope.row.expireTime ? $timestamp.getExpireTimeByTimestamp(scope.row.expireTime, 1) : '未设置'}}
              </template>
            </el-table-column>
            <el-table-column align="center" property="money" label="余额">
              <template slot-scope="scope">
                {{scope.row.money ? scope.row.money : 0}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="设置" min-width="270">
              <template slot-scope="scope">
                <el-button size="medium" type="text"
                           @click="updateUserStatus(scope.row.id, scope.row.status === 'Y' ? 'N' : 'Y')">{{scope.row.status === 'Y' ? '禁用' : '启用'}}</el-button>
                <el-button size="medium" type="text" @click="updateUserAccount(scope.row.id)">修改</el-button>
                <el-button size="medium" type="text" @click="functionConfig(currentLevelId, scope.row)">功能配置</el-button>
                <!--<el-button size="medium" type="text" @click="organizationPowerConfig(currentCategory, currentLevel, scope.row.id, scope.row.organId)">组织权限</el-button>-->
                <el-button size="medium" type="text" @click="functionPowerConfig(currentCategory, currentLevel, scope.row.id, scope.row.organId, scope.row)">权益分配</el-button>
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
        currentFilterType: 0, // 0：筛选， 1：全局筛选
      }
    },
    computed: {
      status(){
        return this.filterForm.status
      },
      phone(){
        return this.filterForm.phone
      },
      beginDate(){
        return this.filterForm.beginDate
      },
      endDate(){
        return this.filterForm.endDate
      },
      organName(){
        return this.filterForm.organName
      }
    },
    watch: {
      currentLevelId(newVal, oldVal){
        if(!newVal) return
        this.$urlTool.setQueryStringArgs({currentLevelId: this.currentLevelId})
      },
      status(newVal, oldVal){

        if(!newVal) return
        this.$urlTool.setQueryStringArgs({status: newVal})
      },
      phone(newVal, oldVal){
        if(!newVal) return
        this.$urlTool.setQueryStringArgs({phone: newVal})
      },
      beginDate(newVal, oldVal){
        if(!newVal) return
        this.$urlTool.setQueryStringArgs({beginDate: newVal})
      },
      endDate(newVal, oldVal){
        if(!newVal) return
        this.$urlTool.setQueryStringArgs({endDate: newVal})
      },
      organName(newVal, oldVal){
        if(!newVal) return
        this.$urlTool.setQueryStringArgs({organName: newVal})
      },
    },
    methods:{
      // 获取类别列表
      getCategoryList(){
        this.$service.post({
          url: this.$api.getCategoryList,
          successHook: (data) => {
            data.forEach(item => {
              this.treeData[0].children.push({categoryId: item.dictValue, label: item.dictName, children: []})
            })
            this.treeData[0].children.forEach(item => {
              this.getLevelList(item)
            })
          }
        })
      },
      // 获取等级列表
      getLevelList(category){
        this.$service.post({
          url: this.$api.platformUserLevelDefinition.getLevelList,
          params: {userTypeId: category.categoryId},
          successHook: (data) => {
            data.forEach(item => {
              category.children.push({levelId: item.id, label: item.sysUserLevelName})
            })
            this.$nextTick(()=>{
              if(this.$route.query.currentLevelId)
              {
                this.currentLevelId && this.$refs['tree'].setCurrentKey(this.currentLevelId)
                let node = this.$refs['tree'].getNode(this.currentLevelId)
                this.currentCategoryId = node && node.parent.data.categoryId
                this.getUserList(this.currentLevelId)
              }
              else
              {
                for(let i=0; i<this.treeData[0].children.length; i++){
                  if(this.treeData[0].children[i].children.length>0){
                    let data = this.treeData[0].children[i].children[0]
                    let node = this.$refs['tree'].getNode(data)

                    this.getUserList()
                    this.currentLevelId = node.data.levelId
                    this.currentCategoryId = node && node.parent.data.categoryId

                    break
                  }
                }
              }
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
      filter(){
        this.currentPageNumber = 1
        this.currentFilterType = 0
        this.$refs['filterForm'].validate((valid, object)=>{
          if(valid){
            this.getUserList(this.currentLevelId, this.filterForm.status, this.filterForm.phone, this.filterForm.beginDate, this.filterForm.endDate, this.filterForm.organName)
          }
        })
      },
      // 提交全局筛选条件
      filterAll(){
        this.currentPageNumber = 1
        this.currentFilterType = 1
        this.$refs['filterForm'].validate((valid, object)=>{
          if(valid){
            this.getUserList(null, this.filterForm.status, this.filterForm.phone, this.filterForm.beginDate, this.filterForm.endDate, this.filterForm.organName)
          }
        })
      },
      // 清空筛选条件
      resetForm(){
        this.$refs['filterForm'].resetFields()
      },
      // 跳转到新建账户页面
      addUserAccount(){
        this.$router.push({
          name: 'UserManagementAddUserAccount',
          params: {
            currentCategoryId: this.currentCategoryId,
            currentLevelId: this.currentLevelId
          },
          query: {
            currentCategoryId: this.currentCategoryId,
            currentLevelId: this.currentLevelId
          }
        })
      },
      // 更改平台用户状态
      updateUserStatus(id, updateStatus){
        let statusText = updateStatus === 'Y' ? "启用" : "禁用"
        let url = updateStatus === 'Y' ? 'enableUser' : 'disableUser'
        this.$service.postWithConfirm({
            confirmText: '此操作将' + statusText + '该用户, 是否继续？',
            url: this.$api.userManagement[url],
            params: {id: id},
            successHook: () => {this.getUserList(this.currentLevelId)},
            successMessage: '已成功' + statusText + '该类别',
            errorCloseHook: this.back
        })
      },
      // 跳转到修改账户页面
      updateUserAccount(id){
        this.$router.push({name: 'UserManagementUpdateUserAccount', params: {id: id}, query: {id: id}})
      },
      // 跳转到功能配置页面
      functionConfig(currentLevelId, row){
        let levelId
        // switch(this.currentFilterType){
        //   case 0: levelId = currentLevelId; break;
        //   case 1: levelId = row.userLevelId; break;
        // }
        levelId = row.userLevelId
        this.$router.push({name: 'UserManagementFunctionConfig', params: {
          levelId: levelId,
          userId: row.id
        }})
      },
      // 跳转到组织权限配置页面
      organizationPowerConfig(category, level, userId, organId){
        this.$router.push({name: 'UserManagementOrganizationPowerConfig', params: {
          category: category,
          level: level,
          userId: userId,
          organId: organId
        }})
      },
      // 跳转到功能权益配置页面
      functionPowerConfig(category, level, userId, organId, row){
        this.$router.push({name: 'UserManagementFunctionPowerConfig', params: {
          category: category,
          level: level,
          userId: userId,
          organId: organId
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
        this.currentPageSize = pageSize
        switch(this.currentFilterType){
          case 0: this.getUserList(this.currentLevelId); break;
          case 1: this.getUserList(); break;
        }
      },
    },
    mounted(){
      this.currentLevelId = this.$route.query.currentLevelId || null
      this.$route.query.status && (this.filterForm.status = this.$route.query.status)
      this.$route.query.phone && (this.filterForm.phone = this.$route.query.phone)
      this.$route.query.beginDate && (this.filterForm.beginDate = new Date(this.$route.query.beginDate))
      this.$route.query.endDate && (this.filterForm.endDate = new Date(this.$route.query.endDate))
      this.$route.query.organName && (this.filterForm.organName = this.$route.query.organName)
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

  /*.user-management-wrapper .pagination span, .pagination .number{height: 25px!important;line-height: 25px!important;color: #d7d7d7;}*/
  /*.user-management-wrapper .pagination button span, .pagination .number{border: 1px solid #d7d7d7!important;padding: 0 5px;}*/
  /*.user-management-wrapper .pagination li{margin-right: 10px;}*/
  /*.user-management-wrapper .pagination button:hover span{color: #666!important;border-color: #666!important;}*/
  /*.user-management-wrapper .pagination .el-pager li.active,*/
  /*.user-management-wrapper .pagination .el-pager li:hover{color: #666!important;border-color: #666!important;}*/
  /*.user-management-wrapper .pagination .el-pagination__editor.el-input .el-input__inner{color: #666;}*/
  /*.user-management-wrapper .pagination .el-pagination__editor.el-input .el-input__inner:focus,*/
  /*.user-management-wrapper .pagination .el-select .el-input .el-input__inner:focus{border-color: #666;}*/
  /*.user-management-wrapper .pagination .el-pagination__sizes .el-input .el-input__inner:hover{border-color: #666;}*/
  /*.user-management-wrapper .pagination-popper .el-select-dropdown__item{color: #d7d7d7;}*/
  /*.user-management-wrapper .pagination-popper .el-select-dropdown__item.selected{color: #666;}*/
</style>
<style type="text/css" scoped>
  .el-table{border: none;margin-top: 10px;text-align: center;}
  .el-table:after{background-color: transparent;}
  .el-table th{text-align: center;}
  .el-pagination{text-align: center;padding-top: 20px;padding-bottom: 10px;}
</style>

