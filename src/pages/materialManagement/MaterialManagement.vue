<template>
  <div class="material-management-wrapper">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item>权限后台</el-breadcrumb-item>
        <el-breadcrumb-item>物资管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <h1 style="display: inline-block;font-weight: 400;margin-bottom: 10px;line-height: 40px;border-bottom: 1px solid #409eff;">资源商城管理</h1>
      <el-form ref="filterForm" :model="filterForm" inline size="small" label-position="right" label-width="100px" label-suffix="：" :rules="filterFormRules" style="background: #f2f2f2;padding-top: 20px;">
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="filterForm.name" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="time">
          <el-date-picker v-model="filterForm.beginDate" placeholder="选择开始时间" value-format="timestamp"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="time">
          <el-date-picker v-model="filterForm.endDate" placeholder="选择结束时间" value-format="timestamp"></el-date-picker>
        </el-form-item>
        <el-form-item label="类别" prop="classId">
          <el-select v-model="filterForm.classId">
            <el-option label="全部" value="">全部</el-option>
            <el-option label="异业资源" value="1">异业资源</el-option>
            <el-option label="话费资源" value="2">话费资源</el-option>
            <el-option label="微信红包" value="3">微信红包</el-option>
            <el-option label="实物奖品" value="4">实物奖品</el-option>
            <el-option label="电影票" value="5">电影票</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="filterForm.status">
            <el-option label="全部" value="">全部</el-option>
            <el-option label="启用" value="1">启用</el-option>
            <el-option label="禁用" value="2">禁用</el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 100px;">
          <el-button style="margin-left: 1em;width: 6em;" native-type="submit" type="primary" size="medium" @click.stop.prevent="searchData">筛选</el-button>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 1em;width: 6em;" type="text" size="medium" @click.stop.prevent="clearData">清空筛选条件</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" style="margin: 10px 0;" @click="addMaterial">新建资源</el-button>
      <el-table :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}">
        <el-table-column align="center" prop="name" label="资源名称"></el-table-column>
        <el-table-column align="center" property="createdTime" label="创建时间">
          <template slot-scope="scope">{{ scope.row.createdTime | filterTime }}</template>
        </el-table-column>
        <el-table-column align="center" property="classId" label="类别">
          <template slot-scope="scope">{{ scope.row.classId | filterClassId }}</template>
        </el-table-column>
        <el-table-column align="center" property="price" label="价格(元)"></el-table-column>
        <el-table-column align="center" property="status" label="当前状态">
          <template slot-scope="scope">{{ scope.row.status | filterStatus }}</template>
        </el-table-column>
        <el-table-column align="center" property="planOnsaleTime" label="上架时间">
          <template slot-scope="scope">{{ scope.row.planOnsaleTime | filterTime }}</template>
        </el-table-column>
        <el-table-column align="center" property="inventory" label="库存数量"></el-table-column>
        <el-table-column align="center" property="planOffsaleTime" label="下架时间">
          <template slot-scope="scope">{{ scope.row.planOffsaleTime | filterTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="设置" min-width="200px">
          <template slot-scope="scope">
            <el-button size="medium" type="text" @click="updateStock(scope.row)">修改库存</el-button>
            <el-button size="medium" type="text" @click="updateMaterial(scope.row)">配置</el-button>
            <el-button size="medium" type="text" @click="enRow(scope.row)" v-if="scope.row.status===2">启用</el-button>
            <el-button size="medium" type="text" @click="disRow(scope.row)" v-else>禁用</el-button>
            <el-button size="medium" type="text" @click="recommendRow(scope.row)" v-if="scope.row.isRecommend==0">推荐</el-button>
            <el-button size="medium" type="text" @click="unRecommendRow(scope.row)" v-else>取消推荐</el-button>
            <el-button size="medium" type="text" @click="delRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
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

      <el-dialog title="修改库存" :visible.sync="dialogFormVisible">
        <el-table :data="stockData">
          <el-table-column property="name" label="资源名称" width="150" align="center"></el-table-column>
          <el-table-column property="inventory" label="当前库存数量" width="200" align="center"></el-table-column>
          <el-table-column property="" label="修改库存" align="center">
            <template slot-scope="scope">
              <!-- <el-input size="small" style="width: 60%;" v-model="inventoryNum"></el-input> -->
              <el-input-number v-model="inventoryNum" :min="-scope.row.inventory" size="mini"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveInven">保存</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import util from '@/util/commonFn.js'
import { MessageBox,Message } from 'element-ui'

  export default {
    data(){
      return {
        dialogFormVisible: false,
        form: {},
        stockData: [],
        inventoryNum: '',
        tableRules: {},
        filterForm: {
          name: '',
          beginDate: '',
          endDate: '',
          classId: '',
          status: '',
        },
        filterFormRules: {},
        tableData: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      }
    },
    mounted(){
      this.getData()
    },
    methods:{
      // 跳转到新建资源页面
      addMaterial(){
        this.$router.push({name: 'AddMaterial'})
      },
      // 跳转到修改资源页面
      updateMaterial(row){
        sessionStorage.setItem('supperGoodsId',row.id);
        setTimeout(() => {
          this.$router.push({name: 'UpdateMaterial'})
        }, 500);
      },
      // 修改库存
      updateStock(row){
        this.dialogFormVisible = true;
        this.stockData.length = 0;
        // 1.sendData
        let sendData = {   //库存详情
          id: row.id
        };

        // 2.post
        let vm = this
        this.axios.post(this.$api.goodsMana.supperManaInventoryDetail,sendData).then(function(respone){
          let msg = respone.data.message
          let data = respone.data.data
          if(msg == 'ok'){
            vm.stockData.push(data)
          }
        }).catch(function(error){
          console.error(error)
        });
      },
      //保存库存
      saveInven(){
        // 判断

        // 1.sendData
        let sendData = {   //修改库存
          id: this.stockData[0].id,
          num: this.inventoryNum
        };

        // console.log( sendData ); return;

        // 2.post
        let vm = this
        this.axios.post(this.$api.goodsMana.supperManaUpdateGoodsInventory,sendData).then(function(respone){
          let msg = respone.data.message
          if(msg == 'ok'){
            Message({
              type: 'success',
              message: '修改成功'
            });
            vm.getData();
            setTimeout(() => {
              vm.dialogFormVisible = false
            }, 500);
          }else{
            console.error(msg)
          }
        }).catch(function(error){
          console.error(error)
        });

        //关闭
        setTimeout(() => {
          this.dialogFormVisible = false
        }, 500);
      },
      // 筛选
      searchData(){
        // this.$refs['filterForm'].validate((valid, object)=>{
        //   if(valid){}
        // })
        this.pageNum = 1
        this.getData()
      },
      clearData(){
        this.filterForm.name = ''
        this.filterForm.classId = ''
        this.filterForm.status = ''
        this.filterForm.beginDate = ''
        this.filterForm.endDate = ''
      },
      //初始化数据
      getData(){
        // 1.sendData
        let sendData = {
          name: this.filterForm.name,
          source: 1,
          classId: this.filterForm.classId,
          status: this.filterForm.status,
          beginDate: this.filterForm.beginDate,
          endDate: this.filterForm.endDate ? this.filterForm.endDate+86399000:this.filterForm.endDate,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        };

        // 2.post
        let vm = this
        this.axios.post(this.$api.goodsMana.supperManaListGoods,sendData).then(function(respone){
          let msg = respone.data.message
          let data = respone.data.data
          if(msg == 'ok'){
            vm.tableData = data.list;
            vm.total = data.total;
            vm.pageNum = data.pageNum;
            vm.pageSize = data.pageSize;
          }else{
            console.error(msg)
            vm.tableData = []
          }
        }).catch(function(error){
          console.error(error)
        });
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.getData()
      },
      handleCurrentChange(val){
        this.pageNum = val;
        this.getData()
      },
      //禁用
      disRow(row){
        // 1.sendData
        let sendData = {
          list: [row.id]
        };

        // 2.post
        let vm = this
        this.$confirm(`确定要禁用`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          vm.axios.post(vm.$api.goodsMana.supperManaDisable,sendData).then(function(respone){
            let msg = respone.data.message
            if(msg=='ok'){
              Message({
                type: 'success',
                message: '禁用成功'
              });
              vm.getData()
            }else{
              console.error(msg)
            }
          }).catch(function(error){
            console.error(error)
          });
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      //启用
      enRow(row){
        // 1.sendData
        let sendData = {
          list: [row.id]
        };

        // 2.post
        let vm = this
        this.$confirm(`确定要启用`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          vm.axios.post(vm.$api.goodsMana.supperManaEnable,sendData).then(function(respone){
            let msg = respone.data.message
            if(msg=='ok'){
              Message({
                type: 'success',
                message: '启用成功'
              });
              vm.getData()
            }else{
              console.error(msg)
            }
          }).catch(function(error){
            console.error(error)
          });
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      // del
      delRow(row){
        // 1.sendData
        let sendData = {
          list: [row.id]
        };

        // 2.post
        let vm = this
        this.$confirm(`确定要删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          vm.axios.post(vm.$api.goodsMana.supperManaDeleteGoods,sendData).then(function(respone){
            let msg = respone.data.message
            if(msg=='ok'){
              Message({
                type: 'success',
                message: '删除成功'
              });
              vm.getData()
            }else{
              console.error(msg)
            }
          }).catch(function(error){
            console.error(error)
          });
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //推荐
      recommendRow(row){  //supperManaRecommend
        // 1.sendData
        let sendData = {
          list: [row.id]
        };

        // 2.post
        let vm = this
        this.$confirm(`确定要推荐?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          vm.axios.post(vm.$api.goodsMana.supperManaRecommend,sendData).then(function(respone){
            let msg = respone.data.message
            if(msg=='ok'){
              Message({
                type: 'success',
                message: '推荐成功'
              });
              vm.getData()
            }else{
              console.error(msg)
            }
          }).catch(function(error){
            console.error(error)
          });
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      //取消推荐
      unRecommendRow(row){
        // 1.sendData
        let sendData = {
          list: [row.id]
        };

        // 2.post
        let vm = this
        this.$confirm(`确定要取消推荐?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          vm.axios.post(vm.$api.goodsMana.supperManaCancelRecommend,sendData).then(function(respone){
            let msg = respone.data.message
            if(msg=='ok'){
              Message({
                type: 'success',
                message: '取消推荐成功'
              });
              vm.getData()
            }else{
              console.error(msg)
            }
          }).catch(function(error){
            console.error(error)
          });
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消操作'
          });
        });
      }
    },
    filters: {
      filterTime(val){
        if(!val){return}
        return util.transTime(val)
      },
      filterClassId(val){
        if(!val){return}
        let classId = ''
        switch(val){
          case 1:
          classId = '异业资源';
          break;
          case 2:
          classId = '话费资源';
          break;
          case 3:
          classId = '微信红包';
          break;
          case 4:
          classId = '实物奖品';
          break;
          case 5:
          classId = '电影票';
          break;
        }
        return classId
      },
      filterStatus(val){
        if(!val){return}
        // 1启用 2禁用 3已上架 4待审批
        if(val==1){
          return '启用'
        }else if( val==2 ){
          return '禁用'
        }else if( val==3 ){
          return '已上架'
        }else if( val==4 ){
          return '待审批'
        }
      }
    }
  }
</script>
<style type="text/css">
  .material-management-wrapper .el-form--inline .el-form-item__content{width: 150px;}
  .material-management-wrapper .el-input--suffix .el-input__inner{padding: 0 15px;}
  .material-management-wrapper .el-form--inline .filter.el-form-item{width: 100%;padding-left: 15px;}
  .material-management-wrapper .el-form--inline .filter.el-form-item .el-form-item__content{width: 100%;}
  .material-management-wrapper .el-date-editor.el-input, .el-date-editor.el-input__inner{width: 100%;}
  .material-management-wrapper .el-input--suffix.el-date-editor .el-input__inner{text-indent: 20px;}

  .material-management-wrapper .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell{padding-left: 0;}
  .material-management-wrapper .el-table .cell, .el-table th div{padding-right: 0;white-space: nowrap;}
</style>
<style type="text/css" scoped>
  .el-table{border: none;margin-top: 10px;text-align: center;}
  .el-table:after{background-color: transparent;}
  .el-table th{text-align: center;}
  .el-pagination{text-align: center;padding-top: 20px;padding-bottom: 10px;}
</style>

