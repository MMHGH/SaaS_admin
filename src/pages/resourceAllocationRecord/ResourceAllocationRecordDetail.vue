<template>
  <div>
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>资源分配记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <el-row style="margin-bottom: 20px;color: #409EFF;">
        <el-col :span="4">用户名：{{username}}</el-col>
        <el-col :span="4">订购服务：{{name}}</el-col>
        <el-col :span="4">订单号：{{number}}</el-col>
      </el-row>
      <el-table :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}" style="margin-bottom: 100px;">
        <el-table-column align="center" prop="name" label="资源内容"></el-table-column>
        <el-table-column align="center" property="quantity" label="数量"></el-table-column>
        <el-table-column align="center" property="time" label="时效"></el-table-column>
        <el-table-column align="center" property="price" label="价格（元）"></el-table-column>
      </el-table>
      <section class="total">
        <el-row class="price">
          <el-col :offset="18" :span="6">合计：{{totalPrice}}</el-col>
        </el-row>
        <el-row class="order">
          <el-col :offset="18" :span="6">
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
        username: '15889649844',
        name: '奖品订购',
        number: '20180125001',
        discount: null,
        orderStatus: '已支付',
        tableData: [
          {
            name: '十元移动话费',
            quantity: '1',
            time: '30天',
            price: '4750.00'
          },
          {
            name: '十元移动话费',
            quantity: '1',
            time: '30天',
            price: '4750.00'
          },
        ],
      }
    },
    methods: {
      goBack(){
        this.$router.go(-1)
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
    }
  }
</script>
<style type="text/css" scoped>
  .total{background: #f2f2f2;padding: 20px;}
  .total .el-row .el-col{text-align: center;line-height: 60px;}
  .total .el-row.price .el-col{line-height: 70px;}
  .total .el-row.price{border-bottom: 1px solid #e0e0e0;}
</style>

