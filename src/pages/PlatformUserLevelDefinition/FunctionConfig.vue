<template>
  <div class="function-config-wrapper">
    <div class="header">
      <span>功能配置</span>
    </div>
    <div class="main" v-show="isShow">
      <el-tree
        ref="tree" show-checkbox
        :expand-on-click-node="true"
        :check-on-click-node="false"
        default-expand-all
        :data="options"
        node-key="id"
        :props="defaultProps"
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
        options: [
          {
            label: '全选',
            children: []
          }
        ],
        defaultCheckedOptions:[],
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
      // 转化已选复选框数据
      transformCheckedOptions(data){
        return data.map(item => {
          return item.permitId
        })
      },
      // 转化不可配置复选框数据
      transformDisabledOptions(data){
        let arr = data.map(item => {
          return item.disabledId
        })
        return arr
      },
      // 设置不可配置复选框
      setDisabledOptions(data){
        data.forEach(item => {
          this.$refs.tree.getNode(item).data.disabled = true
        })
      },
      // 根据父元素的ID获取子元素
      getTreeChildNodesById(data, id){
        let arr = []
        arr = data.filter(item => {
          return parseInt(item['pid']) === parseInt(id)
        })
        arr.forEach(item => {
          arr = arr.concat(this.getTreeChildNodesById(data, item['id']))
        })
        return arr
      },
      getTreeChildNodesId(data){
        return data.map(item => {
          return item['id']
        })
      },
      // 获取已选配置项列表（等级）
      getFunctionConfigListByLevel(){
        this.$service.post({
          url: this.$api.platformUserLevelDefinition.getFunctionConfig,
          params: { userLevelId: this.$route.params.id },
          successHook: (data) => {
            this.defaultCheckedOptions = this.transformCheckedOptions(data)
            // 渲染已启动配置项
            for(let val of new Set(this.defaultCheckedOptions)){
              this.$refs.tree.setChecked(val, true)
            }
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
              this.getFunctionConfigListByLevel()
            })
          }
        })
      },
      // 修改类别配置项
      updateFunctionConfig(){
        let checkedOptions = this.$refs.tree.getCheckedKeys()
        // 新增半选状态项
        for(let val of new Set(this.$refs.tree.getHalfCheckedKeys())){
          val ? checkedOptions.unshift(val) : '';
        }
        checkedOptions = checkedOptions.filter(item => {return item})
        checkedOptions = checkedOptions.join(',')
        this.$service.postWithConfirm({
          confirmText: '此操作将修改类别的功能配置, 是否继续？',
          url: this.$api.platformUserLevelDefinition.updateFunctionConfig,
          params: {
            userLevelId: this.$route.params.id,
            permitIds: checkedOptions,
          },
          successHook: () => {
            // 禁用按钮
            this.buttonDisabled = true
          },
          successMessage: '已成功修改类别功能配置',
          successCloseHook: this.back,
          errorCloseHook: this.back
        })
      },
      // 返回上一层
      back: function(){
        this.$router.go(-1)
      }
    },
    directives: {
      'format-tree-node': formatTreeNode['format-tree-node']
    },
    created(){
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
