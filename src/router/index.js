/*
  设置成可配置项
  title标题
*/

import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('@/pages/Login.vue')
const Admin = () => import('@/pages/Admin.vue')

// 平台用户等级定义
const UserLevelDefinition = () => import('@/pages/PlatformUserLevelDefinition/UserLevelDefinition.vue')
const AddLevel = () => import('@/pages/PlatformUserLevelDefinition/AddLevel.vue')
const UpdateLevel = () => import('@/pages/PlatformUserLevelDefinition/UpdateLevel.vue')
const FunctionConfig = () => import('@/pages/PlatformUserLevelDefinition/FunctionConfig.vue')
const FunctionPowerConfig = () => import('@/pages/PlatformUserLevelDefinition/FunctionPowerConfig.vue')
const OrganizationPowerConfig = () => import('@/pages/PlatformUserLevelDefinition/OrganizationPowerConfig.vue')

// 用户管理
const UserManagement = () => import('@/pages/userManagement/UserManagement.vue')
const UserManagementAddUserAccount = () => import('@/pages/userManagement/AddUserAccount.vue')
const UserManagementUpdateUserAccount = () => import('@/pages/userManagement/UpdateUserAccount.vue')
const UserManagementFunctionConfig = () => import('@/pages/userManagement/FunctionConfig.vue')
const UserManagementOrganizationPowerConfig = () => import('@/pages/userManagement/OrganizationPowerConfig.vue')
const UserManagementFunctionPowerConfig = () => import('@/pages/userManagement/FunctionPowerConfig.vue')
const FacilityManage = () => import('@/pages/userManagement/FacilityManage.vue')

// 价格配置
const PriceConfig = () => import('@/pages/priceConfig/PriceConfig.vue')
const PriceConfigPlatformUsageFee = () => import('@/pages/priceConfig/PlatformUsageFee.vue')
const PriceConfigAddPlatformUsageFee = () => import('@/pages/priceConfig/AddPlatformUsageFee.vue')
const PriceConfigUpdatePlatformUsageFee = () => import('@/pages/priceConfig/UpdatePlatformUsageFee.vue')
const PriceConfigFunctionUsageFee = () => import('@/pages/priceConfig/FunctionUsageFee.vue')
const PriceConfigAddFunctionUsageFee = () => import('@/pages/priceConfig/AddFunctionUsageFee.vue')
const PriceConfigUpdateFunctionUsageFee = () => import('@/pages/priceConfig/UpdateFunctionUsageFee.vue')
const PriceConfigTemplateUsageFee = () => import('@/pages/priceConfig/TemplateUsageFee.vue')
const PriceConfigAddTemplateUsageFee = () => import('@/pages/priceConfig/AddTemplateUsageFee.vue')
const PriceConfigUpdateTemplateUsageFee = () => import('@/pages/priceConfig/UpdateTemplateUsageFee.vue')
const PriceConfigCodeUsageFee = () => import('@/pages/priceConfig/CodeUsageFee.vue')
const PriceConfigAddCodeUsageFee = () => import('@/pages/priceConfig/AddCodeUsageFee.vue')
const PriceConfigUpdateCodeUsageFee = () => import('@/pages/priceConfig/UpdateCodeUsageFee.vue')
const PriceConfigOrganizationUsageFee = () => import('@/pages/priceConfig/OrganizationUsageFee.vue')
const PriceConfigAddOrganizationUsageFee = () => import('@/pages/priceConfig/AddOrganizationUsageFee.vue')
const PriceConfigUpdateOrganizationUsageFee = () => import('@/pages/priceConfig/UpdateOrganizationUsageFee.vue')

// 订单管理
const OrderManagement = () => import('@/pages/orderManagement/OrderManagement.vue')
const OrderManagementOrderDetail = () => import('@/pages/orderManagement/OrderDetail.vue')

// 物资管理
const MaterialManagement = () => import('@/pages/materialManagement/MaterialManagement.vue')
const AddMaterial = () => import('@/pages/materialManagement/AddMaterial.vue')
const UpdateMaterial = () => import('@/pages/materialManagement/UpdateMaterial.vue')
// 自建奖品
const myAwardList = () => import('@/pages/myAwardList/myAwardList.vue')
// 自建奖品-查看详情
const awardDetail = () => import('@/pages/myAwardList/awardDetail.vue')
// 自建商品审核
const OpenRedPacketAudit = () => import('@/pages/createProductAudit/openRedPacketAudit.vue')
const AuditawardDetail = () => import('@/pages/createProductAudit/auditawardDetail.vue')
const VideoAudit = () => import('@/pages/createProductAudit/videoAudit.vue')
const SetWhiteList = () => import('@/pages/createProductAudit/setWhiteList.vue')
const ImageTextAudit = () => import('@/pages/createProductAudit/imageTextAudit.vue')
const AuditLogging = () => import('@/pages/createProductAudit/auditLogging.vue')
const AuditRuleSetting = () => import('@/pages/createProductAudit/auditRuleSetting.vue')

// 实物中奖列表
const PrizeList = () => import('@/pages/prizeList/PrizeList.vue')
const BatchExportInvoice = () => import('@/pages/prizeList/BatchExportInvoice.vue')
const BatchImportInvoice = () => import('@/pages/prizeList/BatchImportInvoice.vue')

// 虚拟中奖信息
const VirtualWinningList = () => import('@/pages/virtualWinning/virtualWinningList.vue')
const RedPacketWinningList = () => import('@/pages/virtualWinning/redPacketWinningList.vue')
const RedPacketWinningInfo = () => import('@/pages/virtualWinning/redPacketWinningInfo.vue')

// 代理商用户列表
const AgentUserList = () => import('@/pages/agentUserList/AgentUserList.vue')

// 标签制作留言
const LabelMakingMessage = () => import('@/pages/labelMakingMessage/labelMakingMessage.vue')
const LabelMakingMessageDetail = () => import('@/pages/labelMakingMessage/labelMakingMessageDetail.vue')
const RawCodeMessage = () => import('@/pages/labelMakingMessage/rawCodeMessage.vue')
const ShareGeneraMessage = () => import('@/pages/labelMakingMessage/shareGeneraMessage.vue')

// 用户域名管理
const PlatformUser = () => import('@/pages/userDomainManage/platformUser.vue')
const AgentUse = () => import('@/pages/userDomainManage/agentUse.vue')
const UserDomainConfig = () => import('@/pages/userDomainManage/userDomainConfig.vue')

// 资源分配记录
const ResourceAllocationRecord = () => import('@/pages/resourceAllocationRecord/ResourceAllocationRecord.vue')
const ResourceAllocationRecordDetail = () => import('@/pages/resourceAllocationRecord/ResourceAllocationRecordDetail.vue')

// 严选商品管理
const YxCommodityManage = () => import('@/pages/yxCommodityManage/yxCommodityManage.vue')
const YxOrderManage = () => import('@/pages/yxCommodityManage/yxOrderManage.vue')
// SaaS试用申请管理
const SaasTrialManage = () => import('@/pages/saasTrialManage/saasTrialManage.vue')
// 账号设置
const AccountConf = () => import('@/pages/accountManage/accountConf.vue')
// 印刷厂管理
const PrintHouseManage = () => import('@/pages/printHouseManage/printHouseManage.vue')
const PrintHouseCheck = () => import('@/pages/printHouseManage/printHouseCheck.vue')
const PrintHouseEdit = () => import('@/pages/printHouseManage/printHouseEdit.vue')
// 返利条件定制
const RebateConditionCustom = () => import('@/pages/rebateConditionCustom/rebateConditionCustom.vue')
// 系统管理
const UpgradeMaintenance = () => import('@/pages/adminManagement/upgradeMaintenance.vue')

Vue.use(Router)

const routes = [
  {
    path: '/login', name: 'Login', component: Login, meta: {secure: true, title: '登录页面'}
  },
  {
    path: '/admin', name: 'Admin', component: Admin,
    children: [
      // 平台用户等级定义
      {
        path: '/userLevelDefinition',
        name: 'UserLevelDefinition',
        component: UserLevelDefinition,
        meta: {title: '平台用户等级定义'}
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
      {
        path: '/redPacketWinningInfo',
        name: 'RedPacketWinningInfo',
        component: RedPacketWinningInfo,
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

      {
        path: '/videoAudit',
        name: 'VideoAudit',
        component: VideoAudit,
        meta: {title: '视频审核'}
      },
      {
        path: '/setWhiteList',
        name: 'SetWhiteList',
        component: SetWhiteList,
        meta: {title: '设置白名单'}
      },
      {
        path: '/imageTextAudit',
        name: 'ImageTextAudit',
        component: ImageTextAudit,
        meta: {title: '图文审核'}
      },
      {
        path: '/auditLogging',
        name: 'AuditLogging',
        component: AuditLogging,
        meta: {title: '审核记录'}
      },
      {
        path: '/auditRuleSetting',
        name: 'AuditRuleSetting',
        component: AuditRuleSetting,
        meta: {title: '自动审核规则设置'}
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
      {
        path: '/rawCodeMessage',
        name: 'RawCodeMessage',
        component: RawCodeMessage,
        meta: {title: '生码域名定制留言'}
      },
      {
        path: '/shareGeneraMessage',
        name: 'ShareGeneraMessage',
        component: ShareGeneraMessage,
        meta: {title: '分享推广定制域名留言'}
      },
      // 用户域名管理
      {
        path: '/platformUser',
        name: 'PlatformUser',
        component: PlatformUser,
        meta: {title: '平台用户'}
      },
      {
        path: '/agentUse',
        name: 'AgentUse',
        component: AgentUse,
        meta: {title: '代理商企业用户'}
      },
      {
        path: '/userDomainConfig',
        name: 'UserDomainConfig',
        component: UserDomainConfig,
        meta: {title: '用户域名配置'}
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
      {
        path: '/printHouse/printHouseManage',
        name: 'printHouseManage',
        component: PrintHouseManage,
        meta: {title: '印刷厂管理'}
      },
      {
        path: '/printHouse/printHouseCheck',
        name: 'printHouseCheck',
        component: PrintHouseCheck,
        meta: {title: '印刷厂审核'}
      },
      {
        path: '/printHouse/printHouseEdit',
        name: 'printHouseEdit',
        component: PrintHouseEdit,
        meta: {title: '印刷厂编辑'}
      },
      {
        path: '/rebateConditionCustom',
        name: 'rebateConditionCustom',
        component: RebateConditionCustom,
        meta: {title: '返利条件定制'}
      },
      {
        path: '/upgradeMaintenance',
        name: 'upgradeMaintenance',
        component: UpgradeMaintenance,
        meta: {title: '升级维护'}
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
  } else {
    document.title = '云溯无限-超管平台'
  }
  next()
})

export default router
