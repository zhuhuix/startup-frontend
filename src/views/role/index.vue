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
      <el-button-group class="card-toggle-table">
        <el-tooltip
          v-if="cardType"
          class="item"
          effect="dark"
          content="切换成表格"
          placement="top-start"
        >
          <el-button size="mini" plain icon="el-icon-s-grid" @click="toggle" />
        </el-tooltip>
        <el-tooltip
          v-else
          class="item"
          effect="dark"
          content="切换成卡片"
          placement="top-start"
        >
          <el-button
            size="mini"
            plain
            icon="el-icon-bank-card"
            @click="toggle"
          />
        </el-tooltip>
      </el-button-group>
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
    <!-- 卡片风格 -->
    <el-row v-if="cardType">
      <el-col
        v-for="item in roles"
        :key="item.id"
        :span="5"
        style="margin-bottom: 10px"
        :offset="1"
      >
        <el-card>
          <div slot="header" class="clearfix">
            <i class="el-icon-user" /><span style="margin-left: 5px">{{
              item.roleName
            }}</span>
            <div
              style="display: inline-block; float: right; cursor: pointer"
              @click="doEdit(item.id)"
            >
              <el-tooltip effect="dark" content="编辑角色" placement="top">
                <i class="el-icon-edit-outline" style="margin-left: 15px" />
              </el-tooltip>
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
          <div
            style="display: inline-block; float: left; cursor: pointer"
            @click="doAssignPemission(item.id, item.roleName)"
          >
            <el-tooltip effect="dark" content="权限分配" placement="bottom">
              <i class="el-icon-menu" />
            </el-tooltip>
          </div>
          <div
            style="display: inline-block; float: right; cursor: pointer"
            @click="doDelete(item.id)"
          >
            <el-tooltip effect="dark" content="删除角色" placement="bottom">
              <i class="el-icon-delete" style="margin-left: 15px" />
            </el-tooltip>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 列表风格 -->
    <el-table
      v-else
      ref="table"
      :data="roles"
      style="width: 100%; font-size: 12px"
      @selection-change="selectionChangeHandler"
    >
      <el-table-column
        :show-overflow-tooltip="true"
        width="150"
        prop="roleName"
        label="角色名称"
      />

      <el-table-column
        :show-overflow-tooltip="true"
        prop="createTime"
        width="155"
        label="创建时间"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述信息" />
      <el-table-column label="操作" width="300" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            round
            @click="doEdit(scope.row.id)"
          >编辑角色</el-button>
          <el-button
            size="mini"
            type="text"
            round
            @click="doDelete(scope.row.id)"
          >删除角色</el-button>
          <el-button
            size="mini"
            type="text"
            round
            @click="doAssignPemission(scope.row.id,scope.row.roleName)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限表单 -->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="showPermissionDialog"
      :title="permission.roleName"
      width="520px"
    >
      <treeselect
        v-model="permission.menus"
        :options="menuTree"
        :show-count="true"
        style="width: 480px"
        :multiple="true"
        :sort-value-by="sortValueBy"
        :value-consists-of="valueConsistsOf"
        :default-expand-level="1"
        placeholder="请选择或搜索菜单进行权限分配"
      />

      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="doPemissionCancel">取消</el-button>
        <el-button
          type="primary"
          @click="doSubmitPemission(permission)"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import { getRoleList, getRole, saveRole, deleteRole, getPermission, savePermission } from '@/api/role'
import { getMenuList } from '@/api/menu'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: '角色管理',
  components: { Treeselect },
  data() {
    return {
      showDialog: false,
      loading: false,
      cardType: true,
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
      },
      showPermissionDialog: false,
      permission: {},
      menuTree: [],
      valueConsistsOf: 'ALL_WITH_INDETERMINATE',
      sortValueBy: 'INDEX'
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
    },
    doAssignPemission(roleId, roleName) {
      var param = { name: '' }
      getMenuList(param).then(res => {
        if (res) {
          this.menuTree = this.ArrayToTreeData(res)
          getPermission(roleId).then(res => {
            if (res) {
              const menus = []
              res.forEach(element => {
                menus.push(element.menuId)
              })
              this.permission = { roleId: roleId, roleName: roleName, menus: menus }
              this.showPermissionDialog = true
            }
          })
        }
      })
    },
    doPemissionCancel() {
      this.showPermissionDialog = false
      this.permission = {}
    },
    doSubmitPemission(permission) {
      console.log(permission)
      savePermission(permission.roleId, permission.menus).then(res => {
        if (res) {
          this.showPermissionDialog = false
          this.$notify({
            title: '配置权限成功',
            type: 'success',
            duration: 2500
          })
        }
      })
    },
    ArrayToTreeData(data) {
      const cloneData = JSON.parse(JSON.stringify(data)) // 对源数据深度克隆
      return cloneData.filter(father => {
        const branchArr = cloneData.filter(child => father.id === child.pid) // 返回每一项的子级数组
        branchArr.length > 0 ? father.children = branchArr : '' // 如果存在子级，则给父级添加一个children属性，并赋值
        const parentArr = cloneData.filter(parent => parent.id === father.pid) // 判断该菜单的父级菜单是否存在
        if (parentArr.length === 0) { return father } // 如果该菜单的父级菜单不存在，则直接返回该菜单
        return father.pid === null // 返回第一层
      })
    },
    toggle() {
      this.cardType = !this.cardType
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

  .line {
    width: 100%;
    height: 1px;
    border-top: 1px solid #ccc;
  }
}

.card-toggle-table {
  padding: 4px 0;
  display: -webkit-flex;
  display: flex;
  float: right;
  align-items: center;
  margin-left: auto;
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
