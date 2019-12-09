<template>
  <div class="yxOrderManage form-unify">
    <div class="mat-header">资源管理 / <span>图文审核</span></div>
    <div class="body">
      <!-- 查询条件 -->
      <div class="mateForm">
        <el-form :inline="true" :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-form-inline">
          <el-form-item prop="createdBeginTime" label="建立开始时间：">
            <el-date-picker
              v-model="ruleForm.createdBeginTime"
              type="datetime"
              size="small"
              value-format="timestamp"
              style="width: 215px;"
              placeholder="请选择建立开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="createdEndTime" label="建立结束时间：">
            <el-date-picker
              v-model="ruleForm.createdEndTime"
              type="datetime"
              size="small"
              value-format="timestamp"
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
          <el-form-item label="页面：" prop="scene">
            <el-select v-model="ruleForm.scene" placeholder="页面" size="small">
                <el-option
                    v-for="item in pageList"
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
            <el-table-column align="center" property="scene" label="所在页面">
              <template slot-scope="scope">{{ scope.row.scene | fmtPage()}}</template>
            </el-table-column>
            <el-table-column align="center" property="status" label="状态">
              <template slot-scope="scope">{{ scope.row.status | fmtStatus()}}</template>
            </el-table-column>
            <el-table-column align="center" prop="censoredNote" label="审核意见"></el-table-column>
            <el-table-column
                align="center"
                prop="operation"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="lookDetail(scope.row, scope.$index)" >查看</el-button>
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
          scene: '',
          context:'',
          createdBeginTime: '',
          createdEndTime: ''
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
        pageList: [
          {label: '全部页面', value: ''},
          {label: '品牌主页', value: 1},
          {label: '防伪验真配置', value: 2},
          {label: '资讯公告', value: 3},
          {label: '商品详情配置', value: 4},
          {label: '会员中心', value: 5},
          {label: '自定义模板', value: 6},
          {label: '视频展示', value: 7},
          {label: '发展历程', value: 8},
          {label: '商品动态', value: 17},
          {label: '商品证书', value: 18},
          {label: '商品列表', value: 9},
          {label: '商品分类', value: 10},
          {label: '活动管理', value: 11},
          {label: '活动管理-奖品基本设置', value: 12},
          {label: '静态溯源模板设置', value: 13},
          {label: '活动推广', value: 15},
          {label: '商品分享', value: 16},
          {label: '精准放奖活动', value: 19},
          {label: '广告投放', value: 20},
        ],
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
          case 0:
           auditStatus = '未审核'
           break;
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
      },
      fmtPage(val) {
        let pageName = '';
        switch(Number(val)){
          case 1:
           pageName = '品牌主页'
           break;
          case 2:
           pageName = '防伪验真配置'
           break;
          case 3:
           pageName = '资讯公告'
           break;
          case 4:
           pageName = '商品详情配置'
           break;
          case 5:
           pageName = '会员中心'
           break;
          case 6:
           pageName = '自定义模板'
           break;
          case 7:
           pageName = '视频展示'
           break;
          case 8:
           pageName = '发展历程'
           break;
          case 9:
           pageName = '商品列表'
           break;
          case 10:
           pageName = '商品分类'
           break;
          case 11:
           pageName = '活动管理'
           break;
          case 12:
           pageName = '活动管理-奖品基本设置'
           break;
          case 13:
           pageName = '静态溯源模板设置'
           break;
          case 15:
           pageName = '活动推广'
           break;
          case 16:
           pageName = '商品分享'
           break;
          case 17:
           pageName = '商品动态'
           break;
          case 18:
           pageName = '商品证书'
           break;
          case 19:
           pageName = '精准放奖活动'
           break;
          case 20:
           pageName = '广告投放'
           break;
        }
        return pageName
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
          scene: this.ruleForm.scene,
          context: this.ruleForm.context,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
        this.axios.post(this.$api.auditDetails.getImageList, param).then((res) => {
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
<style>
.form-unify  .el-input__inner{
    height:32px;
}
</style>
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
