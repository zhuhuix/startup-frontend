<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input
        v-model="userName"
        size="small"
        clearable
        placeholder="输入账号或用户名称搜索"
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
        type="danger"
        icon="el-icon-circle-plus-outline"
        :disabled="selections.length === 0"
        @click="doDelete"
      >删除</el-button>
    </div>

    <el-row>
      <!--角色分配表单-->
      <el-dialog
        append-to-body
        :close-on-click-modal="false"
        :visible.sync="showDialog"
        title="角色分配"
        width="600px"
      >
        <el-form
          ref="form"
          :inline="true"
          :model="form"
          size="small"
          label-width="76px"
        >
          <el-form-item label="登录账号" prop="userName">
            <el-input v-model="form.userName" :disabled="true" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <el-input v-model="form.nickName" :disabled="true" />
          </el-form-item>
          <el-form-item style="margin-bottom: 0" label="角色" prop="userRoles">
            <el-select
              v-model="userRoles"
              style="width: 455px"
              multiple
              filterable
              placeholder="请选择"
              @remove-tag="deleteTag"
              @change="changeRole"
            >
              <el-option
                v-for="item in roles"
                :key="item.roleCode"
                :label="item.roleName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="doCancel">取消</el-button>
          <el-button
            :loading="formLoading"
            type="primary"
            @click="doSubmit"
          >确认</el-button>
        </div>
      </el-dialog>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="用户列表" name="userList">
          <el-table
            ref="table"
            v-loading="loading"
            :data="users"
            style="width: 100%; font-size: 12px"
            @selection-change="selectionChangeHandler"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              :show-overflow-tooltip="true"
              width="150"
              prop="userName"
              label="登录账号"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              width="150"
              prop="nickName"
              label="用户昵称"
            />
            <el-table-column prop="gender" width="60" label="性别">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.gender === 1" type="success">男</el-tag>
                <el-tag v-if="scope.row.gender === 2" type="warning">女</el-tag>
                <el-tag v-if="scope.row.gender === 0" type="info">未知</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="phone"
              width="150"
              label="电话"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="city"
              label="所在地区"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.province }} {{ scope.row.city }}
                  {{ scope.row.country }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="avatarUrl"
              width="80"
              label="头像"
            >
              <template slot-scope="scope">
                <img
                  :src="
                    scope.row.avatarUrl
                      ? baseApi + '/file/' + scope.row.avatarUrl
                      : Avatar
                  "
                  class="avatar"
                >
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="createTime"
              width="155"
              label="注册日期"
            >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="160"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  round
                  @click="doAssignRole(scope.row.id)"
                >分配角色</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="page"
            background
            :current-page="currentPage"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            layout="sizes,prev, pager, next"
            :total="totalPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Avatar from '@/assets/images/avatar.png'
import { parseTime } from '@/utils/index'
import { getUserPageList, deleteUser, getInfoById, getUserRoles, saveUserRoles } from '@/api/user'
import { getRoleList } from '@/api/role'
export default {
  name: '用户管理',
  data() {
    return {
      Avatar: Avatar,
      activeName: 'userList',
      showDialog: false,
      loading: false,
      formLoading: true,
      form: {},
      totalPage: 0,
      currentPage: 1,
      pageSize: 5,
      users: [],
      selections: [],
      userName: '',
      createTime: null,
      roles: [],
      userRoles: []
    }
  },
  computed: {
    ...mapGetters([
      'baseApi'
    ])
  },
  created() {

  },
  methods: {
    parseTime,
    doQuery() {
      this.users = []
      var param = { userName: this.userName }
      if (this.createTime != null) {
        param.createTimeStart = Date.parse(this.createTime[0])
        param.createTimeEnd = Date.parse(this.createTime[1])
      }
      param.pageSize = this.pageSize
      param.currentPage = this.currentPage
      console.log(param)
      getUserPageList(param).then(res => {
        if (res) {
          this.totalPage = res.totalPage
          this.currentPage = res.currentPage
          this.users = res.sysUserList
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.doQuery()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.doQuery()
    },
    doDelete() {
      const ids = []
      this.selections.forEach((res) => {
        ids.push(res.id)
      })
      this.$confirm(`确认删除这些用户吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() =>
        deleteUser(ids).then(res => {
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
    // 选择改变
    selectionChangeHandler(val) {
      this.selections = val
    },
    doAssignRole(id) {
      this.form = {}
      this.userRoles = []
      this.roles = []
      this.showDialog = true
      this.formLoading = true
      getInfoById(id).then((res) => {
        this.form = { id: res.id, userName: res.userName, nickName: res.nickName, gender: res.gender, phone: res.phone }
        var param = {}
        getRoleList(param).then(res => {
          if (res) {
            this.roles = res
          }
          getUserRoles(id).then((res) => {
            if (res) {
              res.forEach(role => {
                this.userRoles.push(role.id)
              })
            }
            this.formLoading = false
          })
        })
      })
    },
    doCancel() {
      this.showDialog = false
      this.form = {}
    },
    doSubmit() {
      this.formLoading = true
      saveUserRoles(this.form.id, this.userRoles).then(() => {
        this.showDialog = false
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
      })
    },
    deleteTag(value) {
      this.userRoles.forEach(function(data, index) {
        if (data.id === value) {
          this.userRoles.splice(index, value)
        }
      })
    },
    changeRole(value) {
      // console.log(this.userRoles)
    }
  }
}

</script>

<style rel="stylesheet/scss" lang="scss">
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
.page{
  float: right;
  margin-top: 5px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
