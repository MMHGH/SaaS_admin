<template>
  <div class="yxOrderManage">
    <div class="mat-header">网易严选 / <span>订单管理</span></div>

    <div class="body">
      <!-- 查询条件 -->
      <div class="mateForm">
        <el-form :inline="true" :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-dynamic">
          <el-form-item prop="orderSn" label="订单号：">
            <el-input v-model="ruleForm.orderSn" placeholder="订单号" size="small" style="width: 215px;"></el-input>
          </el-form-item>
          <el-form-item prop="orderStatus" label="订单状态：">
            <el-select v-model="ruleForm.orderStatus" placeholder="订单状态" size="small">
              <el-option
                v-for="item in orderStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="goodsName" label="商品名：">
            <el-input v-model="ruleForm.goodsName" placeholder="商品名" size="small" style="width: 215px;"></el-input>
          </el-form-item>
          <el-form-item prop="orderTime" label="订单时间：">
            <el-date-picker
              v-model="ruleForm.orderTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="userName" label="用户信息：">
            <el-input v-model="ruleForm.userName" placeholder="用户信息" size="small" style="width: 215px;"></el-input>
          </el-form-item>
          <el-form-item prop="enterprise" label="所属企业用户：">
            <el-input v-model="ruleForm.enterprise" placeholder="所属企业用户" size="small" style="width: 215px;"></el-input>
          </el-form-item>
          <el-form-item style="padding-left: 30px;">
            <el-button type="primary" @click="queryData" size="small">筛选</el-button>
            <el-button type="text" @click="resetForm('ruleForm')" size="small">清空筛选条件</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div class="metaContent">
        <div class="btns">
          <el-button type="primary" size="small" @click="exportExcel">导出Excel</el-button>
        </div>
        <div class="mateTable">
          <el-table ref="multipleTable" border :data="tableData" :header-cell-style="{backgroundColor: '#f2f2f2'}">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column align="center" prop="goodsName" label="订单号" min-width="150"></el-table-column>
            <el-table-column align="center" prop="firstCategory" label="订单状态" width="150"></el-table-column>
            <el-table-column align="center" prop="secondCategory" label="用户信息" width="150"></el-table-column>
            <el-table-column align="center" prop="YXSpuId" label="商品名" width="120"></el-table-column>
            <el-table-column align="center" prop="YXSkuId" label="规格" width="120"></el-table-column>
            <el-table-column align="center" prop="specName" label="订单时间" width="150"></el-table-column>
            <el-table-column align="center" prop="saasPrice" label="订单价格" width="120"></el-table-column>
            <el-table-column align="center" prop="YXSkuId" label="地址" width="120"></el-table-column>
            <el-table-column align="center" prop="specName" label="物流状态" width="150"></el-table-column>
            <el-table-column align="center" prop="saasPrice" label="所属企业用户" width="120"></el-table-column>
          </el-table>
        </div>
        <div class="page">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "yxOrderManage",
    data() {
      return {
        orderStatus: [
          {label: '全部', value: ''},
          {label: '成功', value: 1},
          {label: '失败', value: 2}
        ],
        ruleForm: {
          orderSn: '',
          orderStatus: '',
          goodsName: '',
          orderTime: '',
          userName: '',
          enterprise: ''
        },
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
      }
    },
    methods: {
      /**
       * 查询
       * */
      queryData() {
      },
      /**
       * 清空
       */
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      /**
       * 导出Excel
       */
      exportExcel() {
      },
      /**
       * 切换 页大小
       * @param val
       */
      handleSizeChange(val) {
        this.pageNum = 1;
        this.pageSize = val;
        this.queryData();
      },
      /**
       * 翻页
       * @param val
       */
      handleCurrentChange(val) {
        this.pageNum = val;
        this.queryData();
      },
    },
    mounted() {

    }
  }
</script>

<style scoped>
  .yxOrderManage {
    background: rgb(242, 242, 242);
  }

  .yxOrderManage .body {
    background: #ffffff;
    padding: 5px 15px 15px 15px;
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

  .mateForm {
    background: #f2f2f2;
    padding-top: 20px;
  }

  .metaContent {
    background-color: #ffffff;
    margin-top: 10px;
  }

  .metaContent .btns {
    padding-left: 20px;
    padding-bottom: 10px;
  }

  .mateForm form {
    padding-left: 10px;
  }

  .mateTable img {
    width: 100px;
  }

  .page {
    text-align: center;
    margin-top: 10px;
  }

  .top_info {
    margin: 10px 20px 0 20px;
    background: rgba(255, 247, 204, 1);
  }

  .left_size {
    color: #0033FF;
    margin-left: 20px;
  }
</style>
