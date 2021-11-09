// 1.导入request.js文件
import request from '../utils/request'

/**
 * getUserChannelAPI 获取用户频道数据
 * @param 无
 * @returns Promise
 */
export const getUserChannelAPI = () => {
  return request.get('/v1_0/user/channels')
}

/**
 * 获取文章列表
 * @param {*} Id 频道ID
 * @param {*} time 时间戳
 */
export const getArticleListAPI = (Id, time) => {
  return request.get('/v1_0/articles', {
    params: {
      channel_id: Id, // 频道的 Id
      timestamp: time // 时间戳
    }
  })
}

/**
 * 将文章设置为不感兴趣
 * @param {*} id 文章Id
 * @returns
 */
export const dislikeArticleAPI = (id) => {
  return request.post('/v1_0/article/dislikes', {
    target: id
  })
}

/**
 * 举报文章
 * @param {String| Number} id 文章Id
 * @param { Number } type 举报的类型的标识符
 * @returns
 */
export const reportArticleAPI = (id, type) => {
  return request.post('/v1_0/article/reports', {
    target: id,
    type: type
  })
}

/**
 * 获取所有频道列表
 * @returns
 */
export const getAllChannelAPI = () => {
  return request.get('/v1_0/channels')
}

/**
 * 更新用户的频道
 * @param { Array<Object> } channels
 * @returns
 */
export const updateUserChannelAPI = (channels) => {
  return request.put('/v1_0/user/channels', {
    channels
  })
}
