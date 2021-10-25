import request from '@/utils/request.js'

// 获取搜索建议列表数据的 API
export const getSuggestListAPI = kw => {
  return request.get('/v1_0/suggestion', {
    // 注意：GET 请求的参数，要通过 params 提供
    params: {
      q: kw
    }
  })
}
