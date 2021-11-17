<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input
        v-model="name"
        size="small"
        clearable
        placeholder="输入菜单名称搜索"
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
        icon="el-icon-document-add"
        @click="doAdd"
      >增加</el-button>
      <el-button
        class="filter-item"
        size="mini"
        type="danger"
        icon="el-icon-circle-plus-outline"
        :disabled="selections.length === 0"
        @click="doDelete"
      >删除{{ selections.length }}</el-button>
    </div>

    <el-row>
      <!-- 表单渲染 -->
      <el-dialog
        append-to-body
        :close-on-click-modal="false"
        :visible.sync="showDialog"
        width="620px"
      >
        <el-form
          ref="form"
          :inline="true"
          :model="form"
          :rules="rules"
          size="small"
          label-width="80px"
        >
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="路由地址" prop="path">
            <el-input
              v-model="form.path"
              placeholder="根目录菜单需前置加斜杠/"
            />
          </el-form-item>
          <el-form-item label="组件路径" prop="component">
            <el-input
              v-model="form.component"
              placeholder="根目录菜单输入Layout"
            />
          </el-form-item>
          <el-form-item label="菜单排序" prop="sort">
            <el-input-number
              v-model.number="form.sort"
              :min="0"
              :max="999"
              controls-position="right"
              style="width: 185px"
            />
          </el-form-item>
          <el-form-item label="菜单图标">
            <el-popover
              placement="bottom-start"
              width="450"
              trigger="click"
              @show="$refs['iconSelect'].reset()"
            >
              <el-input
                slot="reference"
                v-model="form.icon"
                placeholder="请选择菜单图标"
                readonly
                style="cursor: pointer; width: 460px"
              >
                <template slot="prepend">
                  <i
                    v-if="form.icon && form.icon.includes('el-icon')"
                    :class="form.icon"
                  />
                  <svg-icon v-else :icon-class="form.icon ? form.icon : ''" />
                </template>
              </el-input>
              <select-icon ref="iconSelect" @selected="selected" />
            </el-popover>
          </el-form-item>
          <el-form-item label="上级菜单" prop="pid">
            <treeselect
              v-model="form.pid"
              :options="menuTree"
              :show-count="true"
              style="width: 460px"
              placeholder="选择上级菜单"
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
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="菜单列表" name="menuList">
          <el-table
            ref="table"
            v-loading="loading"
            :data="menuTree"
            row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            style="width: 100%; font-size: 12px"
            @selection-change="selectionChangeHandler"
            @select="selectChange"
            @select-all="selectAllChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              :show-overflow-tooltip="true"
              width="150"
              prop="name"
              label="菜单名称"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              width="150"
              prop="path"
              label="路由地址"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="component"
              width="150"
              label="组件路径"
            />
            <el-table-column
              prop="icon"
              label="菜单图标"
              align="center"
              width="80px"
            >
              <template slot-scope="scope">
                <i
                  v-if="scope.row.icon.includes('el-icon')"
                  :class="scope.row.icon ? scope.row.icon : ''"
                />
                <svg-icon
                  v-else
                  :icon-class="scope.row.icon ? scope.row.icon : ''"
                />
              </template>
            </el-table-column>
            <el-table-column prop="sort" align="center" label="菜单排序">
              <template slot-scope="scope">
                {{ scope.row.sort }}
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="createTime"
              width="155"
              label="创建日期"
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
                  @click="doEdit(scope.row.id)"
                >编辑菜单</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import SelectIcon from '@/components/SelectIcon'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils/index'
import { getMenuList, getMenuById, saveMenu, deleteMenu } from '@/api/menu'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: '菜单管理',
  components: { SelectIcon, Treeselect },
  data() {
    return {
      activeName: 'menuList',
      showDialog: false,
      loading: false,
      formLoading: false,
      form: {},
      menus: [],
      menuTree: [],
      selections: [],
      name: '',
      createTime: null,
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入路由地址', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '请输入组件路径', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'baseApi'
    ])
  },
  created() {
    var param = { name: '' }
    getMenuList(param).then(res => {
      if (res) {
        this.menuTree = this.ArrayToTreeData(res)
      }
    })
  },
  methods: {
    parseTime,
    doQuery() {
      this.menus = []
      var param = { name: this.name }
      if (this.createTime != null) {
        param.createTimeStart = Date.parse(this.createTime[0])
        param.createTimeEnd = Date.parse(this.createTime[1])
      }
      getMenuList(param).then(res => {
        if (res) {
          this.menus = res
          this.menuTree = this.ArrayToTreeData(res)
        }
      })
    },
    doAdd() {
      this.form = { icon: '' }
      this.showDialog = true
      this.formLoading = false
    },
    doSubmit(menu) {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 判断菜单id与父菜单id是否一样
          if (menu.pid === undefined) {
            menu.pid = null
          }
          if (menu.id && menu.id === menu.pid) {
            this.$notify({
              title: '上级菜单不能是自己',
              type: 'error',
              duration: 2500
            })
            return
          }
          // console.log(menu)
          this.formLoading = true
          saveMenu(menu).then(res => {
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
    doDelete() {
      const ids = []
      this.selections.forEach((res) => {
        ids.push(res.id)
      })
      this.$confirm(`确认删除这些菜单吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() =>
        deleteMenu(ids).then(res => {
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
    // 选择所有
    selectAllChange(selection) {
      // 如果选中的数目与请求到的数目相同就选中子节点，否则就清空选中
      if (selection && selection.length === this.menuTree.length) {
        selection.forEach(val => {
          this.selectChange(selection, val)
        })
      } else {
        this.$refs.table.clearSelection()
      }
    },
    // 单个选中
    selectChange(selection, row) {
      // 如果selection中存在row代表是选中，否则是取消选中
      if (selection.find(val => { return val.id === row.id })) {
        if (row.children) {
          row.children.forEach(val => {
            this.$refs.table.toggleRowSelection(val, true)

            // 过滤重复值
            let i = 0
            let exist = false
            for (i = 0; i < selection.length; i++) {
              if (selection[i].id === val.id) {
                exist = true
                break
              }
            }
            if (!exist) {
              selection.push(val)
            }

            if (val.children) {
              this.selectChange(selection, val)
            }
          })
        }
      } else {
        this.toggleRowSelection(selection, row)
      }
    },
    // 取消选中
    toggleRowSelection(selection, data) {
      if (data.children) {
        this.$nextTick(() => {
          data.children.forEach(val => {
            this.$refs.table.toggleRowSelection(val, false)
            if (val.children) {
              this.toggleRowSelection(selection, val)
            }
          })
        })
      }
    },

    doEdit(id) {
      this.showDialog = true
      this.formLoading = true
      this.form = {}
      getMenuById(id).then(res => {
        this.form = res
        this.formLoading = false
      })
    },
    doCancel() {
      this.showDialog = false
      this.formLoading = true
      this.form = {}
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
    // 选中图标
    selected(name) {
      this.form.icon = name
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
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}

::v-deep .vue-treeselect__control,
::v-deep .vue-treeselect__placeholder,
::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
