import request from '@/utils/request.js'

// 获取文章详情的 API（形参中的 id 是文章的 id）
export const getArticleDetailAPI = id => {
  return request.get(`/v1_0/articles/${id}`)
}
