<template>
  <div class="createPrize">
    <div class="cheader">资源管理 / <span>自建奖品详情</span></div>
    <div class="content">
      <p><span>基本奖品信息</span></p>
      <div class="createForm">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
          <el-form-item label="奖品名称" prop="name">
            <el-input v-model="ruleForm.name" style="width:300px;" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="奖品图片" >
            <el-upload
              name="fileName"
              :disabled="true"
              :action="imgApi"
              :headers="{ 'Authorization': Authorization }"
              list-type="picture-card"
              :file-list="fileList">
              <i class="el-icon-plus"></i>
            </el-upload>
            <span>建议尺寸：800*800像素，支持 JPG、PNG，大小不超过100K</span>
          </el-form-item>
          <el-form-item label="奖品规格" prop="unit">
            <el-input v-model="ruleForm.unit" style="width:300px;" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="奖品库存" prop="upInventory">
            <span>{{ruleForm.inventory}}</span>
            <!--<el-input v-model="ruleForm.inventory" style="width:300px;"></el-input>-->
            <el-input-number v-model="ruleForm.upInventory" :min="-ruleForm.inventory" :max="999999" maxlength="9"
                             label="奖品库存" :disabled="true"></el-input-number>
          </el-form-item>
          <el-form-item label="奖品说明" prop="description">
            <el-input type="textarea" v-model="ruleForm.description" :disabled="true" :rows="5"
                      placeholder="请输入不超过300个中文字符" style="width:400px;"></el-input>
          </el-form-item>
          <el-form-item label="是否需要运费" required v-if="false">
            <el-radio-group v-model="isNeedFreight" :disabled="true">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <!--v-if="isNeedFreight=='0'? false:true">-->
          <!--<div class="isNeedFreight" v-if="false">-->
            <!--<div id="area" v-for="n in areaAcount" :key="n">-->
              <!--<el-form-item label="适用地区" required>-->
                <!--<el-cascader-->
                  <!--:options="options"-->
                  <!--v-model="areas[n-1]">-->
                <!--</el-cascader>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="运费" required>-->
                <!--<el-form-item prop="price">-->
                  <!--<el-input v-model="price[n-1]" style="width:100px;"></el-input> 元 <br>-->
                <!--</el-form-item>-->
              <!--</el-form-item>-->
            <!--</div>-->
            <!--<el-form-item>-->
              <!--<el-button type="text" @click="addArea">新增</el-button>-->
            <!--</el-form-item>-->
          <!--</div>-->
          <!--<el-form-item label="活动时间" required>-->
          <!--<el-col :span="4">-->
          <!--<el-form-item prop="planOnsaleTime">-->
          <!--<el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="开始日期" v-model="planOnsaleTime" style="width:200px;"></el-date-picker>-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col class="line" :span="1" style="padding-left:10px">-</el-col>-->
          <!--<el-col :span="4">-->
          <!--<el-form-item prop="planOffsaleTime">-->
          <!--<el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="结束日期" v-model="planOffsaleTime" style="width:200px;"></el-date-picker>-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <!--</el-form-item>-->
          <el-form-item>
            <el-button type="primary" @click="loadPage('last')">上一个</el-button>

            <el-button type="primary" @click="checkPrize(1)"
                       v-if="ruleForm.status===4 || ruleForm.status===5">通过</el-button>
            <el-button type="primary" @click="checkPrize(2)"
                       v-if="ruleForm.status!==5">不通过</el-button>

            <el-button type="primary" @click="loadPage('next')">下一个</el-button>
            <el-button type="primary" @click="$router.push({path:'/myAwardList'})">返回列表</el-button>
          </el-form-item>
        </el-form>
        <br><br><br>
      </div>
    </div>
  </div>
</template>
<script>
  import { Message,MessageBox } from 'element-ui';

  export default {
    name: 'createPrize',
    data(){
      return {
        ruleForm: {
          goodsId:'',
          status:'',
          name: '',
          unit: '',
          thumbImgUrl: '',
          inventory: '',
          upInventory: 0,
          description: ''
        },
        imgApi: '',   // 图片上传地址
        Authorization: sessionStorage.getItem('Authorization'),
        areas: [],
        price: [],
        fileList: [],
        isNeedFreight: '1',
        planOnsaleTime: '',
        planOffsaleTime: '',
        areaAcount: 1,    //用于循环输出'地区和运费'
        options: [{
          value: '8',
          label: '全国',
        },{
          value: '9',
          label: '广东省',
          children: [{
            value: '10',
            label: '深圳市'
          },{
            value: '11',
            label: '广州市'
          }]
        }],
        rules:{
          name: [
            {required: true, max: 30, message: '请输入奖品名称', trigger: 'blur'}
          ],
          unit: [
            {required: true, message: '请输入奖品规格', trigger: 'blur'}
          ],
          upInventory: [
            {required: true, message: '请输入奖品库存', trigger: 'blur'}
            // { validator: validateInventory, trigger: 'blur' }
          ],
          description: [
            {required: true, max: 300, message: '请输入不超过300个中文字符', trigger: 'blur'}
          ],
          // price: [
          //     {required: true, message: '请输入运费', trigger: 'blur'}
          // ],
          freight2: [
            {required: true, message: '请输入运费', trigger: 'blur'}
          ],
          planOnsaleTime: [
            {required: true, message: '请输入开始时间', trigger: 'blur'}
          ],
          planOffsaleTime: [
            {required: true, message: '请输入结束时间', trigger: 'blur'}
          ]
        },
        detailPageNum:0, // 详情页
        detailPageSize:0 // 详情总页数
      }
    },
    mounted(){
      // 查询详情
      this.getDetail('');
    },
    methods: {
      /**
       * 查询详情
       * */
      getDetail(pageNum){
        this.fileList = [];
        // 1.收集参数
        let detailIdx = location.hash ? location.hash.slice(location.hash.indexOf('?')+1).split('=')[1] : '';
        // let sendData = {
        //   name: '',
        //   createdUserTimeBegin: '',
        //   createdUserTimeEnd: '',
        //   status: '',
        //   user: '',
        //   pageNum: pageNum==''?detailIdx:pageNum,
        //   pageSize: 1,
        //   source:2  // 奖品类型：1 平台；2 自建
        // };

        // 查询条件
        let sendData = sessionStorage.getItem('detail_queryParam');
        sendData = JSON.parse(sendData);
        sendData.pageNum = pageNum==''?detailIdx:pageNum;
        sendData.pageSize = 1;
        console.log(sendData);

        // 2.发起请求
        let vm = this
        this.axios.post(this.$api.award.listAwardByPage,sendData).then(function(respone){
          let data = respone.data.data,
            msg = respone.data.message;
          if(msg == 'ok'){
            // vm.ruleForm = data;
            vm.detailPageNum = data.pageNum;
            vm.detailPageSize = data.pages;

            if(data.list.length>0){
              let row = data.list[0];

              vm.ruleForm.goodsId = row.goodsId;
              vm.ruleForm.status = row.status;
              vm.ruleForm.name = row.name;
              vm.ruleForm.unit = row.unit;
              vm.ruleForm.inventory = row.inventory;
              vm.ruleForm.upInventory = 0;
              vm.ruleForm.description = row.description;
              vm.ruleForm.thumbImgUrl = row.thumbImgUrl;

              if(vm.ruleForm.thumbImgUrl){
                vm.fileList.push({name: 'img.png', url: vm.ruleForm.thumbImgUrl});
              }

              // 时间戳转日期
              let getDate = function(time){
                let date,y,m,d;
                date = new Date(time);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                y = date.getFullYear() + '-';
                m = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                d = date.getDate() + ' ';
                return y+m+d;
              }

              // vm.planOnsaleTime = getDate(row.planOnsaleTime);
              // vm.planOffsaleTime = getDate(row.planOffsaleTime);
              // console.log(vm.ruleForm)
            }
          }else{
            Message({
              type: 'error',
              message: msg
            });
          }
        }).catch(function(error){
          console.error(error)
        });
      },
      addArea(){  //新增地区
        this.areaAcount += 1
      },
      /**
       * 上一个、下一个
       */
      loadPage(type){
        if(type=='last'){
          if(this.detailPageNum<=1){
            this.$message.warning(`已经是第一页！`);
            return;
          }
          this.detailPageNum--;
          this.getDetail(this.detailPageNum);
        }else{
          if(this.detailPageNum==this.detailPageSize){
            this.$message.warning(`已经是最后一页！`);
            return;
          }
          this.detailPageNum++;
          this.getDetail(this.detailPageNum);
        }
      },
      /**
       * 审核
       */
      checkPrize(type){
        let vm = this;
        MessageBox.confirm('是否确定'+(type===1?'审核通过':'审核不通过')+'？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          let url = vm.$api.award.approval;//同意
          if(type === 2){
            url = vm.$api.award.refuse;//拒绝
          }
          vm.axios.post(url, {goodsId: vm.ruleForm.goodsId}).then(function(res){
            if(res.data.code == 0){
              Message({
                type: 'success',
                message: '审核成功'
              });
              vm.getDetail(vm.detailPageNum);
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
    }
  }

</script>
<style scoped>
  .createPrize .cheader{
    background: #ffffff;
    color: #000000;
    font-size: 16px;
  }
  .createPrize .cheader span{
    color: #0033FF;
    font-size: 16px;
  }
  .createPrize .content{
    margin-top: 10px;
  }
  .avatar-uploader .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }
  .createPrize{
    /* margin: 20px; */
    padding: 10px;
    background-color: #ffffff;
    /* border-radius: 10px; */
  }
  .content>p{
    display: flex;
    background-color: #f2f2f2;
    padding: 10px;
  }
  .content>p>span{
    flex: 1;
  }
  .cheader{
    padding: 10px;
    background-color: #f2f2f2;
  }
  .createForm{
    padding-top: 10px;
  }
</style>


