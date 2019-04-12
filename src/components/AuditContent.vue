<template>
  <div class="audit-content">
    <el-dialog title="审核内容" :visible.sync="dialogAudit" width="700px" center>
      <el-form ref="form" label-width="100px">
        <el-form-item class="list-item" :label="item.label+'：'" v-for="(item,index) in formData" :keys="index">
          <el-input class="item-txt" v-if="item.type==='text'" size="small" v-model="item.value"
                    :placeholder="item.label" disabled></el-input>
          <img class="item-img" v-else v-for="(img,idx) in item.value" :keys="idx" :src="img">
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="nopass">审核通过</el-button>
        <el-button @click="dialogCause = true">审核不通过</el-button>
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
        <el-button type="primary" @click="submitCause">确 定</el-button>
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
        statusList: [
          {label: '全部审核状态', value: ''},
          {label: '未审核', value: 0},
          {label: '审核通过', value: 1},
          {label: '审核不通过', value: 2}
        ],
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
      /**
       * 查询 申请用户
       * */
      getData() {
        let param = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          account: this.ruleForm.account,
          auditStatus: this.ruleForm.auditStatus,
          beginDate: this.ruleForm.beginDate,
          endDate: this.ruleForm.endDate,
        }
        this.axios.post(this.$api.createProduct.listWxRedPacketConf, param).then((res) => {
          let data = res.data.data,
            msg = res.data.message;
          if (msg == 'ok') {
            this.tableData = data.list;
            this.total = data.total;
          } else {
            this.$message.error('查询失败：' + msg);
          }
        })
      },
      //审核
      auditHandle(row, type) {
        switch (type) {
          case 'pass':
            this.pass(row);
            break;
          case 'nopass':
            this.id = row.id;
            this.dialogCause = true;
            break;
        }
      },
      pass(row) {
        let param = {
          id: row.id,
        }
        this.axios.post(this.$api.createProduct.listWxRedPacketConf, param).then((res) => {
          let data = res.data.data,
            msg = res.data.message;
          if (msg == 'ok') {
            // Message({
            //   type: 'success',
            //   message: '保存成功'
            // });
            this.getData();
          } else {
            this.$message.error('保存失败：' + msg);
          }
        })
      },
      nopass() {
        let param = {
          id: this.id,
          cause: this.ruleForm1.cause
        }
        this.$refs['ruleForm1'].validate((valid, object) => {
          if (valid) {
            this.axios.post(this.$api.createProduct.listWxRedPacketConf, param).then((res) => {
              let data = res.data.data,
                msg = res.data.message;
              if (msg == 'ok') {
                Message({
                  type: 'success',
                  message: '保存成功'
                });
                this.getData();
              } else {
                this.$message.error('保存失败：' + msg);
              }
            })
          }
        })
      },
      // 提交原因
      submitCause() {
        let param = {
          id: this.id,
          cause: this.ruleForm1.cause,
        }
        this.axios.post(this.$api.createProduct.listWxRedPacketConf, param).then((res) => {
          let data = res.data.data,
            msg = res.data.message;
          if (msg == 'ok') {
            Message({
              type: 'success',
              message: '保存成功'
            });
            this.dialogCause = false;
          } else {
            this.$message.error('保存失败：' + msg);
          }
        })
      }
    },
    mounted() {
      // 查询
      //   this.queryData();
      console.log(this.auditData)

      // 获取配置
      let conf = formVerifyConf.getConfByType(this.orderType);
      // 解析json
      let json = JSON.parse(this.formJson);
      // 设置值
      this.formData = formVerifyConf.setVerifyField(conf.verifyField, json);
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
