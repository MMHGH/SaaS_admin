<template>
    <div>
        <el-table
            border
            :data="tableData"
            :header-cell-style="{backgroundColor: '#f2f2f2'}"
            style="width: 100%">
            <el-table-column
                align="center"
                prop=""
                width=150
                type="index"
                label="序号">
                <template slot-scope="scope">
                    <span>{{scope.$index+(currentPageNumber - 1) * currentPageSize + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="hostId"
                label="机台号">
            </el-table-column>
            <el-table-column
                align="center"
                prop="machineId"
                label="设备id">
            </el-table-column>
            <el-table-column
                align="center"
                prop="activationCode"
                label="激活码">
            </el-table-column>
            <el-table-column
                align="center"
                prop="updatedTime"
                label="最近登录时间">
                <template slot-scope="scope">{{ scope.row.updatedTime | filterTime }}</template>
            </el-table-column>
            <el-table-column align="center" property="status" label="状态">
                <template slot-scope="scope">
                    {{scope.row.status === 1 ? '启用' : '禁用'}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" min-width="150">
                <template slot-scope="scope">
                    <el-button size="medium" type="text" @click="updateLevelStatus(scope.row)">{{scope.row.status === 1 ? "禁用" : "启用"}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            popper-class="pagination-popper"
            :current-page="currentPageNumber" 
            :page-size="currentPageSize"
            :page-sizes="[5, 10, 20, 50, 100]" 
            :total="currentTotal"
            layout="prev, pager, next, total, sizes, jumper"
            @current-change="pageNumberChange" 
            @prev-click="pageNumberChange"
            @next-click="pageNumberChange" 
            @size-change="pageSizeChange">
        </el-pagination>
    </div>
</template>
<script>
import util from '@/util/commonFn.js'
import { MessageBox,Message } from 'element-ui'

export default {
    data(){
      return {
        currentPageNumber: 1,
        currentPageSize: 10,
        currentTotal: null,
        tableData: []
      }
    },
    computed: {
    },
    mounted(){
     this.getData();
    },
    methods:{
        // 获取标签打印信息
        getData(){
            let that = this;
            this.$service.post({
                url: this.$api.userManagement.getListTag,
                params: {
                    pageNum: this.currentPageNumber,
                    pageSize: this.currentPageSize,
                    organId:parseInt(this.$route.query.organId)||''
                },
                successHook: (data,response) => {
                    let msg = response.data.message;
                    if(msg=='ok'){
                        that.tableData = response.data.data.list;
                        that.currentTotal = response.data.data.total;
                    }
                }
            })
        },
        // 当前页码改变刷新列表
        pageNumberChange(pageNumber){
            this.currentPageNumber = pageNumber
            this.getData();
        },
        // 当前每页数量改变刷新列表
        pageSizeChange(pageSize){
            this.currentPageNumber = 1
            this.currentPageSize = pageSize
            this.getData();
        },
        // 更改平台用户状态
        updateLevelStatus(row){
            let statusText = row.status == 0 ? "启用" : "禁用";
            this.$service.postWithConfirm({
                confirmText: '此操作将' + statusText + '该用户, 是否继续？',
                url: this.$api.userManagement.updateTagState,
                params: {machineId: row.machineId},
                successHook: () => {this.getData()},
                successMessage: '已成功' + statusText + '该类别',
                errorCloseHook: this.back
            })
        },
    },
    filters: {
        filterTime(val){
            if(!val){return}
            return util.transTime(val)
        }
    }
  }
</script>
<style type="text/css">
  
</style>
<style type="text/css" scoped>
  .el-pagination{text-align: center;padding-top: 20px;padding-bottom: 10px;}
 
</style>

