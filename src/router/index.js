/*
  设置成可配置项
  title标题
*/

import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/pages/Login.vue'
import Admin from '@/pages/Admin.vue'

// 平台用户等级定义
import UserLevelDefinition from '@/pages/PlatformUserLevelDefinition/UserLevelDefinition.vue'
import AddLevel from '@/pages/PlatformUserLevelDefinition/AddLevel.vue'
import UpdateLevel from '@/pages/PlatformUserLevelDefinition/UpdateLevel.vue'
import FunctionConfig from '@/pages/PlatformUserLevelDefinition/FunctionConfig.vue'
import FunctionPowerConfig from '@/pages/PlatformUserLevelDefinition/FunctionPowerConfig.vue'
import OrganizationPowerConfig from '@/pages/PlatformUserLevelDefinition/OrganizationPowerConfig.vue'

// 用户管理
import UserManagement from '@/pages/userManagement/UserManagement.vue'
import UserManagementAddUserAccount from '@/pages/userManagement/AddUserAccount.vue'
import UserManagementUpdateUserAccount from '@/pages/userManagement/UpdateUserAccount.vue'
import UserManagementFunctionConfig from '@/pages/userManagement/FunctionConfig.vue'
import UserManagementOrganizationPowerConfig from '@/pages/userManagement/OrganizationPowerConfig.vue'
import UserManagementFunctionPowerConfig from '@/pages/userManagement/FunctionPowerConfig.vue'
import FacilityManage from '@/pages/userManagement/FacilityManage.vue'

// 价格配置
import PriceConfig from '@/pages/priceConfig/PriceConfig.vue'
import PriceConfigPlatformUsageFee from '@/pages/priceConfig/PlatformUsageFee.vue'
import PriceConfigAddPlatformUsageFee from '@/pages/priceConfig/AddPlatformUsageFee.vue'
import PriceConfigUpdatePlatformUsageFee from '@/pages/priceConfig/UpdatePlatformUsageFee.vue'
import PriceConfigFunctionUsageFee from '@/pages/priceConfig/FunctionUsageFee.vue'
import PriceConfigAddFunctionUsageFee from '@/pages/priceConfig/AddFunctionUsageFee.vue'
import PriceConfigUpdateFunctionUsageFee from '@/pages/priceConfig/UpdateFunctionUsageFee.vue'
import PriceConfigTemplateUsageFee from '@/pages/priceConfig/TemplateUsageFee.vue'
import PriceConfigAddTemplateUsageFee from '@/pages/priceConfig/AddTemplateUsageFee.vue'
import PriceConfigUpdateTemplateUsageFee from '@/pages/priceConfig/UpdateTemplateUsageFee.vue'
import PriceConfigCodeUsageFee from '@/pages/priceConfig/CodeUsageFee.vue'
import PriceConfigAddCodeUsageFee from '@/pages/priceConfig/AddCodeUsageFee.vue'
import PriceConfigUpdateCodeUsageFee from '@/pages/priceConfig/UpdateCodeUsageFee.vue'
import PriceConfigOrganizationUsageFee from '@/pages/priceConfig/OrganizationUsageFee.vue'
import PriceConfigAddOrganizationUsageFee from '@/pages/priceConfig/AddOrganizationUsageFee.vue'
import PriceConfigUpdateOrganizationUsageFee from '@/pages/priceConfig/UpdateOrganizationUsageFee.vue'

// 订单管理
import OrderManagement from '@/pages/orderManagement/OrderManagement.vue'
import OrderManagementOrderDetail from '@/pages/orderManagement/OrderDetail.vue'

// 物资管理
import MaterialManagement from '@/pages/materialManagement/MaterialManagement.vue'
import AddMaterial from '@/pages/materialManagement/AddMaterial.vue'
import UpdateMaterial from '@/pages/materialManagement/UpdateMaterial.vue'
// 自建奖品
import myAwardList from '@/pages/myAwardList/myAwardList.vue'
// 自建奖品-查看详情
import awardDetail from '@/pages/myAwardList/awardDetail.vue'

// 实物中奖列表
import PrizeList from '@/pages/prizeList/PrizeList.vue'
import BatchExportInvoice from '@/pages/prizeList/BatchExportInvoice.vue'
import BatchImportInvoice from '@/pages/prizeList/BatchImportInvoice.vue'

// 虚拟中奖信息
import VirtualWinningList from '@/pages/virtualWinning/virtualWinningList.vue'
import RedPacketWinningList from '@/pages/virtualWinning/redPacketWinningList.vue'

// 自建商品审核
import OpenRedPacketAudit from '@/pages/createProductAudit/openRedPacketAudit.vue'
import AuditawardDetail from '@/pages/createProductAudit/auditawardDetail.vue'

// 代理商用户列表
import AgentUserList from '@/pages/agentUserList/AgentUserList.vue'

// 标签制作留言
import LabelMakingMessage from '@/pages/labelMakingMessage/labelMakingMessage.vue'
import LabelMakingMessageDetail from '@/pages/labelMakingMessage/labelMakingMessageDetail.vue'

// 资源分配记录
import ResourceAllocationRecord from '@/pages/resourceAllocationRecord/ResourceAllocationRecord.vue'
import ResourceAllocationRecordDetail from '@/pages/resourceAllocationRecord/ResourceAllocationRecordDetail.vue'

// 严选商品管理
import YxCommodityManage from '@/pages/yxCommodityManage/yxCommodityManage.vue'
import YxOrderManage from '@/pages/yxCommodityManage/yxOrderManage.vue'
// SaaS试用申请管理
import SaasTrialManage from '@/pages/saasTrialManage/saasTrialManage.vue'
// 账号设置
import AccountConf from '@/pages/accountManage/accountConf.vue'

Vue.use(Router)

const routes = [
  {
    path: '/login', name: 'Login', component: Login, meta: { secure: true, title: '登录页面' }
  },
  {
    path: '/admin', name: 'Admin', component: Admin,
    children: [
      // 平台用户等级定义
      {
        path: '/userLevelDefinition',
        name: 'UserLevelDefinition',
        component: UserLevelDefinition,
        meta: { title: '平台用户等级定义' }
      },
      {
        path: '/addLevel',
        name: 'AddLevel',
        component: AddLevel,
        meta: {title: '新建类别信息'}
      },
      {
        path: '/updateLevel',
        name: 'UpdateLevel',
        component: UpdateLevel,
        meta: {title: '修改类别信息'}
      },
      {
        path: '/functionConfig',
        name: 'FunctionConfig',
        component: FunctionConfig,
        meta: {title: '功能配置'}
      },
      {
        path: '/functionPowerConfig',
        name: 'FunctionPowerConfig',
        component: FunctionPowerConfig,
        meta: {title: '功能权益配置'}
      },
      {
        path: '/organizationPowerConfig',
        name: 'OrganizationPowerConfig',
        component: OrganizationPowerConfig,
        meta: {title: '组织权益配置'}
      },
      // 用户管理
      {
        path: '/userManagement',
        name: 'UserManagement',
        component: UserManagement,
        meta: {title: '用户管理'}
      },
      {
        path: '/userManagement/addUserAccount',
        name: 'UserManagementAddUserAccount',
        component: UserManagementAddUserAccount,
        meta: {title: '新建账户'}
      },
      {
        path: '/userManagement/updateUserAccount',
        name: 'UserManagementUpdateUserAccount',
        component: UserManagementUpdateUserAccount,
        meta: {title: '账户配置'}
      },
      {
        path: '/userManagement/functionConfig',
        name: 'UserManagementFunctionConfig',
        component: UserManagementFunctionConfig,
        meta: {title: '功能配置'}
      },
      {
        path: '/userManagement/organizationPowerConfig',
        name: 'UserManagementOrganizationPowerConfig',
        component: UserManagementOrganizationPowerConfig,
        meta: {title: '组织权益配置'}
      },
      {
        path: '/userManagement/functionPowerConfig',
        name: 'UserManagementFunctionPowerConfig',
        component: UserManagementFunctionPowerConfig,
        meta: {title: '功能权益配置'}
      },
      {
        path: '/userManagement/facilityManage',
        name: 'FacilityManage',
        component: FacilityManage,
        meta: {title: '设备登录管理'}
      },
      // 价格配置
      {
        path: '/priceConfig',
        name: 'PriceConfig',
        component: PriceConfig,
        meta: {title: '价格配置'},
        // children: [
        //   {
        //     path: '/priceConfig/platformUsageFee',
        //     name: 'PriceConfigPlatformUsageFee',
        //     component: PriceConfigPlatformUsageFee,
        //     meta: {title: '平台使用费'}
        //   },
        //   {
        //     path: '/priceConfig/functionUsageFee',
        //     name: 'PriceConfigFunctionUsageFee',
        //     component: PriceConfigFunctionUsageFee,
        //     meta: {title: '功能使用费'}
        //   },
        //   {
        //     path: '/priceConfig/templateUsageFee',
        //     name: 'PriceConfigTemplateUsageFee',
        //     component: PriceConfigTemplateUsageFee,
        //     meta: {title: '模板使用费'}
        //   },
        //   {
        //     path: '/priceConfig/codeUsageFee',
        //     name: 'PriceConfigCodeUsageFee',
        //     component: PriceConfigCodeUsageFee,
        //     meta: {title: '生码相关费用'}
        //   },
        //   {
        //     path: '/priceConfig/organizationUsageFee',
        //     name: 'PriceConfigOrganizationUsageFee',
        //     component: PriceConfigOrganizationUsageFee,
        //     meta: {title: '组织权益费用'}
        //   },
        // ]
      },
      {
        path: '/priceConfig/addPlatformUsageFee',
        name: 'PriceConfigAddPlatformUsageFee',
        component: PriceConfigAddPlatformUsageFee,
        meta: {title: '新增平台使用费'}
      },
      {
        path: '/priceConfig/updatePlatformUsageFee',
        name: 'PriceConfigUpdatePlatformUsageFee',
        component: PriceConfigUpdatePlatformUsageFee,
        meta: {title: '配置平台使用费'}
      },
      {
        path: '/priceConfig/addFunctionUsageFee',
        name: 'PriceConfigAddFunctionUsageFee',
        component: PriceConfigAddFunctionUsageFee,
        meta: {title: '新增功能使用费'}
      },
      {
        path: '/priceConfig/updateFunctionUsageFee',
        name: 'PriceConfigUpdateFunctionUsageFee',
        component: PriceConfigUpdateFunctionUsageFee,
        meta: {title: '配置功能使用费'}
      },
      {
        path: '/priceConfig/addTemplateUsageFee',
        name: 'PriceConfigAddTemplateUsageFee',
        component: PriceConfigAddTemplateUsageFee,
        meta: {title: '新增模板使用费'}
      },
      {
        path: '/priceConfig/updateTemplateUsageFee',
        name: 'PriceConfigUpdateTemplateUsageFee',
        component: PriceConfigUpdateTemplateUsageFee,
        meta: {title: '配置模板使用费'}
      },
      {
        path: '/priceConfig/addCodeUsageFee',
        name: 'PriceConfigAddCodeUsageFee',
        component: PriceConfigAddCodeUsageFee,
        meta: {title: '新增生码相关费用'}
      },
      {
        path: '/priceConfig/updateCodeUsageFee',
        name: 'PriceConfigUpdateCodeUsageFee',
        component: PriceConfigUpdateCodeUsageFee,
        meta: {title: '配置生码相关费用'}
      },
      {
        path: '/priceConfig/addOrganizationUsageFee',
        name: 'PriceConfigAddOrganizationUsageFee',
        component: PriceConfigAddOrganizationUsageFee,
        meta: {title: '新增组织权益费用'}
      },
      {
        path: '/priceConfig/updateOrganizationUsageFee',
        name: 'PriceConfigUpdateOrganizationUsageFee',
        component: PriceConfigUpdateOrganizationUsageFee,
        meta: {title: '配置组织权益费用'}
      },
      // 订单管理
      {
        path: '/orderManagement',
        name: 'OrderManagement',
        component: OrderManagement,
        meta: {title: '订单管理'}
      },
      {
        path: '/orderManagement/orderDetail',
        name: 'OrderManagementOrderDetail',
        component: OrderManagementOrderDetail,
        meta: {title: '订单详情'}
      },
      // 物资管理
      {
        path: '/materialManagement',
        name: 'MaterialManagement',
        component: MaterialManagement,
        meta: {title: '物资管理'}
      },
      {
        path: '/addMaterial',
        name: 'AddMaterial',
        component: AddMaterial,
        meta: {title: '新建资源'}
      },
      {
        path: '/updateMaterial',
        name: 'UpdateMaterial',
        component: UpdateMaterial,
        meta: {title: '编辑资源'}
      },
      // 自建奖品审核
      {
        path: '/myAwardList',
        name: 'myAwardList',
        component: myAwardList,
        meta: {title: '自建奖品审核'}
      },
      // 自建奖品审核-查看详情
      {
        path: '/awardDetail',
        name: 'awardDetail',
        component: awardDetail,
        meta: {title: '自建奖品详情'}
      },
      // 实物中奖列表
      {
        path: '/prizeList',
        name: 'PrizeList',
        component: PrizeList,
        meta: {title: '实物中奖列表'}
      },
      {
        path: '/batchExportInvoice',
        name: 'BatchExportInvoice',
        component: BatchExportInvoice,
        meta: {title: '批量导出发货单'}
      },
      {
        path: '/batchImportInvoice',
        name: 'BatchImportInvoice',
        component: BatchImportInvoice,
        meta: {title: '批量导入发货单'}
      },
      // 虚拟中奖信息
      {
        path: '/virtualWinningList',
        name: 'VirtualWinningList',
        component: VirtualWinningList,
        meta: {title: '虚拟中奖信息'}
      },
      {
        path: '/redPacketWinningList',
        name: 'RedPacketWinningList',
        component: RedPacketWinningList,
        meta: {title: '微信红包中奖信息'}
      },
      // 自建商品审核
      {
        path: '/openRedPacketAudit',
        name: 'OpenRedPacketAudit',
        component: OpenRedPacketAudit,
        meta: {title: '开通微信红包奖品'}
      },
      {
        path: '/auditawardDetail',
        name: 'AuditawardDetail',
        component: AuditawardDetail,
        meta: {title: '开通微信红包奖品'}
      },
      // 代理商用户列表
      {
        path: '/agentUserList',
        name: 'AgentUserList',
        component: AgentUserList,
        meta: {title: '代理商用户列表'}
      },
      // 标签制作留言
      {
        path: '/labelMakingMessage',
        name: 'LabelMakingMessage',
        component: LabelMakingMessage,
        meta: {title: '标签制作留言'}
      },
      {
        path: '/labelMakingMessageDetail',
        name: 'LabelMakingMessageDetail',
        component: LabelMakingMessageDetail,
        meta: {title: '标签制作留言详情'}
      },
      // 资源分配记录
      {
        path: '/resourceAllocationRecord',
        name: 'ResourceAllocationRecord',
        component: ResourceAllocationRecord,
        meta: {title: '资源分配记录'}
      },
      {
        path: '/resourceAllocationRecordDetail',
        name: 'ResourceAllocationRecordDetail',
        component: ResourceAllocationRecordDetail,
        meta: {title: '资源分配记录'}
      },
      {
        path: '/yxCommodityManage',
        name: 'yxCommodityManage',
        component: YxCommodityManage,
        meta: {title: '网易严选商品管理'}
      },
      {
        path: '/yxOrderManage',
        name: 'yxOrderManage',
        component: YxOrderManage,
        meta: {title: '网易严选订单'}
      },
      {
        path: '/saasTrialManage',
        name: 'saasTrialManage',
        component: SaasTrialManage,
        meta: {title: 'SaaS试用申请管理'}
      },
      {
        path: '/accountConf',
        name: 'accountConf',
        component: AccountConf,
        meta: {title: '账号设置'}
      },
    ]
  },
  {
    path: "/",
    redirect: "/login"  // 重定向
  }
]

const router = new Router({routes})
router.beforeEach((to, from, next) => {
  // 路由发生变化修改页面title
  if (to.meta.title) {
    document.title = to.meta.title
  }else{
    document.title = '云溯无限-超管平台'
  }
  next()
})

export default router
