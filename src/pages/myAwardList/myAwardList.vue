<template>
  <div class="material">
    <div class="mat-header">资源管理 / <span>自建奖品审核</span></div>
    <div class="mateForm">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" style="background: #f2f2f2;padding-top: 20px;">
        <el-form-item label="建立开始时间">
          <el-date-picker
            v-model="formInline.createdUserTimeBegin"
            type="date" size="small"
            value-format="timestamp"
            placeholder="建立开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="建立结束时间">
          <el-date-picker
            v-model="formInline.createdUserTimeEnd"
            type="date" size="small"
            value-format="timestamp"
            placeholder="建立结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="奖品名称：">
          <el-input v-model="formInline.name" placeholder="奖品名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="所属用户：">
          <el-input v-model="formInline.user" placeholder="所属用户" size="small"></el-input>
        </el-form-item>
        <el-form-item label="状态: ">
          <el-select v-model="formInline.status" placeholder="状态" size="small">
            <el-option label="全部" value="">全部</el-option>
            <!-- 状态：1启用 2禁用 3已上架 4审批中 5审批不通过 -->
            <!--<el-option label="启用" value="1">启用</el-option>-->
            <el-option label="禁用" value="2">禁用</el-option>
            <el-option label="已上架" value="3">已上架</el-option>
            <el-option label="审核中" value="4">审批中</el-option>
            <el-option label="审批不通过" value="5">审批不通过</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchData" size="small">筛选</el-button>
          <el-button type="text" @click="clearData" size="small">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="metaContent">
      <div class="mateTable">
        <el-table
          border
          :data="tableData"
          :header-cell-style="{backgroundColor: '#f2f2f2'}">
          style="width: 100%">
          <el-table-column
            align="center"
            prop="createdTime"
            label="建立时间">
            <template slot-scope="scope">{{ scope.row.createdTime | filterTime2 }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="createdTime"
            label="所属用户">
            <template slot-scope="scope">{{ scope.row.user}}</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="thumbImgUrl"
            label="奖品图片">
            <template slot-scope="scope"><img :src="scope.row.thumbImgUrl" alt=""></template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="name"
            label="奖品名称">
          </el-table-column>
          <el-table-column
            align="center"
            prop="status"
            label="状态">
            <template slot-scope="scope">{{ scope.row.status | filterStatus }}</template>
          </el-table-column>
          <!--<el-table-column
              align="center"
              prop="price"
              label="奖品有效期">
              <template slot-scope="scope">{{ scope.row.planOnsaleTime | filterTime }} 至 {{ scope.row.planOffsaleTime | filterTime }}</template>
          </el-table-column>-->
          <!--<el-table-column-->
            <!--align="center"-->
            <!--prop="inventory"-->
            <!--label="剩余库存">-->
          <!--</el-table-column>-->
          <el-table-column
            align="center"
            prop="operation"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="lookDetail(scope.row, scope.$index)" >查看详情</el-button>
              <el-button type="text" @click="checkPrize(scope.row,1)" v-if="scope.row.status===4 || scope.row.status===5">通过</el-button>
              <el-button type="text" @click="checkPrize(scope.row,2)" v-if="scope.row.status!==5">不通过</el-button>
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
</template>
<script>
  import {MessageBox,Message} from 'element-ui'
  import util from '@/util/commonFn.js'

  export default {
    name: 'material',
    data(){
      return {
        formInline: {
          name: '',
          createdUserTimeBegin: '',
          createdUserTimeEnd: '',
          status: '',
          user: ''
        },
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        queryParam: {}
      }
    },
    mounted(){
      this.getData();
    },
    methods: {
      getData(){
        // 格式化结束日期
        let endDt = '';
        if(this.formInline.createdUserTimeEnd!=""){
          endDt = new Date(this.formInline.createdUserTimeEnd);
          endDt.setDate(endDt.getDate()+1);
          endDt = endDt.getTime()-1;
        }
        // 1.收集参数
        let sendData = {
          name: this.formInline.name,
          createdUserTimeBegin: this.formInline.createdUserTimeBegin,
          createdUserTimeEnd: endDt,
          status: this.formInline.status,
          user: this.formInline.user,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          source:2  // 奖品类型：1 平台；2 自建
        };
        this.queryParam = sendData;

        // 2.发起请求
        let vm = this
        this.axios.post(this.$api.award.listAwardByPage,sendData).then(function(respone){
          let data = respone.data.data,
            msg = respone.data.message;
          if(msg == 'ok'){
            vm.tableData = data.list;
            vm.total = data.total;
            vm.pageNum = data.pageNum;
            vm.pageSize = data.pageSize;
          }
        }).catch(function(error){
          console.error(error)
        });
      },
      searchData(){
        this.getData();
      },
      handleSizeChange(val){
        this.pageNum = 1
        this.pageSize = val;
        this.getData();
      },
      handleCurrentChange(val){
        this.pageNum = val;
        this.getData();
      },
      lookDetail(row, idx){
        // 查询条件
        sessionStorage.setItem('detail_queryParam', JSON.stringify(this.queryParam));
        let detailIdx = ((this.pageNum * this.pageSize)+idx+1)-this.pageSize;
        this.$router.push({path:'/awardDetail?detailIdx='+detailIdx});
      },
      checkPrize(row, type){
        let vm = this;
        MessageBox.confirm('是否确定'+(type===1?'通过':'不通过')+'？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          let url = vm.$api.award.approval;//同意
          if(type === 2){
            url = vm.$api.award.refuse;//拒绝
          }
          vm.axios.post(url, {goodsId: row.goodsId}).then(function(res){
            if(res.data.code == 0){
              Message({
                type: 'success',
                message: '审核成功'
              });
              vm.getData();
            }else{
              Message({
                type: 'error',
                message: res.data.message
              });
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
      clearData(){
        this.formInline = {
            name: '',
            createdUserTimeBegin: '',
            createdUserTimeEnd: '',
            status: '',
            user: ''
        };
      },
    },
    filters: {
      filterTime(val){
        if(!val){return}
        return util.transTime(val).split(' ')[0]
      },
      filterTime2(val){
        if(!val){return}
        return util.transTime(val)
      },
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
    }
  }
</script>

<style scoped>
  .material>p{
    text-indent: 20px;
  }
  .mateForm,.metaContent{
    /*margin: 20px;*/
    padding: 0 20px 20px 20px;
    background-color: #ffffff;
    border-radius: 10px;
  }
  .mateForm form{
    padding-left: 10px;
  }
  .mateTable{
    min-height: 400px;
  }
  .mateTable img{
    width: 100px;
  }
  .page{
    text-align: center;
    margin-top: 10px;
  }
  .mat-header{
    background-color: #ffffff;
    margin: 15px 20px;
    font-size: 20px;
  }
  .mat-header span{
    color: #0033FF;
  }
  .top_info{
    margin: 10px 20px 0 20px;
    background: rgba(255, 247, 204, 1);
  }
  .left_size{
    color: #0033FF;
    margin-left: 20px;
  }
</style>
