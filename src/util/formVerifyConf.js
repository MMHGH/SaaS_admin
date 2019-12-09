export default {
  // 审核内容模板
  orderTypes: [
    {
      value: 1, label: '品牌主页-新建主页模板',
      verifyField: [
        {key: 'notice', label: '公告', type: 'text', value: ''},
        {key: 'name', label: '页面标题', type: 'text', value: ''},
        {key: 'description', label: '页面描述', type: 'text', value: ''},
        {key: 'imgUrls', label: '图片轮播广告', type: 'img', value: ''},
        {key: 'footer', label: '底部文案', type: 'text', value: ''},
      ]
    },
    {
      value: 2, label: '防伪验真配置-新建验真模板',
      verifyField: [
        {key: 'name', label: '页面标题', type: 'text', value: ''},
        {key: 'imgUrls', label: '图片轮播广告', type: 'img', value: ''},
        {key: 'notice', label: '使用须知', type: 'text', value: ''},
      ]
    },
    {
      value: 3, label: '资讯公告',
      verifyField: [
        {key: 'name', label: '页面标题', type: 'text', value: ''},
        {key: 'description', label: '页面描述', type: 'text', value: ''},
        {key: 'imgUrls', label: '设置企业广告图', type: 'img', value: ''},
        {key: 'introduce', label: '介绍', type: 'text', value: ''},
      ]
    },
    {
      value: 4, label: '商品详情配置',
      verifyField: [
        {key: 'name', label: '页面标题', type: 'text', value: ''},
        {key: 'description', label: '页面描述', type: 'text', value: ''},
      ]
    },
    {
      value: 5, label: '会员中心',
      verifyField: [
        {key: 'name', label: '页面标题', type: 'text', value: ''},
        {key: 'description', label: '页面描述', type: 'text', value: ''},
        {key: 'imgUrls', label: '设置广告图', type: 'img', value: ''},
      ]
    },
    {
      value: 6, label: '自定义模板-添加模板',
      verifyField: [
        {key: 'name', label: '模块名称', type: 'text', value: ''},
        {key: 'moduleContent', label: '页面内容', type: 'html', value: ''},
      ]
    },
    // {
    //   value: 7, label: '视频展示',
    //   verifyField: [
    //     {key: 'videoUrl', label: '视频链接', type: 'other', value: ''},
    //   ]
    // },
    {
      value: 8, label: '发展历程-历程模板',
      verifyField: [
        {key: 'name', label: '页面标题', type: 'text', value: ''},
        {key: 'imgUrl', label: 'banner图片', type: 'img', value: ''},
        {key: 'brandName', label: '品牌名称', type: 'json', value: ''},
        {key: 'description', label: '描述', type: 'text', value: ''},
        {key: 'specification', label: '项目名称', type: 'other', value: ''},
        {key: 'origin', label: '项目内容', type: 'other', value: ''},
        {key: 'imgUrl', label: '项目图片', type: 'other', value: ''},
      ]
    },
    {
      value: 9, label: '商品列表-添加商品',
      verifyField: [
        {key: 'name', label: '商品名称', type: 'text', value: ''},
        {key: 'code', label: '商品编号', type: 'text', value: ''},
        {key: 'unit', label: '单位', type: 'text', value: ''},
        {key: 'specification', label: '规格', type: 'text', value: ''},
        {key: 'origin', label: '产地', type: 'text', value: ''},
        {key: 'imgUrl', label: '产品正面图', type: 'img', value: ''},
        {key: 'imgUrls', label: '产品反面图', type: 'img', value: ''},
        {key: 'brand', label: '品牌', type: 'text', value: ''},
        {key: 'manufacturer', label: '生产厂家', type: 'text', value: ''},
        {key: 'description', label: '商品简介', type: 'text', value: ''},
        // {key: 'description', label: '奖品说明', type: 'text', value: ''},
      ]
    },
    {
      value: 10, label: '商品分类-添加分类',
      verifyField: [
        {key: 'name', label: '分类名称', type: 'text', value: ''},
      ]
    },
    {
      value: 11, label: '活动管理-添加活动',
      verifyField: [
        {key: 'name', label: '活动名称', type: 'text', value: ''},
        {key: 'title', label: '页面标题', type: 'json', value: ''},
        {key: 'describe', label: '页面描述', type: 'json', value: ''},
        {key: 'rules', label: '活动规则文字', type: 'json', value: ''},
      ]
    },
    {
      value: 12, label: '活动管理-添加活动-添加奖品-奖品基本设置',
      verifyField: [
        {key: 'name', label: '缩写名称', type: 'text', value: ''},
      ]
    },
    {
      value: 13, label: '静态溯源模板设置',
      verifyField: [
        {key: 'name', label: '页面标题', type: 'text', value: ''},
      ]
    },
    {
      value: 15, label: '活动推广',
      verifyField: [
        {key: 'no', label: '推广编号', type: 'text', value: ''},
        {key: 'name', label: '推广名称', type: 'text', value: ''},
        {key: 'title', label: '公告标题', type: 'text', value: ''},
        {key: 'backgroundImgUrl', label: '推广信息背景图片', type: 'img', value: ''},
        {key: 'content', label: '推广信息', type: 'html', value: ''},
        {key: 'buttonOneName', label: '推广按钮1名称', type: 'text', value: ''},
        {key: 'buttonTwoName', label: '推广按钮2名称', type: 'text', value: ''},
        {key: 'shareImgUrl', label: '分享背景图片', type: 'img', value: ''}
      ]
    },
    {
      value: 16, label: '商品分享',
      verifyField: [
        {key: 'no', label: '分享规则编号', type: 'text', value: ''},
        {key: 'name', label: '分享规则名称', type: 'text', value: ''},
        {key: 'content', label: '商品分享说明', type: 'text', value: ''},
        {key: 'buttonTwoName', label: '按钮名称', type: 'text', value: ''},
        {key: 'buttonUrl', label: '链接地址', type: 'text', value: ''},
      ]
    },
    {
      value: 17, label: '商品动态',
      verifyField: []
    },
    {
      value: 18, label: '商品证书',
      verifyField: []
    },
    {
      value: 19, label: '精准放奖活动',
      verifyField: [
        {key: 'name', label: '活动名称', type: 'text', value: ''},
        {key: 'title', label: '页面标题', type: 'text', value: ''},
        {key: 'desc', label: '页面描述', type: 'text', value: ''},
        {key: 'activityRule', label: '活动规则文字', type: 'text', value: ''},
      ]
    },
    {
      value: 20, label: '广告投放',
      verifyField: [
        {key: 'tname', label: '广告名称', type: 'text', value: ''},
        {key: 'threePartyEnterprise', label: '三方广告', type: 'text', value: ''},
        {key: 'imgAdvertUrl', label: '广告图片', type: 'img', value: ''},
        {key: 'linkUrl', label: '图片链接', type: 'text', value: ''},
      ]
    },
  ],
  /**
   * 获取 单据配置信息
   */
  getConfByType(type) {
    for (let i = 0; i < this.orderTypes.length; i++) {
      let order = this.orderTypes[i];
      if (order.value === type) {
        return order;
      }
    }
    return null;
  },
  /**
   * 设置 单据验证字段
   * type:页面类型 fields:属性值 jsonObj：数据
   * 自定义(动态)模块另写html
   */
  setVerifyField(type,fields, jsonObj) {
    for (let i = 0; i < fields.length; i++) {
      let auditType = fields[i].type;//渲染类型
      if (auditType != 'other') {
        fields[i].value = jsonObj[fields[i].key];
        if(auditType == 'json' || type == 8 || type == 11 || type == 19 || type == 20){
          switch(type){
            case 8:
            case 20:
              let jsonPares = JSON.parse(jsonObj.json);
              fields[i].value = fields[i].type==='img'?[jsonPares[fields[i].key]]:jsonPares[fields[i].key];
              break;
            case 11:
              let jsonData = JSON.parse(jsonObj.templateData);
              fields[i].value = jsonData[fields[i].key];
              break;
            case 19:
              if(i===0){
                fields[i].value = jsonObj.name;
              }else{
                let json = JSON.parse(jsonObj.templateData);
                fields[i].value = json[fields[i].key];
              }
              break;
          }
        }
      }
    }
    return fields;
  }
}
