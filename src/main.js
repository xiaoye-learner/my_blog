import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'  // UI 框架
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'  //element-plus图标库
import router from './router'   // 路由

import './assets/markdown.css'  // markdown自定义样式
import 'highlight.js/styles/vs.min.css'

import './assets/styles.css'  // 全局样式
import './less/App.less'
import './less/basic/home.less'
import './less/basic/study.less'
import './less/basic/time-articles.less'
import './less/basic/album.less'
import './less/basic/friend-links.less'
import './less/basic/about-me.less'
import './less/start-loading.less'
import './less/ArticleDetail.less'
import './assets/rem'

const app = createApp(App)
app.use(ElementPlus).use(router)
app.mount('#app')
// 全局注册element-plus图标库
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
