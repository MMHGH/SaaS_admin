<template>
  <div class="yxOrderManage">
    <div class="mat-header">资源管理 / <span>审核记录</span></div>

    <div class="body">
      <!-- 查询条件 -->
      <div class="mateForm">
        <el-form :inline="true" :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-dynamic">
           <el-form-item prop="createdBeginTime" label="建立开始时间：">
                <el-date-picker
                    v-model="ruleForm.createdBeginTime"
                    type="datetime"
                    value-format="timestamp"
                    style="width: 200px;height:32px" 
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
          
          <el-form-item label="审核结果：" prop="status">
            <el-select v-model="ruleForm.status" placeholder="状态" size="small">
                <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核来源：" prop="source">
            <el-select v-model="ruleForm.source" placeholder="审核来源" size="small">
                <el-option
                    v-for="item in sourceList"
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
            <el-table-column align="center" property="createdTime" label="时间">
              <template slot-scope="scope">{{ $timestamp.getTimeByTimestamp(scope.row.createdTime)}}</template>
            </el-table-column>
            <el-table-column align="center" property="censored" label="审核结果">
              <template slot-scope="scope">{{ scope.row.censored | filterCensored }}</template>
            </el-table-column>
            <el-table-column align="center" prop="account" label="用户账号"></el-table-column>
            <el-table-column align="center" prop="companyName" label="企业名称"></el-table-column>
            <el-table-column align="center" property="content" label="审核内容">
              <template slot-scope="scope">
                  <el-button type="text" v-if="scope.row.contentType == 1" @click="lookDetail(scope.row, scope.$index)" >查看</el-button>
                  <a :href="scope.row.content.videoUrl" target="_blank" style="color: #409EFF;" v-else>{{scope.row.content.videoUrl}}</a>
              </template>
            </el-table-column>
            <el-table-column align="center" property="source" label="审核来源">
              <template slot-scope="scope">{{ scope.row.source==1?'自动审核':'人工审核' }}</template>
            </el-table-column>
            <el-table-column align="center" prop="censoredNote" label="审核意见"></el-table-column>
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

    <!-- 审核内容 -->
    <audit-content ref="audit" @getData="getData" @setAuditContent="setAuditContent" v-if="showAudit"  :auditData="auditData"></audit-content>
  </div>
</template>

<script>
  import Util from '../../util/timestamp'
  import auditContent  from "@/components/AuditContent"
 
  export default {
    data() {
      return {
        showAudit:false,
        auditData:'',
        ruleForm: {
          status: '',
          createdBeginTime: '',
          createdEndTime: '',
          context:'',
          source:''
        },
        statusList: [
          {label: '全部', value: ''},
          {label: '审核不通过', value: 0},
          {label: '审核通过', value: 1},
        ],
        sourceList: [
          {label: '全部', value: ''},
          {label: '自动审核', value: 1},
          {label: '人工审核', value: 2}
        ],
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
      }
    },
    filters: {
      // 状态过滤器
      filterCensored(val) {
        let auditStatus = '';
        switch(Number(val)){
          case 1:
           auditStatus = '审核通过'
           break;
          case 2:
           auditStatus = '自动审核不通过'
           break;
          case 3:
           auditStatus = '人工复审不通过'
           break;
        }
        return auditStatus
      }
    },
    components: {
      auditContent
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
          createdBeginTime: this.ruleForm.createdBeginTime,
          createdEndTime: this.ruleForm.createdEndTime,
          status: this.ruleForm.status,
          source: this.ruleForm.source,
          context: this.ruleForm.context,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
        this.axios.post(this.$api.auditDetails.getRecordList, param).then((res) => {
          let data = res.data.data, 
              msg = res.data.message;
          if (msg == 'ok') {
            this.tableData = data.list;
            this.total = data.total;
            for(let i =0;i<data.list.length;i++){
              if(data.list[i].contentType == 2){
                this.tableData[i].content = JSON.parse(data.list[i].content);
              }
            }
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
        this.auditData = row;
        this.showAudit = true;
        //调用子组件方法
        this.$nextTick(()=>{
          this.$refs.audit.initData();
          this.$refs.audit.setDialogAudit();
        })
      },
      setAuditContent(){
        this.showAudit = false;
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
