<template>
    <!-- 网页滚动条 -->
    <el-scrollbar wrap-class="wrap" ref="scrollbar" @scroll="handleScroll">  <!-- 加入wrap-class(包裹容器的自定义类名)用于让el-backtop绑定 --><!-- 监听滚动 -->
        <div class="app">
            <!-- 导航栏 -->
            <header :style="{ 
                background: isHeaderTop? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0.3)', 
                transform: headerTransform 
                }">   <!-- 导航栏显示与隐藏动态样式绑定 -->
                <nav>
                    <ul>
                        <li :class="{ active: activeName === 'home' }">   <!-- 根据路由的activeName动态加入class=active -->
                            <router-link to="/">主页</router-link>
                        </li>
                        <li :class="{ active: activeName === 'study' }">
                            <router-link to="/study">学习</router-link>
                        </li>
                        <li :class="{ active: activeName === 'life' }">
                            <router-link to="/life">日常</router-link>
                        </li>
                        <li :class="{ active: activeName === 'album' }">
                            <router-link to="/album">相册</router-link>
                        </li>
                        <li :class="{ active: activeName === 'friend-links' }">
                            <router-link to="/friend-links">友链</router-link>
                        </li>
                        <li :class="{ active: activeName === 'about-me' }">
                            <router-link to="/about-me">关于</router-link>
                        </li>                
                    </ul>
                </nav>
            </header>
            <router-view @scroll-to-header="scrollToElement"></router-view>   <!-- 根据路由渲染不同的组件 --><!-- 监听home.vue组件传来的对象，用于传递由其他vue组件内容指定的滚动距离 -->
        </div>
    </el-scrollbar>
    
    <!-- 返回顶部 -->
    <el-backtop :right="50" :bottom="50" target=".wrap"></el-backtop>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            activeName: 'home',   //当前所处页面

            lastScrollTop: 0,
            headerHeight: 60,    // 根据实际header高度调整
            isHeaderHidden: false,   //隐藏与显示状态栏
            isHeaderTop: true,    //靠近顶部
        }
    },

    computed: {
        headerTransform() {
            return this.isHeaderHidden      //实现显示与隐藏效果
                ? `translateY(-${this.headerHeight}px)` 
                : 'translateY(0)'
        }
    },

    methods: {
        //主页点击箭头（指向文章列表）后的滚动效果
        scrollToElement(element) {
            if (element) {
                // 获取元素相对于 .wrap 容器的偏移量
                const offsetHeight = element.offsetHeight;   // 由home.vue传来的滚动距离
                // 使用 el-scrollbar 的 setScrollTop 方法滚动到指定位置
                this.$refs.scrollbar.setScrollTop(offsetHeight);
            }
        },

        handleScroll({ scrollTop }) {
            const currentScrollTop = scrollTop     //当前滚动条距离顶部的距离
            const scrollDelta = currentScrollTop - this.lastScrollTop   //根据相对位置判断是否隐藏导航栏

            // 优化边界检测（当接近顶部时强制显示）
            if (currentScrollTop < 7) {
                this.isHeaderHidden = false
                this.isHeaderTop = true
            } else { this.isHeaderTop = false }

            // 判断滚动方向，并添加移动阈值（避免微小滚动触发）
            if (Math.abs(scrollDelta) > 3) {
                if (scrollDelta > 0 && !this.isHeaderHidden) {
                    this.isHeaderHidden = true
                } else if (scrollDelta < 0 && this.isHeaderHidden) {
                    this.isHeaderHidden = false
                }
            }
            this.lastScrollTop = currentScrollTop    
        },
    },

    watch: {
        '$route.path': function(newPath) {     // 监听路由变化
            this.activeName = newPath.slice(1) || 'home';   //去除'/'，如果没有路由则默认为'home'
        },
    },

    mounted() {    
        this.activeName = this.$route.path.slice(1) || 'home';    // 页面加载完成后，初始化activeName
        const wrapElement = this.$refs.scrollbar.$el.querySelector('.el-scrollbar__wrap');     //放入mounted钩子解决第一次点击无法平滑滚动问题
        if (wrapElement) {
            wrapElement.style.scrollBehavior = 'smooth'     // 平滑滚动
        }
    }
}
</script>