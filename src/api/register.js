import request from '@/utils/request'

export function getEmailCode(email) {
  return request({
    url: '/vue-admin-template/register/getEmailCode',
    method: 'post',
    email
  })
}

export function register(code, data) {
  return request({
    url: '/vue-admin-template/register?code=' + code,
    method: 'post',
    data
  })
}
