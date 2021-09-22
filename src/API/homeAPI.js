import request from '@/utils/request'

// 请求用户频道列表数据的 API
export const getUserChannelAPI = () => {
  return request.get('/v1_0/user/channels')
}

// 根据频道 Id 请求频道下的文章列表数据
export const getArtListAPI = (id, time) => {
  return request.get('/v1_0/articles', {
    params: {
      channel_id: id, // 频道Id
      timestamp: time // 时间戳
    }
  })
}
