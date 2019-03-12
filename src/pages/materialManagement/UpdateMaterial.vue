<template>
  <div class="home-main-wrapper">
    <div class="header">
      <el-breadcrumb>
        <el-breadcrumb-item><span>权限后台</span></el-breadcrumb-item>
        <el-breadcrumb-item><span>编辑资源</span><span style="color: #606266;">（标注<i style="color: #F56C6C;">*</i>表示必填选项）</span></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="header">
      <div class="arrow">编辑积分资源信息</div>
    </div>
    <div class="main" style="position: relative;">
      <el-form ref="form" :model="form" :rules="formRules" size="small" label-position="right" label-width="150px" label-suffix="：" :disabled="formDisabled">
        <h1 style="font-weight: 400;line-height: 40px;background: #f2f2f2;margin-bottom: 10px;padding-left: 20px;">选择资源类型：</h1>
        <el-form-item prop="" style="margin-left: -100px;">
          <el-radio-group v-model="form.material" :disabled="!isEditInfo">
            <el-radio label="1" value="1">异业资源</el-radio>
            <el-radio label="2" value="2">话费资源</el-radio>
            <el-radio label="3" value="3">微信红包</el-radio>
            <el-radio label="4" value="4">实物奖品</el-radio>
            <el-radio label="5" value="5">电影票</el-radio>
            <el-radio label="8" value="8">方圆</el-radio>
          </el-radio-group>
        </el-form-item>
        <h1 style="font-weight: 400;line-height: 40px;background: #f2f2f2;margin-bottom: 10px;padding-left: 20px;">基本信息</h1>
        <el-form-item label="资源名称" prop="name" required>
          <el-input v-model="form.name" :disabled="!isEditInfo"></el-input>
        </el-form-item>
        <!-- <el-form-item label="分类" prop="category">
          <el-select v-model="form.category">
            <el-option label="优惠券" :value="1"></el-option>
            <el-option label="红包" :value="2"></el-option>
            <el-option label="积分" :value="3"></el-option>
            <el-option label="实物" :value="4"></el-option>
            <el-option label="话费" :value="5"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" :disabled="!isEditInfo"></el-input>
          <p style="display: inline-block;margin-left: 10px;color: #C0C4CC;">元</p>
        </el-form-item>
        <el-form-item label="虚拟物品价值" prop="value" v-show="form.material==8">
          <el-input v-model.number="form.value" :disabled="!isEditInfo"></el-input>
          <p style="display: inline-block;margin-left: 10px;color: #C0C4CC;">元</p>
        </el-form-item>
        <el-form-item label="虚拟物品价值" prop="value" v-show="form.material==2" >
          <!--<el-input v-model.number="form.value" :disabled="!isEditInfo"></el-input>-->
          <!--<p style="display: inline-block;margin-left: 10px;color: #C0C4CC;">分</p>-->
          <el-select v-model="form.value" placeholder="请选择虚拟物品价值">
            <el-option
              v-for="item in virtualValues"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="礼客币" prop="coin">
          <el-input v-model="form.coin"></el-input>
        </el-form-item> -->
        <el-form-item label="库存数量" prop="inventory">
          <el-input v-model="form.inventory" ></el-input>
        </el-form-item>
        <el-form-item label="单位"  prop="unit" required>
          <el-input v-model="form.unit" type="text" :disabled="!isEditInfo"></el-input>
        </el-form-item>
        <el-form-item label="设置上架时间" prop="planOnsaleTime" required>
          <el-date-picker :disabled="form.status==3 || !isEditInfo? true : false" v-model="form.planOnsaleTime" type="datetime" placeholder="设置上架时间" value-format="timestamp"></el-date-picker>
          <!-- <el-checkbox v-model="form.status"  style="margin-left: 10px;" @change="statusChange">立即上架</el-checkbox> -->
        </el-form-item>
        <el-form-item label="设置下架时间" prop="planOffsaleTime" required>
          <el-date-picker v-model="form.planOffsaleTime" type="datetime" placeholder="设置下架时间" value-format="timestamp"></el-date-picker>
        </el-form-item>
        <el-form-item label="上传缩略图" prop="" required>
          <el-upload style="display: inline-block;"
            name="fileName"
            :action = 'imgApi'
            list-type="picture-card"
            :show-file-list="true"
            :limit="1"
            :on-remove="thumbImgRemove"
            :file-list="thumbImglist"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess">
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog> -->
          <p style="display: inline-block;margin-left: 10px;color: #C0C4CC;vertical-align: top;">请上传小于20k的图片，支持jpg、png</p>
        </el-form-item>
        <el-form-item label="上传详情图" prop="" required>
          <el-upload style="display: inline-block;"
            :action = 'imgApi'
            name="fileName"
            list-type="picture-card"
            :show-file-list="true"
            :limit="1"
            :on-remove="imgsRemove"
            :before-upload="beforeAvatarUpload2"
            :on-success="handleAvatarSuccess2"
            :file-list="fileList">
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog> -->
          <p style="display: inline-block;margin-left: 10px;color: #C0C4CC;vertical-align: top;">请上传小于100K的图片，支持jpg、png</p>
        </el-form-item>
          <!-- <el-form-item label="适用地区" prop="province">
          <el-select v-model="form.province">
            <el-option label="全国" :value="1"></el-option>
            <el-option label="广东省" :value="2"></el-option>
            <el-option label="浙江省" :value="3"></el-option>
            <el-option label="福建省" :value="4"></el-option>
          </el-select>
          <el-select v-model="form.city" placeholder="请选择">
            <el-option label="深圳市" :value="1"></el-option>
            <el-option label="广州市" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 10px;" type="text" size="medium" @click="count+=1">添加</el-button>
        </el-form-item> -->
        <!-- <el-form-item label="设置标签" prop="label">
          <el-input v-model="form.label"></el-input>
        </el-form-item> -->
        <el-form-item label="使用须知" prop="description" required>
          <el-input v-model="form.description" :rows="3" type="textarea" :disabled="!isEditInfo"></el-input>
        </el-form-item>
        <!-- <h1 style="font-weight: 400;line-height: 40px;background: #f2f2f2;margin-bottom: 10px;padding-left: 20px;">关联URL：</h1>
        <el-form-item label="URL地址" prop="relationURL">
          <el-input v-model="form.relationURL"></el-input>
        </el-form-item> -->
        <el-form-item style="text-align: center;position: absolute;bottom: -20px;left: 0;right: 0;background: #ffff99;height: 42px;">
          <el-button native-type="submit" type="primary" size="small" @click.stop.prevent="subData('form')" style="position:relative;width: 10em;top: 4px;">提交保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { Message,MessageBox } from 'element-ui'

  export default {
    data(){
      var validatePrice1 = (rule, value, callback)=>{
               var regex =/^([0]|[1-9][0-9]{0,7})(\.\d{1,2})?$/g;
            if (!regex.test(value)){
             return callback(new Error('最多包含8位正整数和两位小数格式'));
          }

          callback()
        };
      var validatePrice2 = (rule, value, callback)=>{
        var regex =/^([0]|[1-9][0-9]{0,7})(\.\d{1,2})?$/g;
        if (!regex.test(value)){
          return callback(new Error('最多包含8位正整数和两位小数格式'));
        }

        callback()
      };
        var validateInventory = (rule, value, callback)=>{
          if (!Number.isInteger(Number(value))) {
             return callback(new Error('请输入整数'));
          }
          if (value<0) {
            return callback(new Error('请输入大于0的数'));
          }
          if( String(value).length > 9 ){
             return callback(new Error('最多只能输入9位'));
          }
          callback()
        };
        var validateUnit = (rule, value, callback)=>{
          if( String(value).length > 20 ){
             return callback(new Error('输入过长，最多20个字符'));
          }
          callback()
        };
      var validateOffTime = (rule, value, callback) => {
          if( value - this.form.planOnsaleTime < 0 ){
            return callback(new Error('下架时间不能小于上架时间'));
          }
          callback()
      };
      return {
        count: 1,
        sortCount: 1,
        imgApi: this.$api.uploadUrl,   // 图片上传地址
        thumbImgUrl: '',
        imgs: [],
        dialogVisible: false,
        fileList: [], //详情图展示
        thumbImglist:[],//缩略图展示
        form: {
         description:"",
          material: '1',
          name: '',
          price: '',
          value: '',
          inventory: '',
          unit: '',
          planOnsaleTime: '',
          planOffsaleTime: '',
          status: "",
        },
        isValue:false,
        isEditInfo:true, // 是否可以编辑其他信息，大于上架时间：只可修改库存和下架时间
        formDisabled: false,
        formRules: {
          name: [
            { required: true, message: '请输入资源名称', trigger: 'blur' },
            { max: 40, message: '长度最大40个字符', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请输入价格', trigger: 'blur' },
            { validator: validatePrice1, trigger: 'blur' }
          ],
          value: [
            { required: false, message: '请输入虚拟物品价值', trigger: 'blur' },
            { validator: (rule, value, callback)=>{
                callback()
              }, trigger: 'blur' }
          ],
          inventory: [
            { required: true, message: '请输入库存数量', trigger: 'blur' },
            { validator: validateInventory, trigger: 'blur' }
          ],
          planOnsaleTime: [
            { required: true, message: '请输入上架时间', trigger: 'blur' },
          ],
          planOffsaleTime: [
            { required: true, message: '请输入下架时间', trigger: 'blur' },
            { validator: validateOffTime, trigger: 'blur' }
          ],
          unit: [
            { required: true, message: '请输入单位', trigger: 'blur' },
            { validator: validateUnit, trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入使用须知', trigger: 'blur' }
          ]
        },
        virtualValues:[
          {value:1, label:'1元'},{value:2, label:'2元'},{value:3, label:'3元'},{value:4, label:'4元'},
          {value:5, label:'5元'},{value:6, label:'6元'},{value:7, label:'7元'},{value:8, label:'8元'},
          {value:9, label:'9元'},{value:10, label:'10元'},{value:20, label:'20元'},{value:30, label:'30元'},
          {value:50, label:'50元'},{value:100, label:'100元'},{value:200, label:'200元'},{value:300, label:'300元'},
          {value:500, label:'500元'}
        ]
      }
    },
    mounted(){
      this.getDetailData()
    },
    methods: {
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024  < 20;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG或png 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 20k!');
        }
        return isJPG && isLt2M;
      },

      beforeAvatarUpload2(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024  < 100;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG或png 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 100k!');
        }
        return isJPG && isLt2M;
      },


      handleAvatarSuccess(response, file, fileList) {
        this.thumbImgUrl = response.data;
      },

      handleAvatarSuccess2(response, file, fileList) {
        this.imgs.splice(0,1,{
          sort: this.sortCount,
          url: response.data
        })
        this.sortCount += 1;
         console.log( this.imgs )
      },

      thumbImgRemove(file, fileList){
              this.thumbImgUrl="";
      },

       imgsRemove(file, fileList){
               this.imgs=[];
      },

      // 列样式设置
      tableCellStyle({row, column, rowIndex, columnIndex}) {
        if(column.property === 'number') {
          return {color: '#409EFF'}
        }
      },
      subData(formName){
        let vm = this
        // 1. sendData
        console.log( "当前:"+vm.fileList );
        let sendData = {
          id: sessionStorage.getItem('supperGoodsId'),
          name: this.form.name,
          classId: this.form.material,
          price: this.form.price,
          unit: this.form.unit,
          inventory: this.form.inventory,
          planOnsaleTime: this.form.planOnsaleTime,
          planOffsaleTime: this.form.planOffsaleTime,
          status: this.form.status,
          description:this.form.description,
          thumbImgUrl: this.thumbImgUrl,
          imgs: vm.imgs
        };

        // console.log( sendData );return
       if(vm.imgs.length==0||this.thumbImgUrl==""){
         this.$message.error('详情图和缩略图不能为空');
         return;
       }

        // 2.post
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$service.post({
              url: vm.$api.goodsMana.supperManaUpdateGoods,
              params: sendData,
              successHook: (data, response) => {
                let msg = response.data.message
                if(msg=='ok'){
                  Message({
                    type: 'success',
                    message: '修改成功'
                  });
                  sessionStorage.removeItem('supperGoodsId');
                  setTimeout(() => {
                    vm.$router.push({ path: '/materialManagement' });
                  }, 500);
                }else{
                  console.error(msg)
                }
              }
            })


//            vm.axios.post(vm.$api.goodsMana.supperManaUpdateGoods,sendData).then(function(respone){
//              let msg = respone.data.message
//              if(msg=='ok'){
//                Message({
//                  type: 'success',
//                  message: '修改成功'
//                });
//                sessionStorage.removeItem('supperGoodsId');
//                setTimeout(() => {
//                  vm.$router.push({ path: '/materialManagement' });
//                }, 500);
//              }else{
//                console.error(msg)
//              }
//            }).catch(function(error){
//              console.error(error)
//            });





          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // getDetail
      getDetailData(){
        // 1.sendData
        let sendData = {
          id: sessionStorage.getItem('supperGoodsId')
        };

        // 2.post
        let vm = this
        this.$service.post({
          url: this.$api.goodsMana.supperManaDetail,
          params: sendData,
          successHook: (dataResource, response) => {
            let msg = response.data.message
            let data = response.data.data
            if(msg=='ok'){
              vm.form = data;
              vm.isValue = (data.classId==2 || data.classId==8)?true:false;
              vm.formRules.value[0].required= vm.isValue?true:false;
              if(vm.isValue){
                vm.formRules.value[1].validator= (rule, value, callback)=>{
                  var regex =/^([0]|[1-9][0-9]{0,7})(\.\d{1,2})?$/g;
                  if (!regex.test(value)){
                    return callback(new Error('最多包含8位正整数和两位小数格式'));
                  }
                  callback()
                };
              }else{
                vm.formRules.value[1].validator= (rule, value, callback)=>{
                  callback()
                };
              }
              console.log(this.formRules.value)

              // vm.form.material = String(data.classId);
              vm.$set(vm.form,'material',String(data.classId));
              vm.form.status = data.status;

              for(var i=0;i<data.imgs.length;i++){
                vm.fileList.push({"name":data.imgs[i].sort+"","url":data.imgs[i].url});
              }
              vm.imgs=data.imgs;
              vm.thumbImglist.push({"name":data.name+"","url":data.thumbImgUrl});
              vm.thumbImgUrl=data.thumbImgUrl;

              // 当前时间大于上架时间，只允许修改库存和下架时间
              let dt = new Date();
              if(dt.getTime() > data.planOnsaleTime){
                vm.isEditInfo = false;
              }
            }else{
              console.error(msg)
            }
          }
        })
//        this.axios.post(this.$api.goodsMana.supperManaDetail,sendData).then(function(respone){
//          let msg = respone.data.message
//          let data = respone.data.data
//          if(msg=='ok'){
//            vm.form = data
//            // vm.form.material = String(data.classId);
//            vm.$set(vm.form,'material',String(data.classId));
//            vm.form.status = data.status==1? false : true;
//          }else{
//            console.error(msg)
//          }
//        }).catch(function(error){
//          console.error(error)
//        });
      },
      // 立即上架状态更改
      statusChange(value){
        // 选择立即上架状态
        if(this.form.status){
          this.form.planOnsaleTime = new Date().getTime()
        }
      }
    }
  }
</script>
<style type="text/css" scoped>
  .home-main-wrapper>.header .arrow{display: inline-block;position: relative;font-size: 16px;color: #fff;background: #409EFF;line-height: 36px;text-align: center;width: 400px;}
  .home-main-wrapper>.header .arrow:before{content: '';position: absolute;left: 100%;width: 0;height: 0;border-width: 18px;border-style: solid;border-color: transparent transparent transparent #409EFF;}
  .home-main-wrapper>.main{padding-bottom: 52px;}
  .el-input, .el-select{width: 200px;}
  .el-textarea{width: 300px;}
</style>

