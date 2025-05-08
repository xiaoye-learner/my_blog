<template>
    <!-- 网页滚动条 -->
    <el-scrollbar wrap-class="wrap">  <!-- 加入wrap-class(包裹容器的自定义类名)用于让el-backtop绑定 -->
        <div class="app">
            <!-- 导航栏 -->
            <header>
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
            <router-view></router-view>   <!-- 根据路由渲染不同的组件 -->
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
            activeName: 'home'   //当前所处页面
        }
    },

    watch: {
        '$route.path': function(newPath) {     // 监听路由变化
            this.activeName = newPath.slice(1) || 'home';   //去除'/'，如果没有路由则默认为'home'
        },
    },

    mounted() {    // 页面加载完成后，初始化activeName
        this.activeName = this.$route.path.slice(1) || 'home';
    }
}
</script>