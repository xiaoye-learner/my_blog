import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'  // UI 框架
import 'element-plus/dist/index.css'
import router from './router'   // 路由

import './assets/styles.css'  // 引入自定义样式（markdown 样式）
import './less/App.less'
import './less/home.less'
import './less/study.less'
import './less/life.less'
import './less/album.less'
import './less/friend-links.less'
import './less/about-me.less'
import './less/MarkdownViewer.less'

const app = createApp(App)
app.use(ElementPlus).use(router)
app.mount('#app')
