<template>
  <div class="home-main-wrapper">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item><span>资源管理</span></el-breadcrumb-item>
        <el-breadcrumb-item><span>开通微信红包奖品</span></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main" style="position: relative;">
      <el-form ref="form" :model="form"  size="small" label-position="right" label-width="180px" label-suffix="：">
        <el-form-item label="商户号" prop="name" required>
          <el-input v-model="form.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="appid" prop="price">
          <el-input v-model="form.price" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="value">
          <el-input v-model.number="form.value" disabled></el-input>
        </el-form-item>
        <el-form-item label="pck12证书" prop="value">
          <el-input class="pck" v-model.number="form.value" disabled></el-input>
          <el-button type="primary" style="margin-left:20px;" size="small" @click="exportExcel">下载</el-button>
        </el-form-item>
        <el-form-item label="每天每人限制红包个数" class="astrictNum">
          <el-input v-model="num" disabled></el-input>
           <span style="margin-left: 10px;">个</span>
        </el-form-item>
        <el-form-item style="margin-top:80px">
          <el-button native-type="submit" type="primary" size="small" @click.stop.prevent="subData('1')" style="width:100px;margin-right:10px">通过</el-button>
          <el-button native-type="submit"  size="small" @click.stop.prevent="subData('2')" style="width:100px;margin-right:10px">未通过</el-button>
          <el-button native-type="submit"  size="small" @click.stop.prevent="subData('3')" style="width:100px;margin-right:10px">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { Message,MessageBox } from 'element-ui'

  export default {
    data(){
      return {
        form: {
         description:"",
          material: '1',
          name: '',
          price: '',
          value: '',
        },
        num:'99',
      }
    },
    mounted(){
      this.getDetailData()
    },
    methods: {
       getDetailData(){
        let sendData = {
          id: sessionStorage.getItem('supperGoodsId')
        };
        let vm = this
        this.$service.post({
          url: this.$api.goodsMana.supperManaDetail,
          params: sendData,
          successHook: (dataResource, response) => {
            let msg = response.data.message
            let data = response.data.data
            if(msg=='ok'){
              vm.form = data;
             
            }
          }
        })
       },  
      subData(type){
        let that = this
        switch(type){
            case '1':
              break;
            case '2':
            case '3':
              this.$router.go(-1);//返回上一层
              break;
        }
      },
      // 下载
      exportExcel(){

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

