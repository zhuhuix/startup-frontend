<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="queryString" size="small" clearable placeholder="输入编码、名称或者描述搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="doQuery" />
      <el-date-picker
        v-model="createTime"
        :default-time="['00:00:00','23:59:59']"
        type="daterange"
        range-separator=":"
        size="small"
        class="date-item"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="doQuery">搜索</el-button>
    </div>
    <!-- 表单渲染 -->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="doBeforeClose" :visible.sync="showDialog" width="520px">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="form.name" style="width: 380px;" />
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.name" style="width: 380px;" />
        </el-form-item>
        <el-form-item label="描述信息" prop="description">
          <el-input v-model="form.description" style="width: 380px;" rows="5" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="doCancel">取消</el-button>
        <el-button :loading="showDialog" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </el-dialog>
    <el-row :gutter="15">
      <!--角色管理-->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="margin-bottom: 10px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
          </div>
          <el-table ref="table" v-loading="loading" highlight-current-row :header-cell-style="{ fontSize: '12px'}" style="width: 100%;" :data="roles">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="rolecode" label="编码" />
            <el-table-column prop="roleName" label="名称" />
            <el-table-column :show-overflow-tooltip="true" prop="description" label="描述" />
            <el-table-column :show-overflow-tooltip="true" width="135px" prop="createTime" label="创建日期">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="130px" align="center" fixed="right" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
export default {
  name: 'Role',
  data() {
    return {
      showDialog: false,
      loading: false,
      form: {},
      roles: [],
      queryString: '',
      createTime: null,
      rules: {
        roleCode: [
          { required: true, message: '请输入编码', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {

  },
  methods: {
    parseTime,
    doQuery() {
      this.showDialog = true
    },
    doCancel() {
      this.showDialog = false
    },
    doSubmit() {
      this.showDialog = false
    },
    doBeforeClose() {
      this.showDialog = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
  ::v-deep .vue-treeselect__multi-value{
    margin-bottom: 0;
  }
  ::v-deep .vue-treeselect__multi-value-item{
    border: 0;
    padding: 0;
  }
</style>
