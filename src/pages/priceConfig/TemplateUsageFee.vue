<template>
  <div>
    <el-button type="text" style="position: absolute;right: 5px;top: 30px;transform: translateY(-50%);" @click="addTemplateUsageFee">新增模板使用费</el-button>
    <el-table :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}">
      <el-table-column align="center" prop="name" label="模板名称"></el-table-column>
      <el-table-column align="left"   prop="price" label="当前价格">
        <template slot-scope="scope">
          {{ scope.row.price + scope.row.unit }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="当前状态">
        <template slot-scope="scope">
          {{ scope.row.status === 'Y' ? "启用" : "禁用" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="设置">
        <template slot-scope="scope">
          <el-button size="medium" type="text" :disabled="customDisabled" @click="updateTemplateUsageFee">配置</el-button>
          <el-button size="medium" type="text" :disabled="customDisabled">
            {{scope.row.status === "Y" ? "禁用" : "启用"}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        tableData: [
          {
            name: '大转盘',
            unit: '元/月',
            price: '99',
            status: 'Y'
          },
          {
            name: '开宝箱',
            unit: '元/月',
            price: '100',
            status: 'N'
          },
          {
            name: '摇钱树',
            unit: '元/月',
            price: '99',
            status: 'Y'
          },
        ],
        customDisabled: false
      }
    },
    methods: {
      addTemplateUsageFee(){
        this.$router.push({name: 'PriceConfigAddTemplateUsageFee'})
      },
      updateTemplateUsageFee(){
        this.$router.push({name: 'PriceConfigUpdateTemplateUsageFee'})
      }
    }
  }
</script>
<style type="text/css" scoped></style>

