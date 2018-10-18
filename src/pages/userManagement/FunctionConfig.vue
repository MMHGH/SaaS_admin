<template>
  <div class="function-config-wrapper">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限后台</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>功能配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main" v-show="isShow">
      <el-tree
        ref="tree"
        show-checkbox :expand-on-click-node="true"
        :check-on-click-node="false" default-expand-all
        :data="options" node-key="id" :props="defaultProps"
        v-format-tree-node
      >
      </el-tree>
      <el-row>
        <el-col :span="12" style="margin-top: 20px;text-align: center">
          <el-button type="primary" size="medium" @click="updateFunctionConfig" :disabled="buttonDisabled">修改</el-button>
          <el-button size="medium" @click="back" :disabled="buttonDisabled">取消</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import formatTreeNode from '@/directive/format-tree-node'
  export default {
    data() {
      return {
        currentLevelId: null,
        currentUserId: null,

        options: [
          {
            label: '全选',
            children: []
          }
        ],
        levelCheckedOptions: [],
        userCheckedOptions:[],
        checkedOptions: [],
        disabledOptions:[],
        defaultProps: {
          children: 'children',
          label: 'label',
          disabled: 'disabled'
        },
        buttonDisabled: false,
        isShow: false,
      }
    },
    methods: {
      // 转化复选框数据
      transformOptions(data){
        let sourceChildren = []
        function getData(children, id){
          for(let i = 0; i < children.length; i++){
            if(children[i]['id'] === id){
              return children[i]
            }
          }
          for(let j = 0; j < children.length; j++){
            let data = getData(children[j]['children'], id)
            if(data){
              return data
            }
          }
        }
        let sortData = data.concat().sort((x, y) => {
          return parseInt(x['pid']) - parseInt(y['pid'])
        })
        sortData.forEach(item => {
          if(parseInt(item['pid']) === 0){
            sourceChildren.push({
              'id': item['id'],
              'pid': item['pid'],
              'label': item['name'],
              'disabled': false,
              'children': []
            })
          }
          else{
            let childrenTarget = getData(sourceChildren, parseInt(item['pid']))
            if(childrenTarget && childrenTarget.children){
              childrenTarget.children.push({
                'id': item['id'],
                'pid': item['pid'],
                'label': item['name'],
                'disabled': false,
                'children': []
              })
            }
          }
        })
        return sourceChildren
      },
      // 转化已选/不可配置复选框数据
      transformOptionsByData(data){
        return Array.prototype.slice.call(data).map(item => {
          return item.permitId
        })
      },
      // 设置不可配置复选框
      setDisabledOptions(data){
        data.forEach(item => {
          this.$refs.tree.getNode(item).data.disabled = true
        })
      },
      // 获取已选功能配置项列表（等级）
      getLevelFunctionConfigList(){
        this.$service.post({
          url: this.$api.platformUserLevelDefinition.getFunctionConfig,
          params: { userLevelId: this.currentLevelId },
          successHook: (data) => {
            this.disabledOptions = this.levelCheckedOptions = this.transformOptionsByData(data)
            // 渲染已选配置项
            this.levelCheckedOptions.forEach(item => { this.$refs.tree.setChecked(item, true) })
            // 渲染不可配置项
            this.setDisabledOptions(this.disabledOptions)
            // 显示配置项
            this.isShow = true
          }
        })
      },
      // 获取已选功能配置项列表（用户）
      getUserFunctionConfigList(){
        this.$service.post({
          url: this.$api.userManagement.getFunctionConfig,
          params: { userId: this.currentUserId },
          successHook: (data) => {
            this.userCheckedOptions = this.transformOptionsByData(data)
            // 渲染已选配置项
            this.userCheckedOptions.forEach(item => { this.$refs.tree.setChecked(item, true) })
            // 渲染不可配置项
            this.setDisabledOptions(this.disabledOptions)
            // 显示配置项
            this.$nextTick(() => {
              this.isShow = true
            })
          }
        })
      },
      // 获取功能配置项列表
      getFunctionConfigList(){
        this.$service.post({
          url: this.$api.getFunctionConfigList,
          successHook: (data) => {
            this.options[0].children = this.transformOptions(data)
            // DOM更新完成
            this.$nextTick(()=>{
              // 获取已选功能配置项（用户）
              this.getUserFunctionConfigList()
              // 获取已选功能配置项（等级）
              this.getLevelFunctionConfigList()
            })
          }
        })
      },
      // 修改配置项（用户）
      updateFunctionConfig(){
        // 新增勾选状态
        let checkedOptions = this.$refs.tree.getCheckedKeys()
        // 新增半选状态项
        for(let val of new Set(this.$refs.tree.getHalfCheckedKeys())){
          val ? checkedOptions.unshift(val) : '';
        }
        // 筛选过滤
        checkedOptions = checkedOptions.filter(item => { return item && this.levelCheckedOptions.indexOf(item) === -1 })
        checkedOptions = checkedOptions.join(',')


        this.$service.postWithConfirm({
          confirmText: '此操作将修改用户的功能配置, 是否继续？',
          url: this.$api.userManagement.updateFunctionConfig,
          params: {
            userId: this.currentUserId,
            permitIds: checkedOptions
          },
          successHook: () => {
            // 禁用按钮
            this.buttonDisabled = true
          },
          successMessage: '已成功修改用户功能配置',
          successCloseHook: this.back,
          errorCloseHook: this.back
        })
      },
      // 返回上一层
      back: function(){
        this.$router.go(-1)
      }

      // // 根据父元素的ID获取子元素
      // getTreeChildNodesById(data, id){
      //   let arr = []
      //   arr = data.filter(item => {
      //     return parseInt(item['pid']) === parseInt(id)
      //   })
      //   arr.forEach(item => {
      //     arr = arr.concat(this.getTreeChildNodesById(data, item['id']))
      //   })
      //   return arr
      // },
      // getTreeChildNodesId(data){
      //   return data.map(item => {
      //     return item['id']
      //   })
      // },
    },
    directives: {
      'format-tree-node': formatTreeNode['format-tree-node']
    },
    created(){
      this.currentUserId = this.$route.params.userId
      this.currentLevelId = this.$route.params.levelId
      this.getFunctionConfigList()
    }
  }
</script>
<style>
  .function-config-wrapper .el-tree-node.is-current{background: transparent;}
  .function-config-wrapper .el-tree-node:focus>.el-tree-node__content{background: transparent;}
  .function-config-wrapper .el-tree-node__content:hover{background: transparent;}
</style>
<style scoped>
  .el-checkbox-group .el-checkbox-group{padding-left: 24px;}
  .header{background: #f2f2f2;}
</style>
