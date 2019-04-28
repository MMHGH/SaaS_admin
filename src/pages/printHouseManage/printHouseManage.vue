<template>
  <div class="printHouseManage">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限后台</el-breadcrumb-item>
        <el-breadcrumb-item>印刷厂管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="c-left">
        <el-tree ref="tree" 
            node-key="provinceId" 
            :data="treeData"
            accordion 
            :highlight-current="true" 
            default-expand-all
            @node-click="getUserListByLevel">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span v-if="node.data.label=='全部'"
                      style="color: #666666;font-weight: bold;">{{ node.label + `(${data.num})` }}
                </span>
                <span v-else
                      style="white-space: nowrap;">{{ node.label +  `(${data.num})`}}
                </span>
            </span>
          </el-tree>
      </div>
      <div class="c-right">
        <el-form :inline="true" :model="ruleForm" class="demo-form-inline">
          <el-form-item label="">
            <el-input v-model="ruleForm.name" size="small" placeholder="搜索印刷厂名称"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="ruleForm.source" size="small" placeholder="来源">
              <el-option label="全部来源" value=""></el-option>
              <el-option label="自建" :value="1"></el-option>
              <el-option label="用户添加" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="ruleForm.status" size="small" placeholder="状态">
              <el-option label="全部状态" value=""></el-option>
              <el-option label="已启用" :value="1"></el-option>
              <el-option label="已停用" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getData">查询</el-button>
          </el-form-item>
        </el-form>

        <el-button class="btn-add" type="primary" size="small" @click="orderDetail('','get')">添加印刷厂</el-button>
        <el-table :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}">
          <el-table-column align="center" prop="name" label="印刷厂名称"></el-table-column>
          <el-table-column align="center" prop="shortName" label="印刷厂简称"></el-table-column>
          <el-table-column align="center" prop="key" label="印刷厂ID"></el-table-column>
          <el-table-column align="center" prop="id" label="序列号"></el-table-column>

          <el-table-column align="center" prop="contacts" label="联系人"></el-table-column>
          <el-table-column align="center" prop="tel" label="联系电话"></el-table-column>
          <el-table-column align="center" prop="address" label="所在地"></el-table-column>

          <el-table-column align="center" prop="addressDetail" label="详细地址"></el-table-column>
          <el-table-column align="center" prop="remark" label="备注"></el-table-column>
          <el-table-column align="center" prop="source" label="来源">
             <template slot-scope="scope">
               <span>{{ scope.row.source==1?'自建':'用户添加' }}</span>
             </template>
          </el-table-column>
          <el-table-column align="center" prop="status" label="状态">
            <template slot-scope="scope">{{ scope.row.status | filterStatus }}</template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <!-- v-if="scope.row.status === 2" -->
              <el-button size="small" type="text" v-if="scope.row.status === 2" @click="orderDetail(scope.row,'update')">编辑</el-button>
              <el-button size="small" type="text" v-if="scope.row.status === 2"  @click="orderDetail(scope.row,'del')">删除</el-button>
              <el-button size="small" type="text"  @click="orderDetail(scope.row,'start')">{{scope.row.status === 2? "启用" : "停用"}}</el-button>
              <!-- <el-button size="small" type="text"  v-else @click="orderDetail(scope.row,'end')">停用</el-button> -->
              <el-button size="small" type="text"  @click="orderDetail(scope.row,'download')">下载授权文件</el-button>
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
    </div>
    <!-- 删除原因 -->
    <el-dialog title="" :visible.sync="dialogCause" width="400px" center>
      <span>请输入{{tips}}原因：</span>
      <el-form :inline="true" :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="120px"
               style="margin-top:10px;" class="demo-dynamic">
        <el-form-item label="" prop="cause">
          <el-input type="textarea" v-model="ruleForm1.cause" :rows="5"
                    placeholder="请输入不超过300个中文字符" style="width:350px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="tips == '删除'" @click="delUser">确 定</el-button>
        <el-button type="primary" v-else @click="endUser">确 定</el-button>
        <el-button @click="dialogCause = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { MessageBox,Message } from 'element-ui'
  import formatterURL from '@/util/formatterURL'
  
  export default {
    name: "printHouseManage",
    data() {
      return {
        dialogCause:false,
        selectTreeNode: '',
        treeData: [{
          label: '全部',
          num:'',
          children: []
        }],
        defaultProps: {
            label: 'name',
            children: 'childNodes',
            isLeaf: 'leaf'
        },
        ruleForm: {
         name:'',
         source:'',
         status:'',
         provinceId:'', 
         cityId:'' 
        },
        ruleForm1:{
          cause:''
        },
        rules1: {
          cause: [
            {required: true, max: 300, message: '请输入不超过300个中文字符', trigger: 'blur'}
          ],
        },
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        tips:''
      }
    },
    filters: {
      // 状态过滤器
      filterStatus(val) {
        let auditStatus = '';
        switch (Number(val)) {
          case 1:
            auditStatus = '已启用'
            break;
          case 2:
            auditStatus = '已停用'
            break;
        }
        return auditStatus
      }
    },
    mounted(){
      this.getData();
      this.getOrgTree();
    },
    methods: {
      /**
       * 查询
       */
      getData() {
        let param = {
          provinceId:this.ruleForm.provinceId || '',
          cityId:this.ruleForm.cityId || '',
          name:this.ruleForm.name,
          source:this.ruleForm.source,
          status:this.ruleForm.status,
          pageNum:this.pageNum,
          pageSize:this.pageSize
        }
        this.axios.post(this.$api.printHouseManage.printHouseList, param).then((res) => {
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
      getUserListByLevel(val){
        console.log(555,val)
        this.ruleForm.provinceId = val.provinceId;
        this.ruleForm.cityId = val.cityId;
        this.getData();         
      },
       // 查询组织树
      getOrgTree(){
          let that = this;
          let params = {
          }
          this.axios.post(this.$api.printHouseManage.printHouseListArea, params).then(function (res) {
              let code = res.data.code;  
              let data = res.data.data;
              let numAll = 0;
              if (code === 0) {
                  data.forEach(item => {
                    let citieList = [];
                    numAll += item.num;
                    for(let i =0;i<item.cities.length;i++){
                      citieList.push({label: item.cities[i].cityName,num:item.cities[i].num,cityId:item.cities[i].cityId});
                    }
                    console.log(citieList)
                    that.treeData[0].children.push({ label: item.provinceName,num:item.num,provinceId:item.provinceId,
                    children:citieList
                  });
                });
                that.treeData[0].num = numAll;
                console.log('总的数量',numAll)
              } else {
                  that.$message.error(res.data.message);
              }
          })
      },
        /**
         * 树节点 点击
         */
        handleNodeClick(data) {
            if (data.type == 1) {
               return 
            } 
            this.selectTreeNode = data;
            //  查询数据
           
        },
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
      orderDetail(row,type){
        switch(type){
          case 'get':
           this.$router.push({path:'/printHouse/printHouseEdit',query:{id:row.id,type:type}});
           break;
          case 'update':
           this.$router.push({path:'/printHouse/printHouseEdit',query:{id:row.id,type:type}});
           break;
          case 'del':
           this.delConfirm(row);
           break;
          case 'start':
           this.updateLevelStatus(row);
           break;
          case 'download':
           this.download(row);
           break;
        }
      },
      // 下载
      download(row){
        window.location.href = formatterURL.formatterURL(this.$api.printHouseManage.downloadPrintHouse) + '?id=' + row.id
      },
      // 更改用户状态
      updateLevelStatus(row){
        let that = this;
        let statusText = row.status == 1 ? "停用" : "启用";
        let url = row.status == 1 ?this.$api.printHouseManage.disablePrintHouse:this.$api.printHouseManage.enablePrintHouse; 
        this.$confirm('此操作将' + statusText + '该用户, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          if(row.status == 1 && row.source == 2){
            this.dialogCause = true;
            this.ruleForm1.cause = '';
            this.id = row.id;
            this.tips = '停用';
            return;
          }
          that.disablePrintHouse(row,statusText,url);
        })
      },
      // 普通启用/停用
      disablePrintHouse(row,text,url){
        let vm = this;
        let sendData = {
          id: row.id
        }
        vm.axios.post(url,sendData).then(function(respone){
          let msg = respone.data.message;
          if(msg=='ok'){
            Message({
              type: 'success',
              message: `已成功${text}该类别`
            });
            vm.getData();
          }
        })
      },
      // 用户来源停用
      endUser(){
        let vm = this;
        let sendData = {
          id: this.id,
          note : this.ruleForm1.cause
        }
        this.$refs['ruleForm1'].validate((valid, object)=>{
          if(valid){
            vm.axios.post(this.$api.printHouseManage.disablePrintHouse,sendData).then(function(respone){
              let msg = respone.data.message;
              if(msg=='ok'){
                Message({
                  type: 'success',
                  message: '已成功停用该类别'
                });
                vm.getData();
                vm.dialogCause = false;
              }
            })
          }
        })
      },
      delConfirm(row){
        this.$confirm(`确定要删除这家印刷厂吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 用户添加来源
          if(row.source == 2){
            this.id = row.id;
            this.dialogCause = true;
            this.ruleForm1.cause = '';
            this.tips = '删除';
          }else{
            this.del(row);
          }
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      del(row){
        let vm = this;
        let sendData = {
          id : row.id
        };
        vm.axios.post(vm.$api.printHouseManage.delPrintHouse,sendData).then(function(respone){
          let msg = respone.data.message
          if(msg=='ok'){
            Message({
              type: 'success',
              message: '删除成功'
            });
            vm.getData()
          }
        })
      },
      delUser(){
        let vm = this;
        let sendData = {
          id : this.id,
          note : this.ruleForm1.cause
        };
        this.$refs['ruleForm1'].validate((valid, object)=>{
          if(valid){
            vm.axios.post(vm.$api.printHouseManage.delPrintHouse,sendData).then(function(respone){
              let msg = respone.data.message;
              if(msg=='ok'){
                Message({
                  type: 'success',
                  message: '删除成功'
                });
                vm.getData();
                vm.dialogCause = false;
              }
            })
          }
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
  .printHouseManage {
    .content {
      padding: 0px 10px 10px 20px;
      .c-left {
        width: 200px;
        height: 100%;
        display: inline-block;
        float: left;
      }
      .c-right {
        margin-left: 200px;
        .btn-add {
          margin-bottom: 10px;
        }
        .pagination {
          text-align: center;
          margin-top: 5px;
        }
      }
    }
  }
</style>
