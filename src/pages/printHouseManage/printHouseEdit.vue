<template>
  <div class="printHouseEdit">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限后台</el-breadcrumb-item>
        <el-breadcrumb-item> 添加印刷厂</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="c-title"> 编辑印刷厂信息</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="印刷厂名称：" prop="name">
          <el-input v-model="ruleForm.name" class="input-txt" size="small" placeholder="请输入印刷厂名称"></el-input>
        </el-form-item>
        <el-form-item label="印刷厂简称：" prop="name">
          <el-input v-model="ruleForm.name" class="input-txt" size="small" placeholder="请输入印刷厂简称"></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="name">
          <el-input v-model="ruleForm.name" class="input-txt" size="small" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="name">
          <el-input v-model="ruleForm.name" class="input-txt" size="small" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="所在地：" prop="region">
          <el-select v-model="ruleForm.region" class="input-sel" size="small" placeholder="选择省">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
          <el-select v-model="ruleForm.region" class="input-sel" size="small" placeholder="选择市">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
          <el-select v-model="ruleForm.region" class="input-sel" size="small" placeholder="选择区">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址：" prop="name">
          <el-input v-model="ruleForm.name" class="input-des" size="small" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input type="textarea" size="small" class="input-des"
                    rows="5" v-model="ruleForm.desc" placeholder="备注"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button @click="cancel()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "printHouseEdit",
    data() {
      return {
        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          region: [
            {required: true, message: '请选择活动区域', trigger: 'change'}
          ],
          date1: [
            {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
          ],
          date2: [
            {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
          ],
          type: [
            {type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change'}
          ],
          resource: [
            {required: true, message: '请选择活动资源', trigger: 'change'}
          ],
          desc: [
            {required: true, message: '请填写活动形式', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      /**
       * 保存
       * */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      /**
       * 取消
       */
      cancel() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .printHouseEdit {
    .content {
      padding: 0px 10px 10px 10px;
      .c-title {
        width: 450px;
        color: #ffffff;
        background: #409EFF;
        height: 36px;
        line-height: 36px;
        text-align: center;
        margin-bottom: 15px;
        position: relative;
      }
      .c-title::after {
        content: '';
        position: absolute;
        right: -26px;
        width: 0;
        height: 0;
        border-top: 18px solid transparent;
        border-left: 26px solid #409EFF;
        border-bottom: 18px solid transparent;
      }
      .input-txt {
        width: 260px;
      }
      .input-sel {
        width: 200px;
        display: inline-block;
      }
      .input-des {
        width: 400px;
      }
    }
  }
</style>
