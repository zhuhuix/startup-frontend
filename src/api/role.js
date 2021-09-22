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
