import request from '@/utils/request'
import Axios from 'axios'
export const loginAPI = data => {
  return request.post('/v1_0/authorizations', data)
}

export const exchangeTokenAPI = (refreshToken) => {
  return Axios({
    method: 'PUT',
    url: 'http://geek.itheima.net/v1_0/authorizations',
    headers: {
      // 在请求头中携带 Authorization 身份认证字段
      Authorization: 'Bearer ' + refreshToken
    }
  })
}
