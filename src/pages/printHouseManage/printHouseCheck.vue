<template>
  <div class="printHouseCheck">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限后台</el-breadcrumb-item>
        <el-breadcrumb-item>印刷厂审核</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="开始时间" prop="beginTime">
          <el-date-picker v-model="formInline.beginTime" class="input-txt" size="small" type="date"
                          value-format="yyyy-MM-dd" placeholder="选择开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="formInline.endTime" class="input-txt" size="small" type="date"
                          value-format="yyyy-MM-dd" placeholder="选择结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="formInline.region" size="small" class="input-txt" placeholder="审核状态">
            <el-option label="全部" value="1"></el-option>
            <el-option label="未审核" value="2"></el-option>
            <el-option label="已审核" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请人" prop="region">
          <el-input v-model="formInline.region" size="small" placeholder="请输入申请人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getData">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}">
        <el-table-column align="center" prop="orderNo" label="申请人"></el-table-column>
        <el-table-column align="center" prop="orderNo" label="申请企业"></el-table-column>
        <el-table-column align="center" prop="orderNo" label="印刷厂名称"></el-table-column>
        <el-table-column align="center" prop="orderNo" label="印刷厂简称"></el-table-column>

        <el-table-column align="center" prop="orderNo" label="联系人"></el-table-column>
        <el-table-column align="center" prop="orderNo" label="联系电话"></el-table-column>
        <el-table-column align="center" prop="orderNo" label="所在地"></el-table-column>

        <el-table-column align="center" prop="orderNo" label="详细地址"></el-table-column>
        <el-table-column align="center" prop="orderNo" label="备注"></el-table-column>
        <el-table-column align="center" prop="receivedTime" label="申请时间">
          <template slot-scope="scope">{{ $timestamp.getTimeByTimestamp(scope.row.receivedTime)}}</template>
        </el-table-column>
        <el-table-column align="center" property="status" label="审核状态">
          <template slot-scope="scope">{{ scope.row.status | filterStatus }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <div v-if="0">
              <el-button size="small" type="text" @click="edit(scope.row)">编辑</el-button>
              <el-button size="small" type="text" @click="pass(scope.row)">审核通过</el-button>
              <el-button size="small" type="text" @click="dialogCause = true">审核不通过</el-button>
            </div>
            <div v-else-if="2">
              <el-button  v-popover:popover5 type="text">审核</el-button>
              <el-popover
                ref="popover5"
                placement="bottom"
                width="160"
                v-model="visible2">
                <div style="text-align:center;">
                  <el-button type="primary" style="margin-bottom:5px;" @click="pass">审核通过</el-button>
                  <el-button  @click="dialogCause = true">审核不通过</el-button>
                </div>
              </el-popover>
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
  export default {
    name: "printHouseCheck",
    data() {
      return {
        dialogCause:false,
        visible2: false,
        formInline: {
          user: '',
          region: '',
          status: '',
          beginTime: '',
          endTime: ''
        },
        ruleForm1: {
          cause: ''
        },
        rules1: {
          cause: [
            {required: true, max: 300, message: '请输入不超过300个中文字符', trigger: 'blur'}
          ],
        },
        tableData: [
          {
           orderNo:'11' 
          }
        ],
        pageNum: 1,
        pageSize: 10,
        total: 0,
      }
    },
    filters: {
      filterStatus(val){
        if(!val){return}
        let sta = '';
        //状态：1 启用 2 禁用 3 已上架 4 审批中 5 审批不通过
        switch(val){
          case 1:
            sta = '启用';
            break;
          case 2:
            sta = '禁用';
            break;
          case 3:
            sta = '已上架';
            break;
          case 4:
            sta = '审批中';
            break;
          case 5:
            sta = '审批不通过';
            break;
        }
        return sta
      }
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
            for(let i =0;i<data.list.length;i++){
              this.tableData[i].content = JSON.parse(data.list[i].content);
            }
            this.total = data.total;
          } else {
            this.$message.error('查询失败：' + msg);
          }
        })
      },
      edit(row){
        this.$router.push({
          path:'/printHouse/printHouseEdit',
          query:{
            id:row.id
          }
        });
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
