<template>
  <div class="home-main-wrapper myPrintingCompanyEdit">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>一物一码</el-breadcrumb-item>
        <el-breadcrumb-item><span class="title">我的印企</span></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="c-title"> {{type=='get'?'新增':'编辑'}}印刷厂信息</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
        <el-form-item label="印刷厂全称：" prop="name">
          <el-input v-model="ruleForm.name" class="input-txt" maxlength="300" size="small"
                    placeholder="请输入印刷厂全称"></el-input>
        </el-form-item>
        <el-form-item label="印刷厂简称：" prop="shortName">
          <el-input v-model="ruleForm.shortName" class="input-txt" maxlength="300" size="small"
                    placeholder="请输入印刷厂简称"></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="contacts">
          <el-input v-model="ruleForm.contacts" class="input-txt" maxlength="200" size="small"
                    placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="tel">
          <el-input v-model="ruleForm.tel" class="input-txt" maxlength="200" size="small"
                    placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="所在地：" prop="provinceId">
          <el-select v-model="ruleForm.provinceId" size="small" placeholder="请选择省份"
                     @change="listAreaByPidAndLevel('cidOptions', ruleForm.provinceId, 4)">
            <el-option
              v-for="item in pidOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="ruleForm.cityId" size="small" placeholder="请选择城市" no-data-text="选择城市前请选择省份">
            <el-option
              v-for="item in cidOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址：" prop="addressDetail">
          <el-input v-model="ruleForm.addressDetail" class="input-des" maxlength="300" size="small"
                    placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="ruleForm.email" class="input-des" maxlength="300" size="small"
                    placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" size="small" class="input-des" maxlength="300"
                    rows="5" v-model="ruleForm.remark" placeholder="备注"></el-input>
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
    name: "myPrintingCompanyEdit",
    data() {
      return {
        type: 'get', // 操作类型
        ruleForm: {
          id: '',
          name: '', //	是	string	名称
          shortName: '', //	是	string	简称
          contacts: '', //	是	string	联系人
          tel: '', //	是	string	电话
          provinceId: '', //	是	number	省份ID
          cityId: '', //	是	string	城市ID
          addressDetail: '', //	是	string	详细地址
          email: '', //	是	string	邮箱
          remark: '', //	是	string	备注
        },
        rules: {
          name: [
            {required: true, message: '请输入印刷厂全称', trigger: 'blur'},
          ],
          shortName: [
            {required: true, message: '请输入印刷厂简称', trigger: 'blur'}
          ],
          contacts: [
            {required: true, message: '请输入联系人', trigger: 'blur'},
          ],
          tel: [
            {required: true, message: '请输入联系电话', trigger: 'blur'}
          ],
          provinceId: [
            {required: true, message: '选择所在地', trigger: 'blur'},
          ],
          addressDetail: [
            {required: true, message: '请输入详细地址', trigger: 'blur'}
          ],
        },
        // 省市区
        pidOptions: [],
        cidOptions: [],
        aidOptions: [],
      }
    },
    methods: {
      /**
       * 查询 印企详情
       * */
      getPrintDetail() {
        let vm = this;
        let params = {
          id: this.ruleForm.id
        }
        vm.axios.post(vm.$api.printHouseManage.infoPrintHouse, params).then(function (res) {
          if (res.data.code == 0) {
            vm.ruleForm = res.data.data;
            // 查询区域
            vm.listAreaByPidAndLevel('cidOptions', vm.ruleForm.provinceId, 4, 'init');
          } else {
            vm.$message.error(res.data.message);
          }
        })
      },
      /**
       * 保存
       * */
      submitForm(formName) {
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let _url = that.$api.printHouseManage.addPrintHouse;
            if (that.type === 'update') {
              _url = that.$api.printHouseManage.updatePrintHouse;
            }

            that.axios.post(_url, that.ruleForm).then(function (res) {
              if (res.data.code == 0) {
                that.$router.go(-1);
              } else {
                that.$message.error(res.data.message);
              }
            })
          } else {
            return false;
          }
        });
      },
      /**
       * 取消
       */
      cancel() {
        this.$router.go(-1)
      },
      /**
       * 根据上级id或级别查询区域
       * level：级别，(1ALL;2省级类型;3省级行政区;4市级行政区;5县级行政区;)
       **/
      listAreaByPidAndLevel(options, pid, level, type = 'get') {
        let params = {
          pid: pid,
          level: level
        }
        let that = this;
        this.axios.post(this.$api.printHouseManage.listAreaByPidAndLevel, params).then(function (res) {
          if (res.data.code == 0) {
            that[options] = res.data.data;
            if (level === 4 && type === 'get') {
              that.ruleForm.cityId = '';
            }
          } else {
            that.$message.error(res.data.message);
          }
        })
      },
    },
    mounted() {
      // 查询省份
      this.listAreaByPidAndLevel('pidOptions', '', 3);
      this.ruleForm.id = this.$route.query.id;
      this.type = this.$route.query.type;
      if (this.type === 'update') {
        // 查询详情
        this.getPrintDetail();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .myPrintingCompanyEdit {
    .header {
      .title {
        display: inline-block;
        position: relative;
        font-size: 16px;
        color: #409EFF;
      }
    }
    .content {
      padding:20px;
      .c-title {
        width: 450px;
        color: #ffffff;
        background: #409EFF;
        height: 36px;
        line-height: 36px;
        text-align: center;
        margin-bottom: 30px;
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
      .ruleForm {
        background: #ffffff;
        padding-bottom: 30px;
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
  }
</style>
