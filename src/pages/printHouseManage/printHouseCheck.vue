<template>
  <div class="printHouseCheck">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限后台</el-breadcrumb-item>
        <el-breadcrumb-item>印刷厂审核</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <el-form :inline="true" :model="ruleForm" class="demo-form-inline">
        <el-form-item label="开始时间" prop="beginCreatedTime">
          <el-date-picker v-model="ruleForm.beginCreatedTime" class="input-txt" size="small"
                          type="datetime" value-format="timestamp" placeholder="选择开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endCreatedTime">
          <el-date-picker v-model="ruleForm.endCreatedTime" class="input-txt" size="small"
                         type="datetime" value-format="timestamp" placeholder="选择结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="ruleForm.auditStatus" size="small" class="input-txt" placeholder="审核状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="未审核" :value="0"></el-option>
            <el-option label="已审核" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请人" prop="applicant">
          <el-input v-model="ruleForm.applicant" size="small" placeholder="请输入申请人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getData(1)">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}">
        <el-table-column align="center" prop="applicant" label="申请人"></el-table-column>
        <el-table-column align="center" prop="organName" label="申请企业"></el-table-column>
        <el-table-column align="center" prop="name" label="印刷厂名称" width="200px"></el-table-column>
        <el-table-column align="center" prop="shortName" label="印刷厂简称" width="200px"></el-table-column>

        <el-table-column align="center" prop="contacts" label="联系人"></el-table-column>
        <el-table-column align="center" prop="tel" label="联系电话"></el-table-column>
        <el-table-column align="center" prop="address" label="所在地"></el-table-column>

        <el-table-column align="center" prop="addressDetail" label="详细地址" width="200px"></el-table-column>
        <el-table-column align="center" prop="remark" label="备注"></el-table-column>
        <el-table-column align="center" prop="createdTime" label="申请时间">
          <template slot-scope="scope">{{ $timestamp.getTimeByTimestamp(scope.row.createdTime)}}</template>
        </el-table-column>
        <el-table-column align="center" prop="auditStatus" label="审核状态">
          <template slot-scope="scope">{{ scope.row.auditStatus | filterStatus }}</template>
        </el-table-column>
        <el-table-column align="center" prop="auditNote" label="审核意见"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <div v-if="scope.row.auditStatus==2">
              <el-button size="small" type="text" @click="edit(scope.row)">编辑</el-button>
              <el-button size="small" type="text" @click="auditHandle(scope.row,'pass')">审核通过</el-button>
            </div>
            <div v-else-if="scope.row.auditStatus==0">
                <el-button type="text" style="margin-bottom:5px;" @click="auditHandle(scope.row,'pass')">审核通过</el-button>
                <el-button type="text" @click="auditHandle(scope.row,'nopass')">审核不通过</el-button>
            </div>
            <span v-else>-</span>
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
    <!-- 审核不通过 -->
    <el-dialog title="" :visible.sync="dialogCause" width="400px" center>
      <span>请输入不通过原因：</span>
      <el-form :inline="true" :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="120px"
               style="margin-top:10px;" class="demo-dynamic">
        <el-form-item label="" prop="cause">
          <el-input type="textarea" v-model="ruleForm1.cause" :rows="5"
                    placeholder="请输入不超过300个中文字符" style="width:350px;"></el-input>
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
  import { MessageBox,Message } from 'element-ui'

  export default {
    name: "printHouseCheck",
    data() {
      return {
        dialogCause:false,
        ruleForm: {
         applicant:'',
         auditStatus:'',
         beginCreatedTime:'',
         endCreatedTime:''
        },
        ruleForm1: {
          cause: ''
        },
        rules1: {
          cause: [
            {required: true, max: 300, message: '请输入不超过300个中文字符', trigger: 'blur'}
          ],
        },
        id:'',
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
      }
    },
    filters: {
      filterStatus(val){
        let sta = '';
        switch(val){
          case 0:
            sta = '未审核';
            break;
          case 1:
            sta = '通过';
            break;
          case 2:
            sta = '不通过';
            break;
        }
        return sta
      }
    },
    mounted(){
      this.getData()
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
      getData(pageNum) {
        if(pageNum===1){
          this.pageNum = pageNum;
        }
        let param = {
          beginCreatedTime:this.ruleForm.beginCreatedTime,
          endCreatedTime:this.ruleForm.endCreatedTime,
          applicant:this.ruleForm.applicant,
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          source:2
        }
        let auditStatus = [];
        // // 未审查0  已审核（包括通过和不通过）
        if(this.ruleForm.auditStatus === 0){
          auditStatus = [0]
        }else if(this.ruleForm.auditStatus === 1){
          auditStatus = [1,2]
        }
        param.auditStatuses = auditStatus;
        this.axios.post(this.$api.printHouseManage.printHouseList, param).then((res) => {
          let data = res.data.data,
              msg = res.data.message;
          if (msg == 'ok') {
            this.tableData = data.list;
            // for(let i=0;i<this.tableData.length;i++){
              // this.tableData[i].visible2 = false;
              // this.tableData[i].auditStatus = 2;
            // }
            this.total = data.total;
            console.log(this.tableData)
          } else {
            this.$message.error('查询失败：' + msg);
          }
        })
      },
      edit(row){
        this.$router.push({
          path:'/printHouse/printHouseEdit',
          query:{
            id:row.id,
            type:'update'
          }
        });
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
      // 审核通过
      pass(row){
        let param = {
          id:row.id,
          auditStatus:1,
        }
        this.axios.post(this.$api.printHouseManage.auditPrintHouse, param).then((res) => {
          let data = res.data.data,
              msg = res.data.message;
          if (msg == 'ok') {
            Message({
              type: 'success',
              message: '审核通过成功'
            });
            this.getData();
          } else {
            this.$message.error('提交失败：' + msg);
          }
        })
      },
      nopass(){
        let param = {
          id:this.id,
          auditStatus:2,
          auditNote:this.ruleForm1.cause
        }
        this.$refs['ruleForm1'].validate((valid, object)=>{
          if(valid){
            this.axios.post(this.$api.printHouseManage.auditPrintHouse, param).then((res) => {
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
