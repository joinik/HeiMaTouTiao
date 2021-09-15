module.exports = {
  lang: 'en-US',
  title: '黑马头条',
  description: '黑马头条文档',
  base: "/HeiMaTouTiao/",
  markdown: {
    lineNumbers: true
  },

  theme: '@vuepress/theme-default',
  themeConfig: {
    logo: 'https://vuejs.org/images/logo.svg',
    searchMaxSuggestions: 10,
    sidebarDepth: 3,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Bilibili', link: 'https://space.bilibili.com/36036472' },
      { text: 'GitHub', link: 'https://github.com/VueProjectCourse/HeiMaTouTiao' },
    ],
    sidebar: [
      {
        title: '1.初始化项目',   // 必要的
        path: '/initial-project/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 1,    // 可选的, 默认值是 1
        children: [
          '/'
        ]
      },
      {
        title: '2.登录功能',
        path: '/login/',
        children: [ /* ... */],
        initialOpenGroupIndex: -1 // 可选的, 默认值是 0
      }
    ]
  },
  plugins: ['@vuepress/back-to-top']
}

