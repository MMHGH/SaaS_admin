<template>
  <div class="yxOrderManage">
    <div class="mat-header">SAAS试用 / <span>申请管理</span></div>

    <div class="body">
      <!-- 查询条件 -->
      <div class="mateForm">
        <el-form :inline="true" :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-dynamic">
          <el-form-item prop="startTime" label="申请时间范围：">
            <el-date-picker
              v-model="ruleForm.startTime"
              type="datetime"
              value-format="timestamp" style="width: 215px;" @change="changeTime('start')"
              placeholder="开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="endTime" label="至：">
            <el-date-picker
              v-model="ruleForm.endTime"
              type="datetime"
              value-format="timestamp" style="width: 215px;" @change="changeTime('end')"
              placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="type" label="申请类别：">
            <el-select v-model="ruleForm.type" placeholder="申请类别" size="small">
              <el-option
                v-for="item in categorys"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="status" label="审核结果：">
            <el-select v-model="ruleForm.status" placeholder="审核结果" size="small">
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
            <el-table-column align="center" prop="type" label="申请类别" min-width="150">
              <template slot-scope="scope">{{ scope.row.type | fmtStatus(categorys)}}</template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="联系人" width="150"></el-table-column>
            <el-table-column align="center" prop="phone" label="联系电话" width="150"></el-table-column>
            <el-table-column align="center" prop="enterpriseName" label="企业名称" width="150"></el-table-column>
            <el-table-column align="center" prop="sector" label="所属行业" width="120"></el-table-column>
            <el-table-column align="center" prop="createdTime" label="团队规模" width="160">
              <template slot-scope="scope">{{ scope.row.teamSize | fmtStatus(teamSize)}}</template>
            </el-table-column>
            <el-table-column align="center" prop="status" label="审核结果" width="160">
              <template slot-scope="scope">{{ scope.row.status | fmtStatus(statusList)}}</template>
            </el-table-column>
            <el-table-column align="center" prop="email" label="邮箱" width="120"></el-table-column>
            <el-table-column align="center" prop="cityName" label="所在城市" min-width="150"></el-table-column>
            <el-table-column align="center" prop="createdTime" label="申请时间" min-width="150">
              <template slot-scope="scope">{{ $timestamp.getTimeByTimestamp(scope.row.createdTime)}}</template>
            </el-table-column>
            <el-table-column align="center" label="操作" min-width="150">
              <template slot-scope="scope">
                <el-button type="text" @click="review(scope.row)">审核</el-button>
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

        <el-dialog
          title="申请审核"
          :visible.sync="dialogVisible"
          width="450px">
          <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
            <el-form-item label="审核结果" prop="status">
              <el-select v-model="ruleForm2.status" size="small" style="width:100%">
                <el-option label="已通过" value="Y"></el-option>
                <el-option label="不通过" value="N"></el-option>
                <el-option label="待审核" value="W"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开通账号" prop="phone">
              <el-input v-model="ruleForm2.phone" placeholder="请输入开通账号" size="small"></el-input>
            </el-form-item>
            <el-form-item label="备注说明" prop="description">
              <el-input type="textarea" v-model="ruleForm2.description" placeholder="请输入备注" rows="5"
                        size="small" resize="none"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveReview('ruleForm2')">确 定</el-button>
          </span>
        </el-dialog>

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
        categorys: [
          {label: '全部', value: ''},
          {label: '试用申请', value: 1},
          {label: '代理商申请', value: 2}
        ],
        statusList: [
          // 状态 ：Y已联系 N未联系 W待审批
          {label: '全部', value: ''},
          {label: '已通过', value: 'Y'},
          {label: '未通过', value: 'N'},
          {label: '待审核', value: 'W'}
        ],
        teamSize: [
          {label: '小于50人', value: 1},
          {label: '50-100人', value: 2},
          {label: '100人以上', value: 3}
        ],
        ruleForm: {
          startTime: '',
          endTime: '',
          type: '',
          status: ''
        },
        ruleForm2: {
          id: '',
          status: '1',
          phone: '',
          description: ''
        },
        rules2: {
          status: [
            {required: true, message: '请选择审核结果', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入开通账号', trigger: 'blur'}
          ],
        },
        dialogVisible: false,
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
        this.getGoodsAccountInfoList();
      },
      /**
       * 查询 申请用户
       * */
      getGoodsAccountInfoList() {
        let param = this.ruleForm;
        param.pageNum = this.pageNum;
        param.pageSize = this.pageSize;
        this.axios.post(this.$api.feedback.getFeedbackList, param).then((res) => {
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
       * 审核
       * */
      review(row) {
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs['ruleForm2'].resetFields();
          this.ruleForm2.id = row.id;
          this.ruleForm2.status = row.status;
          this.ruleForm2.phone = row.phone;
          this.ruleForm2.description = row.description;
        })
      },
      /**
       * 审核 保存
       * */
      saveReview(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(this.$api.feedback.approve, this.ruleForm2).then((res) => {
              let data = res.data.data, msg = res.data.message;
              if (msg == 'ok') {
                this.$message({
                  message: '审核成功',
                  type: 'success'
                });
                this.dialogVisible = false;
                // 刷新
                this.queryData()
              } else {
                this.$message.error('审核失败：' + msg);
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
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
        let load = this.$api.feedback.exportFeedbackList.replace('@root', '/api');
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
            attr.setAttribute("value", this.ruleForm[key]);
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
      // 默认近期三个月
      let date = new Date();//1516499610000 2018-01-21 09:53:30
      this.ruleForm.endTime = new Date().getTime();
      this.ruleForm.startTime = new Date(date.setMonth(date.getMonth() - 3)).getTime();
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
