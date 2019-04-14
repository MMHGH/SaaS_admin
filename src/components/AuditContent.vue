<template>
  <div class="audit-content">

    <el-dialog title="审核内容" :visible.sync="dialogAudit" width="700px" center>
      <el-form ref="form" label-width="120px">
        <el-form-item class="list-item" :label="item.label+'：'" v-for="(item,index) in formData" :key="index">
          <!-- text类型 -->
          <el-input class="item-txt" v-if="item.type==='text' || item.type==='other'" size="small" v-model="item.value"
                    :placeholder="item.label" disabled></el-input>
          <!-- img类型 -->
          <img class="item-img" v-else-if="item.type === 'img'" v-for="(img,idx) in item.value" :key="idx" :src="img">
          <img class="item-img" v-else-if="item.type === 'imgs'" v-for="(img,idx) in item.value" :key="idx" :src="img">
          <!-- html类型 -->
          <div v-else-if="item.type === 'html'" v-html="item.value"></div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary"  v-if="auditData.status==0 || auditData.status==2 || auditData.status==3" @click="pass">审核通过</el-button>
        <el-button v-if="auditData.status==0 || auditData.status==1" @click="dialogCause = true">审核不通过</el-button>
      </span>
    </el-dialog>

    <!-- 审核不通过 -->
    <el-dialog title="" :visible.sync="dialogCause" width="400px" center>
      <span>请输入不通过原因：</span>
      <el-form :inline="true" :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="120px"
               style="margin-top:10px;" class="demo-dynamic">
        <el-form-item label="" prop="cause">
          <el-input type="textarea" v-model="ruleForm1.cause" :rows="5"
                    placeholder="请输入不超过300个中文字符" style="width:350px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="nopass">确 定</el-button>
        <el-button @click="dialogCause = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import formVerifyConf from '../util/formVerifyConf'
  import {Message} from 'element-ui';

  export default {
    props: ['auditData'],
    data() {
      return {
        dialogAudit: true,
        dialogCause: false,
        ruleForm: {
          beginDate: '',
          endDate: '',
          auditStatus: '',
          account: ''
        },
        ruleForm1: {
          cause: ''
        },
        rules1: {
          cause: [
            {required: true, max: 300, message: '请输入不超过300个中文字符', trigger: 'blur'}
          ],
        },
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        id: '',
        formData: [],
        orderType: 14,
        formJson: '{"name":"微信红包","thumbImgUrl":["https://imgtest-1257418739.cos.ap-guangzhou.myqcloud.com/152/2019-03-08/99699ebf-4405-4bc6-a1d3-f23fa5199bec.png","https://imgtest-1257418739.cos.ap-guangzhou.myqcloud.com/152/2019-03-08/99699ebf-4405-4bc6-a1d3-f23fa5199bec.png"],"unit":"元","description":"微信红包微信红包"}',
      }
    },
    mounted() {
      // this.initData();
    },
   
    filters: {
      // 状态过滤器
      fmtStatus(val) {
        let auditStatus = '';
        switch (Number(val)) {
          case 0:
            auditStatus = '未审核'
            break;
          case 1:
            auditStatus = '审核通过'
            break;
          case 2:
            auditStatus = '审核不通过'
            break;
        }
        return auditStatus
      }
    },
    methods: {
      initData(){
        // 数据
        console.log('数据',this.auditData)
        // 类型
        console.log('类型',this.auditData.scene)
        // 集合
        console.log('集合',JSON.parse(this.auditData.content))

        // 获取配置
        let conf = formVerifyConf.getConfByType(this.auditData.scene);
        // let conf = formVerifyConf.getConfByType(12);
        console.log('1.通过类型匹配到的数据',conf)
        // 解析json
        let data = {
            smallName: "九宫格"
        }
        // let json = JSON.parse(JSON.stringify(data));
        let json = JSON.parse(this.auditData.content);
        console.log('2.解析后台返回的json数据',json)
        // 设置值
        this.formData = formVerifyConf.setVerifyField(conf.value,conf.verifyField, json);
        console.log('3.最终得到的数据',this.formData)
      },
      // 设置状态
      setDialogAudit(){
        this.dialogAudit = true;
      },
      //审核通过
      pass(row) {
        let param = {
          id:this.auditData.id,
          status:1,
          remark:''
        }
        this.axios.post(this.$api.auditDetails.censor, param).then((res) => {
          let data = res.data.data, 
              msg = res.data.message;
          if (msg == 'ok') {
            Message({
              type: 'success',
              message: '提交成功'
            });
            // 调用父组件初始化方法
            this.$emit('getData');
            this.$emit('setAuditContent');
            this.dialogAudit = false;
          } else {
            this.$message.error('提交失败：' + msg);
          }
        })
      },
      nopass() {
        let param = {
          id:this.auditData.id,
          status:0,
          remark:this.ruleForm1.cause
        }
        this.$refs['ruleForm1'].validate((valid, object) => {
          if (valid) {
            this.axios.post(this.$api.auditDetails.censor, param).then((res) => {
              let data = res.data.data,
                msg = res.data.message;
              if (msg == 'ok') {
                Message({
                  type: 'success',
                  message: '提交成功'
                });
                // 调用父组件初始化方法
                this.$emit('getData');
                this.$emit('setAuditContent');
                this.dialogAudit = false;
                this.dialogCause = false;
              } else {
                this.$message.error('提交失败：' + msg);
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .list-item {
    margin-bottom: 5px;
  }

  .list-item .item-txt {
    width: 400px;
  }

  .list-item .item-img {
    width: 160px;
    height: 160px;
    margin-right: 5px;
  }
</style>
