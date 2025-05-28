import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'  // UI 框架
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'  //element-plus图标库
import router from './router'   // 路由

import './assets/styles.css'  // 引入自定义样式（markdown 样式）
import './less/App.less'
import './less/home.less'
import './less/study.less'
import './less/time-articles.less'
import './less/album.less'
import './less/friend-links.less'
import './less/about-me.less'
import './less/MarkdownViewer.less'
import './less/ArticleDetail.less'
import './assets/rem'

const app = createApp(App)
app.use(ElementPlus).use(router)
app.mount('#app')
// 全局注册element-plus图标库
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
