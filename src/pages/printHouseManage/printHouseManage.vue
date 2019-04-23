<template>
  <div class="printHouseManage">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限后台</el-breadcrumb-item>
        <el-breadcrumb-item>印刷厂管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="c-left">
        <el-tree :data="data" :props="defaultProps" default-expand-all
                 @node-click="handleNodeClick"></el-tree>
      </div>
      <div class="c-right">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="">
            <el-input v-model="formInline.user" size="small" placeholder="搜索印刷厂名称"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="formInline.region" size="small" placeholder="来源">
              <el-option label="全部来源" value="1"></el-option>
              <el-option label="自建" value="2"></el-option>
              <el-option label="用户添加" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="formInline.region" size="small" placeholder="状态">
              <el-option label="全部状态" value="1"></el-option>
              <el-option label="已停用" value="2"></el-option>
              <el-option label="已启用" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getData">查询</el-button>
          </el-form-item>
        </el-form>

        <el-button class="btn-add" type="primary" size="small" @click="addPrintHouse">添加印刷厂</el-button>
        <el-table :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}">
          <el-table-column align="center" prop="orderNo" label="印刷厂名称"></el-table-column>
          <el-table-column align="center" prop="orderNo" label="印刷厂简称"></el-table-column>
          <el-table-column align="center" prop="orderNo" label="印刷厂ID"></el-table-column>
          <el-table-column align="center" prop="orderNo" label="序列号"></el-table-column>

          <el-table-column align="center" prop="orderNo" label="联系人"></el-table-column>
          <el-table-column align="center" prop="orderNo" label="联系电话"></el-table-column>
          <el-table-column align="center" prop="orderNo" label="所在地"></el-table-column>

          <el-table-column align="center" prop="orderNo" label="详细地址"></el-table-column>
          <el-table-column align="center" prop="orderNo" label="备注"></el-table-column>
          <el-table-column align="center" prop="orderNo" label="来源"></el-table-column>
          <el-table-column align="center" property="status" label="状态">
            <template slot-scope="scope">{{ scope.row.status | filterStatus }}</template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="orderDetail(scope.row)">编辑</el-button>
              <el-button size="small" type="text" @click="orderDetail(scope.row)">删除</el-button>
              <el-button size="small" type="text" @click="orderDetail(scope.row)">启用</el-button>
              <el-button size="small" type="text" @click="orderDetail(scope.row)">停用</el-button>
              <el-button size="small" type="text" @click="orderDetail(scope.row)">下载授权文件</el-button>
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
  </div>
</template>

<script>
  export default {
    name: "printHouseManage",
    data() {
      return {
        data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        formInline: {
          user: '',
          region: '1'
        },
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
      }
    },
    mounted(){
      this.getData();
    },
    methods: {
      /**
       * 查询
       */
      getData() {
        let param = {
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          subOrganId:this.$route.query.id,
          orderNo:this.ruleForm.orderNo,
          winAccount:this.ruleForm.winAccount,
          status:this.ruleForm.status,
          zbeginDate:this.ruleForm.time1?this.ruleForm.time1[0] : '',
          zendDate:this.ruleForm.time1?this.ruleForm.time1[1] : '',
          beginDate:this.ruleForm.time2?this.ruleForm.time2[0] : '',
          endDate:this.ruleForm.time2?this.ruleForm.time2[1] : '',
        }
        this.axios.post(this.$api.printHouseManage.listPrintHouse, param).then((res) => {
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
      /**
       * 点击 树
       * */
      handleNodeClick(data) {
        console.log(data);
      },
      /**
       * 添加印刷厂
       */
      addPrintHouse() {
        this.$router.push({name: 'printHouseEdit'});
      },
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
      
    },
  }
</script>

<style lang="scss" scoped>
  .printHouseManage {
    .content {
      padding: 0px 10px 10px 10px;
      .c-left {
        width: 200px;
        height: 100%;
        display: inline-block;
        float: left;
      }
      .c-right {
        margin-left: 200px;
        .btn-add {
          margin-bottom: 10px;
        }
        .pagination {
          text-align: center;
          margin-top: 5px;
        }
      }
    }
  }
</style>
