<template>
  <div class="prize-list-wrapper">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>中奖信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <el-form ref="filterForm" :model="filterForm" inline size="small" label-position="right" label-width="100px" label-suffix="：" :rules="filterFormRules" style="background: #f2f2f2;padding-top: 20px;">
        <el-form-item label="中奖时间" prop="prizeTime">
          <el-date-picker v-model="filterForm.prizeTime" placeholder="选择中奖时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="中奖账号" prop="prizeAccount">
          <el-input v-model="filterForm.prizeAccount" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="关联账号" prop="relationAccount">
          <el-input v-model="filterForm.relationAccount" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="filterForm.status">
            <el-option label="全部" value="1"></el-option>
            <el-option label="已发货" value="2"></el-option>
            <el-option label="未发货" value="3"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="所属物流" prop="logistics">
          <el-select v-model="filterForm.logistics">
            <el-option label="太和物流" value="1"></el-option>
            <el-option label="顺丰" value="2"></el-option>
            <el-option label="京东" value="3"></el-option>
            <el-option label="申通" value="4"></el-option>
            <el-option label="圆通" value="5"></el-option>
            <el-option label="韵达" value="6"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item style="width: 100px;">
          <el-button style="margin-left: 1em;width: 6em;" type="primary" size="medium" @click.stop.prevent="searchData">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 1em;width: 6em;" type="text" size="medium" @click.stop.prevent="clearData">清空</el-button>
        </el-form-item>
        <el-form-item style="width: 150px;">
          <el-button style="margin-left: 1em;" type="primary" size="medium" @click.stop.prevent="batchExportInvoice">批量导出发货单</el-button>
        </el-form-item>
        <el-form-item style="width: 150px;">
          <el-button style="margin-left: 1em;" type="primary" size="medium" @click.stop.prevent="batchImportInvoice">批量导入发货单</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}">
        <el-table-column align="center" prop="oddNumbers" label="单号"></el-table-column>
        <el-table-column align="center" property="prizeAccount" label="中奖账号"></el-table-column>
        <el-table-column align="center" property="prizeName" label="奖品名称"></el-table-column>
        <el-table-column align="center" property="status" label="状态"></el-table-column>
        <el-table-column align="center" property="relationAccount" label="关联账户"></el-table-column>
        <el-table-column align="center" property="prizeTime" label="中奖时间"></el-table-column>
        <el-table-column align="center" property="mailingAddress" label="邮寄地址" min-width="200" class-name="mailing-address"></el-table-column>
        <el-table-column align="center" property="logistics" label="所属物流"></el-table-column>
        <el-table-column align="center" property="consignor" label="发货人"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="medium" type="text" @click="changeStatue">更改状态</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        filterForm: {
          prizeTime: '',
          prizeAccount: '',
          relationAccount: '',
          status: '',
          logistics: ''
        },
        filterFormRules: {},
        tableData: [],
        dialogFormVisible: false,
        form: {},
        stockData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
      }
    },
    mounted(){
      this.getData()
    },
    methods:{
      // 跳转到批量导出发货单
      batchExportInvoice(){
        // this.$router.push({name: 'BatchExportInvoice'})
      },
      // 跳转到批量导入发货单
      batchImportInvoice(){
        // this.$router.push({name: 'BatchImportInvoice'})
      },
      // 筛选
      searchData(){
        this.pageNum = 1
        // this.$refs['filterForm'].validate((valid, object)=>{
        //   if(valid){}
        // })
      },
      clearData(){},
      handleSizeChange(val){},
      handleCurrentChange(val){},
      getData(){
        // 1.sendData
        let sendData = {

        };

        // 2.post
        let vm = this
        this.axios.post(this.$api.prizeMana.supperManaGetMaterialPrizeList,sendData).then(function(respone){
          let msg = respone.data.message;
          let data = respone.data.data;
          if(msg == 'ok'){
            // vm.tableData = data.orderDetailApiVOList
            // vm.account = data.account;
            // vm.orderNo = data.orderNo;
            // vm.status = data.status;
            // vm.goodsAmount = data.goodsAmount;
            // vm.discountAmount = data.discountAmount;
            // vm.dueAmount = data.dueAmount;
          }
        }).catch(function(error){
          console.error(error);
        });
      },
      changeStatue(){}
    }
  }
</script>
<style type="text/css">
  .prize-list-wrapper .el-form--inline .el-form-item__content{width: 150px;}
  .prize-list-wrapper .el-input--suffix .el-input__inner{padding: 0 15px;}
  .prize-list-wrapper .el-form--inline .filter.el-form-item{width: 100%;padding-left: 15px;}
  .prize-list-wrapper .el-form--inline .filter.el-form-item .el-form-item__content{width: 100%;}
  .prize-list-wrapper .el-date-editor.el-input, .el-date-editor.el-input__inner{width: 100%;}
  .prize-list-wrapper .el-input--suffix.el-date-editor .el-input__inner{text-indent: 20px;}
  .prize-list-wrapper .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell{padding-left: 0;}
  .prize-list-wrapper .el-table .cell, .el-table th div{padding-right: 0;white-space: nowrap;}

  .mailing-address .cell{white-space: normal!important;}
</style>
<style type="text/css" scoped>
  .el-table{border: none;margin-top: 10px;text-align: center;}
  .el-table:after{background-color: transparent;}
  .el-table th{text-align: center;}
  .el-pagination{text-align: center;padding-top: 20px;padding-bottom: 10px;}
</style>

