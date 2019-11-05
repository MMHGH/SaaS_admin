<template>
  <div class="upgrade">
    <div class="mat-header">系统管理 / <span>升级维护</span></div>
    <div class="upgrade-content">
        <div class="upgrade-content__status">当前状态：<span :style="{'color':isStart?'#13CE66':'#FF4949'}">{{isStart?'正常运行':'维护中'}}</span></div>
        <div class="upgrade-content__setting">
            <span>设置服务器状态:</span>
            <el-switch
                v-model="isStart"
                active-color="#13ce66"
                @change="changeSetting"
                inactive-color="#ff4949">
            </el-switch>
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
        isStart:true
      }
    },
    filters: {
    },
    methods: {
      getData() {
        let param = {
          isStart:this.isStart
        }
        this.axios.post(this.$api.auditDetails.getImageList, param).then((res) => {
          let data = res.data.data,
              msg = res.data.message;
          if (msg == 'ok') {
            this.isStart = data.isStart;
          } else {
            this.$message.error('查询失败：' + msg);
          }
        })
      },
      changeSetting(){
        let param = {
          isStart:this.isStart
        }
        this.axios.post(this.$api.auditDetails.getImageList, param).then((res) => {
          let msg = res.data.message;
          if (msg == 'ok') {
            Message({
                type: 'success',
                message: '设置成功'
            });
            this.getData();
          } else {
            this.$message.error('查询失败：' + msg);
          }
        })
      }
    },
    mounted() {
      // 查询
    //   this.getData();
    }
  }
</script>

<style lang="scss" scoped>
  .upgrade{
    height: 100%;
    background: rgb(242, 242, 242);
    .mat-header {
        background-color: #ffffff;
        padding: 15px 15px;
        font-size: 20px;
        span {
            color: #0033FF;
        }
    }
    &-content{
        background: #ffffff;
        padding:35px;
        margin-top: 10px;
        &__setting{
             margin-top:20px;
            span{
                margin-right:10px;
            }
        }
    }
  }
</style>
