<template>
  <div class="yxCommodityManage">
    <div class="mat-header">网易严选 / <span>物资管理</span></div>
    <el-tabs value="you163" class="body">
      <el-tab-pane label="网易严选物资管理" name="you163">
        <div class="mateForm">
          <el-form :inline="true" :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-dynamic">
            <el-form-item prop="goodsName" label="商品名：">
              <el-input v-model="ruleForm.goodsName" placeholder="商品名" size="small" style="width: 215px;"></el-input>
            </el-form-item>
            <el-form-item prop="firstCategoryId" label="一级类目：">
              <el-select v-model="ruleForm.firstCategoryId" placeholder="一级类目" size="small"
                         @change="getSecondaryCategory" :clearable="true">
                <!--<el-option label="全部" value="" selected>全部</el-option>-->
                <el-option
                  v-for="item in firstCategory"
                  :key="item.id"
                  :label="item.categoryName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="secondCategoryId" label="二级类目：">
              <el-select v-model="ruleForm.secondCategoryId" placeholder="二级类目" size="small" :clearable="true">
                <el-option
                  v-for="item in secondaryCategory"
                  :key="item.id"
                  :label="item.categoryName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="price" label="售价：">
              <el-input v-model="ruleForm.price" placeholder="售价" size="small" style="width: 215px;"></el-input>
            </el-form-item>

            <el-form-item prop="saasType" label="平台状态：">
              <el-select v-model="ruleForm.saasType" placeholder="平台状态" size="small">
                <el-option
                  v-for="item in saasStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="itemId" label="ITEMID：">
              <!--<el-input-number v-model="ruleForm.itemId" :controls="false" placeholder="ITEMID" size="small" style="width: 215px;"></el-input-number>-->
              <el-input v-model="ruleForm.itemId" placeholder="ITEMID" size="small" style="width: 215px;"></el-input>
            </el-form-item>
            <el-form-item prop="skuId" label="SKUID：">
              <!--<el-input-number v-model="ruleForm.skuId" :controls="false" placeholder="SKUID" size="small" style="width: 215px;"></el-input-number>-->
              <el-input v-model="ruleForm.skuId" placeholder="SKUID" size="small" style="width: 215px;"></el-input>
            </el-form-item>
            <el-form-item prop="skuType" label="sku状态：">
              <el-select v-model="ruleForm.skuType" placeholder="sku状态" size="small">
                <el-option
                  v-for="item in skuStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="padding-left: 20px;">
              <el-button type="primary" @click="queryData" size="small">筛选</el-button>
              <el-button type="text" @click="resetForm('ruleForm')" size="small">清空筛选条件</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <div class="metaContent">
        <div class="btns">
          <el-button type="primary" size="small" @click="allUpStatus('up')">批量上架</el-button>
          <el-button type="primary" size="small" @click="allUpStatus('down')">批量下架</el-button>
          <el-button type="primary" size="small" @click="refreshData">刷新</el-button>
        </div>
        <div class="mateTable">
          <el-table ref="multipleTable" border :data="tableData" :header-cell-style="{backgroundColor: '#f2f2f2'}"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column align="center" prop="goodsName" label="商品名" min-width="150"></el-table-column>
            <el-table-column align="center" prop="firstCategory" label="一级类目" width="150"></el-table-column>
            <el-table-column align="center" prop="secondCategory" label="二级类目" width="150"></el-table-column>
            <el-table-column align="center" prop="yxspuId" label="ITEMID" width="120"></el-table-column>
            <el-table-column align="center" prop="yxskuId" label="SKUID" width="120"></el-table-column>
            <el-table-column align="center" prop="specName" label="规格" width="150"></el-table-column>
            <el-table-column align="center" prop="inventory" label="库存" width="100"></el-table-column>
            <el-table-column align="center" prop="classification" label="商品等级" width="100"></el-table-column>
            <el-table-column align="center" prop="skuType" label="sku状态" width="100">
              <template slot-scope="scope">{{ scope.row.skuType | fmtStatus(skuStatus)}}</template>
            </el-table-column>
            <el-table-column align="center" prop="price" label="售价" width="100"></el-table-column>
            <el-table-column align="center" prop="saasType" label="平台状态" width="100">
              <template slot-scope="scope">{{ scope.row.saasType | fmtStatus(saasStatus)}}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="saasPrice" label="平台价格" width="120"></el-table-column>
            <el-table-column align="center" prop="operation" width="200" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="upStatus(scope.row)" v-if="scope.row.saasType==2">上架</el-button>
                <el-button type="text" @click="upStatus(scope.row)" v-if="scope.row.saasType==1">下架</el-button>
                <a :href="scope.row.goodsUrl" target="_blank" style="color: #409EFF;">官网链接</a>
                <el-button type="text" @click="showDialog(scope.row)">设置价格</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>

      <!-- 修改官网链接/设置价格 -->
      <el-dialog title="设置价格" @close="closeDialog('ruleFormUp')"
                 :visible.sync="dialogVisible" width="450px">
        <el-form :model="ruleFormUp" :rules="rules" ref="ruleFormUp" label-width="100px" class="demo-ruleForm">
          <el-form-item label="价格" prop="price">
            <el-input :controls="false" v-model="ruleFormUp.price" maxlength="12"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveDialog('ruleFormUp')">确 定</el-button>
        </span>
      </el-dialog>

    </el-tabs>
  </div>
</template>

<script>
  import validator from '@/util/validator'

  export default {
    name: "yxCommodityManage",
    data() {
      var validatePrice = (rule, value, callback) => {
        validator.onlyFloat(callback, value)
        let pattern = /^\d{0,8}(\.\d{0,2})?$/
        if (!pattern.test(value)) {
          return (callback(new Error('请输入有效数值，小数点后保留2位，商品价格不允许超出范围')))
        }
        callback()
      };
      return {
        ruleForm: {
          goodsName: '',
          itemId: '',
          skuId: '',
          price: '',
          saasType: '',
          skuType: '',
          firstCategoryId: '',
          secondCategoryId: ''
        },
        firstCategory: [], // 一级类目
        secondaryCategory: [], // 二级类目
        saasStatus: [// 平台状态
          {label: '全部', value: ''},
          {label: '上架', value: 1},
          {label: '下架', value: 2}
        ],
        skuStatus: [// sku状态
          {label: '全部', value: ''},
          {label: '启用', value: 1},
          {label: '未启用', value: 2}
        ],
        dialogVisible: false,
        editRow: null, // 修改行
        ruleFormUp: {
          price: '',
        },
        rules: {
          price: [
            {required: true, message: '请输入价格', trigger: 'blur'},
            {validator: validatePrice, trigger: 'blur'}
          ],
        },
        allSelection: [],
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
      }
    },
    methods: {
      /**
       * 查询 一级类目
       */
      getFirstCategory() {
        this.axios.post(this.$api.yxGoods.getGoodsCategoryList, {}).then((res) => {
          let data = res.data.data, msg = res.data.message;
          if (msg == 'ok') {
            this.firstCategory = data;
          }
        })
      },
      /**
       * 查询二级类目
       * */
      getSecondaryCategory(val) {
        if (val) {
          this.axios.post(this.$api.yxGoods.getGoodsCategoryList, {categoryId: val}).then((res) => {
            let data = res.data.data, msg = res.data.message;
            if (msg == 'ok') {
              this.secondaryCategory = data;
            }
          })
        }
      },
      /**
       * 查询
       * */
      queryData() {
        this.pageNum = 1;
        this.getGoodsList();
      },
      /**
       * 查询 严选商品
       */
      getGoodsList() {
        let param = this.ruleForm;
        param.pageNum = this.pageNum;
        param.pageSize = this.pageSize;
        this.axios.post(this.$api.yxGoods.getGoodsList, param).then((res) => {
          let data = res.data.data, msg = res.data.message;
          if (msg == 'ok') {
            this.tableData = data.list;
            this.total = data.total;
          } else {
            this.$message.error('查询失败：' + msg);
          }
        })
      },
      /**
       * 清空
       */
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 获取选中数据
      handleSelectionChange(val) {
        this.allSelection = val;
      },
      /**
       * 刷新
       * */
      refreshData() {
        this.axios.post(this.$api.yxGoods.importItems, {}).then((res) => {
          let data = res.data.data, msg = res.data.message;
          if (msg == 'ok') {
            this.pageNum = 1;
            this.queryData();
            this.$message({
              message: '刷新成功',
              type: 'success'
            });
          } else {
            this.$message.error('刷新失败：' + msg);
          }
        })
      },
      /**
       * 批量 上架 / 下架
       * 商品状态（1.上架2.下架）
       * */
      allUpStatus(type) {
        if (this.allSelection.length === 0) {
          this.$message('请选中需要批量操作的商品。');
          return;
        }
        let title = type == 'up' ? '上架' : '下架';

        this.$confirm(`是否确认批量${title}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {skuIds: [], status: type == 'up' ? 1 : 2};
          this.allSelection.forEach((item) => {
            params.skuIds.push(item.skuId);
          })
          this.axios.post(this.$api.yxGoods.batchUpdateGoodsStatus, params).then((res) => {
            let data = res.data.data, msg = res.data.message;
            if (msg == 'ok') {
              this.$message({
                message: '批量操作成功',
                type: 'success'
              });
              this.pageNum = 1;
              this.queryData();
            } else {
              this.$message.error('操作失败：' + msg);
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      /**
       * 上架 / 下架
       * */
      upStatus(row) {
        let params = {skuIds: [row.skuId], status: row.saasType == 1 ? 2 : 1};
        this.axios.post(this.$api.yxGoods.batchUpdateGoodsStatus, params).then((res) => {
          let data = res.data.data, msg = res.data.message;
          if (msg == 'ok') {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.pageNum = 1;
            this.queryData();
          } else {
            this.$message.error('操作失败：' + msg);
          }
        })
      },
      /**
       * 设置价格
       * */
      showDialog(row) {
        this.editRow = row;
        this.ruleFormUp.price = row.saasPrice;
        this.dialogVisible = true;
      },
      /**
       * 关闭弹窗
       * */
      closeDialog(formName) {
        this.$refs[formName].resetFields();
      },
      /**
       * 保存 设置价格
       * */
      saveDialog(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {skuId: this.editRow.skuId, price: this.ruleFormUp.price};
            this.axios.post(this.$api.yxGoods.updateGoodsPrice, params).then((res) => {
              let data = res.data.data, msg = res.data.message;
              if (msg == 'ok') {
                this.$message({
                  message: '设置价格成功',
                  type: 'success'
                });
                this.pageNum = 1;
                this.queryData();
                this.dialogVisible = false;
              } else {
                this.$message.error('设置失败：' + msg);
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      /**
       * 切换 页大小
       * @param val
       */
      handleSizeChange(val) {
        this.pageNum = 1;
        this.pageSize = val;
        this.getGoodsList();
      },
      /**
       * 翻页
       * @param val
       */
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getGoodsList();
      },
    },
    filters: {
      // 状态过滤器
      fmtStatus(val, list) {
        if (val) {
          for (let item of list) {
            if (item.value == val) {
              return item.label;
            }
          }
        }
        return '';
      }
    },
    mounted() {
      // 查询一级类目
      this.getFirstCategory();
      // 列表查询
      this.queryData();
    }
  }
</script>

<style scoped>
  .yxCommodityManage {
    background: rgb(242, 242, 242);
  }

  .yxCommodityManage .body {
    background: #ffffff;
    padding: 0px 15px 15px 15px;
    margin-top: 5px;
  }

  .mat-header {
    background-color: #ffffff;
    padding: 15px 15px;
    font-size: 20px;
  }

  .mat-header span {
    color: #0033FF;
  }

  .yxCommodityManage > p {
    text-indent: 20px;
  }

  .mateForm {
    background: #f2f2f2;
    padding-top: 20px;
  }

  .metaContent {
    background-color: #ffffff;
    margin-top: 10px;
  }

  .metaContent .btns {
    padding-left: 20px;
    padding-bottom: 10px;
  }

  .mateForm form {
    padding-left: 10px;
  }

  .mateTable img {
    width: 100px;
  }

  .page {
    text-align: center;
    margin-top: 10px;
  }

  .top_info {
    margin: 10px 20px 0 20px;
    background: rgba(255, 247, 204, 1);
  }

  .left_size {
    color: #0033FF;
    margin-left: 20px;
  }
</style>
