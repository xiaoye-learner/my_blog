import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'
import Study from '../views/study.vue'
import TimeArticles from '../views/time-articles.vue'
import Album from '../views/album.vue'
import FriendLinks from '../views/friend-links.vue'
import AboutMe from '../views/about-me.vue'
import Article from '../components/MarkdownViewer.vue'
import ArticleDetail from '../components/ArticleDetail.vue';

const routes = [      // 路由配置
    {
        path: '/',
        name: 'Home',
        component: Home  // 首页组件
    },
    {
        path: '/study',
        name: 'Study',
        component: Study  // 学习组件
    },
    {
        path: '/time-articles',
        name: 'TimeArticles',
        component: TimeArticles  // 归档组件
    },
    {
        path: '/album',
        name: 'Album',
        component: Album  // 相册组件
    },
    {
        path: '/friend-links',
        name: 'FriendLinks',
        component: FriendLinks  // 友情链接组件
    },
    {
        path: '/about-me',
        name: 'AboutMe',
        component: AboutMe  // 关于我组件
    },
    {
        path: '/Article/:id',
        name: 'Article',
        component: Article  // 文章组件
    },
    {
        path: '/article/:id',
        name: 'ArticleDetail',
        component: ArticleDetail,   // 文章详情组件
    },
]

const router = createRouter({    // 创建路由实例
    history: createWebHistory(),
    routes
})

export default router  // 导出路由实例