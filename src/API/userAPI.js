import request from '@/utils/request'

export const loginAPI = data => {
  return request.post('/v1_0/authorizations', data)
}
