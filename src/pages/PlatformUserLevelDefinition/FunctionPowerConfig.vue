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
          <header style="margin-top: 10px;font-size: 16px;">{{this.currentCategory + ' - ' + this.currentLevel}}</header>
        </el-col>
        <el-col :span="1">
          <el-button type="text" size="medium" @click="goBack">返回</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-table :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}">
            <el-table-column align="center" prop="privilegeName" label="权益名称" min-width="150"></el-table-column>
            <el-table-column align="left" prop="privilegeValue" label="当前数值">
              <template slot-scope="scope">{{scope.row.privilegeValue ? (scope.row.unitName === '%' ? scope.row.privilegeValue : parseInt(scope.row.privilegeValue)) : 0}}{{scope.row.unitName}}</template>
            </el-table-column>
            <!--修改数量-->
            <el-table-column align="left" header-align="center" label="修改数量" min-width="120">
              <template slot-scope="scope">
                <el-form :ref="'form' + scope.row.privilegeId" :rules="tableRules" :model="scope.row.form" :id="scope.row.privilegeId">
                  <el-form-item prop="updatedQuantity">
                    <el-input :maxlength="10" v-model.number="scope.row.form.updatedQuantity" size="small" style="width: 60%;" @focus="clearValidate($refs['form' + scope.row.privilegeId], scope.row)"></el-input>
                    {{ scope.row.unitName }}
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column align="left" header-align="center" prop="description" label="说明" min-width="300"></el-table-column>
            <el-table-column align="center" prop="status" label="当前状态">
              <template slot-scope="scope">
                {{ formatShowStatusText(scope.row.status) }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="设置">
              <template slot-scope="scope">
                <el-button size="medium" type="text" @click="updateFunctionPowerConfigStatus(scope.row.privilegeId, scope.row.status)">
                  {{ formatSetStatusText(scope.row.status) }}
                </el-button>
                <el-button :form="scope.row.privilegeId" native-type="submit" size="medium" type="text"
                           @click.stop.prevent="updateFunctionPowerConfig(scope.row.privilegeId, scope.row.userLvPrivilegeId, scope.row.form.updatedQuantity, $refs['form' + scope.row.privilegeId])">保存</el-button>
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
        validatePrivilege.privilegeCode(rule, value, callback, vm.currentRow.privilegeCode)
        validatePrivilege.unitName(rule, value, callback, vm.currentRow.unitName)
        callback()
      }
      return {
        currentCategory: '',
        currentLevel: '',
        currentLevelId: '',
        currentPageNumber: 1,
        currentPageSize: 10,
        currentTotal: null,
        tableData: [],
        tableRules:{
          updatedQuantity: [
            { required: true, message: '请输入修改数量', trigger: 'blur' },
            { type: 'number', message: '修改数量必须为数字'},
            { validator: validateUpdatedQuantity, trigger: 'blur' }
          ]
        },
        currentValidateRef: '',
        currentRow: ''
      }
    },
    methods: {
      // 格式化显示状态文本
      formatShowStatusText(status){
        let text = null
        switch(status){
          case 'Y': text = '启用'; break;
          case 'N': text = '禁用'; break;
          default: text = '未设置';
        }
        return text
      },
      // 格式化设置状态文本
      formatSetStatusText(status){
        let text = null
        switch(status){
          case 'Y': text = '禁用'; break;
          case 'N': text = '启用'; break;
          default: text = '';
        }
        return text
      },
      // 移除校验结果
      clearValidate(ref, row){
        if(this.currentValidateRef) this.currentValidateRef.clearValidate()
        this.currentValidateRef = ref
        this.currentRow = row
      },
      // 返回上一层
      goBack: function(){
        this.$router.go(-1)
      },
      // 获取单个平台用户类别的功能权益配置列表
      getFunctionPowerConfigList(callback){
        this.$service.post({
          url: this.$api.platformUserLevelDefinition.getFunctionPowerConfigList,
          params: {
            userLevelId: this.currentLevelId,
            largeClass: 1,
            pageNum: this.currentPageNumber,
            pageSize: this.currentPageSize
          },
          successHook: (data) => {
            this.currentTotal = data.total
            this.tableData = data.list
            this.tableData.forEach((item, index, array) => {
              this.$set(array[index], 'form', { updatedQuantity: '' })
            })
            this.$nextTick(callback)
          }
        })
      },
      // 修改单个平台用户类别的功能权益配置的状态
      updateFunctionPowerConfigStatus(id, status){
        let statusText = this.formatSetStatusText(status)
        let url = 'enablePowerConfig'
        if(status === 'Y'){ url = 'disablePowerConfig' }
        else if(status === 'N'){ url = 'enablePowerConfig' }
        this.$service.postWithConfirm({
          confirmText: '此操作将' + statusText + '该功能权益, 是否继续？',
          url: this.$api.platformUserLevelDefinition[url],
          params: {
            userLevelId: this.currentLevelId,
            privilegeId: id,
          },
          successHook: () => {
            // 刷新列表
            this.getFunctionPowerConfigList()
          },
          successMessage: '已成功' + statusText + '该功能权益',
        })
      },
      // 修改单个平台用户类别的功能权益配置
      updateFunctionPowerConfig(id, userLvPrivilegeId, updatedQuantity, ref){
        ref.validate((valid, object)=>{
          //this.clearValidate(ref)
          // 校验成功
          if(valid){
            let url = userLvPrivilegeId ? 'updatePowerConfig' : 'addPowerConfig'
            this.$service.postWithConfirm({
              confirmText: '此操作将保存该功能权益, 是否继续？',
              url: this.$api.platformUserLevelDefinition[url],
              params: {
                userLevelId: this.currentLevelId,
                privilegeId: id,
                value: updatedQuantity,
              },
              successHook: () => {
                // ref.$el.elements[0].value = ''
                // 刷新列表
                this.getFunctionPowerConfigList(()=>{
                  this.clearValidate()
                })
              },
              successMessage: '已成功保存该功能权益！',
            })
          }
        })
      },

      // 当前页码改变刷新列表
      pageNumberChange(pageNumber){
        this.currentPageNumber = pageNumber
        this.getFunctionPowerConfigList()
      },
      // 当前每页数量改变刷新列表
      pageSizeChange(pageSize){
        this.currentPageSize = pageSize
        this.getFunctionPowerConfigList()
      },
    },
    created () {
      this.currentCategory = this.$route.params.category
      this.currentLevel = this.$route.params.level
      this.currentLevelId = this.$route.params.levelId
      this.getFunctionPowerConfigList()
    }
  }
</script>
<style></style>
<style scoped>
  .wrapper{position: absolute;top: 0;left: 0;right: 0;bottom: 0;background: #f2f2f2;}
  .el-table{border: none;margin-top: 10px;text-align: center;}
  .el-table:after{background-color: transparent;}
  .el-form-item:not(.is-error){margin-bottom: 0;}
  /*.el-form-item.is-error{margin-bottom: 22px;}*/
  .el-pagination{text-align: center;padding-top: 20px;padding-bottom: 10px;}
</style>
