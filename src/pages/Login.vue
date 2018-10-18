<template>
  <div class="login-wrapper">
    <section class="header">
      <el-row>
        <el-col>
          <!-- LOGO -->
          <figure class="logo">
            <img src="../assets/images/logo.png"/>
          </figure>
        </el-col>
      </el-row>
    </section>
    <section class="main">
      <header>登录</header>
      <el-form ref="loginForm" :model="loginForm" :rules="loginFormRules" label-width="100px">
        <el-form-item prop="username" label="用户账号">
          <el-input placeholder="请输入账号" maxlength="11" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="登录密码">
          <el-input type="password" placeholder="请输入密码" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item prop="verificationCode" label="验证码">
          <el-col :span="12">
            <el-input maxlength="4" placeholder="请输入验证码" v-model="loginForm.verificationCode"></el-input>
          </el-col>
          <el-col :span="12">
            <img ref="verificationCodeImg" style="width: 90%;" :src="verificationCodeUrl" @click="getVerificationCodeUrl($event)"/>
          </el-col>
        </el-form-item>
        <!--<el-form-item prop="autoLogin" label-width="0px" style="border: none;margin-bottom: 0;">-->
          <!--<el-checkbox v-model="loginForm.autoLogin">三天自动登录</el-checkbox>-->
        <!--</el-form-item>-->
        <el-form-item label-width="0px" style="border: none;">
          <el-button native-type="submit" type="primary" style="width: 100%;" @click.stop.prevent="login">登录</el-button>
          <!--<el-col :span="12">-->
          <!--<el-button type="text">忘记密码</el-button>-->
          <!--</el-col>-->
          <!--<el-col :span="12" style="text-align: right;">-->
          <!--<el-button type="text">免费注册</el-button>-->
          <!--</el-col>-->
        </el-form-item>
      </el-form>
      <!--<footer>Copyright © 2015 深圳市太和物联信息技术有限公司 All Rights Reserved 粤ICP备08010402号</footer>-->
    </section>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        verificationCodeUrl: this.$api.getLoginVerification + '?random=' + new Date().getTime(),
        loginForm: {
          username: '',
          password: '',
          verificationCode: '',
          autoLogin: false
        },
        loginFormRules: {
          username: [
//            { validator: this.$validator.telephone, trigger: 'blur' }
          ],
          password: [
//            { validator: this.$validator.password, trigger: 'blur' }
          ],
          verificationCode: [
            { validator: this.$validator.verificationCode, trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      // 刷新验证码
      getVerificationCodeUrl($event){
        $event.target.setAttribute('src', '')
        $event.target.setAttribute('src', window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '') + this.$api.getLoginVerification + '?random=' + new Date().getTime())
      },
      getVerificationCodeUrlAuto(){
        this.$refs['verificationCodeImg'].click()
      },
      login(){
        this.$refs['loginForm'].validate((valid, object)=>{
          if(valid){
            this.$service.post({
              url: this.$api.loginEntrance,
              params: {
                account: this.loginForm.username,
                pwd: this.loginForm.password,
                verifyCode: this.loginForm.verificationCode,
                autoLogin: this.loginForm.autoLogin
              },
              successHook: (data) => {
                let redirect = decodeURIComponent(this.$route.query.redirect || '/userLevelDefinition')
                this.$router.push({
                  path: redirect,
                  query: {
                    name: data.name
                  }
                })
                sessionStorage.setItem('username', data.name)
                sessionStorage.setItem('defaultMenuActive', this.$route.query.redirect ? sessionStorage.getItem('defaultMenuActive') : '/userLevelDefinition')
              },
              errorHook: (data, response) => {
                this.getVerificationCodeUrlAuto()
              }
            })
          }
        })
      }
    }
  }
</script>
<style>
  .login-wrapper .el-input input.el-input__inner{border: none;}
  .login-wrapper .el-input-group__append, .el-input-group__prepend{background-color: transparent;border: none;}
  .login-wrapper .el-form-item__label{font-size: 16px;font-weight: 700;text-align: left;}
  .login-wrapper .el-form-item__error{white-space: nowrap;top: 50%;left: 100%;margin-top: -9px;font-size: 14px;}
</style>
<style scoped>
  .login-wrapper{width: 50%;margin: 30px auto;}
  /*.login-wrapper>.header .logo img{height: 50px;}*/
  .login-wrapper .main{max-width: 650px;margin: 0 auto;}
  .login-wrapper .main header{text-align: right;padding-bottom: 10px;border-bottom: 1px solid #d7d7d7;font-size: 18px;color: #409EFF;}
  .login-wrapper .main footer{text-align: center;color: #d7d7d7;padding-top: 20px;border-top: 1px solid #d7d7d7;}
  .login-wrapper .el-form{margin: 40px auto;}
  .login-wrapper .el-form-item{margin-left: auto;margin-right: auto;min-width: 345px;width: 50%;border-bottom: 1px solid #d7d7d7;}
</style>
