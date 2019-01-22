<template>
  <div class="user-management-wrapper">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限后台</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>设备登录管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
        <el-tabs type="card" class="searchForm" v-model="active"  @tab-click="tabRouter">
            <el-tab-pane label="标签打印客户端登录信息" name="tally"></el-tab-pane>
            <el-tab-pane label="PDA手持设备登录信息" name="pda"></el-tab-pane>
        </el-tabs>
        <div class="mateTable">
            <tally-info  v-if="showTally"></tally-info>
            <facility-info  v-else></facility-info>
        </div>
    </div>
  </div>
</template>
<script>
import util from '@/util/commonFn.js'
import { MessageBox,Message } from 'element-ui'
import TallyInfo from '@/pages/userManagement/TallyInfo'
import FacilityInfo from '@/pages/userManagement/FacilityInfo'

export default {
    data(){
      return {
        active:'tally',
        showTally:true,
        showPda:false,
        currentPageNumber: 1,
        currentPageSize: 10,
        currentTotal: null,
        tableData: [],
      }
    },
    components:{
        TallyInfo,
        FacilityInfo
    },
    methods:{
       /**@method tab  */
        tabRouter() {
            switch (this.active) {
                case "tally":
                    this.showTally = true;
                    this.showPda = false;
                    break;
                case "pda":
                    this.showTally = false;
                    this.showPda = true;
                    break;
            }
        }
    }
  }
</script>
<style type="text/css">
  
</style>
<style type="text/css" scoped>
.el-pagination{text-align: center;padding-top: 20px;padding-bottom: 10px;}
.mateTable{
    margin-top:30px;
}
</style>

