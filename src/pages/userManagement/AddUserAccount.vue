<template>
  <div class="add-user-account-wrapper">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限后台</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>新建账户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <el-form ref="form" :model="form" :rules="formRules" size="small" label-position="right" label-width="200px" label-suffix="：" :disabled="formDisabled">
        <el-form-item label="用户类型" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择" filterable @focus="categorySelect" @change="categorySelectChange">
            <el-option v-for="item in categoryList" :label="item.dictName" :value="parseInt(item.dictValue)" :key="parseInt(item.dictValue)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户级别" prop="levelId">
          <el-select v-model="form.levelId" placeholder="请选择" filterable :filter-method="function(){return}" no-data-text="暂无数据，请选择用户类型" @focus="levelSelect">
            <el-option v-for="item in levelList" :key="item.id" :label="item.sysUserLevelName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="企业名称" prop="organName" v-if="confirmCategory">-->
        <el-form-item label="企业名称" prop="organName">
          <el-input placeholder="输入企业名称" maxlength="300" v-model="form.organName"></el-input>
        </el-form-item>
        <el-form-item label="用户账号" prop="account">
          <el-input placeholder="输入手机号码" maxlength="11" v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input type="password" placeholder="请输入密码" auto-complete="new-password" v-model="form.pwd"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="repeatedPwd">
          <el-input type="password" placeholder="请输入密码" auto-complete="new-password" v-model="form.repeatedPwd"></el-input>
        </el-form-item>
        <el-form-item label="是否限制IP地址" prop="isIpLimit">
          <el-radio-group v-model="form.isIpLimit">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="配置IP地址" prop="ipLimit" v-if="form.isIpLimit">
          <el-input placeholder="请输入IP地址" v-model="form.ipLimit"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit" type="primary" size="medium" @click.stop.prevent="addUserAccount">新增</el-button>
          <el-button size="medium" @click="back">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      let validateCategory = (rule, value, callback) => {
        if(!value){
          callback(new Error('请选择用户类型'))
        }
        callback()
      }
      let validateLevel = (rule, value, callback) => {
        if(!value){
          callback(new Error('请选择用户级别'))
        }
        callback()
      }
      let validateOrganName = (rule, value, callback) => {
        if(!this.confirmCategory) callback()
        if(!value){
          callback(new Error('请输入企业名称'))
        }
        callback()
      }
      let validateRepeatedPassword = (rule, value, callback) => {
        this.$refs.form.validateField('pwd')
        if(!value){
          callback(new Error('请输入密码'))
        }
        if(value.length <8 || value.length > 25){
          callback(new Error('密码为8-25位'))
        }
        if(value !== this.form.pwd){
          callback(new Error('两次密码输入不一致'))
        }
        callback()
      }
      let validateIpLimit = (rule, value, callback) => {
        if(!value && this.form.isIpLimit){
          callback(new Error('请输入IP地址'))
        }
        callback()
      }
      return {
        categoryList: [],
        levelList: [],
        form: {
          categoryId: null,
          levelId: null,
          organName: '',
          account: null,
          pwd: '',
          repeatedPwd: '',
          isIpLimit: false,
          ipLimit: null
        },
        formRules: {
          categoryId: [
            { validator: validateCategory, trigger: 'blur' }
          ],
          levelId: [
            { validator: validateLevel, trigger: 'blur' }
          ],
          organName: [
            { validator: validateOrganName, trigger: 'blur' }
          ],
          account: [
            { validator: this.$validator.telephone, trigger: 'blur' }
          ],
          pwd: [
            { validator: this.$validator.password, trigger: 'blur' }
          ],
          repeatedPwd: [
            { validator: validateRepeatedPassword, trigger: 'blur' }
          ],
          ipLimit: [
            { validator: validateIpLimit, trigger: 'blur' }
          ]
        },
        formDisabled: false
      }
    },
    computed: {
      // 确定是否个人用户，决定是否需要用户名称
      confirmCategory: function(){
        let name = ''
        for(let i=0; i<this.categoryList.length; i++){
          if(this.form.categoryId === parseInt(this.categoryList[i].dictValue)){
            name = this.categoryList[i].dictName
            break
          }
        }
        if(name === '个人用户'){
          return false
        }else{
          return true
        }
      }
    },
    methods: {
      // 返回
      back: function(){
        this.$router.go(-1)
      },
      // 获取平台用户类别列表
      getCategoryList(){
        this.$service.post({
          url: this.$api.getCategoryList,
          successHook: (data) => {
            this.categoryList = data
          }
        })
      },
      // 获取平台用户等级列表（通过平台用户类别ID）
      getLevelListByCategoryId(id){
        this.$service.post({
          url: this.$api.platformUserLevelDefinition.getLevelList,
          params: { userTypeId: id },
          successHook: (data) => {
            this.levelList = data
          }
        })
      },
      // 选择平台用户类别
      categorySelect(){
        this.getCategoryList()
      },
      categorySelectChange(value){
        this.form.levelId = null
      },
      // 选择平台用户等级
      levelSelect(){
        this.form.categoryId && this.getLevelListByCategoryId(this.form.categoryId)
      },
      // 新增用户
      addUserAccount: function(){
        this.$refs['form'].validate((valid, object)=>{
          // 校验成功
          if(valid){
            this.$service.postWithConfirm({
              confirmText: '此操作将新建账户, 是否继续？',
              url: this.$api.userManagement.addUser,
              params: {
                account: this.form.account,
                isIpLimit: this.form.isIpLimit,
                userLevelId: this.form.levelId,
                organName: this.form.organName,
                pwd: this.form.pwd,
                ipLimit: this.form.ipLimit,
              },
              successHook: () => { this.formDisabled = true },
              successMessage: '已成功添加类别',
              successCloseHook: () => {
                // this.$router.push({
                //   name: 'UserManagement',
                //   query:{
                //     userLevelId: this.form.levelId,
                //   }
                // })
                this.back()
              },
              errorCloseHook: () => {},
            })
          }
        })
      },

    },
    created(){
      this.form.categoryId = parseInt(this.$route.params.currentCategoryId || this.$route.query.currentCategoryId) || null
      this.form.levelId = parseInt(this.$route.params.currentLevelId || this.$route.query.currentLevelId) || null
      this.categorySelect()
      this.levelSelect()
    }
  }
</script>
<style>
  .add-user-account-wrapper .el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label{width: 215px;}
</style>
<style scoped>
</style>
