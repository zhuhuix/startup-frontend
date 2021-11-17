<template>
  <div class="tabbar-container">
    <el-tabs v-model="pageCurrent" type="card" closable @tab-click="tabChange" @tab-remove="removeTab">
      <el-tab-pane
        v-for="(item) in pageList"
        :key="item.name"
        :name="item.name"
        class="tabbar-item"
      >
        <span slot="label">
          <span><i :class="item.icon" />{{ }} {{ item.label }}</span>
        </span>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
export default {
  data() {
    return {
      pageCurrent: '',
      pageList: [],
      exclude: null,
      condition: true
    }
  },
  watch: {
    $route: {
      handler(to, form = null) {
        // 当路由改变时，检测该路由是否已经在打开的页面之中，如果不在，就添加进去
        if (to.meta) {
          this.pageCurrent = to.path
          var index = this.pageList.findIndex(value => {
            return value.name === to.path
          })
          if (index < 0) {
            this.pageList.push({ name: to.path, label: to.meta.title, icon: to.meta.icon })
          }
          // 缓存页面
          const { name, meta } = this.$route
          if (name && meta !== undefined && meta.noCache !== undefined && !meta.noCache) {
            this.$store.dispatch('tabbar/addCachedView', this.$route)
          }
        }
      },
      immediate: true
    }
  },

  methods: {
    removeTab(targetName) {
      if (targetName === '/dashboard') return
      const tabs = this.pageList
      let activeName = this.pageCurrent
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      this.pageCurrent = activeName

      this.pageList = tabs.filter(tab => tab.name !== targetName)
      // 去除缓存页面
      this.$store.dispatch('tabbar/delCachedView', this.$route)
      this.$router.push({ path: activeName })
    },
    tabChange(tab, event) {
      this.$router.push({ path: tab.name })
    },
    refreshModule() {
      this.exclude = this.$refs.view.$options.name
      this.condition = !this.condition
      this.$nextTick(_ => {
        this.exclude = null
        this.condition = !this.condition
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.tabbar-container {
  height: 34px;
  width: 100%;
  cursor: pointer;
}

</style>
