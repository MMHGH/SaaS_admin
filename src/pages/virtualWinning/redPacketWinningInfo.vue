<template>
  <div class="yxOrderManage">
    <div class="mat-header">权限后台 / <span>红包中奖信息</span></div>
    <div class="body">
      <!-- 查询条件 -->
      <div class="mateForm">
        <el-form :inline="true" :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-dynamic">
          <el-form-item label="订单号" prop="orderNo">
            <el-input v-model="ruleForm.orderNo" maxlength="50" placeholder="请输入订单号"></el-input>
          </el-form-item>
          <!-- format="yyyy 年 MM 月 dd 日" -->
          <el-form-item prop="date1" label="中奖时间：">
            <el-date-picker
              v-model="ruleForm.time1"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="timestamp"
              style="width: 400px;" 
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="time2" label="兑换时间：">
            <el-date-picker
              v-model="ruleForm.time2"
              type="datetimerange"
              range-separator="至"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="timestamp"
              style="width: 400px;" 
              start-placeholder="开始时间"
              end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="关联账户" prop="relationAccount">
            <el-input v-model="ruleForm.relationAccount" maxlength="11" placeholder="请输入关联账户"></el-input>
          </el-form-item> -->
          <el-form-item label="中奖账户" prop="winAccount">
            <el-input v-model="ruleForm.winAccount" maxlength="11" placeholder="请输入中奖账户"></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select v-model="ruleForm.status" placeholder="状态" size="small">
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
        <div class="btns">
          <el-button type="primary" size="small" @click="exportExcel">导出</el-button>
        </div>
        <div class="mateTable">
          <el-table ref="multipleTable" border :data="tableData" :header-cell-style="{backgroundColor: '#f2f2f2'}">
            <el-table-column align="center" prop="orderNo" label="订单号"></el-table-column>
              <el-table-column align="center" property="createdTime" label="中奖时间">
                <template slot-scope="scope">{{ $timestamp.getTimeByTimestamp(scope.row.createdTime)}}</template>
              </el-table-column>
            <el-table-column align="center" property="receivedTime" label="兑换时间">
              <template slot-scope="scope">{{ $timestamp.getTimeByTimestamp(scope.row.receivedTime)}}</template>
            </el-table-column>
            <el-table-column align="center" property="winAccount" label="中奖账户"></el-table-column>
            <el-table-column align="center" property="relationAccount" label="关联账号"></el-table-column>
            <el-table-column align="center" property="organName" label="企业名称"></el-table-column>
            <el-table-column align="center" property="codeItem" label="产品二维码"></el-table-column>
            <el-table-column align="center" property="activityName" label="活动名称"></el-table-column>
            <el-table-column align="center" property="value" label="红包金额">
                <template slot-scope="scope">
                  <span>{{ scope.row.value && scope.row.value.toFixed(2)}}</span>
                  <span v-if="scope.row.value">元</span>
                </template>
            </el-table-column>
            <el-table-column align="center" property="status" label="状态">
            <template slot-scope="scope">{{ scope.row.status | fmtStatus(statusList)}}</template>
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
    name: "saasTrialManage",
    data() {
      return {
        statusList: [
          // 状态： 1未领取(待兑换) 2 已兑换 3 已过期
          {label: '全部', value: ''},
          {label: '未领取', value: 1},
          {label: '已兑换', value: 2},
          {label: '已过期', value: 3}
        ],
        ruleForm: {
          orderNo: '',
          winAccount: '',
          relationAccount: '',
          status: '',
          time1: '',
          time2: ''
        },
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
          case 1:
           auditStatus = '未领取'
           break;
          case 2:
           auditStatus = '已兑换'
           break;
          case 3:
           auditStatus = '已过期'
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
        this.getAwardByPage();
      },
      /**
       * 查询 申请用户
       * */
      getAwardByPage() {
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
       
        console.log(param)
        this.axios.post(this.$api.virtualWin.listRedPacketInfo, param).then((res) => {
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
        this.ruleForm.time1 = '';
        this.ruleForm.time2 = '';
      },
      /**
       * 导出Excel
       */
      exportExcel() {
        let load = this.$api.virtualWin.listRedPacketInfoExport.replace('@root', '/api');
        var _form = document.createElement('FORM');
        _form.setAttribute('method', 'post');
        _form.setAttribute('action', load);

        // 组织查询参数1
        let attrs = Object.keys(this.ruleForm);
        for (let i in attrs) {
          let key = attrs[i];
          if (key !== 'pageNum' && key !== 'pageSize') {
            var attr = document.createElement('input');
            attr.setAttribute('type', 'hidden');
            attr.setAttribute('name', key);
            attr.setAttribute("value", !this.ruleForm[key] ? '' : this.ruleForm[key]);
            _form.append(attr);
          }
        }

        document.body.appendChild(_form);
        _form.submit();
        document.body.removeChild(_form)
      },
      /**
       * 切换 页大小
       * @param val
       */
      handleSizeChange(val) {
        this.pageNum = 1;
        this.pageSize = val;
        this.getAwardByPage();
      },
      /**
       * 翻页
       * @param val
       */
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getAwardByPage();
      },
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
