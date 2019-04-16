<template>
  <div class="audit-content">

    <el-dialog title="审核内容" :visible.sync="dialogAudit" width="700px" center>
      <el-form ref="form" label-width="120px">
        <el-form-item class="list-item" :label="item.label+'：'" v-for="(item,index) in formData" :key="index">
          <!-- text类型:placeholder="item.label" -->
          <el-input class="item-txt" v-if="item.type==='text' || item.type==='json'" size="small" v-model="item.value"
                    disabled></el-input>
          <!-- img类型 -->
          <img class="item-img" v-else-if="item.type === 'img'" v-for="(img,idx) in item.value"
               :key="idx" :src="img" :onerror="ImgError">
          <!-- <img class="item-img" v-else-if="item.type === 'imgs'" v-for="(img,idx) in item.value" :key="idx" :src="img"> -->
          <!-- html类型 -->
          <div v-else-if="item.type === 'html'" v-html="item.value"></div>
        </el-form-item>
      </el-form>

      <!-- 静态溯源模板 -->
      <div class="prod-info" v-if="auditData.scene===13" v-for="(item,index) in otherData" :keys="index">
        <el-form>
          <el-form-item style="height: 45px;">
            <div class="title">
              <el-input size="mini" style="width: 260px;" maxlength="16" disabled v-model="item.title"></el-input>
            </div>
          </el-form-item>
          <el-row :gutter="24">
            <el-col :span="12">项目名称</el-col>
            <el-col :span="12">项目内容</el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="11">
              <el-form-item
                v-for="(domain, index) in item.label"
                :key="domain.key"
                :prop="'label.' + index + '.value'"
                class="input_txt"
                :rules="domain.rules">
                <el-input size="mini" style="width:180px;" maxlength="16" v-model="domain.value"
                          placeholder="请项目输入名称" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item
                v-for="(domain, index) in item.value"
                :key="domain.key"
                :prop="'value.' + index + '.value'"
                class="input_txt"
                :rules="domain.rules">
                <el-input size="mini" style="width:200px;" maxlength="50" v-model="domain.value"
                          placeholder="请项目输入内容" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <!-- 借用label处理删除按钮 -->
              <el-form-item
                v-for="(domain, index) in item.label"
                class="input_txt"
                :key="domain.key">
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24" v-for="(c, index) in item.reportList" :key="index">
            <el-col :span="11">相关报告(非必填)</el-col>
            <el-col :span="11">
              <img class="report-img" :src="c.imgUrl" :onerror="ImgError">
            </el-col>
            <el-col :span="2">
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!-- 发展历程 -->
      <el-form v-if="auditData.scene===8" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="页面标题" prop="name">
          <el-input size="mini" v-model="devCourseData.name" maxlength="9" disabled
                    oninput="this.value=this.value.replace(/\s+/g,'')" style="width:390px;"
                    placeholder="请输入页面标题"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="prod-info dev-course">
            <el-checkbox-group class="checkGroup" v-model="devCourseData.devAttrs.attrs">
              <img :src="devCourseData.devAttrs.imgUrl" :onerror="ImgError">
              <el-checkbox class="checkItem" label="imgUrl" disabled style="margin-left: 90px;">图片</el-checkbox>

              <el-input size="mini" v-model="devCourseData.devAttrs.brandName" maxlength="20"
                        oninput="this.value=this.value.replace(/\s+/g,'')" style="width:330px;"
                        placeholder="请输入品牌名称" disabled></el-input>
              <el-checkbox class="checkItem" label="brandName" disabled>名称</el-checkbox>

              <el-input size="mini" v-model="devCourseData.devAttrs.description" maxlength="500"
                        type="textarea" :rows="5" style="resize: none;width:330px;"
                        placeholder="请输入描述" disabled></el-input>
              <el-checkbox class="checkItem" label="description" disabled>描述</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>

        <!-- 模板栏目信息 编辑 -->
        <div v-for="(item, index) in devCourseData.projectList">
          <!-- 自定义栏目 -->
          <el-form-item>
            <div class="prod-info dev-course">
              <div class="title">
                <span>{{item.title}}</span>
              </div>

              <div>
                <div class="temp-item" v-for="(c,idx) in item.children" :key="idx">
                  <p v-if="c.type==='text'">
                    {{c.label[0].value}}：{{c.value[0].value}}
                  </p>
                  <img class="item-img" v-if="c.type==='img'" :src="c.imgUrl" :onerror="ImgError"/>
                </div>
              </div>
            </div>
          </el-form-item>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="auditData.status==0 || auditData.status==2 || auditData.status==3"
                   @click="pass">审核通过</el-button>
        <el-button v-if="auditData.status==0 || auditData.status==1" @click="dialogCause = true">审核不通过</el-button>
      </span>
    </el-dialog>

    <!-- 审核不通过 -->
    <el-dialog title="" :visible.sync="dialogCause" width="400px" center>
      <span>请输入不通过原因：</span>
      <el-form :inline="true" :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="120px"
               style="margin-top:10px;" class="demo-dynamic">
        <el-form-item label="" prop="cause">
          <el-input type="textarea" v-model="ruleForm1.cause" :rows="5"
                    placeholder="请输入不超过300个中文字符" style="width:350px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="nopass">确 定</el-button>
        <el-button @click="dialogCause = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import formVerifyConf from '../util/formVerifyConf'

  export default {
    props: ['auditData'],
    data() {
      return {
        dialogAudit: true,
        dialogCause: false,
        ruleForm: {
          beginDate: '',
          endDate: '',
          auditStatus: '',
          account: ''
        },
        ruleForm1: {
          cause: ''
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
        id: '',
        formData: [],
        orderType: 14,
        formJson: '',
        // 其他自定义栏目
        otherData: [],
        // 发展历程
        devCourseData: {
          devAttrs: {
            attrs: ''
          }
        }
      }
    },
    mounted() {
      // this.initData();
    },
    filters: {
      // 状态过滤器
      fmtStatus(val) {
        let auditStatus = '';
        switch (Number(val)) {
          case 0:
            auditStatus = '未审核'
            break;
          case 1:
            auditStatus = '审核通过'
            break;
          case 2:
            auditStatus = '审核不通过'
            break;
        }
        return auditStatus
      }
    },
    computed: {
      /**
       * 默认图片
       * @constructor
       */
      ImgError: function () {
        return "this.onerror=null;this.src='" + require("@/assets/images/default_Img.png") + "';";
      }
    },
    methods: {
      initData() {
        // 重置数据
        this.formData = [];
        // 其他自定义栏目
        this.otherData = [];
        // 发展历程
        this.devCourseData = {
          devAttrs: {
            attrs: ''
          }
        }

        // 获取配置
        let conf = formVerifyConf.getConfByType(this.auditData.scene);

        // 解析json
        let json = JSON.parse(this.auditData.content);

        // 静态溯源模板
        if (this.auditData.scene === 13) {
          // 设置Form JSon数据
          let setFormJson = function (form, data) {
            let jsonObj = JSON.parse(data), idx = 0;
            // 重置
            form.key = [];
            form.label = [];
            form.value = [];
            // 兼容旧数据，判断是对象还是数组
            let obj = {attrList: jsonObj, reportList: []};
            if (Array.isArray(jsonObj)) {
              obj.reportList = [];
            } else {
              obj.attrList = jsonObj.attrList;
              obj.reportList = jsonObj.reportList;
            }
            // 赋值
            while (idx < obj.attrList.length) {
              form.key.push({value: obj.attrList[idx].key});
              form.label.push({
                value: obj.attrList[idx].label,
                key: Date.now() + idx,
                rules: [
                  {required: true, message: '项目名称不能为空', trigger: 'blur'}
                ]
              });
              form.value.push({
                value: obj.attrList[idx].value,
                key: Date.now() + idx,
                rules: [
                  // { required: true, message: '项目内容不能为空', trigger: 'blur' }
                ]
              });
              idx++;
            }
            form.reportList = obj.reportList;
          }

          // 统一数据结构
          let itemObj = {
            title: '', isShow: true, isOpen: true,
            reportList: [],
            carouselImgs: [], // 图片列表
            rules: [
              {required: true, message: '请输入标题', trigger: 'blur'}
            ],
            key: [],
            label: [],
            value: [],
          }
          let newObj = Object.assign({}, itemObj);
          // 原材料信息
          newObj.title = json.rawMaterialInfoTitle;
          setFormJson(newObj, json.rawMaterialInfo);
          this.otherData.push(newObj)
          // 生产信息
          newObj = Object.assign({}, itemObj);
          newObj.title = json.productionInfoTitle;
          setFormJson(newObj, json.productionInfo);
          this.otherData.push(newObj)
          // 质检信息
          newObj = Object.assign({}, itemObj);
          newObj.title = json.qualityInfoTitle;
          setFormJson(newObj, json.qualityInfo);
          this.otherData.push(newObj)
          // 物流配送信息
          newObj = Object.assign({}, itemObj);
          newObj.title = json.logisticsInfoTitle;
          setFormJson(newObj, json.logisticsInfo);
          this.otherData.push(newObj)
          console.log(this.otherData)
        } else if (this.auditData.scene === 8) { // 发展历程
          // 名称
          this.devCourseData.name = json.name;
          // 产品信息
          this.devCourseData.devAttrs = JSON.parse(json.json);
          // 栏目
          let others = JSON.parse(json.other);
          others.forEach(item => {
            if (item.type !== 'other') {
              item.rules = [
                {required: true, message: '请输入标题', trigger: 'blur'},
              ];
            }
          })
          this.devCourseData.projectList = others;
        } else {  // 其他单据
          // 设置值
          this.formData = formVerifyConf.setVerifyField(conf.value, conf.verifyField, json);
        }
      },
      // 设置状态
      setDialogAudit() {
        this.dialogAudit = true;
      },
      //审核通过
      pass(row) {
        let param = {
          id: this.auditData.id,
          status: 1,
          remark: ''
        }
        this.axios.post(this.$api.auditDetails.censor, param).then((res) => {
          let data = res.data.data,
            msg = res.data.message;
          if (msg == 'ok') {
            this.$message({
              type: 'success',
              message: '提交成功'
            });
            // 调用父组件初始化方法
            this.$emit('getData');
            this.$emit('setAuditContent');
            this.dialogAudit = false;
          } else {
            this.$message.error('提交失败：' + msg);
          }
        })
      },
      // 审核不通过
      nopass() {
        let param = {
          id: this.auditData.id,
          status: 0,
          remark: this.ruleForm1.cause
        }
        this.$refs['ruleForm1'].validate((valid, object) => {
          if (valid) {
            this.axios.post(this.$api.auditDetails.censor, param).then((res) => {
              let data = res.data.data,
                msg = res.data.message;
              if (msg == 'ok') {
                this.$message({
                  type: 'success',
                  message: '提交成功'
                });
                // 调用父组件初始化方法
                this.$emit('getData');
                this.$emit('setAuditContent');
                this.dialogAudit = false;
                this.dialogCause = false;
              } else {
                this.$message.error('提交失败：' + msg);
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .list-item {
    margin-bottom: 5px;
  }

  .list-item .item-txt {
    width: 400px;
  }

  .list-item .item-img {
    width: 160px;
    height: 160px;
    margin-right: 5px;
  }

  .prod-info {
    padding: 0px 20px 5px 20px;
    border-radius: 10px;
    border: 1px solid #dcdfe6;
    background: #f2f2f2;
    margin-bottom: 10px;
  }

  .prod-info img {
    width: 160px;
    height: 160px;
  }

  .dev-course .title, .dev-course .temp-item {
    line-height: 30px;
  }

  .audit-content .el-dialog__body .el-form-item {
    margin-bottom: 0px;
  }
</style>
