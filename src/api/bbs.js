import request from '@/utils/request'

export function createBbs(data) {
  return request({
    url: '/api/guest/bbs',
    method: 'post',
    data
  })
}

export function getBbsPageList(params) {
  return request({
    url: '/api/guest/bbs/page',
    method: 'post',
    data: JSON.stringify(params)
  })
}

export function updateBbs(data) {
  return request({
    url: '/api/admin/bbs',
    method: 'post',
    data
  })
}

export function deleteBbs(ids) {
  return request({
    url: '/api/admin/bbs',
    method: 'delete',
    data: ids
  })
}

export function getBbsById(id) {
  return request({
    url: '/api/admin/bbs/' + id,
    method: 'get'
  })
}

