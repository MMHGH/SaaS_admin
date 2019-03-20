<template>
  <div class="yxOrderManage">
    <div class="mat-header">资源管理 / <span>开通微信红包奖品</span></div>

    <div class="body">
      <!-- 查询条件 -->
      <div class="mateForm">
        <el-form :inline="true" :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-dynamic">
          <el-form-item prop="beginDate" label="申请时间：">
            <el-date-picker
              v-model="ruleForm.beginDate"
              type="datetime"
              value-format="timestamp"
              style="width: 215px;" 
              placeholder="请选择申请时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="endDate" label="结束时间：">
            <el-date-picker
              v-model="ruleForm.endDate"
              type="datetime"
              value-format="timestamp" style="width: 215px;"
              placeholder="请选择结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="用户账号" prop="account">
                <el-input v-model="ruleForm.account" placeholder="请输入用户账号"></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="auditStatus">
            <el-select v-model="ruleForm.auditStatus" placeholder="状态" size="small">
                <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="padding-left: 30px;">
            <el-button type="primary" @click="queryData" size="small">搜索</el-button>
            <el-button  @click="resetForm('ruleForm')" size="small">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div class="metaContent">
        <div class="mateTable">
          <el-table ref="multipleTable" border :data="tableData" :header-cell-style="{backgroundColor: '#f2f2f2'}">
            <el-table-column align="center" property="createdTime" label="申请时间">
              <template slot-scope="scope">{{ $timestamp.getTimeByTimestamp(scope.row.createdTime)}}</template>
            </el-table-column>
            <el-table-column align="center" prop="account" label="用户账号"></el-table-column>
            <el-table-column align="center" prop="organName" label="企业名称"></el-table-column>
            <el-table-column align="center" property="auditStatus" label="状态">
              <template slot-scope="scope">{{ scope.row.auditStatus | fmtStatus()}}</template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="operation"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="lookDetail(scope.row, scope.$index)" >查看</el-button>
                </template>
            </el-table-column>
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
  import Util from '../../util/timestamp'
 
  export default {
    data() {
      return {
        ruleForm: {
          account: '',
          auditStatus: '',
          beginDate: '',
          endDate: ''
        },
        statusList: [
          {label: '全部', value: ''},
          {label: '未审核', value: 0},
          {label: '审核通过', value: 1},
          {label: '审核不通过', value: 2}
        ],
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
      }
    },
    filters: {
      // 状态过滤器
      fmtStatus(val) {
        let auditStatus = '';
        switch(Number(val)){
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
       * 查询
       * */
      queryData() {
        this.pageNum = 1;
        this.getData();
      },
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
      /**
       * 清空
       */
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      /**
       * 切换 页大小
       * @param val
       */
      handleSizeChange(val) {
        this.pageNum = 1;
        this.pageSize = val;
        this.getData();
      },
      /**
       * 翻页
       * @param val
       */
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getData();
      },
      //查看
      lookDetail(row){
        this.$router.push({path:'/auditawardDetail',query:{organId:row.organId}});
      }   
    },
    mounted() {
      // 查询
      this.queryData();
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
    /*padding-left: 20px;*/
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
