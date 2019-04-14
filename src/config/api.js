import './url'
import formatterURL from '../util/formatterURL'

/**
 *  接口地址
 */
export default {
  /**
   * 通用
   * statusCode Number  状态码，状态码列表：0：请求成功
   * messasge   String  信息
   * timestamp  Number  时间戳
   * data       Object  数据
   */
  statusCode: {
    success: 0,
    notAuthority: 1,
    loginElsewhere: 2,
  },

  /**
   * 获取登录验证码
   * @parameter
   * @return
   * 验证码图片（一张85X20的jpg图片）
   */
  getLoginVerification: formatterURL.formatterURL('@root/getVerifyCode'),

  /**
   * 统一审核平台登录
   * @parameter
   * account      string	  用户账号
   * pwd          string	  用户密码
   * verifyCode   string	  验证码
   * autoLogin    boolean	  是否自动登录，true：自动登录，false：不自动登录
   * @return
   * name         string	平台运营人员名称
   */
  loginEntrance: '@root/login',

  /**
   * 统一审核平台注销
   * @parameter
   * @return
   */
  logout: '@root/loginOut',

  /**
   * 修改邮箱
   * @parameter
   * @return
   */
  updateUserEmail: '@root/updateUserEmail',

  /**
   * 修改密码
   */
  updateUserPwd: '@root/updateUserPwd',

  /**
   * 获取平台用户类别列表
   * @parameter
   * @return
   * dictValue	String	平台用户类别值
   * dictName	  String	平台用户类别名称
   *
   */
  getCategoryList: '@root/sysDict/listSysUserType',

  /**
   * 获取单个平台用户等级的【功能】配置列表
   * @parameter
   * @return
   * id	          Long	    权限ID
   * pid	        Long	    父权限ID，第一级别为0
   * name	        String	  权限名称
   * sort	        Long	    排序
   * createdTime	Timestamp	创建时间
   */
  getFunctionConfigList: '@root/sysPermit/list',

  /* 平台用户等级定义 */
  platformUserLevelDefinition: {
    /**
     * 获取平台用户等级列表（显示全部）
     * @parameter
     * userTypeId Long	  平台用户类别ID
     * @return
     * id	              Long	    平台用户等级ID
     * sysUserTypeName	String	  平台用户类别名称
     * sysUserLevelName	String	  平台用户等级名称
     * status	          Character	平台用户等级状态 ,Y启用 N禁用
     */
    getLevelList: '@root/sysUserLevel/listSysUserLevelAll',

    /**
     * 新增单个平台用户等级
     * @parameter
     * userTypeId   Long	  平台用户类别ID
     * name         String	平台用户等级名称
     * @return
     */
    addLevel: '@root/sysUserLevel/save',

    /**
     * 获取单个平台用户等级
     * @parameter
     * id         Long	平台用户等级ID
     * @return
     * id	        Long	    平台用户等级ID
     * userTypeId	Long	    平台用户类别ID
     * roleId	    Long	    角色ID
     * name	      string	  平台用户等级名称
     * status	    Character	状态 ,Y启用 N禁用
     */
    getLevel: '@root/sysUserLevel/getOne',

    /**
     * 修改单个平台用户等级
     * @parameter
     * id           Long	  平台用户等级ID
     * userTypeId   Long	  平台用户类别ID
     * name         String	平台用户等级名称
     * @return
     */
    updateLevel: '@root/sysUserLevel/update',

    /**
     * 删除单个平台用户等级
     * @parameter
     * id   Long  平台用户等级ID
     * @return
     */
    deleteLevel: '@root/sysUserLevel/remove',

    /**
     * 启用单个平台用户等级
     * @parameter
     * id   Long	平台用户等级ID
     * @return
     */
    enableLevel: '@root/sysUserLevel/enable',

    /**
     * 禁用单个平台用户等级
     * @parameter
     * id   Long	平台用户等级ID
     * @return
     */
    disableLevel: '@root/sysUserLevel/disable',

    /**
     * 获取单个平台用户等级的【功能】配置
     * @parameter
     * userLevelId    Long	平台用户等级ID
     * @return
     * permitId       Long	权限ID
     */
    getFunctionConfig: '@root/sysPermit/listSysUserLevelPermit',

    /**
     * 修改单个平台用户等级的【功能】配置
     * @parameter
     * userLevelId  Long	  平台用户等级ID
     * permitIds    String	权限ID集合：如”1,2,3”
     * @return
     */
    updateFunctionConfig: '@root/sysPermit/updateSysUserLevelPermit',

    /**
     * 获取单个平台用户等级的【功能权益】配置列表
     * @parameter
     * userLevelId  Long	  平台用户等级ID
     * largeClass   Long	  权益类别：固定1[功能权益]
     * pageNum      Number  当前页码
     * pageSize     Number  一页总条数
     * @return
     * userLevelId	      Long	    平台用户等级ID
     * userLvPrivilegeId	Long	    平台用户等级权益ID NULL代表未设置
     * privilegeId	      Long	    权益ID
     * privilegeName	    String	  权益名称
     * privilegeValue	    String	  权益值 NULL代表未设置
     * unitName	          String	  权益单位
     * description	      String	  权益描述
     * status             Character	当前状态 ,Y启用 N禁用 NULL代表未设置
     *
     * (pagination)
     * total      Number  数据总条数
     * pageNum    Number  当前页码
     * pageSize   Number  一页总条数
     * pages      Numebr  当前总共页数
     */
    getFunctionPowerConfigList: '@root/sysUserLvPrivilege/listUserLvFunctionPrivilege',

    /**
     * 获取单个平台用户等级的【组织权益】配置列表
     * @parameter
     * userLevelId  Long	  平台用户等级ID
     * largeClass   Long	  权益类别：固定[2]组织权益
     * pageNum      Number  当前页码
     * pageSize     Number  一页总条数
     * @return
     * userLevelId	      Long	    平台用户等级ID
     * userLvPrivilegeId	Long	    平台用户等级权益ID NULL代表未设置
     * privilegeId	      Long	    权益ID
     * privilegeName	    String	  权益名称
     * privilegeValue	    String	  权益值 NULL代表未设置
     * unitName	          String	  权益单位
     * description	      String	  权益描述
     * status	            Character	当前状态 ,Y启用 N禁用 NULL代表未设置
     *
     * (pagination)
     * total      Number  数据总条数
     * pageNum    Number  当前页码
     * pageSize   Number  一页总条数
     * pages      Numebr  当前总共页数
     */
    getOrganizationPowerConfigList: '@root/sysUserLvPrivilege/listUserLvOrganPrivilege',

    /**
     * 新增单个平台用户等级的【功能权益/组织权益】
     * @parameter
     * userLevelId  Long	  平台用户等级ID
     * privilegeId  Long	  权益ID
     * value      	String	设置值
     * @return
     */
    addPowerConfig: '@root/sysUserLvPrivilege/save',

    /**
     * 修改单个平台用户等级的【功能权益/组织权益】
     * @parameter
     * userLevelId  Long	  平台用户等级ID
     * privilegeId  Long	  权益ID
     * value      	String	设置值
     * @return
     */
    updatePowerConfig: '@root/sysUserLvPrivilege/update',

    /**
     * 启用单个平台用户等级的【功能权益/组织权益】
     * @parameter
     *
     * userLevelId  Long	平台用户等级ID
     * privilegeId  Long	权益ID
     * @return
     */
    enablePowerConfig: '@root/sysUserLvPrivilege/enable',

    /**
     * 禁用单个平台用户等级的【功能权益/组织权益】
     * @parameter
     *
     * userLevelId  Long	平台用户等级ID
     * privilegeId  Long	权益ID
     * @return
     */
    disablePowerConfig: '@root/sysUserLvPrivilege/disable',
  },

  /* 平台用户管理 */
  userManagement: {
    /**
     * 获取平台用户列表
     * @parameter
     * userLevelId    Long	    平台用户等级ID
     * status         Character	状态：Y启用，N禁用
     * phone          String	  手机号码
     * beginDate      String	  注册开始时间，格式2018-06-03 17:22:22
     * endDate        String	  注册结束时间，格式2018-06-03 17:22:22
     * organName      String	  企业关键词
     * pageNum        Number  当前页码
     * pageSize       Number  一页总条数

     * @return
     * (list)
     * id	            Long	    平台用户ID
     * account	      String	  账号
     * regTime	      Timestamp	注册时间
     * userLevelId	  Long	    平台用户等级ID
     * userLevelName	String	  平台用户等级名称
     * organId	      Long	    组织ID
     * organName	    String	  组织名称
     * status	        Character	状态 Y启用N禁用
     * expireTime	    Timestamp	剩余时间
     * money	        Double	  余额
     *
     * (pagination)
     * total      Number  数据总条数
     * pageNum    Number  当前页码
     * pageSize   Number  一页总条数
     * pages      Numebr  当前总共页数
     */
    getUserList: '@root/sysUser/listSysUserByPage',

    /**
     * 新增单个平台用户
     * @parameter
     * account      String	平台用户账号
     * isIpLimit    Boolean	是否限制登录IP地址,1是，0不是
     * userLevelId  Long	  平台用户等级ID
     * pwd          String	平台用户密码
     * ipLimit      String	配置登录IP地址
     * @return
     * userId       Number	新增的平台用户ID
     */
    addUser: '@root/sysUser/save',

    /**
     * 获取单个平台用户
     * @parameter
     * id   Long	平台用户ID
     * @return
     * id	          Long	  平台用户ID
     * userTypeId	  Long	  平台用户类别ID
     * userLevelId	Long	  平台用户等级ID
     * account	    string	账号
     * isIpLimit	  Boolean	是否限制登录IP地址,1是，0不是
     * ipLimit	    string	配置登录IP地址
     */
    getUser: '@root/sysUser/detail',

    /**
     * 修改单个平台用户
     * @parameter
     * id           Long	  平台用户ID
     * account      String	平台用户账号
     * isIpLimit    Boolean	是否限制登录IP地址,1是，0不是
     * userLevelId  Long	  平台用户等级ID
     * pwd          String	平台用户密码
     * ipLimit      String	配置登录IP地址
     * @return
     */
    updateUser: '@root/sysUser/update',

    /**
     * 启用单个平台用户
     * @parameter
     * id   Long	  平台用户ID
     * @return
     */
    enableUser: '@root/sysUser/enable',

    /**
     * 禁用单个平台用户
     * @parameter
     * id   Long	  平台用户ID
     * @return
     */
    disableUser: '@root/sysUser/disable',

    /**
     * 获取单个平台用户的【功能】配置列表
     * @parameter
     * userId     Long	  平台用户ID
     * @return
     * permitId	  number	权限id
     */
    getFunctionConfig: '@root/sysUserPermit/listSysUserPermit',

    /**
     * 修改单个平台用户的【功能】配置
     * @parameter
     * userId     Long	  平台用户ID
     * permitIds  String	权限ID集合：如”1,2,3”
     * @return
     */
    updateFunctionConfig: '@root/sysUserPermit/updateSysUserPermit',

    /**
     * 获取单个平台用户的【功能权益】配置列表
     * @parameter
     * userId         Long	  平台用户ID
     * organId        Long	  组织ID
     * largeClass   	Long	  权益类别：固定1[功能权益]
     * pageNum        Number  当前页码
     * pageSize       Number  一页总条数
     * @return
     * organId	          Long	    组织ID
     * organPrivilegeId	  Long	    组织权益ID NULL代表未设置
     * privilegeId	      Long	    权益ID
     * privilegeName	    String	  权益名称
     * privilegeValue	    String	  权益值 NULL代表未设置
     * unitName	          String	  权益单位
     * description	      String	  权益描述
     * status	            Character	当前状态 ,Y启用 N禁用 NULL代表未设置
     *
     * (pagination)
     * total      Number  数据总条数
     * pageNum    Number  当前页码
     * pageSize   Number  一页总条数
     * pages      Numebr  当前总共页数
     */
    getFunctionPowerConfigList: '@root/sysOrganPrivilege/listUserFunctionPrivilege',

    /**
     * 获取单个平台用户的【组织权益】配置列表
     * @parameter
     * userId         Long	  平台用户ID
     * organId        Long	  组织ID
     * largeClass   	Long	  权益类别：固定2[组织权益]
     * pageNum        Number  当前页码
     * pageSize       Number  一页总条数
     * @return
     * organId	          Long	    组织ID
     * organPrivilegeId	  Long	    组织权益ID NULL代表未设置
     * privilegeId	      Long	    权益ID
     * privilegeName	    String	  权益名称
     * privilegeValue	    String	  权益值 NULL代表未设置
     * unitName	          String	  权益单位
     * description	      String	  权益描述
     * status	            Character	当前状态 ,Y启用 N禁用 NULL代表未设置
     *
     * (pagination)
     * total      Number  数据总条数
     * pageNum    Number  当前页码
     * pageSize   Number  一页总条数
     * pages      Numebr  当前总共页数
     */
    getOrganizationPowerConfigList: '@root/sysOrganPrivilege/listUserOrganPrivilege',

    /**
     * 新增单个平台用户的【功能权益/组织权益】
     * @parameter
     * organId      Long	  组织ID
     * privilegeId  Long	  权益ID
     * currentValue Double	设置值
     * @return
     */
    addPowerConfig: '@root/sysOrganPrivilege/save',

    /**
     * 修改单个平台用户的【功能权益/组织权益】
     * @parameter
     * organId      Long	  组织ID
     * privilegeId  Long	  权益ID
     * currentValue Double	设置值
     * @return
     */
    updatePowerConfig: '@root/sysOrganPrivilege/update',

    /**
     * 启用单个平台用户的【功能权益/组织权益】
     * @parameter
     * organId      Long	组织ID
     * privilegeId	Long	权益ID
     * @return
     */
    enablePowerConfig: '@root/sysOrganPrivilege/enable',

    /**
     * 禁用单个平台用户的【功能权益/组织权益】
     * @parameter
     * organId      Long	组织ID
     * privilegeId	Long	权益ID
     * @return
     */
    disablePowerConfig: '@root/sysOrganPrivilege/disable',

    /**
     * 用户管理-物资分配列表
     * @parameter
     * name   string	资源名称
     * @return
     * id	        Long	  物资id
     * name	      String	物资名称
     * inventory	Long	  库存数量
     */
    getListOrganGoods: '@root/goods/listOrganGoods',

    /**
     * 用户管理-物资分配
     * @parameter
     * goodsId  	String	物资ID
     * organId  	Long	单位ID
     * num      	Long	分配数量
     * @return
     */
    shareOrganGoods: '@root/goods/shareOrganGoods',
    
    /**
     * 获取标签打印信息
     * @parameter
     * total      Number  数据总条数
     * pageNum    Number  当前页码
     * pageSize   Number  一页总条数
     * pages      Numebr  当前总共页数
     */
    getListTag: '@root/equipment/listTagClientRegister',

    /**
     * 标签设备禁用or启用
     * @parameter
     * machineId  int  设备id
     */
    updateTagState: '@root/equipment/updateTagClientState',
    
    /**
     * 获取Pad手持登录信息
     * @parameter
     * total      Number  数据总条数
     * pageNum    Number  当前页码
     * pageSize   Number  一页总条数
     * pages      Numebr  当前总共页数
     */
    getListPdaManage: '@root/equipment/listPdaEquipmentManage',

    /**
     * Pad手持登录信息禁用or启用
     * @parameter
     * id  int  设备id
     */
    updatePdaState: '@root/equipment/updatePdaState',

    /**
     * 添加PDA手持设备
     * @parameter
     * machineId  int  设备id
     */
    addPdaManage: '@root/equipment/addPdaEquipmentManage',
  },

  /* 价格配置 */
  priceConfig: {
    /**
     * 获取单个平台用户等级的【增值权益】配置列表
     * @parameter
     * userLevelId  Long	平台用户等级id
     * smallClass   Long	增值权益类别：1平台使用费、2功能使用费、3模板使用费、4生码相关费用、5组织权益费用
     * @return
     * userLvPrivilegePriceId	  Long	      平台用户等级-增值权益ID NULL代表未设置
     * userLevelId	            Long	      平台用户等级id
     * privilegeId	            Long	      权益ID
     * privilegeName	          String	    权益名称
     * qty	                    Long	      数量 NULL代表未设置
     * unitName	                String	    单位名称 NULL代表未设置
     * price	                  Double	    单价(元) NULL代表未设置
     * description	            String	    权益描述
     * status	                  Character	  当前状态 ,Y启用 N禁用 NULL代表未设置
     */
    getPriceConfigList: '@root/sysUserLvPrivilegePrice/listUserLvPrivilegePrice',

    /**
     * 新增单个平台用户等级的【增值权益】
     * @parameter
     * userLevelId  Long	  平台用户等级ID
     * privilegeId  Long	  权益ID
     * qty    	    Long	  数量
     * unit   	    string	单位
     * price        Double	单价(元)
     * @return
     */
    addPriceConfig: '@root/sysUserLvPrivilegePrice/save',

    /**
     * 获取单个平台用户等级的【增值权益】详细信息
     * @parameter
     * id   Long	平台用户等级-增值权益ID
     * @return
     * id           	Long	  平台用户等级-增值权益ID
     * userLevelId	  Long	  平台用户等级ID
     * userTypeName	  String	平台用户类别名称
     * userLevelName	String	平台用户等级名称
     * privilegeId	  Long	  权益ID
     * qty	          Long	  数量
     * unit	          String	单位
     * price	        Double	单价(元)
     */
    getPriceConfig: '@root/sysUserLvPrivilegePrice/getOne',

    /**
     * 修改单个平台用户等级的【增值权益】
     * @parameter
     * id         	Long	平台用户等级-增值权益ID
     * userLevelId	Long	平台用户等级ID
     * privilegeId	Long	权益ID
     * qty          Long	数量
     * unit       	String	单位
     * price      	Double	单价(元)
     * @return
     */
    updatePriceConfig: '@root/sysUserLvPrivilegePrice/update',

    /**
     * 删除单个平台用户等级的【增值权益】
     * @parameter
     * id   Long	平台用户等级-增值权益ID
     * @return
     */
    deletePriceConfig: '@root/sysUserLvPrivilegePrice/remove',

    /**
     * 启用单个平台用户等级的【增值权益】
     * @parameter
     * id   Long	平台用户等级-增值权益ID
     * @return
     */
    enablePriceConfig: '@root/sysUserLvPrivilegePrice/enable',

    /**
     * 禁用单个平台用户等级的增值权益接口
     * @parameter
     * id   Long	平台用户等级-增值权益ID
     * @return
     */
    disablePriceConfig: '@root/sysUserLvPrivilegePrice/disable',
  },

  /* 标签制作留言 */
  labelMakingMessage: {
    /**
     * 获取标签制作留言列表
     * @parameter
     * status     Character	状态 ：A全部 Y已联系 N未联系
     * beginDate  String	  标签制作留言创建-开始时间，格式2018-06-03 17:22:22
     * endDate    String	  标签制作留言创建-结束时间，格式2018-06-03 17:22:22
     * pageNum        Number  当前页码
     * pageSize       Number  一页总条数
     * @return
     * (list)
     * id	          Long	      标签制作留言ID
     * contacts	    String	    联系人
     * phone	      String	    联系方式
     * remark	      String	    设计需求
     * status	      Character	  状态 ,Y 已联系 N 未联系
     * createdTime	Timestamp	  创建时间
     * (pagination)
     * total      Number  数据总条数
     * pageNum    Number  当前页码
     * pageSize   Number  一页总条数
     * pages      Numebr  当前总共页数
     */
     getLabelMakingMessageList: '@root/codeTagFeedback/list',

    /**
     * 获取单个标签制作留言信息
     * @parameter
     * id     Long	标签制作留言ID
     * @return
     * id	      Long	标签自作留言ID
     * contacts	String	联系人
     * phone	  String	联系方式
     * remark	  String	设计需求
     * status	  Character	状态 ,Y已联系 N未联系
     */
    getLabelMakingMessage: '@root/codeTagFeedback/detail',

    /**
     * 设置为已联系
     * @parameter
     * id   	Long	标签制作留言ID
     * @return
     */
    setLabelMakingMessageStatus: '@root/codeTagFeedback/alreadyConnected',
  },
  //物资管理
  goodsMana: {
    supperManaListGoods: '@root/goods/listGoods',     //获取资源商城物资
    supperManaDisable: '@root/goods/disable',     //禁用资源商城物资
    supperManaEnable: '@root/goods/enable',      //启用物资
    supperManaAddGoods: '@root/goods/addGoods',      //新增资源商城物资
    supperManaDeleteGoods: '@root/goods/deleteGoods',    //删除物资
    supperManaDetail: '@root/goods/detail',    //查询单个物资详情
    supperManaUpdateGoods: '@root/goods/updateGoods',   //修改物资
    supperManaRecommend: '@root/goods/recommend',     //推荐物资
    supperManaCancelRecommend: '@root/goods/cancelRecommend',    //取消推荐物资
    supperManaInventoryDetail: '@root/goods/inventoryDetail',     //查询单个物资的库存详情
    supperManaUpdateGoodsInventory: '@root/goods/updateGoodsInventory',     //修改库存
  },
  // 自建奖品
  award:{
    listAwardByPage: '@root/goods/listAwardByPage',     //自建奖品列表
    approval: '@root/goods/approval',     //审批自建奖品
    refuse: '@root/goods/refuse',     //拒批自建奖品
    getAwardDetail: '@root/goods/award/getAwardDetail',  //编辑时查询单个自建奖品
  },

  //订单管理
  orderMana: {
    supperManaListOrder: '@root/order/listOrder',      //获取订单列表
    supperManaOrderDetail: '@root/order/orderDetail'
  },
  //中奖信息
  prizeMana: {
    supperManaGetMaterialPrizeList: '@root/material/getMaterialPrizeList',     //获取实物中奖列表
  },
  //代理商用户列表
  agentsList: {
    supperManaListAgents: '@root/sysUser/listAgents',        //获取代理商列表
    supperManaListAgentUserByType: '@root/sysUser/listAgentUserByType',   //获取代理商列表下的用户
  },
  // 网易严选
  yxGoods: {
    getGoodsList: '@root/yxGoods/getGoodsList',        //获取严选商品列表
    importItems: '@root/yxGoods/importItems', // 一键导入商品信息接口
    getGoodsCategoryList: '@root/yxGoods/getGoodsCategoryList',        //查询所有类目信息
    batchUpdateGoodsStatus: '@root/yxGoods/batchUpdateGoodsStatus',        // 批量上架、下架
    updateGoodsPrice: '@root/yxGoods/updateGoodsPrice',        // 设置价格
    getGoodsAccountInfoList: '@root/yxGoodsAccount/getGoodsAccountInfoList',        // 获取严选商品对账信息列表
    exportGoodsAccountInfoList: '@root/yxGoodsAccount/exportGoodsAccountInfoList',        // 导出严选商品对账信息列表
  },
  feedback:{
    getFeedbackList: '@root/feedback/list',        // 查询SaaS使用申请
    exportFeedbackList: '@root/feedback/exportFeedbackList',        // SaaS使用申请导出
    approve: '@root/feedback/approve',        // saas试用申请审批接口
  },
  // 虚拟中奖信息
  virtualWin:{
    listPlatformAwardByPage: '@root/award/listPlatformAwardByPage',        // 虚拟中奖信息
    listPlatformAwardForExport: '@root/award/listPlatformAwardForExport',        // 导出虚拟中奖信息列表接口
    listRedPacket: '@root/award/listPlatformTotalRedPacketAwardByPage',   // 按单位统计红包记录列表接口
    listRedPacketExport: '@root/award/listPlatformTotalRedPacketAwardForExport',   // 导出按单位统计红包记录接口
    listRedPacketInfo: '@root/award/listPlatformRedPacketAwardByPage',   // 获取单个单位红包记录列表接口
    listRedPacketInfoExport: '@root/award/listPlatformRedPacketAwardForExport',   // 导出单个单位红包记录接口
  },
  // 自建商品审核
  createProduct:{
    listWxRedPacketConf: '@root/wxRedPacketConf/listWxRedPacketConf',  // 获取分页列表接口
    redPacketDetail: '@root/wxRedPacketConf/detail',  // 查看详情
    redPacketEnable: '@root/wxRedPacketConf/enable',  // 审核通过
    redPacketDisable: '@root/wxRedPacketConf/disable',  // 审核不通过
    redPacketDownload: '@root/wxRedPacketConf/download',  // 下载证书
  },

  // 审核
  auditDetails:{
    getImageList: '@root/approve/listContextCensorByPage',  //查询图文审核信息
    getVideoList: '@root/approve/listVideoCensorByPage',  //查询视频审核信息接口
    getRecordList: '@root/approve/listContentCensorLogByPage',  //查询审核记录
    censor: '@root/approve/censor',  //审批

    listWhiteListByPage: '@root/approve/listWhiteListByPage',  //查询视频网站白名单
    addWhiteList: '@root/approve/addWhiteList',  //添加视频网站白名单
    deleteWhiteList: '@root/approve/deleteWhiteList',  //删除视频网站白名单
    getApproveScoreRule: '@root/approve/getApproveScoreRule',  //查询自动审核规则
    updateApproveScoreRule: '@root/approve/updateApproveScoreRule',  //查询自动审核规则
  },

  //上传图片地址
  uploadUrl: '/api/adminFile/imgUpload',

  // logout
  sloginOut: '@root/loginOut',     //

}

