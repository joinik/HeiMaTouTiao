// 1.导入request.js文件
import request from '../utils/request'

import Axios from 'axios'

/**
 * loginAPI 登录
 * @param { object } data 用户数据
 * @returns Promise
 */
export const loginAPI = (data) => {
  return request.post('/v1_0/authorizations', data)
}

/**
 * 刷新用户token
 * @param { String } refreshToken
 * @returns
 */
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

// 请求用户基本信息的 API
export const getUserInfoAPI = () => {
  return request.get('/v1_0/user')
}

/**
 * 请求用户简介信息
 * @returns
 */
export const getUserProfileAPI = () => {
  return request.get('/v1_0/user/profile')
}

/**
 * 修改用户简介信息
 * @param { Object } obj  { name: 'xxx' } 或 { birthday: '2012-12-12' }
 * @returns
 */
export const updateUserProfileAPI = obj => {
  return request.patch('/v1_0/user/profile', obj)
}

// 修改头像的 API（形参中的 fd 表示 FormData 格式的表单数据）
export const updateUserAvatarAPI = fd => {
  return request.patch('/v1_0/user/photo', fd)
}
