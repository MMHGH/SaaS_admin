<template>
  <div class="wrapper">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限后台</el-breadcrumb-item>
        <el-breadcrumb-item>功能权益配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <el-row :gutter="10">
        <el-col :span="23">
          <el-menu mode="horizontal" @select="getCurrentConfigType" :default-active="currentConfigType + ''">
            <el-menu-item index="1">平台权益</el-menu-item>
            <el-menu-item index="2">生码权益</el-menu-item>
            <el-menu-item index="3">模板权益</el-menu-item>
            <el-menu-item index="4">功能权益</el-menu-item>
            <el-menu-item index="5">账号时长</el-menu-item>
            <el-menu-item index="6">资源配置</el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="1">
          <el-button type="text" size="medium" @click="back" style="margin-top: 12px;">返回</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;" v-if="currentConfigType===6">
        <el-col :span="24">
          资源名称：<el-input size="small" style="width: 150px;" v-model="filterName"></el-input>
          <el-button style="margin-left: 10px;" size="small" type="primary" @click.stop.prevent="filter">筛选</el-button>
          <el-button type="text" size="small" @click="resetFilter">清空筛选条件</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="24">
          <el-table :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}">
            <el-table-column align="center" prop="privilegeName" :label="privilegeNameLabel" min-width="150" v-if="currentConfigType!==6">
              <template slot-scope="scope">{{scope.row.privilegeName}}</template>
            </el-table-column>
            <el-table-column align="center" prop="privilegeValue" :label="privilegeValueLabel" v-if="currentConfigType!==5 && currentConfigType!==6">
              <template slot-scope="scope">{{scope.row.privilegeValue ? (scope.row.unitName === '%' ? scope.row.privilegeValue : parseInt(scope.row.privilegeValue)) : 0}}{{scope.row.unitName}}</template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="资源名称" v-if="currentConfigType===6">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column align="center" prop="inventory" label="剩余库存" v-if="currentConfigType===6">
              <template slot-scope="scope">{{scope.row.inventory}}</template>
            </el-table-column>
            <el-table-column align="center" prop="validityTime" label="账号到期时间" v-if="currentConfigType===5">
              <template slot-scope="scope">{{scope.row.validityTime ? scope.row.validityTime.slice(0, 16) : ''}}</template>
            </el-table-column>




            <!--修改数量-->
            <el-table-column align="left" header-align="center" :label="updatedQuantityLabel" min-width="120">
              <template slot-scope="scope">
                <el-form :ref="'form' + scope.row.privilegeId" :rules="tableRules" :model="scope.row.form" :id="scope.row.privilegeId">
                  <el-form-item prop="updatedQuantity" v-if="currentConfigType!==5">
                    <el-input v-model="scope.row.form.updatedQuantity" size="small" style="width: 60%;" @focus="clearValidate(scope.row)"></el-input>
                    {{ scope.row.unitName }}
                  </el-form-item>
                  <el-form-item prop="updatedTime" v-if="currentConfigType===5">
                    <el-date-picker v-model="scope.row.form.updatedTime" type="datetime" size="small" style="width: 60%;" placeholder="选择日期时间" @focus="clearValidate(scope.row)" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>




            <el-table-column align="center" label="设置">
              <template slot-scope="scope">
                <el-button :form="scope.row.privilegeId" size="medium" type="text" @click="updateFunctionPowerConfig(scope.row)">保存</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="pagination" background :current-page="currentPageNumber" layout="prev, pager, next, total, sizes, jumper" :total="currentTotal" :page-size="currentPageSize" :page-sizes="[5, 10, 20, 50, 100]"
            @current-change="pageNumberChange" @prev-clicke="pageNumberChange" @next-click="pageNumberChange" @size-change="pageSizeChange"></el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import validatePrivilege from '@/util/validatePrivilege'
  export default {
    data() {
      let vm = this
      let validateUpdatedQuantity = (rule, value, callback) => {
        let
          _privilegeCode = vm.currentRow && vm.currentRow.privilegeCode,
          _unitName = vm.currentRow && vm.currentRow.unitName
        validatePrivilege.privilegeCode(rule, value, callback, _privilegeCode)
        validatePrivilege.unitName(rule, value, callback, _unitName)
        callback()
      }
      let validateUpdatedTime = (rule, value, callback) => {
        vm.$validator.notEmpty(callback, value, '请选择修改时间')
        let timestamp = new Date(value).getTime() - new Date()
        if(timestamp <= 0){
          callback(new Error('修改时间不能在当前时间之前'))
        }
        if(timestamp > 10*12*30*24*60*60*1000){
          callback(new Error('修改时间不能超过当前时间超出10年'))
        }
        callback()
      }
      return {
        currentCategory: '',
        currentLevel: '',
        currentUserId: '',
        currentOrganId: '',
        currentPageNumber: 1,
        currentPageSize: 10,
        currentTotal: null,
        tableData: [],
        tableRules:{
          updatedQuantity: [{ validator: validateUpdatedQuantity, trigger: 'change' },],
          updatedTime: [{ validator: validateUpdatedTime, trigger: 'change' },]
        },
        currentConfigType: 1,
        filterName:'',
        currentRow: '',
      }
    },
    computed: {
      privilegeNameLabel: function(){
        let name
        switch(this.currentConfigType){
          case 1: name = '类别名称'; break;
          case 2: name = '功能名称'; break;
          case 3: name = '模板名称'; break;
          case 4: name = '功能名称'; break;
          case 5: name = '账号名称'; break;
          case 6: name = '资源名称'; break;
        }
        return name
      },
      privilegeValueLabel: function(){
        let name
        switch(this.currentConfigType){
          case 1: name = '当前可分配账号数量'; break;
          case 2: name = '当前可分配功能数量'; break;
          case 3: name = '当前可分配时间'; break;
          case 4: name = '当前功能数量'; break;
          case 5: name = '账号到期时间'; break;
          case 6: name = '当前可分配数量'; break;
        }
        return name
      },
      updatedQuantityLabel: function(){
        let name
        switch(this.currentConfigType){
          case 1: name = '修改可分配账号数量'; break;
          case 2: name = '可分配数量'; break;
          case 3: name = '修改可分配时间'; break;
          case 4: name = '修改个数'; break;
          case 5: name = '修改到期时间'; break;
          case 6: name = '可分配数量'; break;
        }
        return name
      },
    },
    methods: {
      // 返回上一层
      back: function(){
        this.$router.go(-1)
      },
      // 获取当前权益类型
      getCurrentConfigType(index){
        this.currentPageNumber = 1
        this.currentConfigType = parseInt(index)
        this.getFunctionPowerConfigList()
      },
      // 当前页码改变刷新列表
      pageNumberChange(pageNumber){
        this.currentPageNumber = pageNumber
        this.getFunctionPowerConfigList()
      },
      // 当前每页数量改变刷新列表
      pageSizeChange(pageSize){
        this.currentPageNumber = 1
        this.currentPageSize = pageSize
        this.getFunctionPowerConfigList()
      },
      // 获取单个平台用户类别的功能权益配置列表
      getFunctionPowerConfigList(callback){
        this.tableData = []
        if(this.currentConfigType === 6){
          // 资源配置
          this.$service.post({
            url: this.$api.userManagement.getListOrganGoods,
            params: {
              name: this.filterName,
              pageNum: this.currentPageNumber,
              pageSize: this.currentPageSize,
            },
            successHook: (data) => {
              this.currentTotal = data.total
              this.tableData = data.list
              this.tableData.forEach((item, index, array) => {
                this.$set(array[index], 'form', {updatedQuantity: item.inventory})
                array[index].privilegeId = array[index].id
              })
              callback && this.$nextTick(callback)
            },
          })
        }else{
          // 平台权益、生码权益、模板权益、功能权益、账号时长
          this.$service.post({
            url: this.$api.userManagement.getFunctionPowerConfigList,
            params: {
              userId: this.currentUserId,
              organId: this.currentOrganId,
              largeClass: 1,
              pageNum: this.currentPageNumber,
              pageSize: this.currentPageSize,
              type: this.currentConfigType,
            },
            successHook: (data) => {
              this.currentTotal = data.total
              this.tableData = data.list
              this.tableData.forEach((item, index, array) => {
                if(this.currentConfigType===5){
                  this.$set(array[index], 'form', { updatedTime: ''})
                }else{
                  this.$set(array[index], 'form', { updatedQuantity: item.privilegeValue ? (item.unitName === '%' ? item.privilegeValue : parseInt(item.privilegeValue)) : 0 })
                }
              })
              callback && this.$nextTick(callback)
            }
          })
        }
      },
      // 移除校验结果
      clearValidate(row){
        let ref = this.$refs['form' + this.currentRow.privilegeId]
        ref && ref.clearValidate()
        this.currentRow = row
      },
      // 修改单个平台用户类别的功能权益配置
      updateFunctionPowerConfig(row){
        this.clearValidate(row)
        this.$refs['form' + this.currentRow.privilegeId].validate((valid, object)=>{
          let updatedQuantity = this.currentConfigType===5 ? this.currentRow.form.updatedTime : parseFloat(this.currentRow.form.updatedQuantity)
          // 校验成功
          if(valid){
            if(this.currentConfigType === 6){
              // 资源配置
              this.$service.postWithConfirm({
                confirmText: '此操作将保存, 是否继续？',
                url: this.$api.userManagement.shareOrganGoods,
                params: {
                  goodsId: this.currentRow.privilegeId,
                  organId: this.currentOrganId,
                  num: updatedQuantity,
                },
                successHook: () => {
                  // 刷新列表
                  this.getFunctionPowerConfigList()
                },
                successMessage: '已成功保存',
              })
            }else{
              // 平台权益、生码权益、模板权益、功能权益、账号时长
              let url = this.currentRow.organPrivilegeId ? 'updatePowerConfig' : 'addPowerConfig'
              let type
              switch(this.currentConfigType){
                case 1: type = 2; break;
                case 2: type = 2; break;
                case 3: type = 2; break;
                case 4: type = 2; break;
                case 5: type = 1; break;
                case 6: type = 2; break;
              }
              let params = {
                organId: this.currentOrganId,
                privilegeId: this.currentRow.privilegeId,
                type: type,
              }
              switch(type){
                case 1: params.validityTime = updatedQuantity; break;
                case 2: params.currentValue = updatedQuantity; break;
              }
              this.$service.postWithConfirm({
                confirmText: '此操作将保存, 是否继续？',
                url: this.$api.userManagement[url],
                params: params,
                successHook: () => {
                  // 刷新列表
                  this.getFunctionPowerConfigList()
                },
                successMessage: '已成功保存',
              })
            }
          }
        })
      },
      // 筛选
      filter(){
        this.currentPageNumber = 1
        // 刷新列表
        this.getFunctionPowerConfigList()
      },
      // 清除筛选
      resetFilter(){
        this.filterName = ''
      },
    },
    created () {
      this.currentCategory = this.$route.query.category
      this.currentLevel = this.$route.query.level
      this.currentUserId = this.$route.query.userId
      this.currentOrganId = this.$route.query.organId
      this.getFunctionPowerConfigList()
    }
  }
</script>
<style scoped>
  .wrapper{position: absolute;top: 0;left: 0;right: 0;bottom: 0;background: #f2f2f2;}
  .el-table{border: none;margin-top: 10px;text-align: center;}
  .el-table:after{background-color: transparent;}
  .el-form-item:not(.is-error){margin-bottom: 0;}
  /*.el-form-item.is-error{margin-bottom: 22px;}*/
  .el-pagination{text-align: center;padding-top: 20px;padding-bottom: 10px;}
</style>
