<template>
  <div>
    <el-button type="text" style="position: absolute;right: 5px;top: 30px;transform: translateY(-50%);" @click="addOrganizationUsageFee">新增组织权益费用</el-button>
    <el-table :data="tableData" size="medium" :header-cell-style="{backgroundColor: '#f2f2f2'}">
      <el-table-column align="center" prop="name" label="类别等级"></el-table-column>
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
          <el-button size="medium" type="text" :disabled="customDisabled" @click="updateOrganizationUsageFee">配置</el-button>
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
            name: '建立组织层数',
            unit: '元/层',
            price: '99',
            status: 'Y'
          },
          {
            name: '创建账号数量',
            unit: '元/层',
            price: '100',
            status: 'N'
          },
          {
            name: '创建角色数量',
            unit: '元/个',
            price: '99',
            status: 'Y'
          },
        ],
        customDisabled: false
      }
    },
    methods: {
      addOrganizationUsageFee(){
        this.$router.push({name: 'PriceConfigAddOrganizationUsageFee'})
      },
      updateOrganizationUsageFee(){
        this.$router.push({name: 'PriceConfigUpdateOrganizationUsageFee'})
      }
    }
  }
</script>
<style type="text/css" scoped></style>

