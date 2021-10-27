/**
 * 角色访问后端api
 * 2021-10-26 添加getPermission,savePermission
 */
import request from '@/utils/request'

export function getAllRole() {
  return request({
    url: '/api/role',
    method: 'get'
  })
}

export function getRole(id) {
  return request({
    url: '/api/role/' + id,
    method: 'get'
  })
}

export function saveRole(data) {
  return request({
    url: '/api/role',
    method: 'post',
    data
  })
}

export function deleteRole(ids) {
  return request({
    url: '/api/role',
    method: 'delete',
    data: ids
  })
}

export function getRoleList(params) {
  return request({
    url: '/api/role/list',
    method: 'post',
    data: JSON.stringify(params)
  })
}

export function getPermission(roleId) {
  return request({
    url: '/api/role/' + roleId + '/permission',
    method: 'get'
  })
}

export function savePermission(roleId, data) {
  return request({
    url: '/api/role/' + roleId + '/permission',
    method: 'post',
    data
  })
}
