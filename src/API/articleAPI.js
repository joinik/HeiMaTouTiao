import request from '@/utils/request.js'

/**
 * 获取文章详情
 * @param { String } id 文章ID
 * @returns
 */
export const getArticleDetailAPI = id => {
  return request.get(`/v1_0/articles/${id}`)
}

/**
 * 关注用户
 * @param { String } userId 用户ID
 * @returns
 */
export const followUserAPI = userId => {
  return request.post('/v1_0/user/followings', {
    target: userId
  })
}

/**
 * 取消关注用户
  * @param { String } userId 用户ID
 * @returns
 */
export const unfollowUserAPI = userId => {
  return request.delete(`/v1_0/user/followings/${userId}`)
}

/**
 * 点赞
 * @param {*} artId 文章id
 * @returns
 */
export const addLikeAPI = artId => {
  return request.post('/v1_0/article/likings', {
    target: artId
  })
}

/**
 * 取消点赞
 * @param {*} artId 文章id
 * @returns
 */
export const delLikeAPI = artId => {
  return request.delete(`/v1_0/article/likings/${artId}`)
}

/**
 * 获取文章下评论数据
 * @param {*} artId 文章的 Id
 * @param {*} offset 获取评论数据的偏移量
 * @returns
 */
export const getCmtListAPI = (artId, offset) => {
  return request.get('/v1_0/comments', {
    params: {
      // a 表示获取文章下的评论
      type: 'a',
      // 文章的 Id
      source: artId,
      // 获取评论数据的偏移量，值为评论的 id。表示从此 id 的数据向后取，不传表示从第一页开始读取数据
      offset
    }
  })
}

/**
 * 评论点赞
 * @param { String } cmtId
 * @returns
 */

export const addLikeCmtAPI = cmtId => {
  return request.post('/v1_0/comment/likings', {
    target: cmtId
  })
}

/**
 * 评论取消点赞
 * @param { String } cmtId
 * @returns
 */
export const delLikeCmtAPI = cmtId => {
  return request.delete(`/v1_0/comment/likings/${cmtId}`)
}

/**
 * 表评论
 * @param {*} artId 文章id
 * @param {*} content 内容
 * @returns
 */
export const pubCommentAPI = (artId, content) => {
  return request.post('/v1_0/comments', {
    target: artId,
    content
  })
}
