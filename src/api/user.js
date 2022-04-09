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

export function getInfoById(id) {
  return request({
    url: '/api/user/' + id,
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

export function deleteUser(ids) {
  return request({
    url: '/api/user',
    method: 'delete',
    data: ids
  })
}

export function getUserList(params) {
  return request({
    url: '/api/user/list',
    method: 'post',
    data: JSON.stringify(params)
  })
}

export function getUserPageList(params) {
  return request({
    url: '/api/user/page',
    method: 'post',
    data: JSON.stringify(params)
  })
}

export function getUserPermission(userId) {
  return request({
    url: '/api/user/permission/' + userId,
    method: 'get'
  })
}

export function getUserRoles(userId) {
  return request({
    url: '/api/user/roles/' + userId,
    method: 'get'
  })
}

export function saveUserRoles(userId, roleIds) {
  return request({
    url: '/api/user/roles/' + userId,
    method: 'post',
    data: roleIds
  })
}

