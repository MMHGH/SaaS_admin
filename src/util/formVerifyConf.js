export default {
  // 审核内容模板
  orderTypes: [
    //扫码入口配置：1-8
    {
      value: 1, label: '品牌主页-新建主页模板',
      verifyField: [
        {key: 'notice', label: '公告', type: 'text', value: ''},
        {key: 'name', label: '页面标题', type: 'text', value: ''},
        {key: 'description', label: '页面描述', type: 'text', value: ''},
        {key: 'imgUrls', label: '图片轮播广告', type: 'imgs', value: ''},
        {key: 'footer', label: '底部文案', type: 'text', value: ''},
      ]
    },
    {
      value: 2, label: '防伪验真配置-新建验真模板',
      verifyField: [
        {key: 'name', label: '页面标题', type: 'text', value: ''},
        {key: 'imgUrls', label: '图片轮播广告', type: 'imgs', value: ''},
        {key: 'notice', label: '使用须知', type: 'text', value: ''},
      ]
    },
    {
      value: 3, label: '资讯公告',
      verifyField: [
        {key: 'name', label: '页面标题', type: 'text', value: ''},
        {key: 'description', label: '页面描述', type: 'text', value: ''},
        {key: 'imgUrls', label: '设置企业广告图', type: 'imgs', value: ''},
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
      value: 5, label: '我的主页',
      verifyField: [
        {key: 'name', label: '页面标题', type: 'text', value: ''},
        {key: 'description', label: '页面描述', type: 'text', value: ''},
        {key: 'imageUrl', label: '设置广告图', type: 'imgs', value: ''},
      ]
    },
    {
      value: 6, label: '自定义模板-添加模板',
      verifyField: [
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
        {key: 'brandName', label: '品牌名称', type: 'other', value: ''},
        {key: 'description', label: '描述', type: 'text', value: ''},
        {key: 'specification', label: '项目名称', type: 'other', value: ''},
        {key: 'origin', label: '项目内容', type: 'other', value: ''},
        {key: 'imgUrl', label: '项目图片', type: 'img', value: ''},
      ]
    },
    //  商品管理:9-10
    {
      value: 9, label: '商品列表-添加商品',
      verifyField: [
        {key: 'name', label: '商品名称', type: 'text', value: ''},
        {key: 'code', label: '商品编号', type: 'text', value: ''},
        {key: 'unit', label: '单位', type: 'text', value: ''},
        {key: 'specification', label: '规格', type: 'text', value: ''},
        {key: 'origin', label: '产地', type: 'text', value: ''},
        {key: 'imgUrl', label: '产品正面图', type: 'img', value: ''},
        {key: 'imgUrls', label: '产品反面图', type: 'imgs', value: ''},
        {key: 'brand', label: '品牌', type: 'text', value: ''},
        {key: 'manufacturer', label: '生产厂家', type: 'text', value: ''},
        {key: 'description', label: '商品简介', type: 'text', value: ''},
        {key: 'description', label: '奖品说明', type: 'text', value: ''},
      ]
    },
    {
      value: 10, label: '商品分类-添加分类',
      verifyField: [
        {key: 'name', label: '分类名称', type: 'text', value: ''},
      ]
    },
    //  营销活动:11-12
    {
      value: 11, label: '活动管理-添加活动',
      verifyField: [
        {key: 'name', label: '活动名称', type: 'text', value: ''},
        {key: 'title', label: '页面标题', type: 'other', value: ''},
        {key: 'describe', label: '页面描述', type: 'other', value: ''},
        {key: 'rules', label: '活动规则文字', type: 'other', value: ''},
      ]
    },
    {
      value: 12, label: '活动管理-添加活动-添加奖品-奖品基本设置',
      verifyField: [
        {key: 'smallName', label: '缩写名称', type: 'text', value: ''},
      ]
    },
    //  溯源应用:13
    {
      value: 13, label: '静态溯源模板设置',
      verifyField: [
        {key: 'name', label: '页面标题', type: 'text', value: ''},
        // {key: 'name', label: '', type: 'trace', value: ''},
        
      ]
    },
    // {
    //   value: 14, label: '自建奖品-新建奖品',
    //   verifyField: [
    //     {key: 'name', label: '奖品名称', type: 'text', value: ''},
    //     {key: 'thumbImgUrl', label: '奖品图片', type: 'img', value: ''},
    //     {key: 'unit', label: '奖品规格', type: 'text', value: ''},
    //     {key: 'description', label: '奖品说明', type: 'text', value: ''},
    //   ]
    // },
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
   */
  setVerifyField(type,fields, jsonObj) {
    let arrImgs = [];
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].type == 'text') {
        fields[i].value = jsonObj[fields[i].key];
      }else if(fields[i].type == 'img'){
        switch(type){
          case 8:
            fields[i].value = [jsonObj.json[fields[i].key]];
            break;
          case 9:
          case 14:
            fields[i].value = jsonObj[fields[i].key];
            break;
        }
      }else if(fields[i].type == 'imgs'){
        jsonObj.imgUrls.forEach((item, index) => {
          arrImgs.push(item);
        })
        fields[i].value = arrImgs;
      }else if(fields[i].type == 'html'){
        fields[i].value = jsonObj[fields[i].key];
      }else{
        switch(type){
          case 7:
          case 8:
            fields[i].value = jsonObj.json[fields[i].key];
            break;
          case 11:
            let jsonData = JSON.parse(jsonObj.templateData);
            fields[i].value = jsonData[fields[i].key];
            break;
        }
      }
    }
    return fields;
  }
}
