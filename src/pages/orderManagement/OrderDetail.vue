<template>
  <div>
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <el-row style="margin-bottom: 20px;">
        <el-col :span="4">用户名：{{account}}</el-col>
        <el-col :span="4">订购服务：{{name}}</el-col>
        <el-col :span="4">订单号：{{orderNo}}</el-col>
      </el-row>
      <el-table :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}">
        <el-table-column align="center" prop="itemName" label="订购内容"></el-table-column>
        <el-table-column align="center" property="qty" label="数量"></el-table-column>
        <el-table-column align="center" property="createdTime" label="生效时间"></el-table-column>
        <el-table-column align="center" property="price" label="价格（元）"></el-table-column>
      </el-table>
      <section class="total">
        <el-row class="price">
          <el-col :offset="18" :span="6">合计：{{goodsAmount}}</el-col>
        </el-row>
        <el-row class="order">
          <el-col :span="6">当前折扣：{{discountAmount}}</el-col>
          <el-col :offset="12" :span="6">
            <div style="font-size: 16px;">应付款：<ins style="color: #ff6600;font-weight: 700;">{{dueAmount}}</ins></div>
            <div style="font-size: 18px;">订单状态：{{status | filterStatus}}</div>
            <div><el-button type="primary" style="padding: .5em 2em;" @click="goBack">返回</el-button></div>
          </el-col>
        </el-row>
      </section>

    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        account: '',
        name: '',
        orderNo: '',
        discount: '',
        status: '',
        tableData: [],
        goodsAmount: '',
        discountAmount: '',
        dueAmount: ''
      }
    },
    mounted(){
      this.getData()
    },
    methods: {
      goBack(){
        sessionStorage.removeItem('supperManaOrderId');
        this.$router.go(-1)
      },
      getData(){
        // 1.sendData
        let sendData = {
          orderId: sessionStorage.getItem('supperManaOrderId')
        };

        // 2.post
        let vm = this
        this.axios.post(this.$api.orderMana.supperManaOrderDetail,sendData).then(function(respone){
          let msg = respone.data.message;
          let data = respone.data.data;
          if(msg == 'ok'){
            vm.tableData = data.orderDetailApiVOList
            vm.account = data.account;
            vm.orderNo = data.orderNo;
            vm.status = data.status;
            vm.goodsAmount = data.goodsAmount;
            vm.discountAmount = data.discountAmount;
            vm.dueAmount = data.dueAmount;
          }
        }).catch(function(error){
          console.error(error);
        });
      }
    },
    computed: {
      totalPrice(){
        return this.tableData.reduce((total, item)=>{
            return (total + parseFloat(item.price))
          }, 0).toFixed(2)
      },
      discountText(){
        return this.discount ? this.discount + '折' : '无折扣'
      }
    },
    filters: {
      filterStatus(val){
        if(!val){return}
        let status = ''
        switch(val){  //  1未付款 2已付款 3已完成 4已取消
          case 1:
          status = '未付款';
          break;
          case 2:
          status = '已付款';
          break;
          case 3:
          status = '已完成';
          break;
          case 4:
          status = '已取消';
          break;
        }
        return status
      }
    }
  }
</script>
<style type="text/css" scoped>
  .total{background: #f2f2f2;padding: 20px;}
  .total .el-row .el-col{text-align: center;line-height: 60px;}
  .total .el-row.price .el-col{line-height: 70px;}
  .total .el-row.price{border-bottom: 1px solid #e0e0e0;}
</style>

