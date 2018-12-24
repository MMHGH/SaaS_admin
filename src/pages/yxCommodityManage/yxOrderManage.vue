<template>
  <div class="yxOrderManage">
    <div class="mat-header">网易严选 / <span>订单管理</span></div>

    <div class="body">
      <!-- 查询条件 -->
      <div class="mateForm">
        <el-form :inline="true" :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-dynamic">
          <el-form-item prop="thirdpartyOrderId" label="订单号：">
            <el-input v-model="ruleForm.thirdpartyOrderId" placeholder="订单号" size="small"
                      style="width: 215px;"></el-input>
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
          <el-form-item prop="startTime" label="订单时间：">
            <el-date-picker
              v-model="ruleForm.startTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss" style="width: 215px;" @change="changeTime('start')"
              placeholder="开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="endTime" label="至：">
            <el-date-picker
              v-model="ruleForm.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss" style="width: 215px;" @change="changeTime('end')"
              placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="memberPhone" label="用户手机：">
            <el-input v-model="ruleForm.memberPhone" placeholder="用户手机" size="small" style="width: 215px;"></el-input>
          </el-form-item>
          <el-form-item prop="organName" label="所属企业用户：">
            <el-input v-model="ruleForm.organName" placeholder="所属企业用户" size="small" style="width: 215px;"></el-input>
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
            <el-table-column align="center" prop="thirdpartyOrderId" label="订单号" min-width="150"></el-table-column>
            <el-table-column align="center" prop="goodsName" label="商品名" min-width="150"></el-table-column>
            <el-table-column align="center" prop="orderStatus" label="订单状态" width="150">
              <template slot-scope="scope">{{ scope.row.orderStatus | fmtStatus(orderStatus)}}</template>
            </el-table-column>
            <el-table-column align="center" prop="memberNickname" label="用户名称" width="150"></el-table-column>
            <el-table-column align="center" prop="memberPhone" label="用户手机" width="150"></el-table-column>
            <el-table-column align="center" prop="goodsDesc" label="规格" width="120"></el-table-column>
            <el-table-column align="center" prop="createdTime" label="订单时间" width="160">
              <template slot-scope="scope">{{ $timestamp.getTimeByTimestamp(scope.row.createdTime)}}</template>
            </el-table-column>
            <el-table-column align="center" prop="orderPrice" label="订单价格" width="120"></el-table-column>
            <el-table-column align="center" prop="address" label="地址" min-width="150"></el-table-column>
            <el-table-column align="center" prop="expressInfo" label="物流状态" min-width="150"></el-table-column>
            <el-table-column align="center" prop="organName" label="所属企业用户" width="120"></el-table-column>
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
          thirdpartyOrderId: '',
          orderStatus: '',
          goodsName: '',
          startTime: '',
          endTime: '',
          memberPhone: '',
          organName: ''
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
        return '';
      }
    },
    methods: {
      /**
       * 查询
       * */
      queryData() {
        this.pageNum = 1;
        this.getGoodsAccountInfoList();
      },
      /**
       * 查询 订单
       * */
      getGoodsAccountInfoList() {
        let param = this.ruleForm;
        param.pageNum = this.pageNum;
        param.pageSize = this.pageSize;
        this.axios.post(this.$api.yxGoods.getGoodsAccountInfoList, param).then((res) => {
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
        if (this.ruleForm.startTime && this.ruleForm.endTime) {
          let start = new Date(this.ruleForm.startTime).getTime()
          let end = new Date(this.ruleForm.endTime).getTime()
          if (start > end) {
            let msg = '结束时间不能小于开始时间'
            if (type === 'start') {
              msg = '开始时间不能大于结束时间'
              this.ruleForm.startTime = ''
            } else {
              this.ruleForm.endTime = ''
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
        let load = this.$api.yxGoods.exportGoodsAccountInfoList.replace('@root', '/api');
        console.log(load)

        var _form = document.createElement('FORM');
        _form.setAttribute('method', 'post');
        _form.setAttribute('action', load);

        // 组织查询参数
        let attrs = Object.keys(this.ruleForm);
        for (let i in attrs) {
          let key = attrs[i];
          console.log(key)
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
        this.getGoodsAccountInfoList();
      },
      /**
       * 翻页
       * @param val
       */
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getGoodsAccountInfoList();
      },
    },
    mounted() {
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
