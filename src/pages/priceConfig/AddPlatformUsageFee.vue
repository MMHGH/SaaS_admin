<template>
  <div class="add-price-config-wrapper">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限后台</el-breadcrumb-item>
        <el-breadcrumb-item>价格配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <el-form ref="form" :model="form" :rules="formRules" size="small" label-position="right" label-width="200px" label-suffix="：" :disabled="formDisabled">
        <el-form-item label="用户角色">{{ currentCategory }}</el-form-item>
        <el-form-item label="用户等级">{{ currentLevel }}</el-form-item>
        <el-form-item label="定价" prop="isFree">
          <el-radio-group v-model="form.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">付费</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时间" prop="qty">
          <el-col :span="12">
            <el-input :maxlength="9" v-model="form.qty"></el-input>
          </el-col>
          <el-col :offset="2" :span="10">
            <el-select v-model="form.unit" placeholder="请选择">
              <el-option label="天" value="D"></el-option>
              <el-option label="月" value="M"></el-option>
              <el-option label="年" value="Y"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item ref="formPrice" label="价格" prop="price">
          <el-col :span="12">
            <el-input v-model="form.price" :disabled="form.isFree"></el-input>
          </el-col>
          <el-col :offset="2" :span="10">元</el-col>
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit" type="primary" size="medium" @click.stop.prevent="addPlatformUsageFee">保存</el-button>
          <el-button size="medium" @click="back">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      let validateQty = (rule, value, callback) => {
        this.$validator.notEmpty(callback, value, '请输入时间')
        this.$validator.onlyNum(callback, value, '请输入有效数字')
        this.$validator.limitNum(callback, value, 0, 999999999)
        callback()
      }
      let validatePrice = (rule, value, callback) => {
        this.$validator.notEmpty(callback, value, '请输入价格')
        if(!(/^\d{1,6}(\.\d{1,5})?$/.test(value))){
          return(callback(new Error('请输入有效数值')))
        }
        if(parseFloat(value) === 0){
          this.form.isFree = true
        }
        callback()
      }
      return {
        currentPrivilegeId: null,
        currentLevelId: null,
        currentCategory: null,
        currentLevel: null,
        form: {
          isFree: false,
          qty: '',
          unit: 'D',
          price: ''
        },
        formRules: {
          qty: [
            { validator: validateQty, trigger: 'blur' }
          ],
          price: [
            { validator: validatePrice, trigger: 'blur' }
          ]
        },
        formDisabled: false
      }
    },
    computed:{
      isFree(){
        return this.form.isFree
      }
    },
    watch: {
      isFree(newValue, oldValue){
        if(newValue){
          this.form.price = 0
          this.$refs.formPrice.clearValidate()
        }
      },
    },
    methods: {
      back: function(){
        this.$router.go(-1)
      },
      // 新增平台使用费
      addPlatformUsageFee: function(){
        this.$refs['form'].validate((valid) => {
          if(valid){
            this.$service.postWithConfirm({
              confirmText: '此操作将新增平台使用费, 是否继续？',
              url: this.$api.priceConfig.addPriceConfig,
              params: {
                userLevelId: this.currentLevelId,
                privilegeId: this.currentPrivilegeId,
                qty: this.form.qty,
                unit: this.form.unit,
                price: this.form.price,
              },
              successHook: (data) => {
                this.back()
              },
              successMessage: '已成功新增平台使用费'
            })
          }
        })
      }
    },
    created(){
      this.currentPrivilegeId = this.$route.params.currentPrivilegeId
      this.currentLevelId = this.$route.params.currentLevelId
      this.currentCategory = this.$route.params.currentCategory
      this.currentLevel = this.$route.params.currentLevel
    }
  }
</script>
<style>
  .add-price-config-wrapper .el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label{width: 215px;}
</style>
<style scoped>
</style>
