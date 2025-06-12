import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'
import Study from '../views/study.vue'
import TimeArticles from '../views/time-articles.vue'
import Album from '../views/album.vue'
import FriendLinks from '../views/friend-links.vue'
import AboutMe from '../views/about-me.vue'
import ArticleDetail from '../components/ArticleDetail.vue';

const routes = [      // 路由配置
    {
        path: '/',
        name: 'Home',
        component: Home,  // 首页组件
        meta: { saveScrollPosition: true }  // 标记需要保存的滚动位置
    },
    {
        path: '/study',
        name: 'Study',
        component: Study,  // 学习组件
        meta: { saveScrollPosition: true }  // 标记需要保存的滚动位置
    },
    {
        path: '/time-articles',
        name: 'TimeArticles',
        component: TimeArticles,  // 归档组件
        meta: { saveScrollPosition: true }  // 标记需要保存的滚动位置
    },
    {
        path: '/album',
        name: 'Album',
        component: Album,  // 相册组件
        meta: { saveScrollPosition: true }  // 标记需要保存的滚动位置
    },
    {
        path: '/friend-links',
        name: 'FriendLinks',
        component: FriendLinks,  // 友情链接组件
        meta: { saveScrollPosition: true }  // 标记需要保存的滚动位置
    },
    {
        path: '/about-me',
        name: 'AboutMe',
        component: AboutMe,  // 关于我组件
        meta: { saveScrollPosition: true }  // 标记需要保存的滚动位置
    },
    {
        path: '/article/:id',
        name: 'ArticleDetail',
        component: ArticleDetail,   // 文章详情组件
        meta: { saveScrollPosition: true }  // 标记需要保存的滚动位置
    },
]

const router = createRouter({    // 创建路由实例
    history: createWebHistory(),
    routes,

    scrollBehavior(to, from, savedPosition) {
        if (savedPosition && from.meta.saveScrollPosition) {
            console.log(savedPosition.top)
            // 如果有保存的滚动位置，则恢复到该位置
            setTimeout(() => {             // 延时确保可以获取到页面总高度
                window.scrollTo(0, savedPosition.top)
            }, 30)
        } else {
            window.scrollTo(0, 0)  // 页面切换后滚动到顶部
        }
    }
})

// router.afterEach((to, from) => {     // 路由切换后执行的函数
//     window.scrollTo(0, 0)  // 页面切换后滚动到顶部
// })   

export default router  // 导出路由实例