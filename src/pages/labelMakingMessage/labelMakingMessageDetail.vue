<template>
  <div class="label-making-message-detail-wrapper">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>客户留言</el-breadcrumb-item>
        <el-breadcrumb-item>留言详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <el-form ref="form" :model="form" :rules="formRules" size="small" label-position="right" label-width="200px" label-suffix="：" :disabled="formDisabled">
        <el-form-item label="联系人" prop="contacts">{{ form.contacts }}</el-form-item>
        <el-form-item label="联系方式" prop="phone">{{ form.phone }}</el-form-item>
        <el-form-item label="设计需求" prop="remark">{{ form.remark }}</el-form-item>
        <el-form-item label="设计需求" prop="domain" v-if="this.$route.query.page == 'domain'">{{ form.domain }}</el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click.stop.prevent="setLabelMakingMessageStatus">{{ form.status === 'Y' ? '已联系' : '未联系' }}</el-button>
          <el-button type="primary" size="medium" @click="back">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        currentId: null,
        form: {
          id: '',
          contacts: '',
          phone: '',
          remark: '',
          status: '',
          domain:''
        },
        formRules: {},
        formDisabled: false
      }
    },
    methods: {
      // 返回
      back: function(){
        this.$router.go(-1)
      },
      // 获取标签制作留言信息
      getLabelMakingMessage(){
        let url = this.$route.query.page == 'domain'?this.$api.labelMakingMessage.getDomainFeedbackDetail:this.$api.labelMakingMessage.getLabelMakingMessage;
        this.$service.post({
          url: url,
          params: {id: this.currentId},
          successHook: (data) => {
            this.form.id = data.id
            this.form.contacts = data.contacts
            this.form.phone = data.phone
            this.form.remark = data.remark
            this.form.status = data.status
            this.form.domain = data.domain
          }
        })
      },
      // 设置为已联系
      setLabelMakingMessageStatus(){
        let url = this.$route.query.page == 'domain'?this.$api.labelMakingMessage.setAlreadyConnected:this.$api.labelMakingMessage.setLabelMakingMessageStatus;
        this.$service.postWithConfirm({
          confirmText: '此操作将更改为已联系, 是否继续？',
          url: url,
          params: { id: this.currentId },
          successHook: () => {
            this.getLabelMakingMessage()
          },
          successMessage: '已成功更改为已联系',
        })
      }
    },
    created(){
      this.currentId = this.$route.query.currentId
      this.getLabelMakingMessage()
    }
  }
</script>
<style>
  .label-making-message-detail-wrapper .el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label{width: 215px;}
</style>
<style scoped>
</style>
