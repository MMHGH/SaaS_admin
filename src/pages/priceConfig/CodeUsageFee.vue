<template>
  <div>
    <!--<el-button type="text" style="position: absolute;right: 5px;top: 30px;transform: translateY(-50%);" @click="addCodeUsageFee">新增生码相关费用</el-button>-->

    <section class="tab type">
      <header>生码类型</header>
      <input id="codeUsageFeeType1" type="radio" value="1" v-model="codeType"/>
      <label for="codeUsageFeeType1"><span>普通二维码</span><span>最高生码数量</span></label>
      <input id="codeUsageFeeType2" type="radio" value="2" v-model="codeType"/>
      <label for="codeUsageFeeType2"><span>普通二维码</span><span>单次最大生码数量</span></label>
      <input id="codeUsageFeeType3" type="radio" value="3" v-model="codeType"/>
      <label for="codeUsageFeeType3"><span>视觉二维码</span><span>最高生码数量</span></label>
      <input id="codeUsageFeeType4" type="radio" value="4" v-model="codeType"/>
      <label for="codeUsageFeeType4"><span>视觉二维码</span><span>单次最大生码数量</span></label>
      <input id="codeUsageFeeType5" type="radio" value="5" v-model="codeType"/>
      <label for="codeUsageFeeType5"><span>套标二维码</span><span>最高生码数量</span></label>
      <input id="codeUsageFeeType6" type="radio" value="6" v-model="codeType"/>
      <label for="codeUsageFeeType6"><span>套标二维码</span><span>单次最大生码数量</span></label>
    </section>


    <section class="tab add">
      <header>新增</header>
      <el-button @click="addCodeUsageFee">新增{{codeKindText}}</el-button>
      <span>{{codeTypeText}}</span>
      <span>当前用户等级：{{level}}</span>
      <span>基础生码量：{{codeQuantity}}</span>
    </section>

    <el-table :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}">
      <el-table-column align="center" prop="unit" :label="codeKindText + '提升'"></el-table-column>
      <el-table-column align="left"   prop="price" label="价格">
        <template slot-scope="scope">{{ scope.row.price + '元' }}</template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">
          {{ scope.row.status === 'Y' ? "启用" : "禁用" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="设置">
        <template slot-scope="scope">
          <el-button size="medium" type="text" :disabled="customDisabled" @click="updateCodeUsageFee">配置</el-button>
          <el-button size="medium" type="text" :disabled="customDisabled">{{scope.row.status === "Y" ? "禁用" : "启用"}}</el-button>
          <el-button size="medium" type="text" :disabled="customDisabled">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


  </div>
</template>
<script>
  export default {
    data(){
      return {
        level: '个人普通用户',
        codeQuantity: 10000,
        codeType: '1',
        tableData: [
          {
            name: '最大生码数量提升',
            unit: '提高5%',
            price: '99',
            status: 'Y'
          },
          {
            name: '价格',
            unit: '提高10%',
            price: '100',
            status: 'N'
          },
          {
            name: '状态',
            unit: '提高15%',
            price: '99',
            status: 'Y'
          },
        ],
        customDisabled: false
      }
    },
    computed: {
      codeTypeText(){
        let text
        switch(this.codeType){
          case '1':
          case '2': text = '普通二维码'; break;
          case '3':
          case '4': text = '视觉二维码'; break;
          case '5':
          case '6': text = '套标二维码'; break;
        }
        return text
      },
      codeKindText(){
        return this.codeType % 2 === 1 ? '最高生码数量' : '单次最大生码数量'
      }
    },
    methods: {
      addCodeUsageFee(){
        this.$router.push({name: 'PriceConfigAddCodeUsageFee'})
      },
      updateCodeUsageFee(){
        this.$router.push({name: 'PriceConfigUpdateCodeUsageFee'})
      }
    }
  }
</script>
<style type="text/css" scoped>
  .tab{margin-bottom: 10px;}
  .tab header{background: #f2f2f2;margin-bottom: 10px;padding: 10px;}

  .tab.add .el-button{position: relative;margin-right: 3em;width: 12em;padding: 0;line-height: 2em;background: #169bd5;color: #fff;}
  .tab.add .el-button:hover:before{content: "";position: absolute;top: 0;left: 0;right: 0;bottom: 0;background: rgba(255, 255, 255, .2);}
  .tab.add>span{display: inline-block;margin-right: 3em;}

  input[type="radio"]{position:absolute;clip:rect(0,0,0,0);}
  input[type="radio"]+label{
    display:inline-block;
    position:relative;
    margin-right:1em;padding: .75em 0;width:9em;text-align:center;border-radius:.25em;border:1px solid #dcdfe6;
    color:#606266;background:#fff;
    cursor:pointer;
  }
  input[type="radio"]+label span{display: block;line-height: 1.5em;}
  input[type="radio"]:checked+label{
    background:#fff;
    border-color:#169bd5;
    color:#169bd5;
  }
  input[type="radio"]:checked+label:before{
    content:"\2713";
    position:absolute;bottom:-.2em;right:-.3em;
    width:1.2em;height:1.2em;border-radius:50%;
    line-height:1.2em;text-align:center;
    color:#fff;background-color:#169bd5;
  }
</style>

