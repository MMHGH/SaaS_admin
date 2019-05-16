<template>
  <div class="yxOrderManage">
    <div class="mat-header">资源管理 / <span>设置白名单</span></div>

    <div class="body">
      <!-- 查询条件 -->
      <el-button type="primary" @click="dialogMark=true">添加白名单</el-button>
      <!-- 表格 -->
      <div class="metaContent">
        <div class="mateTable">
          <el-table ref="multipleTable" border :data="tableData" :header-cell-style="{backgroundColor: '#f2f2f2'}">
            <el-table-column align="center" prop="domain" label="地址"></el-table-column>
            <el-table-column align="center" prop="remark" label="备注"></el-table-column>
            <el-table-column
                align="center"
                prop="operation"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="del(scope.row)">删除</el-button>
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
    <!-- 添加白名单弹窗 -->
    <el-dialog title="添加白名单" top="25vh" :visible.sync="dialogMark" width="500px"  :close-on-click-modal=false center>
        <div class="tips-text">
           <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-dynamic">
                <el-form-item label="地址：" prop="domain">
                    <el-input v-model="ruleForm.domain" style="width:300px;" placeholder="请输入地址" maxlength="300"></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                    <el-input  type="textarea" :rows="6" style="width:300px;" v-model="ruleForm.remark" placeholder="请输入备注" maxlength="300"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary"  @click="addWhiteList('ruleForm')">提交</el-button>
            <el-button @click="dialogMark=false">取消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import Util from '../../util/timestamp'
  import { MessageBox,Message } from 'element-ui'

  export default {
    data() {
      return {
        dialogMark:false,
        ruleForm: {
          domain: '',
          remark:''
        },
        statusList: [
          {label: '全部审核状态', value: ''},
          {label: '未审核', value: 0},
          {label: '审核通过', value: 1},
          {label: '审核不通过', value: 2}
        ],
        tableData: [],
         rules: {
          domain: [
            {required: true, message: '请输地址', trigger: 'blur'},
          ]
        },
        pageNum: 1,
        pageSize: 10,
        total: 0,
      }
    },
    methods: {
      /**
       * 查询 申请用户
       * */
      getData() {
        let param = {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
        this.axios.post(this.$api.auditDetails.listWhiteListByPage, param).then((res) => {
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
      // 添加白名单
      addWhiteList(formName){
        let vm = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let sendData = {
              domain:this.ruleForm.domain,
              remark:this.ruleForm.remark
            }
            this.axios.post(this.$api.auditDetails.addWhiteList, sendData).then(function (respone) {
                let msg = respone.data.message
                if (msg === 'ok') {
                  Message({
                    type: 'success',
                    message: '添加成功'
                  });
                  vm.dialogMark = false;
                  vm.getData();
                } else {
                  Message({
                    type: 'error',
                    message: msg
                  });
                }
                vm.$refs[formName].resetFields();
            })
          }else {
            return false;
          }
        })
      },
      // 删除
      del(row){
        let vm = this
        let sendData = {
          domain: row.domain
        };
        this.$confirm(`确定要删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          vm.axios.post(vm.$api.auditDetails.deleteWhiteList,sendData).then(function(respone){
            let msg = respone.data.message
            if(msg=='ok'){
              Message({
                type: 'success',
                message: '删除成功'
              });
              vm.getData()
            }
          })
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    mounted() {
      // 查询
      this.getData();
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
