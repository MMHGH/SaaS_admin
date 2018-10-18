<template>
  <div class="label-making-message-detail-wrapper">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限后台</el-breadcrumb-item>
        <el-breadcrumb-item>留言详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <el-form ref="form" :model="form" :rules="formRules" size="small" label-position="right" label-width="200px" label-suffix="：" :disabled="formDisabled">
        <el-form-item label="联系人" prop="contacts">{{ form.contacts }}</el-form-item>
        <el-form-item label="联系方式" prop="phone">{{ form.phone }}</el-form-item>
        <el-form-item label="设计需求" prop="remark">{{ form.remark }}</el-form-item>
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
        this.$service.post({
          url: this.$api.labelMakingMessage.getLabelMakingMessage,
          params: {id: this.currentId},
          successHook: (data) => {
            this.form.id = data.id
            this.form.contacts = data.contacts
            this.form.phone = data.phone
            this.form.remark = data.remark
            this.form.status = data.status
          }
        })
      },
      // 设置为已联系
      setLabelMakingMessageStatus(){
        this.$service.postWithConfirm({
          confirmText: '此操作将更改该标签制作留言为已联系, 是否继续？',
          url: this.$api.labelMakingMessage.setLabelMakingMessageStatus,
          params: { id: this.currentId },
          successHook: () => {
            this.getLabelMakingMessage()
          },
          successMessage: '已成功更改该标签制作留言为已联系',
        })
      }
    },
    created(){
      this.currentId = this.$route.params.currentId
      console.log(this.currentId)
      this.getLabelMakingMessage()
    }
  }
</script>
<style>
  .label-making-message-detail-wrapper .el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label{width: 215px;}
</style>
<style scoped>
</style>
