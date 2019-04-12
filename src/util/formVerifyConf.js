export default {
  // 审核内容模板
  orderTypes: [
    //扫码入口配置：1-8
    {
      value: 1, label: '品牌主页-新建主页模板',
      verifyField: []
    },
    {
      value: 2, label: '防伪验真配置-新建验真模板',
      verifyField: []
    },
    {
      value: 3, label: '资讯公告',
      verifyField: []
    },
    {
      value: 4, label: '商品详情配置',
      verifyField: []
    },
    {
      value: 5, label: '我的主页',
      verifyField: []
    },
    {
      value: 6, label: '自定义模板-添加模板',
      verifyField: []
    },
    {
      value: 7, label: '视频展示',
      verifyField: []
    },
    {
      value: 8, label: '发展历程-历程模板',
      verifyField: []
    },
    //  商品管理:9-10
    {
      value: 9, label: '商品列表-添加商品',
      verifyField: []
    },
    {
      value: 10, label: '商品分类-添加分类',
      verifyField: []
    },
    //  营销活动:11-12
    {
      value: 11, label: '活动管理-添加活动',
      verifyField: []
    },
    {
      value: 12, label: '活动管理-添加活动-添加奖品-奖品基本设置',
      verifyField: []
    },
    //  溯源应用:13
    {
      value: 13, label: '静态溯源模板设置',
      verifyField: []
    },
    //  资源管理:14
    // '{"name":"微信红包","thumbImgUrl":"","unit":"元","description":"微信红包"}'
    {
      value: 14, label: '自建奖品-新建奖品',
      verifyField: [
        {key: 'name', label: '奖品名称', type: 'text', value: ''},
        {key: 'thumbImgUrl', label: '奖品图片', type: 'img', value: ''},
        {key: 'unit', label: '奖品规格', type: 'text', value: ''},
        {key: 'description', label: '奖品说明', type: 'text', value: ''},
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
   */
  setVerifyField(fields, jsonObj) {
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].type !== 'other') {
        fields[i].value = jsonObj[fields[i].key];
      }
    }
    return fields;
  }
}
