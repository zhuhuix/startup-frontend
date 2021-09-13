import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'delete'
  })
}

export function getInfo() {
  return request({
    url: '/api/user',
    method: 'get'
  })
}

export function saveUser(data) {
  return request({
    url: '/api/user',
    method: 'post',
    data
  })
}

export function getUserPermission(userId) {
  return request({
    url: '/api/user/permission/' + userId,
    method: 'get'
  })
}

