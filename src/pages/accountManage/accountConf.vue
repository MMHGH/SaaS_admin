<template>
  <div class="wrapper">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item><span>账户中心</span></el-breadcrumb-item>
        <el-breadcrumb-item><span style="color: #409eff!important;">修改账户信息</span></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <h1 style="line-height: 36px;background: #f2f2f2;font-weight: 400;padding: 0 20px;">填写基本信息</h1>
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账号:" style="margin-bottom: 0px">
          <span v-text="ruleForm.name"></span>
          <el-button type="text" @click="logOut" style="margin-left: 20px;" title="注销登录">注销</el-button>
        </el-form-item>
        <el-form-item label="密码:"  style="margin-bottom: 0px">
          <el-button type="text" @click="openUpPwd" title="修改密码">修改密码</el-button>
        </el-form-item>
        <el-form-item label="邮箱:">
          <span style="margin-right:10px" v-if="email != 'null'">{{email}}</span>
          <el-button type="text" @click="newsEmail" title="修改邮箱">修改邮箱</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="550px">
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
        <el-form-item label="旧密码" prop="oldPWD">
          <el-input v-model="ruleForm2.oldPWD" type="password" oninput="this.value=this.value.replace(/\s+/g,'')"
                    style="width:240px" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm2.pass" oninput="this.value=this.value.replace(/\s+/g,'')"
                    auto-complete="off" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm2.checkPass" oninput="this.value=this.value.replace(/\s+/g,'')"
                    auto-complete="off" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
          <el-button @click="resetForm('ruleForm2')">重置</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    
    <el-dialog title="修改邮箱" :visible.sync="dialogEmail" width="550px">
      <el-form :model="ruleForm3" status-icon :rules="rules3" ref="ruleForm3" label-width="100px" class="demo-ruleForm">
        <el-form-item label="新的邮箱" prop="newEmail">
          <el-input v-model="ruleForm3.newEmail" type="email" maxlength="60"
                    style="width:240px" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEmail('ruleForm3')">提交</el-button>
          <el-button @click="dialogEmail = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {Message} from 'element-ui';

  export default {
    name: "accountConf",
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validateEmail = (rule, value, callback) => {
        this.$validator.limitEmail(callback, value)
        callback()
      };
      return {
        ruleForm: {
          name: ''
        },
        dialogFormVisible: false,
        dialogEmail:false,
        ruleForm2: {
          pass: '',
          checkPass: '',
          oldPWD: ''
        },
        email:'',
        ruleForm3: {
          newEmail: ''
        },
        rules3: {
          newEmail: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: validateEmail, trigger: 'blur'}
          ],
        },
        rules2: {
          pass: [
            {required: true, message: '请输入6-16位密码', min: 6, max: 16, trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'},
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          oldPWD: [
            // { validator: checkAge, trigger: 'blur' }
            {required: true, message: '请输入6-16位密码', min: 6, max: 16, trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      this.ruleForm.name = sessionStorage.getItem('username');
      this.email = sessionStorage.getItem('email');
    },
    methods: {
      // 修改密码
      openUpPwd() {
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.resetForm('ruleForm2');
        });
      },
      newsEmail(){
        this.ruleForm3.newEmail = '';
        this.dialogEmail = true;
      },
      // 修改邮箱
      submitEmail(formName){
         let vm = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let sendData = {
              email: vm.ruleForm3.newEmail,
            };
            this.axios.post(this.$api.updateUserEmail, sendData).then(function (respone) {
              let msg = respone.data.message
              if (msg === 'ok') {
                Message({
                  type: 'success',
                  message: '修改成功'
                });
                vm.email = respone.data.data;
                sessionStorage.setItem('email',respone.data.data)
                vm.dialogEmail = false;
              } else {
                Message({
                  type: 'error',
                  message: msg
                });
              }
              vm.$refs[formName].resetFields();
            })
          } else {
            return false;
          }
        });
      },
      // 注销
      logOut() {
        this.$confirm('确定注销用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          // 1.sendData
          let sendData = {};

          // 2.post
          let vm = this
          this.axios.post(this.$api.sloginOut, sendData).then(function (respone) {
            let msg = respone.data.message;
            if (msg == 'ok') {
              vm.$message({message: '已成功注销！'})
              setTimeout(function () {
                // 清除缓存
                sessionStorage.removeItem('username')
                setTimeout(() => {
                  vm.$router.push({path: '/login'});
                }, 500);
              }, 1000)
            }
          }).catch(function (error) {
            console.error(error);
          });
        }).catch((err) => {
        })
      },
      /**
       * 修改密码
       */
      submitForm(formName) {
        let vm = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 1.收集参数
            let sendData = {
              oldPwd: vm.ruleForm2.oldPWD,
              newPwd: vm.ruleForm2.pass
            };
            // console.log( sendData );
            // 2.发送请求
            this.axios.post(this.$api.updateUserPwd, sendData).then(function (respone) {
              let msg = respone.data.message
              if (msg === 'ok') {
                Message({
                  type: 'success',
                  message: '修改成功'
                });
                vm.dialogFormVisible = false;
                // 重新登录
                setTimeout(() => {
                  // 清除缓存
                  sessionStorage.removeItem('username')
                  vm.$router.push({path: '/login'});
                }, 500);
              } else {
                Message({
                  type: 'error',
                  message: msg
                });
              }
              vm.$refs[formName].resetFields();
            }).catch(function (error) {
              console.error(error)
            });

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      /**
       * 重置
       * @param formName
       */
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    }
  }
</script>

<style scoped>

</style>
