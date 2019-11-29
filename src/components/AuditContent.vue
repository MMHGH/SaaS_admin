<template>
  <div class="audit-content">

    <el-dialog title="审核内容" :visible.sync="dialogAudit" width="800px" center>
      <!-- 固定模板 -->
      <el-form ref="form" label-width="130px">
        <el-form-item class="list-item" :label="item.label+'：'" v-show="item.value" v-for="(item,index) in formData" :key="index">
          <!-- text类型 -->
          <el-input class="item-txt" v-if="item.type==='text' || item.type==='json'" size="small" v-model="item.value"
                    disabled></el-input>
          <!-- img类型 -->
          <img class="item-img" v-else-if="item.type === 'img'" v-for="(img,idx) in item.value"
               :key="idx" :src="img" :onerror="ImgError">
          <!-- html类型 -->
          <div v-else-if="item.type === 'html'" v-html="item.value"></div>
        </el-form-item>
      </el-form>

      <!-- 动态模板 -->
      <!-- 静态溯源模板 -->
      <div class="prod-info" v-if="auditData.scene===13" v-for="(item,index) in otherData" :key="index">
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
      <!-- 静态溯源模板 --自定义栏目 -->
      <div class="prod-info" v-if="auditData.scene===13" v-for="(item,idx) in staticTempOther" :key="idx">
        <div style="padding: 10px 0px;">
          <span class="title">{{item.title}}</span>
          <div style="float: right;">
            <el-checkbox class="checkShow" :disabled="true" title="是否展示" v-model="item.isShow"></el-checkbox>
          </div>
        </div>

        <div>
          <div class="temp-item" v-for="(c,idx) in item.children" :key="idx">
            <p v-if="c.type==='text'" style="margin-bottom: 10px">
              {{c.label[0].value}}：{{c.value[0].value}}
            </p>
            <img class="item-img" v-if="c.type==='img'" :src="c.imgUrl" :onerror="ImgError"/>
          </div>
        </div>
        <div style="text-align: center;">
          <el-checkbox :disabled="true" title="图片项目展开" v-model="item.isShowImg">图片项目展开</el-checkbox>
        </div>
      </div>
      <!-- 发展历程 -->
      <el-form v-if="auditData.scene===8" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="页面标题" prop="name">
          <el-input size="mini" v-model="devCourseData.name" maxlength="9" disabled
                    style="width:390px;"
                    placeholder="请输入页面标题"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="prod-info dev-course">
            <el-checkbox-group class="checkGroup" v-model="devCourseData.devAttrs.attrs">
              <img :src="devCourseData.devAttrs.imgUrl" :onerror="ImgError">
              <el-checkbox class="checkItem" label="imgUrl" disabled style="margin-left: 90px;">图片</el-checkbox>

              <el-input size="mini" v-model="devCourseData.devAttrs.brandName" maxlength="20"
                        style="width:330px;"
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
      <!-- 商品动态 -->
      <el-form v-if="auditData.scene===17" ref="ruleForm" label-width="100px" disabled class="auto-content demo-ruleForm">
        <el-form-item label="页面标题:" prop="name">
          <el-input size="mini" v-model="productDynameic.name"
                     style="width:390px;"
                    placeholder="请输入页面标题"></el-input>
        </el-form-item>
        <el-form-item label="主标题:" prop="mainName" class="mainName">
          <el-input size="mini" v-model="productDynameic.mainName"
                     style="width:390px;"
                    placeholder="请输入主标题"></el-input>
        </el-form-item>
        <el-form-item label="图片轮播广告:" prop="" class="list-item">
           <img class="item-img"  v-for="(img,idx) in productDynameic.carouselList"
               :key="idx" :src="img.url" :onerror="ImgError">
        </el-form-item>
        <!-- 自定义栏目 -->
        <div v-for="(item, index) in productDynameic.contentList" :key="index" class="prod-info">
            <el-form label-width="100px" disabled>
              <h3>{{item.type == 'content'?'内容栏':'证书栏'}}</h3>
              <!-- 内容栏 -->
              <div v-if="item.type == 'content'">
                <el-form-item label="栏目标题：" prop="name">
                  <el-input :maxlength="8"  v-model="item.name" style="width: 300px;"
                              placeholder="最多输入8个字符"></el-input>
                </el-form-item>
                <el-form-item style="white-space: nowrap;" label="展示图片：" prop="imgUrl">
                    <img v-if="item.imgUrl" class="report-img" :src="item.imgUrl" alt="">
                </el-form-item>
                <el-form-item style="white-space: nowrap;" label="文本内容：" prop="imgUrl">
                    <div class="content-html"  v-html="item.content"></div>
                </el-form-item>
              </div>
              <!-- 证书栏 -->
              <div v-else>
                <el-form-item label="栏目标题：" prop="name">
                  <el-input :maxlength="12"  v-model="item.name" style="width: 300px;" placeholder="最多输入12个字符"></el-input>
                </el-form-item>
                <el-form-item style="white-space: nowrap;" label="证书图片：" prop="imgUrl">
                  <img v-if="item.imgUrl" class="report-img" :src="item.imgUrl" :onerror="ImgError">
                </el-form-item>
                <el-form-item label="字段名称：" prop="designation" v-if="item.embedType == 2">
                  <el-input :maxlength="20"  v-model="item.designation" style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="位置：" prop="location" v-if="item.embedType == 1">
                  <div class="ac-line">
                    <span style="color: #C0C4CC;">{{item.labelOne}}</span>
                    <el-input size="small" placeholder="请输入" v-model="item.level" style="width:140px;"></el-input>
                  </div>
                  <div class="ac-line">
                    <span style="color: #C0C4CC;">{{item.labelTwo}}</span>
                    <el-input size="small" placeholder="请输入" v-model="item.vertical" style="width:140px;"></el-input>
                  </div>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input type="textarea" size="small"  maxlength="500" style="width:500px;"
                          rows="5" v-model="item.remark" placeholder="备注"></el-input>
                </el-form-item>
              </div>
            </el-form>
        </div>
      </el-form>
      <!-- 商品证书 -->
      <el-form v-if="auditData.scene===18" ref="ruleForm" label-width="100px" disabled class="auto-content demo-ruleForm">
        <el-form-item label="页面标题:" prop="name">
          <el-input size="mini" v-model="certificate.name"
                     style="width:390px;"
                    placeholder="请输入页面标题"></el-input>
        </el-form-item>
        <el-form-item label="主标题:" prop="mainName" class="mainName">
          <el-input size="mini" v-model="certificate.mainName"
                     style="width:390px;"
                    placeholder="请输入主标题"></el-input>
        </el-form-item>
        <el-form-item label="图片轮播广告:" prop="" class="list-item">
           <img class="item-img"  v-for="(img,idx) in certificate.carouselList"
               :key="idx" :src="img.url" :onerror="ImgError">
        </el-form-item>
        <!-- 自定义栏目 -->
        <div v-for="(item, index) in certificate.certificateList" :key="index" class="prod-info">
            <el-form label-width="100px" disabled>
                <h3>证书栏</h3>
                <el-form-item label="栏目标题：" prop="name">
                  <el-input :maxlength="12"  v-model="item.name" style="width: 300px;" placeholder="最多输入12个字符"></el-input>
                </el-form-item>
                <el-form-item style="white-space: nowrap;" label="证书图片：" prop="imgUrl">
                  <img v-if="item.imgUrl" class="report-img" :src="item.imgUrl" :onerror="ImgError">
                </el-form-item>
                <el-form-item label="字段名称：" prop="designation" v-if="item.embedType == 2">
                  <el-input :maxlength="20"  v-model="item.designation" style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="位置：" prop="location" v-if="item.embedType == 1">
                  <div class="ac-line">
                    <span style="color: #C0C4CC;">{{item.labelOne}}</span>
                    <el-input size="small" placeholder="请输入" v-model="item.level" style="width:140px;"></el-input>
                  </div>
                  <div class="ac-line">
                    <span style="color: #C0C4CC;">{{item.labelTwo}}</span>
                    <el-input size="small" placeholder="请输入" v-model="item.vertical" style="width:140px;"></el-input>
                  </div>
                </el-form-item>
                <el-form-item label="备注说明：" prop="remark">
                   <div class="content-html"  v-html="item.remark"></div>
                </el-form-item>
            </el-form>
        </div>
      </el-form>

      <!-- 防伪验真-新数据 -->
      <div v-if="auditData.scene===2">
        <el-form ref="form" label-width="130px" label-suffix="：">
          <div v-if="verifyData.pageLayout===1">
            <el-form-item class="list-item" label="页面标题">
              <el-input class="item-txt" size="small" v-model="verifyData.name" disabled></el-input>
            </el-form-item>
            <el-form-item class="list-item" label="设置产品图片">
              <img class="item-img" :src="verifyData.productImageUrl" :onerror="ImgError">
            </el-form-item>
            <el-form-item class="list-item" label="使用须知">
              <el-input class="item-txt" type="textarea" rows="4" size="small" v-model="verifyData.notice" disabled></el-input>
            </el-form-item>
          </div>
          <div v-if="verifyData.pageLayout===2">
            <h3>验真页</h3>
            <el-form-item class="list-item" label="页面标题">
              <el-input class="item-txt" size="small" v-model="verifyData.checkData.name" disabled></el-input>
            </el-form-item>
            <el-form-item class="list-item" label="设置背景图片">
              <img class="item-img" :src="verifyData.checkData.backgroundUrl" :onerror="ImgError">
            </el-form-item>
            <el-form-item class="list-item" label="设置产品图片">
              <img class="item-img" :src="verifyData.checkData.productImageUrl" :onerror="ImgError">
            </el-form-item>
            <!--自定义-->
            <el-form-item class="list-item" :label="item.value" v-for="(item,idx) in verifyData.checkData.label">
              <el-input class="item-txt" size="small" v-model="verifyData.checkData.value[idx].value" disabled></el-input>
            </el-form-item>
            <h3>验真结果页</h3>
            <el-form-item class="list-item" label="页面标题">
              <el-input class="item-txt" size="small" v-model="verifyData.resultData.title" disabled></el-input>
            </el-form-item>
            <el-form-item class="list-item" label="设置产品图片">
              <img class="item-img" :src="verifyData.resultData.productImageUrl" :onerror="ImgError">
            </el-form-item>
            <el-form-item class="list-item" label="备注说明">
              <div v-html="verifyData.resultData.desc"></div>
            </el-form-item>
          </div>
          <div v-if="verifyData.pageLayout===3">
            <h3>验真页</h3>
            <el-form-item class="list-item" label="页面标题">
              <el-input class="item-txt" size="small" v-model="verifyData.checkData.name" disabled></el-input>
            </el-form-item>
            <el-form-item class="list-item" label="设置背景图片">
              <img class="item-img" :src="verifyData.checkData.backgroundUrl" :onerror="ImgError">
            </el-form-item>
            <el-form-item class="list-item" label="设置产品图片">
              <img class="item-img" :src="verifyData.checkData.productImageUrl" :onerror="ImgError">
            </el-form-item>
            <!--自定义-->
            <el-form-item class="list-item" :label="item.value" v-for="(item,idx) in verifyData.checkData.label">
              <el-input class="item-txt" size="small" v-model="verifyData.checkData.value[idx].value" disabled></el-input>
            </el-form-item>
            <h3>验真结果页</h3>
            <el-form-item class="list-item" label="页面标题">
              <el-input class="item-txt" size="small" v-model="verifyData.resultData.title" disabled></el-input>
            </el-form-item>
            <el-form-item class="list-item" label="设置产品图片">
              <img class="item-img" :src="verifyData.resultData.productImageUrl" :onerror="ImgError">
            </el-form-item>
            <!--自定义-->
            <el-form-item class="list-item" :label="item.value" v-for="(item,idx) in verifyData.resultData.label">
              <el-input class="item-txt" size="small" v-model="verifyData.resultData.value[idx].value" disabled></el-input>
            </el-form-item>
            <el-form-item class="list-item" label="备注说明">
              <div v-html="verifyData.resultData.desc"></div>
            </el-form-item>
          </div>
        </el-form>
      </div>

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
        // 新自定义栏目
        staticTempOther: [],
        // 发展历程
        devCourseData: {
          devAttrs: {
            attrs: ''
          }
        },
        // 商品动态
        productDynameic:{},
        // 商品证书
        certificate:{},
        // 防伪验真
        verifyData:{},
      }
    },
    mounted() {
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
        this.productDynameic={}

        // 获取配置
        let conf = formVerifyConf.getConfByType(this.auditData.scene);

        // 解析json
        let json = JSON.parse(this.auditData.content);

        // 防伪验真
        if (this.auditData.scene === 2) {
          this.verifyData = {}
          // 新数据解析
          if(json.pageLayout){
            this.verifyData = JSON.parse(json.json);
            this.verifyData.pageLayout = json.pageLayout;
            this.verifyData.name = json.name;
          }else{
            // 旧数据 设置值
            this.formData = formVerifyConf.setVerifyField(conf.value, conf.verifyField, json);
          }
        } else if (this.auditData.scene === 13) {// 静态溯源模板
          // 设置值
          this.formData = formVerifyConf.setVerifyField(conf.value, conf.verifyField, json);
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

          // 兼容旧数据
          if (json.rawMaterialInfoTitle) {
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
          }
          // 新自定义栏目
          if (json.other) {
            this.staticTempOther = JSON.parse(json.other);
          }

          console.log(this.otherData, this.staticTempOther)
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
        }else if(this.auditData.scene === 17){
          this.productDynameic.name = json.name;
          // 处理json数据
          let jsonData = JSON.parse(json.json);
          this.productDynameic.mainName = jsonData.mainName;
          this.productDynameic.carouselList = jsonData.carouselList;
          this.productDynameic.contentList =  jsonData.contentList;
        }else if(this.auditData.scene === 18){
          this.certificate.name = json.name;
          // 处理json数据
          let jsonData = JSON.parse(json.json);
          this.certificate.mainName = jsonData.mainName;
          this.certificate.carouselList = jsonData.carouselList;
          this.certificate.certificateList =  jsonData.certificateList;
        }else {  // 其他单据
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

<style>
  .list-item img{
    max-width: 100%;
  }
  .audit-content .mainName{
    margin-bottom:6px!important;
  }
</style>
<style lang="scss" scoped>
  .list-item {
    margin-bottom: 5px;
  }
  .auto-content{
    max-height:600px;
    overflow-y: scroll;
  }
  .list-item .item-txt {
    width: 400px;
  }

  .list-item .item-img {
    width: 160px;
    height: 160px;
    margin-right: 5px;
  }
  .ac-line{
    display: inline-block;
  }
  .prod-info {
    width: 90%;
    padding: 0px 20px 5px 20px;
    border-radius: 10px;
    border: 1px solid #dcdfe6;
    background: #f2f2f2;
    margin-bottom: 10px;
  }
  .prod-info h3{
      border-bottom: 1px solid #DCDFE6;
      padding-bottom: 3px;
      font-weight: 400;
      line-height: 24px;
      margin-top: 10px;
      margin-bottom: 18px;
  }
  .content-html{
     word-wrap: break-word;
     word-break: normal;
     border:1px solid #e8e8e8;
     border-radius: 5px;
     padding:10px;
     width: 80%;
     margin:10px 0;
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
