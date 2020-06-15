// import Cookies from 'js-cookie'
import Vue from 'vue'

export const TOKEN_KEY = 'Admin-Token'

export function getToken () {
  return Vue.ls.get(TOKEN_KEY)
}

export function setToken (token) {
  return Vue.ls.set(TOKEN_KEY, token)
}

export function removeToken () {
  return Vue.ls.remove(TOKEN_KEY)
}
