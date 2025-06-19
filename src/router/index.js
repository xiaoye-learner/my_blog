import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/basic/home.vue'
import Study from '../views/basic/study.vue'
import TimeArticles from '../views/basic/time-articles.vue'
import Album from '../views/basic/album.vue'
import FriendLinks from '../views/basic/friend-links.vue'
import AboutMe from '../views/basic/about-me.vue'
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
        if (to.hash) {       // 锚点定位
            // 使用锚点定位时，不添加新的历史条目
            window.history.replaceState(
                { ...window.history.state, isArticlePage: true, hasAnchorJumped: true },
                '',
                to.fullPath
            );
            return {
                selector: to.hash,
                behavior: 'smooth'
            }
        } else if (savedPosition && from.meta.saveScrollPosition) {
            console.log('保存的滚动位置',savedPosition.top)
            // 如果有保存的滚动位置，则恢复到该位置
            setTimeout(() => {             // 延时确保可以获取到页面总高度
                window.scrollTo(0, savedPosition.top)
            }, 50)
        } else {
            window.scrollTo(0, 0)  // 页面切换后滚动到顶部
        }
    }
})

router.afterEach((to, from) => {
    window.scrollTo(0, 0)  // 页面切换后滚动到顶部（修复了上面定位不到顶部的部分bug）

    if (to.name === 'ArticleDetail') {       // 进入文章详情页时就覆盖历史记录（确保返回时直接返回到之前的页面）
        window.history.replaceState(
            { ...window.history.state, isArticlePage: true, hasAnchorJumped: true },
            '',
            to.fullPath
        );
    }
})   

// 监听浏览器前进/后退按钮
window.addEventListener('popstate', (event) => {
    const currentState = event.state;

    if (currentState?.isArticlePage && currentState?.hasAnchorJumped) {
        router.go(-1)
    }
})

export default router  // 导出路由实例