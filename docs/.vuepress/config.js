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
    sidebar: auto,
    nav: require('./nav'),
    sidebar: require('./sidebar')
  },
  plugins: ['@vuepress/back-to-top']
}

