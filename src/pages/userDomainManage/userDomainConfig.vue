<template>
  <div class="domain-config">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>用户域名管理</el-breadcrumb-item>
        <el-breadcrumb-item>平台用户域名管理</el-breadcrumb-item>
        <el-breadcrumb-item>配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="domain-config__content">
        <el-form  :model="ruleForm" ref="ruleForm"  label-width="120px" class="demo-dynamic">
           <div class="item">
               <h2>生码域名设置</h2>
                <el-form-item class="mar-left">
                    <el-radio-group v-model="ruleForm.is1">
                        <el-radio :label="1">使用系统域名</el-radio>
                        <el-radio :label="2">第三方域名</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="二维码域名:" prop="name1">
                   <span style="margin-right:30px;">{{1?1:'未设置'}}</span>
                   <el-button type="text" @click="editDomain('code')" v-if="ruleForm.is1 == 2">编辑</el-button>
                </el-form-item>
           </div>
           <div class="item">
               <h2>活动推广域名</h2>
                <el-form-item class="mar-left">
                    <el-radio-group v-model="ruleForm.is2">
                        <el-radio :label="1">使用系统域名</el-radio>
                        <el-radio :label="2">第三方域名</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="活动推广域名:" prop="name2">
                    <span style="margin-right:30px;">{{0?1:'未设置'}}</span>
                   <el-button type="text" @click="editDomain('active')"  v-if="ruleForm.is2 == 2">编辑</el-button>
                </el-form-item>
           </div>
           <div class="item">
               <h2>商品分享域名</h2>
                <el-form-item class="mar-left">
                    <el-radio-group v-model="ruleForm.is3">
                        <el-radio :label="1">使用系统域名</el-radio>
                        <el-radio :label="2">第三方域名</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="商品分享域名:" prop="name3">
                    <span style="margin-right:30px;">{{1?1:'未设置'}}</span>
                   <el-button type="text" @click="editDomain('product')"  v-if="ruleForm.is3 == 2">编辑</el-button>
                </el-form-item>
           </div>
           <div class="save-btn">
                <el-button type="primary" size="medium" @click.stop.prevent="save">提交保存</el-button>
           </div>
        </el-form>
    </div>
    <el-dialog
        title="域名编辑"
        :visible.sync="dialogVisible"
        width="30%"
        center>
        <div>
            <el-form :model="domainForm" :rules="domainRules" ref="domainForm" label-width="100px" class="demo-dynamic">
                <el-form-item label="域名：" prop="domain">
                    <el-input v-model="domainForm.domain" style="width:400px;" placeholder="请输入域名" maxlength="300"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveDialog('domainForm')">保 存</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        type:'',
        dialogVisible:false,
        ruleForm:{
            is1:1,
            name1:'',
            is2:2,
            name2:'',
            is3:2,
            name3:'',
        },
        domainForm: {
          domain: '',
        },
        domainRules: {
          domain: [
            {required: true, message: '请输入域名', trigger: 'blur'},
          ]
        },
      }
    },
    mounted(){
     
    },
    methods:{
      // 编辑域名
      editDomain(type){
          this.type = type;
          this.dialogVisible = true;
      },
      // 保存
      saveDialog(formName){
        this.$refs[formName].validate((valid) => {
            if (valid) {

            }
        })
      },
      // 提交保存
      save(){
          
      }
    },
  }
</script>
<style lang="">
   .domain-config .mar-left .el-form-item__content{
        margin: 20px 0 0 35px !important;
    }
</style>
<style lang="scss" scoped>
.domain-config{
    background:#f2f2f2;
    &__content{
        padding:10px;
       .item{
           padding:20px;
           margin-bottom:10px;
           background:#fff;
       }
       .save-btn{
            text-align: center;
            padding: 2px 0;
            background: yellow;
       }
    }
}
</style>

