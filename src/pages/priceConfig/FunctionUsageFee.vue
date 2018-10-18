<template>
  <div>
    <el-button type="text" style="position: absolute;right: 5px;top: 30px;transform: translateY(-50%);" @click="addFunctionUsageFee">新增功能使用费</el-button>
    <el-table :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}">
      <el-table-column align="center" prop="name" label="功能名称"></el-table-column>
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
          <el-button size="medium" type="text" :disabled="customDisabled" @click="updateFunctionUsageFee">配置</el-button>
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
            name: '开通自建资源奖品功能',
            unit: '元',
            price: '99',
            status: 'Y'
          },
          {
            name: '自建资源奖品',
            unit: '元/资源奖品',
            price: '100',
            status: 'N'
          },
          {
            name: '开通自建资源奖品功能',
            unit: '元',
            price: '99',
            status: 'Y'
          },
          {
            name: '自建资源奖品',
            unit: '元/资源奖品',
            price: '100',
            status: 'N'
          },
        ],
        customDisabled: false
      }
    },
    methods: {
      addFunctionUsageFee(){
        this.$router.push({name: 'PriceConfigAddFunctionUsageFee'})
      },
      updateFunctionUsageFee(){
        this.$router.push({name: 'PriceConfigUpdateFunctionUsageFee'})
      }
    }
  }
</script>
<style type="text/css" scoped></style>

