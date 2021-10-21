import request from '@/utils/request'

export function getMenuList(params) {
  return request({
    url: '/api/menu/list',
    method: 'post',
    data: JSON.stringify(params)
  })
}

export function getMenuById(id) {
  return request({
    url: '/api/menu/' + id,
    method: 'get'
  })
}

export function saveMenu(data) {
  return request({
    url: '/api/menu',
    method: 'post',
    data
  })
}

export function deleteMenu(ids) {
  return request({
    url: '/api/menu',
    method: 'delete',
    data: ids
  })
}
