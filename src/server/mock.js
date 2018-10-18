import api from '../config/api'
import Mock from 'mockjs'
import formatterURL from '../util/formatterURL'

// 设置
Mock.setup({
  timeout: '200-600' // 表示响应时间介于 200 和 600 毫秒之间，默认值是'10-100'
})

// 登录
Mock.mock(formatterURL.formatterURL(api.loginEntrance), {
  'code': 0,
  'msg': 'ok',
  'data': {
    'name': '@cname'
  }
})

// 获取平台用户等级列表
Mock.mock(formatterURL.formatterURL(api.getLevelList), {
  'code': 0,
  'msg': 'ok',
  'data':[{
    'levelId': 1,
    'level': '集团用户'
  }, {
    'levelId': 2,
    'level': '企业用户'
  }, {
    'levelId': 3,
    'level': '代理商'
  }, {
    'levelId': 4,
    'level': '个人用户'
  }]
})
// 获取平台用户类别列表
Mock.mock(formatterURL.formatterURL(api.getCategoryList), function(options){
  let data = JSON.parse(options.body)
  console.log(data)
  function filter(id){
    let level, name
    switch(id){
      case 1: level = '集团用户'; name = '集团';break;
      case 2: level = '企业用户'; name = '企业';break;
      case 3: level = '代理商'; name = '代理商';break;
      case 4: level = '个人用户'; name = '个人';break;
    }
    return {level:level, name: name}
  }
  if(!data || !data.levelId){
    return Mock.mock(
      {
        'code': 0,
        'msg': 'ok',
        'data': [
          {
            'levelId': '1',
            'level': '集团用户',
            'categoryId': '@guid',
            'category|1': [
              '集团' + 'VIP' + '用户',
              '集团' + '普通' + '用户',
              '集团' + '试用' + '用户'
            ],
            'status|1': ['Y', 'N']
          },
          {
            'levelId': '1',
            'level': '集团用户',
            'categoryId': '@guid',
            'category|1': [
              '集团' + 'VIP' + '用户',
              '集团' + '普通' + '用户',
              '集团' + '试用' + '用户'
            ],
            'status|1': ['Y', 'N']
          },
          {
            'levelId': '1',
            'level': '集团用户',
            'categoryId': '@guid',
            'category|1': [
              '集团' + 'VIP' + '用户',
              '集团' + '普通' + '用户',
              '集团' + '试用' + '用户'
            ],
            'status|1': ['Y', 'N']
          },
          {
            'levelId': '2',
            'level': '企业用户',
            'categoryId': '@guid',
            'category|1': [
              '企业' + 'VIP' + '用户',
              '企业' + '普通' + '用户',
              '企业' + '试用' + '用户'
            ],
            'status|1': ['Y', 'N']
          },
          {
            'levelId': '3',
            'level': '代理商',
            'categoryId': '@guid',
            'category|1': [
              '代理商' + 'VIP' + '用户',
              '代理商' + '普通' + '用户',
              '代理商' + '试用' + '用户'
            ],
            'status|1': ['Y', 'N']
          },
          {
            'levelId': '4',
            'level': '个人用户',
            'categoryId': '@guid',
            'category|1': [
              '个人' + 'VIP' + '用户',
              '个人' + '普通' + '用户',
              '个人' + '试用' + '用户'
            ],
            'status|1': ['Y', 'N']
          }
        ]
      }
    )
  }
  else{
    let {level, name} = filter(data.levelId)
    return Mock.mock(
      {
        'code': 0,
        'msg': 'ok',
        'data|1-10': [
          {
            'levelId': data.levelId,
            'level': level,
            'categoryId': '@guid',
            'category|1': [
              name + 'VIP' + '用户',
              name + '普通' + '用户',
              name + '试用' + '用户'
            ],
            'status|1': ['Y', 'N']
          }
        ]
      }
    )
  }
})
// 新增单个平台用户类别
Mock.mock(formatterURL.formatterURL(api.addCategory), function(options){
  let data = JSON.parse(options.body)
  console.log(data)
  return Mock.mock(
    {
      'code': 0,
      'msg': 'ok',
      'data': {
        'categoryId': Mock.Random.guid()
      }
    }
  )
})
// 获取单个平台用户类别
Mock.mock(formatterURL.formatterURL(api.getCategory), function(options){
  let data = JSON.parse(options.body)
  console.log(data)
  let level, name
  switch(data.levelId){
    case 1: level = '集团用户'; name = '集团';break;
    case 2: level = '企业用户'; name = '企业';break;
    case 3: level = '代理商'; name = '代理商';break;
    case 4: level = '个人用户'; name = '个人';break;
  }
  return Mock.mock(
    {
      'code': 0,
      'msg': 'ok',
      'data': {
        'levelId': data.levelId,
        'level': level,
        'categoryId': data.categoryId,
        'category|1': [
          name + 'VIP' + '用户',
          name + '普通' + '用户',
          name + '试用' + '用户'
        ]
      }
    }
  )
})
// 修改单个平台用户类别
Mock.mock(formatterURL.formatterURL(api.updateCategory), function(options){
  let data = JSON.parse(options.body)
  console.log(data)
  return Mock.mock(
    {
      'code': 0,
      'msg': 'ok'
    }
  )
})
// 删除单个平台用户类别
Mock.mock(formatterURL.formatterURL(api.deleteCategory), function(options){
  let data = JSON.parse(options.body)
  console.log(data)
  return Mock.mock(
    {
      'code': 0,
      'msg': 'ok'
    }
  )
})
// 修改单个平台用户类别的状态
Mock.mock(formatterURL.formatterURL(api.updateCategoryStatus), function(options){
  let data = JSON.parse(options.body)
  console.log(data)
  return Mock.mock(
    {
      'code': 0,
      'msg': 'ok'
    }
  )
})
// 获取单个平台用户类别的功能配置
Mock.mock(formatterURL.formatterURL(api.getFunctionConfigList), function(options){
  let data = JSON.parse(options.body)
  console.log(data)
  return Mock.mock(
    {
      "code": 0,
      "msg": "ok",
      "data": {
        options: [
          {
            id: 11,
            label: '一物一码',
            children: [
              {
                id: 110,
                label: '查看整体概况'
              },
              {
                id: 111,
                label: '查看整体概况'
              },
              {
                id: 112,
                label: '快速生码',
                children: [
                  {
                    id: 1121,
                    label: 'H5网页二维码'
                  },
                  {
                    id: 1122,
                    label: '微信二维码无限版'
                  },
                  {
                    id: 1123,
                    label: '微信二维码'
                  },
                  {
                    id: 1124,
                    label: '套标二维码'
                  }
                ]
              },
              {
                id: 113,
                label: '查看整体概况'
              },
              {
                id: 114,
                label: '查看整体概况'
              },
            ]
          },
          {
            id: 2,
            label: '营销模块',
            children: [
              {
                id: 211,
                label: '活动列表',
                children: [
                  {
                    id: 2111,
                    label: '查看活动列表'
                  },
                  {
                    id: 2112,
                    label: '开启/关闭活动'
                  },
                  {
                    id: 2113,
                    label: '添加活动'
                  },
                  {
                    id: 2114,
                    label: '修改活动'
                  },
                  {
                    id: 2115,
                    label: '删除活动'
                  },
                  {
                    id: 2116,
                    label: '设置奖项'
                  },
                  {
                    id: 2117,
                    label: '数据统计'
                  },
                  {
                    id: 2118,
                    label: '活动模板授权'
                  },
                  {
                    id: 2119,
                    label: '奖项设置授权'
                  },
                  {
                    id: 2120,
                    label: '二维码预览'
                  }
                ]
              },
              {
                id: 212,
                label: '模块管理',
                children: [
                  {
                    id: 2121,
                    label: '九宫格抽奖'
                  },
                  {
                    id: 2122,
                    label: '摇一摇'
                  },
                  {
                    id: 2123,
                    label: '大转盘抽奖'
                  },
                  {
                    id: 2124,
                    label: '积分宝'
                  },
                  {
                    id: 2125,
                    label: '刮刮卡'
                  },
                  {
                    id: 2126,
                    label: '砸金蛋'
                  },
                  {
                    id: 2127,
                    label: '现金红包'
                  },
                  {
                    id: 2128,
                    label: '验证码领奖'
                  },
                  {
                    id: 2129,
                    label: '朋友圈红包'
                  },
                  {
                    id: 2130,
                    label: '百宝箱'
                  },
                  {
                    id: 2131,
                    label: '砍价'
                  }
                ]
              }
            ]
          },
        ],
        checkedOptions: [1121, 1122, 1123, 1124]
      }
    }
  )
})
// 修改单个平台用户类别的功能配置
Mock.mock(formatterURL.formatterURL(api.updateFunctionConfig), function(options){
  let data = JSON.parse(options.body)
  console.log(data)
  return Mock.mock(
    {
      "code": 0,
      "msg": "ok"
    }
  )
})
// 获取单个平台用户类别的功能权益配置列表
Mock.mock(formatterURL.formatterURL(api.getFunctionPowerConfigList), function(options){
  let data = JSON.parse(options.body)
  console.log(data)
  return Mock.mock(
    {
      "code": 0,
      "msg": "ok",
      "data|1-10": [
        {
          'id': '@guid',
          'name': '@ctitle',
          'quantity': '@natural(1, 99)',
          'unit|1': ['个', '%', '礼客币', '积分', '天'],
          'note': '@csentence',
          'status|1': ['Y', 'N']
        }
      ]
    }
  )
})
// 修改单个平台用户类别的功能权益配置的状态
Mock.mock(formatterURL.formatterURL(api.updateFunctionPowerConfigStatus), function(options){
  let data = JSON.parse(options.body)
  console.log(data)
  return Mock.mock(
    {
      "code": 0,
      "msg": "ok"
    }
  )
})
// 修改单个平台用户类别的功能权益配置
Mock.mock(formatterURL.formatterURL(api.updateFunctionPowerConfig), function(options){
  let data = JSON.parse(options.body)
  console.log(data)
  return Mock.mock(
    {
      "code": 0,
      "msg": "ok"
    }
  )
})
// 获取单个平台用户类别的组织权益配置列表
Mock.mock(formatterURL.formatterURL(api.getOrganizationPowerConfigList), function(options){
  let data = JSON.parse(options.body)
  console.log(data)
  return Mock.mock(
    {
      "code": 0,
      "msg": "ok",
      "data|1-10": [
        {
          'id': '@guid',
          'name': '@ctitle',
          'quantity': '@natural(1, 99)',
          'unit|1': ['个', '%', '礼客币', '积分', '天'],
          'note': '@csentence',
          'status|1': ['Y', 'N']
        }
      ]
    }
  )
})
// 修改单个平台用户类别的功能权益配置的状态
Mock.mock(formatterURL.formatterURL(api.updateOrganizationPowerConfigStatus), function(options){
  let data = JSON.parse(options.body)
  console.log(data)
  return Mock.mock(
    {
      "code": 0,
      "msg": "ok"
    }
  )
})
// 修改单个平台用户类别的组织权益配置
Mock.mock(formatterURL.formatterURL(api.updateOrganizationPowerConfig), function(options){
  let data = JSON.parse(options.body)
  console.log(data)
  return Mock.mock(
    {
      "code": 0,
      "msg": "ok"
    }
  )
})

export default Mock





