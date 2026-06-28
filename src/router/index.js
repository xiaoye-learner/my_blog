import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/basic/home.vue'
import Study from '../views/basic/study.vue'
import TimeArticles from '../views/basic/time-articles.vue'
import Album from '../views/basic/album.vue'
import FriendLinks from '../views/basic/friend-links.vue'
import AboutMe from '../views/basic/about-me.vue'
import ArticleDetail from '../components/ArticleDetail.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,  // 首页组件
        meta: { saveScrollPosition: true },  // 标记需要保存的滚动位置
    },
    {
        path: '/study',
        name: 'Study',
        component: Study,  // 学习组件
        meta: { saveScrollPosition: true },  // 标记需要保存的滚动位置
    },
    {
        path: '/time-articles',
        name: 'TimeArticles',
        component: TimeArticles,  // 归档组件
        meta: { saveScrollPosition: true },  // 标记需要保存的滚动位置
    },
    {
        path: '/album',
        name: 'Album',
        component: Album,  // 相册组件
        meta: { saveScrollPosition: true },  // 标记需要保存的滚动位置
    },
    {
        path: '/friend-links',
        name: 'FriendLinks',
        component: FriendLinks,  // 友情链接组件
        meta: { saveScrollPosition: true },  // 标记需要保存的滚动位置
    },
    {
        path: '/about-me',
        name: 'AboutMe',
        component: AboutMe,  // 关于我组件
        meta: { saveScrollPosition: true },  // 标记需要保存的滚动位置
    },
    {
        path: '/article/:id',
        name: 'ArticleDetail',
        component: ArticleDetail,  // 文章详情组件
        meta: { saveScrollPosition: true },  // 标记需要保存的滚动位置
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,

    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            // 使用锚点定位时，不额外添加新的历史条目
            window.history.replaceState(
                { ...window.history.state, isArticlePage: true, hasAnchorJumped: true },
                '',
                to.fullPath
            )

            return {
                selector: to.hash,
                behavior: 'smooth',
            }
        }

        if (savedPosition && from.name === 'ArticleDetail') {
            return savedPosition
        }

        return {
            top: 0,
            left: 0,
            behavior: 'auto',
        }
    },
})

router.afterEach((to) => {
    if (to.name === 'ArticleDetail') {
        // 进入文章详情页时覆盖历史记录，确保返回时直接回到之前的页面
        window.history.replaceState(
            { ...window.history.state, isArticlePage: true, hasAnchorJumped: true },
            '',
            to.fullPath
        )
    }
})

// 监听浏览器前进/后退按钮
window.addEventListener('popstate', (event) => {
    const currentState = event.state

    // 在部分浏览器中，hash 变化也会触发 popstate，这里避免误判回退
    if (window.location.hash) {
        return
    }

    if (currentState?.isArticlePage && currentState?.hasAnchorJumped) {
        router.go(-1)
    }
})

export default router
