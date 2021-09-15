module.exports = {
  base: "/HeiMaTouTiao/",
  lang: 'en-US',
  head: [
    ['link', {rel:'icon', type: 'image/png', sizes: '16x16', href: '/images/icons/favicon-16x16.png'}]
  ],
  markdown: {
    lineNumbers: true
  },
  theme: '@vuepress/theme-default',
  themeConfig: {
    logo: 'https://vuejs.org/images/logo.svg',
    searchMaxSuggestions: 10,
    sidebarDepth: 3,
    sidebar: 'auto',
    nav: require('./nav'),
    sidebar: require('./sidebar')
  },
  plugins: ['@vuepress/back-to-top']
}

