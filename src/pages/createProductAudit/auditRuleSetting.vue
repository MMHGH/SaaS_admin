<template>
  <div class="yxOrderManage">
    <div class="mat-header">资源管理 / <span>自动审核规则设置</span></div>

    <div class="body">
        <p>文本违禁检测分（<span class="warning-text">*代表允许检测内容的风险程度，分数越高风险越大，默认0.5</span>）</p>
        <div class="slide-list">
            <el-slider
                v-model="score"
                :min="0" :max="1" :step="0.1"
                show-input
                show-stops>
            </el-slider>
        </div>
        <div class="save-btn"> 
            <el-button type="primary" @click="save">保存</el-button>
        </div>
    </div>
  </div>
</template>

<script>
  import Util from '../../util/timestamp'
  import { MessageBox,Message } from 'element-ui'
 
  export default {
    data() {
      return {
        score: 0.5,
      }
    },
    methods: {
      initData(){
        let vm = this
        this.axios.post(this.$api.auditDetails.getApproveScoreRule).then(function(respone){
          let msg = respone.data.message
          if(msg == 'ok'){
            vm.score = respone.data.data.score;
          }
        })
      },
      // 保存
      save(){
        let vm = this
        let sendData = {   
          score: this.score
        };
        this.axios.post(this.$api.auditDetails.updateApproveScoreRule,sendData).then(function(respone){
          let msg = respone.data.message
          if(msg == 'ok'){
            Message({
              type: 'success',
              message: '保存成功'
            });
            vm.initData();
          }
        })
      },
    },
    mounted() {
      this.initData();
    }
  }
</script>

<style scoped>
  .yxOrderManage {
    background: rgb(242, 242, 242);
  }

  .yxOrderManage .body {
    background: #ffffff;
    padding: 15px 15px 15px 15px;
    margin-top: 5px;
  }

  .mat-header {
    background-color: #ffffff;
    padding: 15px 15px;
    font-size: 20px;
  }

  .mat-header span {
    color: #0033FF;
  }

  .yxOrderManage > p {
    text-indent: 20px;
  }
  .warning-text{
      color:red;
      font-size: 15px;
  }
  .slide-list{
      margin-top:30px;
      margin-left:10px;
      width:500px;
  }
  .save-btn{
      margin:50px 0 0 200px;
  }
</style>
