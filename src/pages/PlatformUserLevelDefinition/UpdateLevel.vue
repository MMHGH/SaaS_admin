<template>
  <div>
    <div class="header">
      <span>修改等级信息</span>
    </div>
    <div class="main">
      <el-form ref="form" :model="form" label-position="right" label-width="200px" label-suffix="：" :rules="rules" :disabled="formDisabled">
        <el-form-item label="角色类别" prop="categoryId">
          <el-radio-group v-model="form.categoryId">
            <el-radio v-for="category in this.categoryData" :key="category.categoryId" :label="category.categoryId">{{category.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="输入类别名称" prop="level">
          <el-col :span="5">
            <el-input placeholder="请输入内容" v-model="form.level" size="small" :clearable="true" :maxlength="35"></el-input>
          </el-col>
          <el-col :span="14">
            <!--<i style="color: #f56c6c;padding-left: 10px;">*</i>-->
            <span style="color: #C0C4CC;padding-left: 10px;">类别名称不能超过35个汉字</span>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit" type="primary" size="medium" @click.stop.prevent="updateLevel">修改</el-button>
          <el-button size="medium" @click="back">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        categoryData: null,
        form: {
          categoryId: '',
          level: '',
        },
        rules: {
          level: [{ required: true, message: '请输入等级名称', trigger: 'blur' }]
        },
        formDisabled: false,
      }
    },
    methods: {
      // 返回上一层
      back: function(){
        this.$router.go(-1)
      },
      // 获取单个平台用户等级
      getLevel(){
        this.$service.post({
          url: this.$api.platformUserLevelDefinition.getLevel,
          params: {id: this.$route.params.id},
          successHook: (data) => {
            // this.form.categoryId = data.userTypeId
            this.form.level = data.name
          }
        })
      },
      // 修改等级信息
        // messasge => message
      updateLevel: function(){
        this.$refs['form'].validate((valid, object)=>{
          // 校验成功
          if(valid){
            this.$service.postWithConfirm({
              confirmText: '此操作将修改等级, 是否继续？',
              url: this.$api.platformUserLevelDefinition.updateLevel,
              params: {
                id: this.$route.params.id,
                userTypeId: this.form.categoryId,
                name: this.form.level
              },
              successHook: () => { this.formDisabled = true },
              errorHook: () => { this.formDisabled = true },
              successMessage: '已成功修改等级',
              successCloseHook: this.back,
              errorCloseHook: this.back
            })
          }
        })
      }
    },
    created(){
      this.categoryData = this.$route.params.categoryData
      this.$set(this.form,'categoryId', this.$route.params.categoryId)
      this.getLevel()
    }
  }
</script>
<style scoped>
  .header{background: #f2f2f2;}
  .el-row{padding-top: 10px;padding-bottom: 10px;}
  .el-col:first-child{text-align: right;}
  .el-row+.el-row .el-col{line-height: 32px;}
  .el-row+.el-row .el-col:nth-child(3){}
  .el-row+.el-row .el-col:nth-child(3) i{}
  .el-row+.el-row+.el-row .el-col{text-align: center;}
</style>
