<template>
  <div class="yxOrderManage">
    <div class="mat-header">资源管理 / <span>视频审核</span></div>

    <div class="body">
      <!-- 查询条件 -->
      <div class="mateForm">
        <div class="setting-btn">
            <el-button type="primary" @click="whiteList">设置视频来源白名单</el-button>
        </div>
        <el-form :inline="true" :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-dynamic">
          <el-form-item prop="createdBeginTime" label="建立开始时间：">
            <el-date-picker
              v-model="ruleForm.createdBeginTime"
              type="datetime"
              value-format="timestamp"
              style="width: 215px;" 
              placeholder="请选择建立开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="createdEndTime" label="建立结束时间：">
            <el-date-picker
              v-model="ruleForm.createdEndTime"
              type="datetime"
              value-format="timestamp" style="width: 215px;"
              placeholder="请选择建立结束时间">
            </el-date-picker>
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
          <el-form-item label="" prop="context">
                <el-input v-model="ruleForm.context" placeholder="搜索用户账号或企业名称"></el-input>
          </el-form-item>
          <el-form-item style="padding-left: 30px;">
            <el-button type="primary" @click="queryData" size="small">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div class="metaContent">
        <div class="mateTable">
          <el-table ref="multipleTable" border :data="tableData" :header-cell-style="{backgroundColor: '#f2f2f2'}">
            <el-table-column align="center" prop="account" label="用户账号"></el-table-column>
            <el-table-column align="center" prop="companyName" label="企业名称"></el-table-column>
            <el-table-column align="center" property="createdTime" label="提交时间">
              <template slot-scope="scope">{{ $timestamp.getTimeByTimestamp(scope.row.createdTime)}}</template>
            </el-table-column>
            <el-table-column align="center" property="content" label="审核内容">
              <template slot-scope="scope">
                  <a :href="scope.row.content" target="_blank" style="color: #409EFF;">111</a>
              </template>
            </el-table-column>
            <el-table-column align="center" property="status" label="审核状态">
              <template slot-scope="scope">{{ scope.row.status | fmtStatus()}}</template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="status"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.status==0 || scope.row.status==2 || scope.row.status==3" @click="auditHandle(scope.row,'pass')">审核通过</el-button>
                    <el-button type="text" v-if="scope.row.status==0 || scope.row.status==1" @click="auditHandle(scope.row,'nopass')">审核不通过</el-button>
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
    <el-dialog
      title=""
      :visible.sync="dialogCause"
      width="25%"
      center>
      <span>请输入不通过原因：</span>
      <el-form :inline="true" :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="120px" style="margin-top:10px;" class="demo-dynamic">
          <el-form-item label="" prop="cause">
                 <el-input type="textarea" v-model="ruleForm1.cause" :rows="5"
                      placeholder="请输入不超过300个中文字符" style="width:400px;"></el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="nopass">确 定</el-button>
        <el-button @click="dialogCause = false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import Util from '../../util/timestamp'
  import {Message} from 'element-ui';
 
  export default {
    data() {
      return {
        dialogCause:false,
        ruleForm: {
          createdBeginTime: '',
          createdEndTime: '',
          status: '',
          context: ''
        },
        ruleForm1:{
          cause:''
        },
        rules1:{
          cause: [
            {required: true, max: 300, message: '请输入不超过300个中文字符', trigger: 'blur'}
          ],
        },
        statusList: [
          {label: '全部', value: ''},
          {label: '未审核', value: 0},
          {label: '审核通过', value: 1},
          {label: '自动审核不通过', value: 2},
          {label: '人工审核不通过', value: 3},
        ],
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        id:''
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
           auditStatus = '自动审核不通过'
          case 3:
           auditStatus = '人工复审不通过'
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
          context: this.ruleForm.context,
          status: this.ruleForm.status,
          createdBeginTime: this.ruleForm.createdBeginTime,
          createdEndTime: this.ruleForm.createdEndTime,
        }
        this.axios.post(this.$api.auditDetails.getVideoList, param).then((res) => {
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
      //审核
      auditHandle(row,type){
        switch(type){
          case 'pass':
            this.pass(row);
            break;
          case 'nopass':
            this.id = row.id;
            this.ruleForm1.cause = '';
            this.dialogCause = true;
            break;
        }
      },
      pass(row){
        let param = {
          id:row.id,
          status:1,
          remark:''
        }
        this.axios.post(this.$api.auditDetails.censor, param).then((res) => {
          let data = res.data.data, 
              msg = res.data.message;
          if (msg == 'ok') {
            // Message({
            //   type: 'success',
            //   message: '提交成功'
            // });
            this.getData();
          } else {
            this.$message.error('提交失败：' + msg);
          }
        })
      },
      nopass(){
        let param = {
          id:this.id,
          status:0,
          remark:this.ruleForm1.cause
        }
        this.$refs['ruleForm1'].validate((valid, object)=>{
          if(valid){
            this.axios.post(this.$api.auditDetails.censor, param).then((res) => {
              let data = res.data.data, 
                  msg = res.data.message;
              if (msg == 'ok') {
                Message({
                  type: 'success',
                  message: '提交成功'
                });
                this.dialogCause = false;
                this.getData();
              } else {
                this.$message.error('提交失败：' + msg);
              }
            })
          }
        })
      },
      // 设置白名单  
      whiteList(){
        this.$router.push({path:'/setWhiteList'});
      },
      // 提交原因
      submitCause(){
        let param = {
          id:this.id,
          cause: this.ruleForm1.cause,
        }
        this.axios.post(this.$api.createProduct.listWxRedPacketConf, param).then((res) => {
          let data = res.data.data, 
              msg = res.data.message;
          if (msg == 'ok') {
            Message({
              type: 'success',
              message: '保存成功'
            });
            this.dialogCause = false;
          } else {
            this.$message.error('保存失败：' + msg);
          }
        })
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
  .setting-btn{
      margin:0 0 20px 20px;
  }
</style>
