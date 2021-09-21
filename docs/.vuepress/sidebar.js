module.exports = [
  {
    title: '1.初始化项目',   // 必要的
    path: '/initial-project/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
    sidebarDepth: 3,    // 可选的, 默认值是 1
    children: [ /* ... */
    ]
  },
  {
    title: '2.登录功能',
    path: '/login/',
    sidebarDepth: 3,
    children: [ /* ... */],
  },
  {
    title: '3.主页布局',
    path: '/main-layout/',
    sidebarDepth: 3,
    children: [ /* ... */],
  }
]