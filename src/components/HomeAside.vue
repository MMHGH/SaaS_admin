<template>
  <aside class="home-aside" id="home-aside">
    <!-- LOGO -->
    <figure class="logo">
      <img src="../assets/images/logo.png"/>
      <figcaption>
        <h1>快消品平台管理后台</h1>
        <p>
          <span>用户名：{{username}}</span>
          <!--<a href="javascript:;" @click="logOut">注销</a>-->
          <a href="javascript:;" @click="$router.push({path:'/accountConf'})" title="设置账号">设置</a>
        </p>
      </figcaption>
    </figure>
    <!-- 导航菜单 -->
    <!--<el-menu id="mainMenu" ref="mainMenu" background-color="#484848" text-color="#e6e6e6" active-text-color="#e6e6e6"
             :default-active="defaultMenuActive" @select="menuSelect"
             :unique-opened="true" menu-trigger="click" :router="true">-->
    <el-menu id="mainMenu" ref="mainMenu" background-color="#484848" text-color="#e6e6e6" active-text-color="#e6e6e6"
             :default-active="defaultMenuActive" @select="menuSelect"
             router :unique-opened="true" menu-trigger="click">
        <el-menu-item index="/userLevelDefinition"><span>自定义用户等级</span></el-menu-item>
        <el-menu-item index="/userManagement"><span>平台用户管理</span></el-menu-item>
        <el-menu-item index="/priceConfig"><span>价格配置</span></el-menu-item>
        <el-menu-item index="/orderManagement"><span>订单管理</span></el-menu-item>
        <el-menu-item index="/materialManagement"><span>物资管理</span></el-menu-item>
        <!--<el-menu-item index="/prizeList"><span>实物中奖列表</span></el-menu-item>-->
        <!-- <el-menu-item index="/virtualWinningList"><span>虚拟中奖信息</span></el-menu-item> -->
        <el-submenu class="m-submenu-popper" index="0">
          <template slot="title" >
            <span>印刷厂管理</span>
          </template>
          <el-menu-item index="/printHouse/printHouseManage"><span>印刷厂管理</span></el-menu-item>
          <el-menu-item index="/printHouse/printHouseCheck"><span>印刷厂审核</span></el-menu-item>
        </el-submenu>
        <el-submenu class="m-submenu-popper" index="1">
          <template slot="title" >
            <span>虚拟中奖信息</span>
          </template>
          <el-menu-item index="/virtualWinningList"><span>中奖信息</span></el-menu-item>
          <el-menu-item index="/redPacketWinningList"><span>微信红包中奖信息</span></el-menu-item>
        </el-submenu>
        <el-submenu class="m-submenu-popper" index="2">
          <template slot="title" >
            <span>自建商品审核</span>
          </template>
          <el-menu-item index="/myAwardList"><span>自建商品审核</span></el-menu-item>
          <el-menu-item index="/openRedPacketAudit"><span>开通微信红包审核</span></el-menu-item>

          <el-menu-item index="/videoAudit"><span>视频审核</span></el-menu-item>
          <el-menu-item index="/imageTextAudit"><span>图文审核</span></el-menu-item>
          <el-menu-item index="/auditLogging"><span>审核记录</span></el-menu-item>
          <!-- <el-menu-item index="/auditRuleSetting"><span>自动审核规则设置</span></el-menu-item> -->
        </el-submenu>

        <el-menu-item index="/agentUserList"><span>代理商用户列表</span></el-menu-item>

        <el-submenu class="m-submenu-popper" index="4">
          <template slot="title" >
            <span>客户留言</span>
          </template>
          <el-menu-item index="/labelMakingMessage"><span>标签制作留言</span></el-menu-item>
          <el-menu-item index="/rawCodeMessage"><span>生码域名定制留言</span></el-menu-item>
          <el-menu-item index="/shareGeneraMessage"><span>推广域名定制留言</span></el-menu-item>
          <!--<el-menu-item index="/rebateConditionCustom"><span>返利条件定制</span></el-menu-item>-->
        </el-submenu>
        <el-submenu class="m-submenu-popper" index="5">
          <template slot="title" >
            <span>用户域名管理</span>
          </template>
          <el-menu-item index="/platformUser"><span>平台用户</span></el-menu-item>
          <el-menu-item index="/agentUse"><span>代理商企业用户</span></el-menu-item>
        </el-submenu>

        <el-menu-item index="/resourceAllocationRecord"><span>资源分配记录</span></el-menu-item>
        <!-- <el-menu-item index="/myAwardList">
            <span>自建商品审核</span>
        </el-menu-item> -->
        <el-submenu class="m-submenu-popper" index="3">
          <template slot="title" >
            <!--<i class="icon" data-icon="4"></i>-->
            <span>网易严选商品管理</span>
          </template>
          <el-menu-item index="/yxCommodityManage"><span>网易严选商品管理</span></el-menu-item>
          <el-menu-item index="/yxOrderManage"><span>网易严选订单</span></el-menu-item>
        </el-submenu>
        <el-menu-item index="/saasTrialManage"><span>SAAS试用申请</span></el-menu-item>
        <el-menu-item index="/upgradeMaintenance"><span>系统管理</span></el-menu-item>
    </el-menu>
  </aside>
</template>

<script>
let WIN = (function(){return this || (0, eval)('this')})(),
  DOC = WIN.document
export default {
  name: 'home-aside',
  data(){
    return {
      username: '',
      defaultMenuActive: '',
    }
  },
  methods: {
    // 事件句柄
    clickEvent(e){
      let target = e.target, key = true
      while (target.tagName !== 'BODY') {
        if (target.id === 'mainMenu') {
          key = false
          return
        }
        target = target.parentNode
      }
      if (key) {
        let openedMenus = this.$refs.mainMenu.openedMenus.concat([])
        openedMenus.forEach((item) => {
          this.$refs.mainMenu.closeMenu(item)
        })
      }
    },
    // 菜单选择
    menuSelect(index){
      sessionStorage.setItem('defaultMenuActive', index)
    },
    // 注销
    logOut(){
      this.$confirm('确定注销用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        // 1.sendData
        let sendData = {};

        // 2.post
        let vm = this
        this.axios.post(this.$api.sloginOut,sendData).then(function(respone){
          let msg = respone.data.message;
          if(msg == 'ok'){
            vm.$message({message: '已成功注销！'})
            setTimeout(function () {
              // 清除缓存
              sessionStorage.removeItem('username')
              setTimeout(() => {
                vm.$router.push({ path: '/login' });
              }, 500);
            }, 1000)
          }
        }).catch(function(error){
          console.error(error);
        });
      }).catch((err) => {
      })
    }
  },
  mounted: function() {
    this.username = this.$route.query.name || sessionStorage.getItem('username')
    this.defaultMenuActive = this.$route.query.defaultMenuActive || sessionStorage.getItem('defaultMenuActive')
    DOC.querySelector('#app').addEventListener('click', this.clickEvent, false)
  },
  destroyed(){
    DOC.querySelector('#app').removeEventListener('click', this.clickEvent, false)
  }
}
</script>

<style>
/* 左侧导航 */
.home-aside{position: absolute;top: 0;left: 0;width: 140px;height: 100%;background: #484848;margin-top: -1px;/*z-index: 9000;*/}
/* LOGO */
.home-aside .logo{position: relative;top:20px;z-index: 20;margin: 0;/*padding-top: 20px;*/text-align: center;font-size: 14px;}
.home-aside .logo h1{margin: 0;padding: 20px 1em 0;font-size: 12px;color: #e6e6e6;text-align: center;}
.home-aside .logo p{text-align: left;color: #e6e6e6;font-size: 12px; margin: 10px auto;display: inline-block;}
.home-aside .logo p a{margin-left: 1em;font-size: 12px;color: #e6e6e6;outline: none;}
.home-aside .logo img{width: 120px;}
/* menu */
.home-aside .logo+.el-menu{z-index: 10;height: 100%;margin-top: -129px;padding-top: 149px;box-sizing: border-box;}
.home-aside .el-menu{font-weight: 700;border-right: none;border-bottom: none;}
.home-aside .el-menu .icon{position: absolute;top: 50%;left: 20px;transform: translateY(-50%);vertical-align: middle;width: 20px;height: 20px;background-size: 20px 20px;}
.home-aside .el-menu .icon[data-icon="1"]{background-image: url("../assets/images/u6.png")}
.home-aside .el-menu .icon[data-icon="2"]{background-image: url("../assets/images/u3.png")}
.home-aside .el-menu .icon[data-icon="3"]{background-image: url("../assets/images/u7.png")}
.home-aside .el-menu .icon[data-icon="4"]{background-image: url("../assets/images/u17.png")}
.home-aside .el-menu .icon[data-icon="5"]{background-image: url("../assets/images/u9.png")}
.home-aside .el-menu .icon[data-icon="6"]{background-image: url("../assets/images/u34.png")}
.home-aside .el-menu .icon[data-icon="7"]{background-image: url("../assets/images/u15.png")}
.home-aside .el-menu .icon[data-icon="8"]{background-image: url("../assets/images/u31.png")}
.home-aside .el-menu .icon[data-icon="9"]{background-image: url("../assets/images/u11.png")}
.home-aside .el-menu .icon[data-icon="10"]{background-image: url("../assets/images/u13.png")}
.home-aside .el-menu .icon[data-icon="11"]{background-image: url("../assets/images/u20.png")}
.home-aside .el-menu .el-menu-item,
.home-aside .el-menu .el-submenu__title{color: #fff!important;height: 40px;line-height: 40px;}
.home-aside .el-menu .el-menu-item:hover,
  /*.home-aside .el-menu .el-menu-item.is-active,*/
.home-aside .el-menu .el-submenu__title:hover{background-color: #5a5a5a!important;}
.home-aside .el-menu .el-menu-item.is-active{background-color: #5a5a5a!important;}
.home-aside .el-menu>.el-menu-item span,
.home-aside .el-menu .el-submenu .el-submenu__title span{display: block;/*padding-left: 30px;*/text-align: center;}
.home-aside .el-menu .el-submenu .el-menu-item{min-width: 100%;background-color: #5a5a5a!important;}
.home-aside .el-menu .el-submenu .el-submenu .el-submenu__title{background-color: #5a5a5a!important;}
.home-aside .el-menu .el-submenu .el-submenu .el-submenu__title span{padding-left: 0;}
.home-aside .el-menu .el-submenu__icon-arrow.el-icon-arrow-down{display: none;}
/* module */
.home-aside .el-menu .el-submenu.m-submenu-popper:after{content: "";position: absolute;top: 0;left: 0;width: 140px;height: 100%;background: #484848;z-index: -1;}
.home-aside .el-menu .el-submenu.m-submenu-popper .el-submenu__title+.el-menu{/*opacity: 0;*/display: block!important;z-index: -1!important;position: absolute;top: 0; left: 0;width: 140px;height: 100%!important;padding: 0;border-right: 1px solid #f2f2f2;background-color: rgba(255, 255, 255, 1)!important;}
.home-aside .el-menu .el-submenu.m-submenu-popper .el-submenu__title+.el-menu{/*transition: opacity .5s, left .5s;*/transition: left .75s;}

/*.home-aside:hover .el-menu .el-submenu.is-opened .el-submenu__title+.el-menu{left: 140px;opacity: 1;}*/
.home-aside .el-menu .el-submenu:hover .el-submenu__title+.el-menu{left: 140px;opacity: 1;}

/*aside .el-menu:hover .el-submenu.m-submenu-popper.is-opened .el-submenu__title+.el-menu{left: 140px;opacity: 1;}*/
.home-aside .el-menu .el-submenu.m-submenu-popper .el-submenu__title+.el-menu .el-menu-item{transition: none;padding: 0!important;color: #606266!important;background-color: transparent!important;text-align: center;font-weight: 400;}
.home-aside .el-menu .el-submenu.m-submenu-popper .el-submenu__title+.el-menu .el-menu-item:first-child{margin-top: 129px;}
.home-aside .el-menu .el-submenu.m-submenu-popper .el-submenu__title+.el-menu .el-menu-item:hover,
.home-aside .el-menu .el-submenu.m-submenu-popper .el-submenu__title+.el-menu .el-menu-item.is-active{background-color: #f2f2f2!important;}
.home-aside .el-menu .el-submenu.m-submenu-popper .el-submenu__title+.el-menu .el-menu-item span{margin: 0 15px;padding: 0;/*border-bottom: 1px solid #f2f2f2;*/}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>

