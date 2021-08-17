import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { encrypt } from '@/utils/rsaEncrypt'

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
    }
  },

  actions: {
  // user login
    login({ commit }, userInfo) {
      const { userName, password } = userInfo
      return new Promise((resolve, reject) => {
        login({ userName: userName.trim(), password: encrypt(password) }).then(response => {
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
          const { user } = response
          if (!user) {
            reject('获取用户信息错误.')
          }
          commit('SET_USER', user)
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
        commit('RESET_STATE')
        resolve()
      })
    }
  }
}
export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  if (res.roles !== undefined && res.roles.length > 0) {
    commit('SET_ROLES', res.roles)
  }
  commit('SET_USER', res.user)
}

export default user
