<template>
  <div class="home-main-wrapper">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item><span>资源管理</span></el-breadcrumb-item>
        <el-breadcrumb-item><span>开通微信红包奖品</span></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main" style="position: relative;">
      <el-form ref="form" :model="formData"  size="small" label-position="right" label-width="180px" label-suffix="：">
        <el-form-item label="商户号" prop="mchId" required>
          <el-input v-model="formData.mchId" disabled></el-input>
        </el-form-item>
        <el-form-item label="appid" prop="appId" required>
          <el-input v-model="formData.appId" disabled></el-input>
        </el-form-item>
        <el-form-item label="秘钥" prop="mchKey" required>
          <el-input v-model.number="formData.mchKey" disabled></el-input>
        </el-form-item>
        <el-form-item label="pck12证书" prop="cert" required>
          <el-input class="pck" v-model.number="formData.cert" disabled></el-input>
          <el-button type="primary" style="margin-left:20px;" size="small" @click="exportExcel">下载</el-button>
        </el-form-item>
        <el-form-item label="每天每人限制红包个数" class="astrictNum">
          <el-input v-model="formData.dayLimitQty" disabled></el-input>
           <span style="margin-left: 10px;">个</span>
        </el-form-item>
        <el-form-item style="margin-top:80px">
          <el-button native-type="submit" type="primary" size="small" @click.stop.prevent="subData('1')" style="width:100px;margin-right:10px">通过</el-button>
          <el-button native-type="submit" type="info" size="small" @click.stop.prevent="subData('2')" style="width:100px;margin-right:10px">未通过</el-button>
          <el-button native-type="submit"  size="small" @click.stop.prevent="subData('3')" style="width:100px;margin-right:10px">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { Message,MessageBox } from 'element-ui'
import api from '@/config/api'
import formatterURL from '@/util/formatterURL'

  export default {
    data(){
      return {
        formData: {
          mchId:'',
          mchKey:'',
          cert:'',
          dayLimitQty:'',
          appId:''
        },
        organId:''
      }
    },
    mounted(){
      this.getData()
    },
    methods: {
      getData(){
        let sendData = {
          organId: this.$route.query.organId
        };
        this.axios.post(this.$api.createProduct.redPacketDetail,sendData).then((res) => {
            let data = res.data.data, 
                msg = res.data.message;
            if(msg=='ok'){
              this.formData.mchId = data.mchId;
              this.formData.mchKey = data.mchKey;
              this.formData.cert = data.cert;
              this.formData.dayLimitQty = data.dayLimitQty;
              this.formData.appId = data.appId;
              this.organId = data.organId;
            }
        })
      },
      subData(type){
        let that = this
        switch(type){
            case '1':
              this.enable();
              break;
            case '2':
              this.disable();
              break;
            case '3':
              this.$router.go(-1);//返回上一层
              break;
        }
      },
      // 通过
      enable(){
        let sendData = {
          organId: this.organId
        };
        this.axios.post(this.$api.createProduct.redPacketEnable,sendData).then((res) => {
            if(res.data.message == 'ok'){
              this.$router.go(-1);//返回上一层
            }else{
              this.$message.warning(res.data.message);
            }
        })
      },
      // 不通过
      disable(){
        let sendData = {
          organId: this.organId
        };
        this.axios.post(this.$api.createProduct.redPacketDisable,sendData).then((res) => {
            if(res.data.message == 'ok'){
              this.$router.go(-1);//返回上一层
            }else{
              this.$message.warning(res.data.message);
            }
        })
      },
      // 下载
      exportExcel(){
          window.location.href = formatterURL.formatterURL(this.$api.createProduct.redPacketDownload) + '?organId=' + this.$route.query.organId
      }
    }
  }
</script>
<style type="text/css" scoped>
  .home-main-wrapper>.header .arrow{display: inline-block;position: relative;font-size: 16px;color: #fff;background: #409EFF;line-height: 36px;text-align: center;width: 400px;}
  .home-main-wrapper>.header .arrow:before{content: '';position: absolute;left: 100%;width: 0;height: 0;border-width: 18px;border-style: solid;border-color: transparent transparent transparent #409EFF;}
  .home-main-wrapper>.main{padding-bottom: 52px;}
  .el-input, .el-select{width: 200px;}
   .home-main-wrapper>.main .pck{
       width:300px;
   }
   .home-main-wrapper>.main .astrictNum{
       margin-left:80px;
   }
</style>

