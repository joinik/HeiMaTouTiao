import request from '@/utils/request.js'

/**
 * 获取搜索建议列表数据
 * @param { String } kw
 * @returns 建议列表
 */
export const getSuggestListAPI = kw => {
  return request.get('/v1_0/suggestion', {
    // 注意：GET 请求的参数，要通过 params 提供
    params: {
      q: kw
    }
  })
}

/**
 * 搜索文章数据
 * @param { String } kw 搜索关键字
 * @param { Number } page 页码
 * @returns Array 数组
 */
export const getSearchResultAPI = (kw, page) => {
  return request.get('/v1_0/search', {
    params: {
      q: kw, // 搜索关键词
      page // 页码值
    }
  })
}
