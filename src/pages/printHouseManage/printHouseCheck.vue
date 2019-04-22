<template>
  <div class="printHouseCheck">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限后台</el-breadcrumb-item>
        <el-breadcrumb-item>印刷厂审核</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="开始时间" prop="beginTime">
          <el-date-picker v-model="formInline.beginTime" class="input-txt" size="small" type="date"
                          value-format="yyyy-MM-dd" placeholder="选择开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="formInline.endTime" class="input-txt" size="small" type="date"
                          value-format="yyyy-MM-dd" placeholder="选择结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="formInline.region" size="small" class="input-txt" placeholder="审核状态">
            <el-option label="全部" value="1"></el-option>
            <el-option label="未审核" value="2"></el-option>
            <el-option label="已审核" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请人" prop="region">
          <el-input v-model="formInline.region" size="small" placeholder="申请人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getData">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}">
        <el-table-column align="center" prop="orderNo" label="申请人"></el-table-column>
        <el-table-column align="center" prop="orderNo" label="印刷厂名称"></el-table-column>
        <el-table-column align="center" prop="orderNo" label="印刷厂简称"></el-table-column>

        <el-table-column align="center" prop="orderNo" label="联系人"></el-table-column>
        <el-table-column align="center" prop="orderNo" label="联系电话"></el-table-column>
        <el-table-column align="center" prop="orderNo" label="所在地"></el-table-column>

        <el-table-column align="center" prop="orderNo" label="详细地址"></el-table-column>
        <el-table-column align="center" prop="orderNo" label="备注"></el-table-column>
        <el-table-column align="center" prop="orderNo" label="申请时间"></el-table-column>
        <el-table-column align="center" property="status" label="审核状态">
          <template slot-scope="scope">{{ scope.row.status | filterStatus }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="orderDetail(scope.row)">编辑</el-button>
            <el-button size="small" type="text" @click="orderDetail(scope.row)">审核通过</el-button>
            <el-button size="small" type="text" @click="orderDetail(scope.row)">审核不通过</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        popper-class="pagination-popper"
        :current-page="pageNum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: "printHouseCheck",
    data() {
      return {
        formInline: {
          user: '',
          region: '1',
          status: '',
          beginTime: '',
          endTime: ''
        },
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
      }
    },
    methods: {
      /**
       * 切换 页大小
       * */
      handleSizeChange(val) {
        this.pageNum = 1
        this.pageSize = val;
        this.getData()
      },
      /**
       * 分页
       * */
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getData();
      },
      /**
       * 查询
       */
      getData() {

      }
    },
  }
</script>

<style lang="scss" scoped>
  .printHouseCheck {
    .content {
      padding: 0px 10px 10px 10px;
      .input-txt {
        width: 190px;
      }
      .pagination {
        text-align: center;
        margin-top: 5px;
      }
    }
  }
</style>
