<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input
        v-model="nickName"
        size="small"
        clearable
        placeholder="输入用户昵称搜索"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="search"
      />
      <el-select
        v-model="replied"
        placeholder="是否已回复"
        clearable
        size="small"
        style="width: 120px"
        class="filter-item"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
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
        @click="search"
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
      <!--回复留言表单-->
      <el-dialog
        append-to-body
        :close-on-click-modal="false"
        :visible.sync="showDialog"
        width="600px"
      >
        <el-form
          ref="form"
          :model="form"
          size="small"
          label-width="76px"
        >
          <el-form-item label="留言信息" prop="">
            <el-card class="el-card-m">
              <span class="el-card-m-content">{{ form.content }}</span>
              <div />
              <span class="el-card-m-nick-name">{{ form.nickName }} 提交于 {{ parseTime(form.createTime) }}  </span>
            </el-card>
          </el-form-item>
          <el-form-item label="回复留言" prop="replyContent">
            <el-input
              v-model="form.replyContent"
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
            @click="doSubmit"
          >确认</el-button>
        </div>
      </el-dialog>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="留言列表" name="bbsList">
          <el-table
            ref="table"
            v-loading="loading"
            :data="bbsList"
            style="width: 100%; font-size: 12px"
            @selection-change="selectionChangeHandler"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              :show-overflow-tooltip="true"
              width="120"
              prop="nickName"
              label="用户昵称"
            />

            <el-table-column
              :show-overflow-tooltip="true"
              prop="content"
              width="200"
              label="留言内容"
            />

            <el-table-column
              :show-overflow-tooltip="true"
              prop="createTime"
              width="155"
              label="留言时间"
            >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="replied" width="80" label="是否回复">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.replied"
                  :disabled="true"
                />
              </template>
            </el-table-column>

            <el-table-column
              :show-overflow-tooltip="true"
              width="120"
              prop="replyName"
              label="回复人"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="replyContent"
              width="200"
              label="回复内容"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="replyTime"
              width="155"
              label="回复时间"
            >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.replyTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="120"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  round
                  @click="doReply(scope.row.id)"
                >回复</el-button>
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
            :total="total"
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
import { parseTime } from '@/utils/index'
import { getBbsPageList, deleteBbs, getBbsById, updateBbs } from '@/api/bbs'
export default {
  name: '留言管理',
  data() {
    return {
      activeName: 'bbsList',
      showDialog: false,
      loading: false,
      formLoading: true,
      form: {},
      total: 0,
      currentPage: 1,
      pageSize: 5,
      bbsList: [],
      selections: [],
      nickName: '',
      replied: null,
      options: [{
        value: true,
        label: '是'
      }, {
        value: false,
        label: '否'
      }],
      createTime: null,
      roles: [],
      userRoles: []
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    parseTime,
    search() {
      this.currentPage = 1
      this.doQuery()
    },
    doQuery() {
      this.users = []
      var param = { nickName: this.nickName, replied: this.replied }
      if (this.createTime != null) {
        param.createTimeStart = Date.parse(this.createTime[0])
        param.createTimeEnd = Date.parse(this.createTime[1])
      }
      param.pageSize = this.pageSize
      param.currentPage = this.currentPage
      getBbsPageList(param).then(res => {
        if (res) {
          this.total = res.total
          this.currentPage = res.currentPage
          this.bbsList = res.bbsList
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
      this.$confirm(`确认删除这些留言吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() =>
        deleteBbs(ids).then(res => {
          if (res) {
            this.$notify({
              title: '删除成功',
              type: 'success',
              duration: 2500
            })
            this.search()
          }
        })
      ).catch(() => {
      })
    },
    // 选择改变
    selectionChangeHandler(val) {
      this.selections = val
    },
    doReply(id) {
      this.form = {}
      this.userRoles = []
      this.roles = []
      this.showDialog = true
      this.formLoading = true
      getBbsById(id).then((res) => {
        if (res) {
          this.form = res
        }
        this.formLoading = false
      })
    },
    doCancel() {
      this.showDialog = false
      this.form = {}
    },
    doSubmit() {
      const bbs = { id: this.form.id, replied: true, replyName: this.user.nickName,
        replyContent: this.form.replyContent }
      this.formLoading = true
      updateBbs(bbs).then(() => {
        this.showDialog = false
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        this.doQuery()
      })
    }
  }
}

</script>

<style rel="stylesheet/scss" lang="scss">
.el-card-m{
    height: 100px;
}

.el-card-m-content{
    display: block;
    font-weight: bold;
}

.el-card-m-nick-name{
    display: block;
    font-size: x-small;
    margin-top: 15px;
    color: gray;
}

.page {
  float: right;
  margin-top: 5px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
