<template>
  <div class="price-config-wrapper">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限后台</el-breadcrumb-item>
        <el-breadcrumb-item>价格配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-tree ref="tree" node-key="levelId" :data="treeData" default-expand-all :highlight-current="true" :props="defaultProps" @node-click="getCurrentLevelId"></el-tree>
        </el-col>
        <el-col :span="20">
          <el-menu mode="horizontal" style="margin-bottom: 20px;" @select="getCurrentPriceConfig" :default-active="currentPriceConfig + ''">
            <el-menu-item index="1">平台使用费</el-menu-item>
            <el-menu-item index="2">功能使用费</el-menu-item>
            <el-menu-item index="3">模板使用费</el-menu-item>
            <el-menu-item index="4">生码相关费用</el-menu-item>
            <el-menu-item index="5">组织权益费用</el-menu-item>
          </el-menu>
          <el-button v-if="currentLevelId && currentPriceConfig === 1" type="text"
                     style="position: absolute;right: 5px;top: 30px;transform: translateY(-50%);"
                     @click="addPlatformUsageFee">新增平台使用费</el-button>
          <el-table empty-text="暂无数据，请选择平台用户等级和费用类型" :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}" :cell-style="setTableCellStyle">
            <el-table-column v-if="currentLevelId && currentPriceConfig === 1" align="center" prop=""  label="类别等级">
              <template slot-scope="scope">
                {{ currentCategory }}
              </template>
            </el-table-column>
            <el-table-column v-if="currentLevelId && currentPriceConfig !== 1" align="center" prop="privilegeName" :label="getPrivilegeName(currentPriceConfig)">
              <template slot-scope="scope">
                {{ scope.row.privilegeName }}
              </template>
            </el-table-column>
            <el-table-column v-if="currentLevelId && currentPriceConfig === 1" align="center" prop="qty"  label="权益时长">
              <template slot-scope="scope">
                {{ formatShowQtyText(scope.row.qty, scope.row.unitName) }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="price"  label="当前价格">
              <template slot-scope="scope">
                {{ formatShowPriceText(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="status" label="当前状态">
              <template slot-scope="scope">{{ formatShowStatusText(scope.row.status) }}</template>
            </el-table-column>
            <el-table-column align="center" label="设置">
              <template slot-scope="scope">
                <el-button size="medium" type="text" @click="updatePriceConfig(scope.row.userLvPrivilegePriceId, scope.row.privilegeId, scope.row.privilegeName)">配置</el-button>
                <el-button size="medium" type="text" @click="updatePriceConfigStatus(scope.row.userLvPrivilegePriceId, scope.row.status)">{{ formatSetStatusText(scope.row.status) }}</el-button>
                <el-button v-if="currentPriceConfig === 1 && scope.row.userLvPrivilegePriceId" size="medium" type="text" @click="deletePriceConfig(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination
            class="pagination" background :current-page="currentPageNumber" layout="prev, pager, next, total, sizes, jumper" :total="currentTotal" :page-size="currentPageSize" :page-sizes="[5, 10, 20, 50, 100]"
            @current-change="pageNumberChange" @prev-clicke="pageNumberChange" @next-click="pageNumberChange" @size-change="pageSizeChange"></el-pagination>
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
        currentCategory: null,
        currentLevel: null,
        currentLevelId: null,
        currentPriceConfig: null,
        currentPrivilegeId: null,
        customDisabled: false,
        defaultProps: {
          label: 'label',
          children: 'children',
          isLeaf: 'leaf'
        },
        tableData: [],
        currentPageNumber: 1,
        currentPageSize: 10,
        currentTotal: null,
        treeData: [{
          label: '平台用户等级',
          children: []
        }],
        levelData: null,
      }
    },
    watch: {
      currentLevelId(newVal, oldVal){
        this.$urlTool.setQueryStringArgs({currentLevelId: newVal})
      },
      currentPriceConfig(newVal, oldVal){
        this.$urlTool.setQueryStringArgs({currentPriceConfig: newVal})
      }
    },
    methods:{
      //格式化显示当前权益时长
      formatShowQtyText(qty, unit){
        return (qty && unit) ? qty + unit : '未配置'
      },
      // 格式化显示当前价格
      formatShowPriceText(row){
        let text = ''
        if(this.currentLevelId && this.currentPriceConfig === 1){
          text = row.price !== null ? ( parseFloat(row.price) === 0 ? '免费' : row.price + '元' ) : '未配置'
        }
        else{
          text = row.price !== null ? ( parseFloat(row.price) === 0 ? '免费' : `${row.price}元/${parseFloat(row.qty) > 1 ? row.qty : ''}${row.unitName}` ) : '未配置'
        }
        return text
      },
      // 格式化显示状态文本
      formatShowStatusText(status){
        let text = null
        switch(status){
          case 'Y': text = '启用'; break;
          case 'N': text = '禁用'; break;
          default: text = '未配置';
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
      // 获取当前勾选类别和对应类别的价格配置列表
      getCurrentPriceList(){
        this.currentLevelId = Number(this.$route.query.userLevelId || this.$route.query.currentLevelId || null)
        if(this.currentLevelId)
        {
          this.$refs['tree'].setCurrentKey(this.currentLevelId)
          let data = this.$refs['tree'].getCurrentNode()
          let node = this.$refs['tree'].getNode(data)
          this.getCurrentLevelId(data, node)
        }
        else
        {
          for(let i=0; i<this.treeData[0].children.length; i++){
            if(this.treeData[0].children[i].children.length>0){
              let data = this.treeData[0].children[i].children[0]
              let node = this.$refs['tree'].getNode(data)
              this.getCurrentLevelId(data, node)
              this.$refs['tree'].setCurrentKey(node.data.levelId)
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
            this.levelData = data
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
              vm.getCurrentPriceList()
              return yield Promise.resolve()
            }).then(function(val){
            }).catch(function(err){
              console.log(err)
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
      // 获取价格配置列表
      getPriceConfigList(){
        this.$service.post({
          url: this.$api.priceConfig.getPriceConfigList,
          params: {
            userLevelId: this.currentLevelId,
            smallClass: this.currentPriceConfig,
            pageNum: this.currentPageNumber,
            pageSize: this.currentPageSize,
          },
          successHook: (data) => {
            this.currentPrivilegeId = data.list[0].privilegeId
            this.tableData = data.list
            this.currentTotal = data.total
            this.currentPageNumber = data.pageNum
            this.currentPageSize = data.pageSize
          }
        })
      },
      // 获取当前等级（通过选择等级）
      getCurrentLevelId(data, node){
        if(data.levelId){
          this.currentLevelId = data.levelId
          this.currentLevel = data.label
          this.currentCategory = node.parent.data.label
          if(this.currentPriceConfig){
            this.getPriceConfigList()
          }
        }
      },
      // 获取当前价格配置
      getCurrentPriceConfig(index){
        this.currentPageNumber = 1
        this.currentPriceConfig = parseInt(index)
        if(this.currentLevelId){
          this.getPriceConfigList()
        }
      },
      // 新增平台使用费
      addPlatformUsageFee(){
        this.$router.push({name: 'PriceConfigAddPlatformUsageFee', params: {
          currentPrivilegeId: this.currentPrivilegeId,
          currentLevelId: this.currentLevelId,
          currentCategory: this.currentCategory,
          currentLevel: this.currentLevel,
        }})
      },
      // 新增/更新价格配置
      updatePriceConfig(id, privilegeId, privilegeName){
        let URLName
        let params = {
          currentLevelId: this.currentLevelId,
          currentCategory: this.currentCategory,
          currentLevel: this.currentLevel,
          currentPrivilegeName: privilegeName,
          currentPrivilegeId: privilegeId
        }
        if(id){
          // 新增
          switch(this.currentPriceConfig){
            case 1: URLName = 'PriceConfigUpdatePlatformUsageFee'; break;
            case 2: URLName = 'PriceConfigUpdateFunctionUsageFee'; break;
            case 3: URLName = 'PriceConfigUpdateTemplateUsageFee'; break;
            case 4: URLName = 'PriceConfigUpdateCodeUsageFee'; break;
            case 5: URLName = 'PriceConfigUpdateOrganizationUsageFee'; break;
          }
          params['currentId'] = id
        }
        else{
          // 更新
          switch(this.currentPriceConfig){
            case 1: URLName = 'PriceConfigAddPlatformUsageFee'; break;
            case 2: URLName = 'PriceConfigAddFunctionUsageFee'; break;
            case 3: URLName = 'PriceConfigAddTemplateUsageFee'; break;
            case 4: URLName = 'PriceConfigAddCodeUsageFee'; break;
            case 5: URLName = 'PriceConfigAddOrganizationUsageFee'; break;
          }
        }
        this.$router.push({name: URLName, params})
      },
      // 更新价格配置状态
      updatePriceConfigStatus(id, status){
        let statusText = this.formatSetStatusText(status)
        let url = status === 'Y' ? 'disablePriceConfig' : 'enablePriceConfig'
        this.$service.postWithConfirm({
          confirmText: '此操作将' + statusText + '该价格配置, 是否继续？',
          url: this.$api.priceConfig[url],
          params: { id: id },
          successHook: () => {
            // 刷新列表
            this.getPriceConfigList()
          },
          successMessage: '已成功' + statusText + '该价格权益',
        })
      },
      // 删除价格配置
      deletePriceConfig(row){
        this.$service.postWithConfirm({
          confirmText: '此操作将删除该价格配置, 是否继续？',
          url: this.$api.priceConfig.deletePriceConfig,
          params: { id: row.userLvPrivilegePriceId },
          successHook: () => {
            // 刷新列表
            this.getPriceConfigList()
          },
          successMessage: '已成功删除该价格权益',
        })
      },
      // 获取等级名称
      getLevelName(levelId){
        for(let i=0;i<this.levelData.length;i++){
          if(parseInt(this.levelData[i].dictValue) === levelId){
            return this.levelData[i].dictName
          }
        }
      },
      // 获取权益名称
      getPrivilegeName(id){
        let name
        switch(id){
          case 3: name = '模板名称'; break;
          case 4: name = '最大生码数量提升'; break;
          case 2:
          case 5: name = '功能名称'; break;
        }
        return name
      },
      // 平台用户等级列表的列样式设置
      setTableCellStyle({row, column, rowIndex, columnIndex}) {
        if(column.property === 'privilegeName' && this.currentPriceConfig === 4) {
          return {color: '#F56C6C'}
        }
      },
      // 当前页码改变刷新列表
      pageNumberChange(pageNumber){
        this.currentPageNumber = pageNumber
        this.getPriceConfigList()
      },
      // 当前每页数量改变刷新列表
      pageSizeChange(pageSize){
        this.currentPageNumber = 1
        this.currentPageSize = pageSize
        this.getPriceConfigList()
      },
    },
    created(){
      this.currentLevelId = this.$route.query.currentLevelId || null
      this.currentPriceConfig = Number(this.$route.query.currentPriceConfig || 1)
      this.getCategoryList()
    },
  }
</script>
<style type="text/css" scoped></style>

