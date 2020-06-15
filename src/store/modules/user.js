import { login, getInfo } from '@/api/user'
import { setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: '',
  expire: null,
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, data) => {
    // state.token = token
    if (data) {
      state.token = data.token
      state.expire = data.expire
    } else {
      state.token = null
      state.expire = null
    }
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login ({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ account: username.trim(), password: password }).then(response => {
        const { data } = response
        // commit('SET_TOKEN', data.token)
        commit('SET_TOKEN', data)
        setToken(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo ({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const user = data.user

        // const { roles, name, avatar, introduction } = data

        if (!user.sys_role) {
          reject('找不到用户角色')
        }

        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }
        // 简单功能,单角色后台项目.
        const roles = [user.sys_role.code]

        commit('SET_ROLES', roles)
        commit('SET_NAME', user.name)
        commit('SET_AVATAR', user.avatar)
        // commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout ({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles ({ commit, dispatch }, role) {
    // return new Promise(async resolve => {
    //   const token = role + '-token'

    //   commit('SET_TOKEN', token)
    //   setToken(token)

    //   const { roles } = await dispatch('getInfo')

    //   resetRouter()

    //   // generate accessible routes map based on roles
    //   const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

    //   // dynamically add accessible routes
    //   router.addRoutes(accessRoutes)

    //   // reset visited views and cached views
    //   dispatch('tagsView/delAllViews', null, { root: true })

    //   resolve()
    // })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
