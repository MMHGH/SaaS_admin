<template>
    <div>
        <el-button type="primary" style="margin-bottom: 10px;" @click="dialogVisible = true">新增设备</el-button>
        <el-table
            border
            :data="tableData"
            :header-cell-style="{backgroundColor: '#f2f2f2'}"
            style="width: 100%">
            <el-table-column
                align="center"
                width=150
                prop=""
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
                label="设备id(IMEI)">
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
            <el-table-column
                align="center"
                prop="createdTime"
                label="新增日期">
                <template slot-scope="scope">{{ scope.row.createdTime | filterTime }}</template>
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
        <el-dialog
            title=""
            :visible.sync="dialogVisible"
            width="500px"
            top=25vh
            :show-close=false
            :close-on-click-modal="false"
            center>
            <el-form  :model="form">
                <el-form-item label="PDA唯一设备号(IMEI)：">
                    <el-input type="tel" v-model.trim="form.facility" maxlength=15 placeholder="15位数字"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addMaterial">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
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
        tableData: [],
        dialogVisible:false,
        form:{
            facility:''
        }
      }
    },
    computed: {

    },
    mounted(){
     this.getPdaData();
    },
    methods:{
        // 获取标签打印信息
        getPdaData(){
            let that = this;
            this.$service.post({
                url: this.$api.userManagement.getListPdaManage,
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
            this.getPdaData();
        },
        // 当前每页数量改变刷新列表
        pageSizeChange(pageSize){
            this.currentPageNumber = 1
            this.currentPageSize = pageSize
            this.getPdaData();
        },
        addMaterial(){
            let that = this;
            if(!this.form.facility){
                this.$message.warning(`请输入PDA唯一设备号(IMEI)！`);
                return
            }
            if(this.form.facility.length<15){
                this.$message.warning(`请输入15位数字！`);
                return
            }
            this.$service.post({
                url: this.$api.userManagement.addPdaManage,
                params: {
                    machineId:parseInt(this.form.facility),
                    organId:parseInt(this.$route.query.organId)||''
                },
                successHook: (data, response) => {
                    let msg = response.data.message
                    if(msg=='ok'){
                        Message({
                            type: 'success',
                            message: '添加成功'
                        });
                        that.dialogVisible = false;
                        that.form.facility = '';
                        that.getPdaData();
                    }
                }
            })
        },
        // 更改平台用户状态
        updateLevelStatus(row){
            let statusText = row.status == 0 ? "启用" : "禁用";
            this.$service.postWithConfirm({
                confirmText: '此操作将' + statusText + '该用户, 是否继续？',
                url: this.$api.userManagement.updatePdaState,
                params: {id: row.id,machineId: row.machineId},
                successHook: () => {this.getPdaData()},
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
  .el-input{
      width:250px;
  }
</style>

