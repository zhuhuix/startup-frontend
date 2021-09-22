<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input
        v-model="roleName"
        size="small"
        clearable
        placeholder="输入角色名称搜索"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="doQuery"
      />
      <el-date-picker
        v-model="createTime"
        :default-time="['00:00:00', '23:59:59']"
        type="daterange"
        range-separator=":"
        size="small"
        class="date-item"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="doQuery"
      >搜索</el-button>
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="doAdd"
      >新增</el-button>
    </div>
    <!-- 表单渲染 -->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="doBeforeClose"
      :visible.sync="showDialog"
      width="520px"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="form.roleCode" style="width: 380px" />
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" style="width: 380px" />
        </el-form-item>
        <el-form-item label="描述信息" prop="description">
          <el-input
            v-model="form.description"
            style="width: 380px"
            rows="5"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="doCancel">取消</el-button>
        <el-button
          :loading="formLoading"
          type="primary"
          @click="doSubmit(form)"
        >确认</el-button>
      </div>
    </el-dialog>
    <el-row>
      <el-col
        v-for="item in roles"
        :key="item.id"
        :span="5"
        style="margin-bottom: 10px"
        :offset="1"
      >
        <el-card>
          <div slot="header" class="clearfix">
            <i class="el-icon-user" /><span style="margin-left: 5px">{{ item.roleName }}</span>

            <div style="display: inline-block; float: right; cursor: pointer" @click="doEdit(item.id)">
              <i class="el-icon-edit-outline" style="margin-left: 15px" />

            </div>
          </div>
          <div>
            <ul class="role-info">
              <li>
                <div class="role-left">描述信息：{{ item.description }}</div>
              </li>
              <li>
                <div class="role-left">
                  创建时间：{{ parseTime(item.createTime) }}
                </div>
              </li>
            </ul>
          </div>
          <div style="display: inline-block; float: right; cursor: pointer" @click="doDelete(item.id)">
            <i class="el-icon-delete" style="margin-left: 15px" />
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import { getRoleList, getRole, saveRole, deleteRole } from '@/api/role'
export default {
  name: 'Role',
  data() {
    return {
      showDialog: false,
      loading: false,
      formLoading: true,
      form: {},
      roles: [],
      roleName: '',
      createTime: null,
      rules: {
        roleCode: [
          { required: true, message: '请输入角色编码', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {

  },
  methods: {
    parseTime,
    doQuery() {
      var param = { roleName: this.roleName }
      if (this.createTime != null) {
        param.createTimeStart = Date.parse(this.createTime[0])
        param.createTimeEnd = Date.parse(this.createTime[1])
      }
      getRoleList(param).then(res => {
        if (res) {
          this.roles = res
        }
      })
    },
    doAdd() {
      this.showDialog = true
      this.formLoading = false
      this.form = {}
    },
    doEdit(id) {
      this.showDialog = true
      getRole(id).then(res => {
        if (res) {
          this.form = res
          this.formLoading = false
        }
      })
    },
    doCancel() {
      this.showDialog = false
      this.formLoading = true
      this.form = {}
    },
    doSubmit(role) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formLoading = true
          saveRole(role).then(res => {
            if (res) {
              this.showDialog = false
              this.$notify({
                title: '保存成功',
                type: 'success',
                duration: 2500
              })
              this.doQuery()
            }
          }).catch(() => {
            this.formLoading = false
          })
        }
      })
    },
    doDelete(id) {
      this.$confirm(`确认删除此条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() =>
        deleteRole([id]).then(res => {
          if (res) {
            this.$notify({
              title: '删除成功',
              type: 'success',
              duration: 2500
            })
            this.doQuery()
          }
        })
      ).catch(() => {
      })
    },
    doBeforeClose() {
      this.showDialog = true
    }
  }
}

</script>

<style rel="stylesheet/scss" lang="scss">
.role-span {
  font-weight: bold;
  color: #303133;
  font-size: 15px;
}
.role-info {
  margin-top: 0;
  padding-top: 0;
  padding-left: 0;
  list-style: none;
  li {
    border-bottom: 1px solid #f0f3f4;
    padding: 11px 0;
    font-size: 12px;
  }
  .role-left {
    color: rgb(148, 137, 137);
    overflow: hidden;
    white-space: nowrap;
    text-align: left;
    text-overflow: ellipsis;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
::v-deep .vue-treeselect__multi-value {
  margin-bottom: 0;
}
::v-deep .vue-treeselect__multi-value-item {
  border: 0;
  padding: 0;
}
</style>
