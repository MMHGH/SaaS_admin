<template>
  <div>
    <el-button type="text" style="position: absolute;right: 5px;top: 30px;transform: translateY(-50%);" @click="addPlatformUsageFee">新增平台使用费</el-button>
    <el-table :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}">
      <el-table-column align="center" prop="level" label="类别等级"></el-table-column>
      <el-table-column align="left"   prop="unit"  label="权益时长">
        <template slot-scope="scope">
          {{ '1' + scope.row.unit }}
        </template>
      </el-table-column>
      <el-table-column align="left"   prop="price"  label="当前价格">
        <template slot-scope="scope">
          {{ scope.row.price + '元' }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="当前状态">
        <template slot-scope="scope">
          {{ scope.row.status === 'Y' ? "启用" : "禁用" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="设置">
        <template slot-scope="scope">
          <el-button size="medium" type="text" :disabled="customDisabled" @click="updatePlatformUsageFee">配置</el-button>
          <el-button size="medium" type="text" :disabled="customDisabled">
            {{scope.row.status === "Y" ? "禁用" : "启用"}}
          </el-button>
          <el-button native-type="submit" size="medium" type="text" :disabled="customDisabled">删除</el-button>
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
            level: '集团VIP用户',
            unit: '月',
            price: '99',
            status: 'Y'
          },
          {
            level: '集团普通用户',
            unit: '月',
            price: '100',
            status: 'N'
          },
          {
            level: '集团VIP用户',
            unit: '天',
            price: '99',
            status: 'Y'
          },
          {
            level: '集团试用用户',
            unit: '年',
            price: '100',
            status: 'N'
          }
        ],
        customDisabled: false
      }
    },
    methods: {
      addPlatformUsageFee(){
        this.$router.push({name: 'PriceConfigAddPlatformUsageFee'})
      },
      updatePlatformUsageFee(){
        this.$router.push({name: 'PriceConfigUpdatePlatformUsageFee'})
      }
    }
  }
</script>
<style type="text/css" scoped></style>

