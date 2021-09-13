import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { encrypt } from '@/utils/rsaEncrypt'
import store from '@/store'

const user = {
  state: {
    token: getToken(),
    user: {},
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    RESET_STATE(state) {
      for (const i in state) {
        delete state[i]
      }
    }

  },

  actions: {
  // user login
    login({ commit }, userInfo) {
      const { userName, password } = userInfo
      return new Promise((resolve, reject) => {
        login({ userName: userName.trim(), password: encrypt(password) }).then(response => {
          console.log('response', response)
          commit('SET_TOKEN', response.token)
          setUserInfo(response.user, commit)
          setToken(response.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // get user info
    getInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const { user, roles } = response
          if (!user) {
            reject('获取用户信息错误.')
          }
          commit('SET_USER', user)
          commit('SET_ROLES', roles)
          resolve(user)
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },

    // user logout
    logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          removeToken() // must remove  token  first
          resetRouter()
          commit('RESET_STATE')
          store.dispatch('permission/setMenuLoaded', false)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // remove token
    resetToken({ commit }) {
      return new Promise(resolve => {
        removeToken() // must remove  token  first
        resolve()
      })
    }
  }
}
export const setUserInfo = (res, commit) => {
  commit('SET_USER', res.user)
  commit('SET_ROLES', res.roles)
}

export default user
