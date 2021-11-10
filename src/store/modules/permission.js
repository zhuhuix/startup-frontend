import { constantRoutes, router } from '@/router'
import { getUserPermission } from '@/api/user'
import store from '@/store'
import Layout from '@/layout/index'

export const filterAsyncRouter = (routers) => { // 遍历后台传来的路由字符串，转换为组件对象
  return routers.filter(router => {
    if (router.component) {
      if (router.component === 'Layout') { // Layout组件特殊处理
        router.component = Layout
      } else {
        const component = router.component
        router.component = loadView(component)
      }
    }
    router.meta = { title: router.name, icon: router.icon, noCache: !router.cache }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children)
    }
    return true
  })
}

export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}`], resolve)
}

const state = {
  routes: [],
  addRoutes: [],
  menuLoaded: false
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    // 增加动态路由
    router.addRoutes(routes)
  },
  SET_MENULOADED: (state, menuLoaded) => {
    state.menuLoaded = menuLoaded
    // console.log('menuLoaded', state.menuLoaded)
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      let accessedRoutes
      getUserPermission(store.getters.user.id).then(res => {
        accessedRoutes = ArrayToTreeData(res)
        let asyncRouter = []
        if (accessedRoutes && accessedRoutes.length) {
          asyncRouter = filterAsyncRouter(accessedRoutes)
        }
        asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', asyncRouter)
        commit('SET_MENULOADED', true)
        resolve(asyncRouter)
      })
    })
  },

  setMenuLoaded({ commit }, munuLoaded) {
    return new Promise(resolve => {
      commit('SET_MENULOADED', munuLoaded)
    })
  }
}

function ArrayToTreeData(data) {
  const cloneData = JSON.parse(JSON.stringify(data)) // 对源数据深度克隆
  return cloneData.filter(father => {
    const branchArr = cloneData.filter(child => father.id === child.pid) // 返回每一项的子级数组
    branchArr.length > 0 ? father.children = branchArr : '' // 如果存在子级，则给父级添加一个children属性，并赋值
    return father.pid === null // 返回第一层
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
