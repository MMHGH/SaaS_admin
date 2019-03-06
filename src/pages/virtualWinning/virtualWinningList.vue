<template>
  <div class="yxOrderManage">
    <div class="mat-header">权限后台 / <span>中奖信息</span></div>

    <div class="body">
      <!-- 查询条件 -->
      <div class="mateForm">
        <el-form :inline="true" :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-dynamic">
          <el-form-item label="订单号" prop="orderNo">
            <el-input v-model="ruleForm.orderNo" maxlength="11" placeholder="请输入订单号"></el-input>
          </el-form-item>
          <el-form-item prop="beginDate" label="兑奖时间：">
            <el-date-picker
              v-model="ruleForm.beginDate"
              type="datetime"
              value-format="timestamp" style="width: 215px;" @change="changeTime('start')"
              placeholder="兑奖时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="endDate" label="结束时间：">
            <el-date-picker
              v-model="ruleForm.endDate"
              type="datetime"
              value-format="timestamp" style="width: 215px;" @change="changeTime('end')"
              placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="关联账户" prop="relationAccount">
            <el-input v-model="ruleForm.relationAccount" maxlength="11" placeholder="请输入关联账户"></el-input>
          </el-form-item>
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
            <el-button type="primary" @click="queryData" size="small">筛选</el-button>
            <el-button type="text" @click="resetForm('ruleForm')" size="small">清空</el-button>
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
            <el-table-column align="center" property="winAccount" label="中奖账号"></el-table-column>
            <el-table-column align="center" property="awardName" label="奖品名称"></el-table-column>
            <el-table-column align="center" property="receivedTime" label="兑换时间">
              <template slot-scope="scope">{{ $timestamp.getTimeByTimestamp(scope.row.receivedTime)}}</template>
            </el-table-column>
            <el-table-column align="center" property="price" label="价格"></el-table-column>
            <el-table-column align="center" property="status" label="状态">
              <template slot-scope="scope">{{ scope.row.status | fmtStatus(statusList)}}</template>
            </el-table-column>
            <el-table-column align="center" property="relationAccount" label="关联账户"></el-table-column>
            <!--<el-table-column align="center" prop="operation" label="操作">-->
            <!--<template slot-scope="scope">-->
            <!--<el-button type="text" @click="delWin(scope.row)">删除</el-button>-->
            <!--</template>-->
            <!--</el-table-column>-->
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
          beginDate: '',
          endDate: ''
        },
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
      }
    },
    filters: {
      // 状态过滤器
      fmtStatus(val, list) {
        if (val) {
          for (let item of list) {
            if (item.value == val) {
              return item.label;
            }
          }
        }
        return '--';
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
        let param = this.ruleForm;
        param.pageNum = this.pageNum;
        param.pageSize = this.pageSize;
        this.axios.post(this.$api.virtualWin.listPlatformAwardByPage, param).then((res) => {
          let data = res.data.data, msg = res.data.message;
          if (msg == 'ok') {
            this.tableData = data.list;
            this.total = data.total;
          } else {
            this.$message.error('查询失败：' + msg);
          }
        })
      },
      // 验证时间
      changeTime(type) {
        if (this.ruleForm.beginDate && this.ruleForm.endDate) {
          let start = new Date(this.ruleForm.beginDate).getTime()
          let end = new Date(this.ruleForm.endDate).getTime()
          if (start > end) {
            let msg = '结束时间不能小于兑奖时间'
            if (type === 'start') {
              msg = '兑奖时间不能大于结束时间'
              this.ruleForm.beginDate = ''
            } else {
              this.ruleForm.endDate = ''
            }
            this.$message({
              message: msg,
              type: 'warning'
            });
          }
        }
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
        let load = this.$api.virtualWin.listPlatformAwardForExport.replace('@root', '/api');
        var _form = document.createElement('FORM');
        _form.setAttribute('method', 'post');
        _form.setAttribute('action', load);

        // 组织查询参数
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
        // _form.submit();
        // document.body.removeChild(_form)
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
