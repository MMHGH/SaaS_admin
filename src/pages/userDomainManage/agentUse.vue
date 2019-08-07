<template>
  <div>
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>用户域名管理</el-breadcrumb-item>
        <el-breadcrumb-item>代理商用户域名管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-tree ref="tree" node-key="levelId" :data="treeData" accordion :highlight-current="true" @node-click="getUserListByLevel"></el-tree>
        </el-col>
        <el-col :span="20">

          <el-form ref="filterForm" :model="filterForm" inline size="small" label-position="right" label-width="100px" label-suffix="：" :rules="filterFormRules">
            <el-row>
              <el-col :span="24">
                <el-form-item label="手机号码" prop="phone">
                  <el-input v-model="filterForm.phone" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="开始时间" prop="beginDate">
                  <el-date-picker v-model="filterForm.beginDate" placeholder="选择开始时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="endDate">
                  <el-date-picker v-model="filterForm.endDate" placeholder="选择结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                  <el-select v-model="filterForm.status">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="启用" value="Y"></el-option>
                    <el-option label="禁用" value="N"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="企业关键词" prop="organName">
                  <el-input v-model="filterForm.organName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item class="filter">
                  <el-button native-type="submit" type="primary" size="medium" @click.stop.prevent="searchData">搜索</el-button>
                  <el-button type="text" size="medium" @click="clearData">清空筛选条件</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <el-table empty-text="暂无数据，请选择平台用户等级" :data="tableData" size="medium"
                    :header-cell-style="{backgroundColor: '#f2f2f2'}" :cell-style="tableCellStyle">
            <el-table-column align="center" prop="account" label="账号"></el-table-column>
            <el-table-column align="center" property="regTime" label="注册时间">
              <template slot-scope="scope">{{$timestamp.getDateByTimestamp(scope.row.regTime)}}</template>
            </el-table-column>
            <el-table-column align="center" property="type" label="用户类型">
              <template slot-scope="scope">{{ scope.row.type | filterType }}</template>
            </el-table-column>
            <el-table-column align="center" property="organName" label="企业名称" min-width="170"></el-table-column>
            <el-table-column align="center" label="设置" min-width="270">
              <template slot-scope="scope">
                <el-button size="medium" type="text" @click="funConfig(scope.row)">配置</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        userLevel: {
          type: '',
          organId: ''
        },
        pageNum: 1,
        pageSize: 10,
        total: 0,
        treeData: [{
          label: '平台用户等级',
          children: []
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        filterForm: {
          status: '',
          phone: null,
          beginDate: null,
          endDate: null,
          organName: null,
        },
        filterFormRules: {},
        tableData: [],
      }
    },
    mounted(){
      this.getAgentsList()
      setTimeout(() => {
        this.getUserDataByOrganId()
      }, 500);
    },
    methods: {
      // 跳转到配置页面
      funConfig(row){
        this.$router.push({path: 'userDomainConfig', query: {
            userId: row.id
          }})
      },
      getAgentsList(){
        // 1.sendData
        let sendData = {};

        // 2.post
        let vm = this
        this.axios.post(this.$api.agentsList.supperManaListAgents,sendData).then(function(respone){
          let msg = respone.data.message;
          let data = respone.data.data;
          if(msg == 'ok'){
            data.forEach(item => {
              vm.treeData[0].children.push({ label: item.organName, organId:item.organId,children:[
                  {
                    label: '个人用户',
                    type: 1,
                    organId: item.organId
                  },
                  {
                    label: '企业用户',
                    type: 2,
                    organId: item.organId
                  },
                  {
                    label: '集团用户',
                    type: 3,
                    organId: item.organId
                  },
                  {
                    label: '代理商',
                    type: 4,
                    organId: item.organId
                  }
                ] });
            });
            vm.userLevel.type = 1;
            vm.userLevel.organId = data[0].organId
          }
        }).catch(function(error){
          console.error(error);
        });
      },
      getUserListByLevel(val){
        for(let item in val ){
          if( item == 'type' ){
            // console.log( val.type,val.organId )
            this.userLevel.type = val.type;
            this.userLevel.organId = val.organId;

            setTimeout(() => {
              this.getUserDataByOrganId();
            }, 500);
          }
        }
      },
      getUserDataByOrganId(){
        // 1.sendData
        let sendData = {
          organId: this.userLevel.organId,
          type: this.userLevel.type,
          status: this.filterForm.status,
          phone: this.filterForm.phone,
          beginDate: this.filterForm.beginDate,
          endDate: this.filterForm.endDate,
          organName: this.filterForm.organName
        };

        // 2.post
        let vm = this
        this.axios.post(this.$api.agentsList.supperManaListAgentUserByType,sendData).then(function(respone){
          let msg = respone.data.message;
          let data = respone.data.data;
          if(msg == 'ok'){
            vm.tableData = data.list
            vm.pageNum = data.pageNum;
            vm.pageSize = data.pageSize;
            vm.total = data.total;
          }else{
            console.error(msg)
            vm.tableData = []
          }
        }).catch(function(error){
          console.error(error);
        });

      },
      searchData(){
        this.pageNum = 1
        this.getUserDataByOrganId()
      },
      clearData(){
        this.$refs['filterForm'].resetFields()
      },
      tableCellStyle({row, column, rowIndex, columnIndex}) {
        if(column.property === 'userLevelName') {
          return {color: '#409EFF'}
        }
      },
      handleSizeChange(val){
        this.pageNum = 1
        this.pageSize = val
        this.getUserDataByOrganId()
      },
      handleCurrentChange(val){
        this.pageNum = val
        this.getUserDataByOrganId()
      }
    },
    filters: {
      filterType(val){
        if(!val){return}
        let type = ''
        switch(val){
          case 1:
            type = '个人';
            break;
          case 2:
            type = '企业';
            break;
          case 3:
            type = '集团';
            break;
          case 4:
            type = '代理商';
            break;
        }
        return type
      }
    }
  }
</script>
<style type="text/css" scoped>
  .el-table{border: none;margin-top: 10px;text-align: center;}
  .el-table:after{background-color: transparent;}
  .el-table th{text-align: center;}
  .el-pagination{text-align: center;padding-top: 20px;padding-bottom: 10px;}
</style>

