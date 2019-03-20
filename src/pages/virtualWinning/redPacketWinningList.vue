<template>
  <div class="yxOrderManage">
    <div class="mat-header">权限后台 / <span>红包中奖信息</span></div>

    <div class="body">
      <!-- 表格 -->
      <div class="metaContent">
        <div class="btns">
          <el-button type="primary" size="small" @click="exportExcel">导出</el-button>
        </div>
        <div class="mateTable">
          <!-- 首页 -->
          <el-table ref="multipleTable" border :data="tableData" :header-cell-style="{backgroundColor: '#f2f2f2'}">
              <el-table-column
                  align="center"
                  prop=""
                  width=150
                  type="index"
                  label="序号">
                  <template slot-scope="scope">
                      <span>{{scope.$index+(pageNum - 1) * pageSize + 1}}</span>
                  </template>
              </el-table-column>
              <el-table-column align="center" property="relationAccount" label="关联账号"></el-table-column>
              <el-table-column align="center" property="organName" label="企业名称"></el-table-column>
              <el-table-column align="center" property="totalValue" label="红包总金额">
                  <template slot-scope="scope">
                    <span>{{ scope.row.totalValue && scope.row.totalValue.toFixed(2)}}</span>
                    <span v-if="scope.row.totalValue">元</span>
                  </template>
              </el-table-column>
              <el-table-column align="center" property="totalNum" label="发放个数">
                  <template slot-scope="scope">{{ scope.row.totalNum}}个</template>
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="operation"
                  label="操作">
                  <template slot-scope="scope">
                      <el-button type="text" @click="lookDetail(scope.row)" >查看</el-button>
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
          zbeginDate: '',
          endDate: ''
        },
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
      }
    },
    filters: {
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
          pageSize:this.pageSize
        };
       
        this.axios.post(this.$api.virtualWin.listRedPacket, param).then((res) => {
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
       * 导出Excel
       */
      exportExcel() {
        let load = this.$api.virtualWin.listRedPacketExport.replace('@root', '/api');
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
      //查看
      lookDetail(row){
        this.$router.push({path:'/redPacketWinningInfo',query:{id:row.subOrganId}});
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
