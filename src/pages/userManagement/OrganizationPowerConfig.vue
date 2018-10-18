<template>
  <div class="wrapper">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限后台</el-breadcrumb-item>
        <el-breadcrumb-item>组织权益配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <el-row :gutter="10">
        <el-col :span="23">
          <header style="margin-top: 10px;font-size: 16px;">{{ currentCategory + ' - ' + currentLevel }}</header>
        </el-col>
        <el-col :span="1">
          <el-button type="text" size="medium" @click="back">返回</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-table :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}">
            <el-table-column align="center" prop="privilegeName" label="权益名称" min-width="150"></el-table-column>
            <el-table-column align="left" prop="quantity" label="默认数量" min-width="150">
              <template slot-scope="scope">
                <el-form :ref="'form' + scope.row.privilegeId" :rules="tableRules" :model="scope.row.form" :id="scope.row.privilegeId" :disabled="customDisabled">
                  <el-form-item prop="updatedQuantity">
                    <el-input v-model.number="scope.row.form.updatedQuantity" size="small" style="width: 60%;"
                              @focus="clearValidate($refs['form' + scope.row.privilegeId])"></el-input>
                    {{scope.row.unitName}}
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
                <el-button size="medium" type="text" :disabled="customDisabled"
                           @click="updateOrganizationPowerConfigStatus(scope.row.privilegeId, scope.row.status)">
                  {{ formatSetStatusText(scope.row.status) }}
                </el-button>
                <el-button :form="scope.row.id" native-type="submit" size="medium" type="text" :disabled="customDisabled"
                           @click.stop.prevent="updateOrganizationPowerConfig(scope.row.privilegeId, scope.row.organPrivilegeId, scope.row.form.updatedQuantity, $refs['form' + scope.row.privilegeId])">保存</el-button>
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
  export default {
    data() {
      return {
        currentCategory: '',
        currentLevel: '',
        currentUserId: '',
        currentOrganId: '',
        currentPageNumber: 1,
        currentPageSize: 10,
        currentTotal: null,
        currentValidateRef: '',
        customDisabled: false,

        tableData: [],
        tableRules:{
          updatedQuantity: [
            { required: true, message: '请输入修改数量', trigger: 'blur' },
            { type: 'number', message: '修改数量必须为数字值'}
          ]
        },
      }
    },
    computed: {
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
      clearValidate(ref){
        if(this.currentValidateRef) this.currentValidateRef.clearValidate()
        this.currentValidateRef = ref
      },
      // 返回上一层
      back: function(){
        this.$router.go(-1)
      },
      // 获取单个平台用户类别的组织权益配置列表
      getOrganizationPowerConfigList(callback){
        this.$service.post({
          url: this.$api.userManagement.getOrganizationPowerConfigList,
          params: {
            userId: this.currentUserId,
            organId: this.currentOrganId,
            largeClass: 2,
            pageNum: this.currentPageNumber,
            pageSize: this.currentPageSize
          },
          successHook: (data) => {
            this.currentTotal = data.total
            this.tableData = data.list
            this.tableData.forEach((item, index, array) => {
              array[index].form = { updatedQuantity: item.privilegeValue ? parseInt(item.privilegeValue) : 0 }
            })
            this.$nextTick(callback)
          }
        })
      },
      // 修改单个平台用户类别的组织权益配置的状态
      updateOrganizationPowerConfigStatus(id, status){
        let statusText = this.formatSetStatusText(status)
        let url = 'enablePowerConfig'
        if(status === 'Y'){ url = 'disablePowerConfig' }
        else if(status === 'N'){ url = 'enablePowerConfig' }
        this.$service.postWithConfirm({
          confirmText: '此操作将' + statusText + '该组织权益, 是否继续？',
          url: this.$api.userManagement[url],
          params: {
            organId: this.currentOrganId,
            privilegeId: id,
          },
          successHook: () => {this.getOrganizationPowerConfigList()},
          successMessage: '已成功' + statusText + '该功能权益',
          // errorCloseHook: this.back
        })
      },
      // 修改单个平台用户类别的组织权益配置
      updateOrganizationPowerConfig(id, organPrivilegeId, updatedQuantity, ref){
        this.clearValidate(ref)
        ref.validate((valid, object)=>{
          // 校验成功
          if(valid){
            let url = organPrivilegeId ? 'updatePowerConfig' : 'addPowerConfig'
            this.customDisabled = true
            this.$service.postWithConfirm({
              confirmText: '此操作将保存该功能权益, 是否继续？',
              url: this.$api.userManagement[url],
              params: {
                organId: this.currentOrganId,
                privilegeId: id,
                currentValue: updatedQuantity,
              },
              successHook: () => {
                // 刷新列表
                this.getOrganizationPowerConfigList(()=>{
                  this.customDisabled = false
                  this.clearValidate()
                })
              },
              successMessage: '已成功保存该功能权益',
              // errorCloseHook: this.back
            })
          }
        })
      },
      // 当前页码改变刷新列表
      pageNumberChange(pageNumber){
        this.currentPageNumber = pageNumber
        this.getOrganizationPowerConfigList()
      },
      // 当前每页数量改变刷新列表
      pageSizeChange(pageSize){
        this.currentPageSize = pageSize
        this.getOrganizationPowerConfigList()
      },
    },
    created () {
      this.currentCategory = this.$route.params.category
      this.currentLevel = this.$route.params.level
      this.currentUserId = this.$route.params.userId
      this.currentOrganId = this.$route.params.organId
      this.getOrganizationPowerConfigList()
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
