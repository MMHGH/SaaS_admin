<template>
  <div class="wrapper">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限后台</el-breadcrumb-item>
        <el-breadcrumb-item>平台用户等级定义</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-tree ref="tree" :data="treeData" :props="defaultProps" node-key="categoryId"
            :highlight-current="true" :default-expanded-keys="[0]" @node-click="getLevelListByTree"></el-tree>
        </el-col>
        <el-col :span="20">
          <el-button type="primary" size="medium" @click="addLevel(currentCategoryId)">添加等级</el-button>
          <el-table empty-text="暂无数据，请选择平台用户类别" :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}" :cell-style="setTableCellStyle">
            <el-table-column align="center" prop="sysUserTypeName" label="类别名称"></el-table-column>
            <el-table-column align="center" prop="sysUserLevelName" label="等级名称"></el-table-column>
            <el-table-column align="center" label="功能配置">
              <template slot-scope="scope">
                <el-button size="medium" type="text" @click="functionConfig(scope.row.id)">配置</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" label="功能权益配置">
              <template slot-scope="scope">
                <el-button size="medium" type="text" @click="functionPowerConfig(scope.row.sysUserTypeName, scope.row.sysUserLevelName, scope.row.id)">配置</el-button>
              </template>
            </el-table-column>
            <el-table-column v-if="!isPersonalUser" align="center" label="组织权益配置">
              <template slot-scope="scope">
                <el-button size="medium" type="text" @click="organizationPowerConfig(scope.row.sysUserTypeName, scope.row.sysUserLevelName, scope.row.id)">配置</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="status" label="当前状态">
              <template slot-scope="scope">
                {{ scope.row.status === "Y" ? "启用" : "禁用" }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="设置" min-width="150">
              <template slot-scope="scope">
                <el-button size="medium" type="text" @click="updateLevelStatus(scope.row.id, (scope.row.status === 'Y' ? 'N' : 'Y'))">{{scope.row.status === 'Y' ? "禁用" : "启用"}}</el-button>
                <el-button size="medium" type="text" @click="deleteLevel(scope.row.id)">删除</el-button>
                <el-button size="medium" type="text" @click="updateLevel(scope.row.id, currentCategoryId)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        treeData: [{
          categoryId: 0,
          label: '平台用户类别',
          children: []
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        tableData: [],
        expands: [],
      }
    },
    computed: {
      // 是否个人用户
      isPersonalUser(){
        return parseInt(this.currentCategoryId) === 1
      },
      currentCategoryId: {
        get(){
          let
            qId = this.$route.query.currentCategoryId,
            tId = this.treeData[0].children[0] ? this.treeData[0].children[0].categoryId : null
          return qId ? qId : tId
        },
        set(val){
          if(val) this.$urlTool.setQueryStringArgs({currentCategoryId: val})
        }
      }
    },
    methods: {
      // 获取平台用户类别列表
      getCategoryList(){
        this.$service.post({
          url: this.$api.getCategoryList,
          successHook: (data) => {
            data.forEach(item => {
              this.treeData[0].children.push({categoryId: item.dictValue, label: item.dictName})
            })
            // DOM更新完成
            this.$nextTick(()=>{
              this.$refs.tree.setCurrentKey(this.currentCategoryId)
              this.getLevelList({userTypeId: this.currentCategoryId})
            })
          }
        })
      },
      // 获取平台用户等级列表（通过选择平台用户类别）
      getLevelListByTree(data){
        if(!data.children) {
          this.currentCategoryId= data.categoryId
          this.getLevelList({userTypeId: data.categoryId})
        }
      },
      // 获取平台用户等级列表
      getLevelList(parameter){
        this.$service.post({
          url: this.$api.platformUserLevelDefinition.getLevelList,
          params: parameter,
          successHook: (data) => {
            this.tableData = data
          }
        })
      },
      // 平台用户等级列表的列样式设置
      setTableCellStyle({row, column, rowIndex, columnIndex}) {
        if(column.property === 'sysUserLevelName') {
          return {color: '#F56C6C'}
        }
      },
      // 跳转至新增单个平台用户等级页面
      addLevel(categoryId){
        this.$router.push({
          name: 'AddLevel',
          params: {categoryId: categoryId, categoryData: this.treeData[0].children},
          query: {categoryId: categoryId,},
        })
      },
      // 跳转至修改单个平台用户等级页面
      updateLevel(id, categoryId){
        this.$router.push({
          name: 'UpdateLevel',
          params: {id: id, categoryId: categoryId, categoryData: this.treeData[0].children},
          query: {id: id, categoryId: categoryId},
        })
      },
      // 跳转至修改单个平台用户类别的功能配置页面
      functionConfig(id){
        this.$router.push({name: 'FunctionConfig', params: {id: id}, query: {id: id}})
      },
      // 跳转至修改单个平台用户类别的功能权益配置页面
      functionPowerConfig(category, level, levelId){
        this.$router.push({
          name: 'FunctionPowerConfig',
          params: {category: category, level: level, levelId: levelId},
          query: {category: category, level: level, levelId: levelId}
        })
      },
      // 跳转至修改单个平台用户类别的组织权益配置页面
      organizationPowerConfig(category, level, levelId){
        this.$router.push({
          name: 'OrganizationPowerConfig',
          params: {category: category, level: level, levelId: levelId},
          query: {category: category, level: level, levelId: levelId},
        })
      },
      // 删除单个平台用户等级
      deleteLevel(id){
        this.$service.postWithConfirm({
          confirmText: '此操作将删除类别, 是否继续？',
          url: this.$api.platformUserLevelDefinition.deleteLevel,
          params: {id: id},
          successHook: () => {
            // 刷新等级列表
            this.getLevelList({userTypeId: this.currentCategoryId})
          },
          successMessage: '已成功删除该等级'
        })
      },
      // 修改单个平台用户等级的状态
      updateLevelStatus(id, updateStatus){
        let statusText = updateStatus === 'Y' ? "启用" : "禁用"
        let url = updateStatus === 'Y' ? 'enableLevel' : 'disableLevel'
        this.$service.postWithConfirm({
          confirmText: `此操作将${statusText}类别, 是否继续？`,
          url: this.$api.platformUserLevelDefinition[url],
          params: {id: id},
          successHook: () => {
            // 刷新类别列表
            this.getLevelList({userTypeId: this.currentCategoryId})
          },
          successMessage: `已成功${statusText}该类别`
        })
      },
    },
    created () {
      this.getCategoryList()
    }
  }
</script>
<style scoped>
  .wrapper{position: absolute;top: 0;left: 0;right: 0;bottom: 0;/*background: #f2f2f2;*/}
  .el-table{border: none;margin-top: 10px;text-align: center;}
  .el-table:after{background-color: transparent;}
</style>
