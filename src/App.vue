<template>
    <!-- <startLoading :show="showLoading"/>  启动动画 -->
    
    <div class="app">
        <!-- 导航栏 -->
        <header :style="{ 
            background: isHeaderTop? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0.3)', 
            transform: headerTransform 
            }">   <!-- 导航栏显示与隐藏动态样式绑定 -->
            <nav>
                <ul>
                    <li>
                        <div class="search" @click="handleSearchClick" style="cursor: pointer;">
                            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704z"></path></svg>
                        </div>

                        <el-dialog v-model="searchVisible" title="搜索文章" :append-to-body="true" :width="dialogWidth">
                            <el-form :model="form">
                                <el-form-item>
                                    <el-input v-model="searchInput" @input="debounce(searchArticles, 300)"/>    <!-- 300ms延迟（防抖动） -->
                                    <el-button type="primary" @click="searchArticles">搜索</el-button>
                                    <div id="search-results"></div>
                                </el-form-item>
                            </el-form>
                        </el-dialog>
                    </li>
                    <li :class="{ active: activeName === 'home' }">   <!-- 根据路由的activeName动态加入class=active -->
                        <router-link to="/"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M512 128 128 447.936V896h255.936V640H640v256h255.936V447.936z"></path></svg>
                            <p>主页</p></router-link>
                    </li>
                    <li :class="{ active: activeName === 'study' }">
                        <router-link to="/study"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="m512 863.36 384-54.848v-638.72L525.568 222.72a96 96 0 0 1-27.136 0L128 169.792v638.72l384 54.848zM137.024 106.432l370.432 52.928a32 32 0 0 0 9.088 0l370.432-52.928A64 64 0 0 1 960 169.792v638.72a64 64 0 0 1-54.976 63.36l-388.48 55.488a32 32 0 0 1-9.088 0l-388.48-55.488A64 64 0 0 1 64 808.512v-638.72a64 64 0 0 1 73.024-63.36z"></path><path fill="currentColor" d="M480 192h64v704h-64z"></path></svg>
                            <p>学习</p></router-link>
                    </li>
                    <li :class="{ active: activeName === 'time-articles' }">
                        <router-link to="/time-articles"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M448 68.48v64.832A384.128 384.128 0 0 0 512 896a384.128 384.128 0 0 0 378.688-320h64.768A448.128 448.128 0 0 1 64 512 448.128 448.128 0 0 1 448 68.48z"></path><path fill="currentColor" d="M576 97.28V448h350.72A384.064 384.064 0 0 0 576 97.28zM512 64V33.152A448 448 0 0 1 990.848 512H512V64z"></path></svg>
                            <p>归档</p></router-link>
                    </li>
                    <li :class="{ active: activeName === 'album' }">
                        <router-link to="/album"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M96 896a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h832a32 32 0 0 1 32 32v704a32 32 0 0 1-32 32H96zm315.52-228.48-68.928-68.928a32 32 0 0 0-45.248 0L128 768.064h778.688l-242.112-290.56a32 32 0 0 0-49.216 0L458.752 665.408a32 32 0 0 1-47.232 2.112zM256 384a96 96 0 1 0 192.064-.064A96 96 0 0 0 256 384z"></path></svg>
                            <p>相册</p></router-link>
                    </li>
                    <li :class="{ active: activeName === 'friend-links' }">
                        <router-link to="/friend-links"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M926.784 480H701.312A192.512 192.512 0 0 0 544 322.688V97.216A416.064 416.064 0 0 1 926.784 480zm0 64A416.064 416.064 0 0 1 544 926.784V701.312A192.512 192.512 0 0 0 701.312 544h225.472zM97.28 544h225.472A192.512 192.512 0 0 0 480 701.312v225.472A416.064 416.064 0 0 1 97.216 544zm0-64A416.064 416.064 0 0 1 480 97.216v225.472A192.512 192.512 0 0 0 322.688 480H97.216z"></path></svg>
                            <p>友链</p></router-link>
                    </li>
                    <li :class="{ active: activeName === 'about-me' }">
                        <router-link to="/about-me"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M384 960v-64h192.064v64H384zm448-544a350.656 350.656 0 0 1-128.32 271.424C665.344 719.04 640 763.776 640 813.504V832H320v-14.336c0-48-19.392-95.36-57.216-124.992a351.552 351.552 0 0 1-128.448-344.256c25.344-136.448 133.888-248.128 269.76-276.48A352.384 352.384 0 0 1 832 416zm-544 32c0-132.288 75.904-224 192-224v-64c-154.432 0-256 122.752-256 288h64z"></path></svg>
                            <p>关于</p></router-link>
                    </li>  
                    <li class="theme-switch">
                        <themeSwitch/>
                    </li>              
                </ul>
            </nav>
        </header>
        <router-view></router-view>   <!-- 根据路由渲染不同的组件 -->
        
        <div class="music" :style="{transform: musicTransform}">
            <div :class="{ hide: isMusicHidden }">
                <aplayer ref="aplayer"
                :music="firstMusic(music_list)" 
                :list="music_list"
                :listFolded="true"
                :mini="false"
                loop="all"/>
            </div>
            
            <div class="arrow" style="cursor: pointer;" @click="toggleMusicHidden()">
                <el-icon v-if="isMusicHidden === true" :size="35"><CaretRight /></el-icon>
                <el-icon v-else :size="35"><CaretLeft /></el-icon>
            </div>
        </div>

        <div class="footer">
            <p>By XiaoYe | ©2025</p>    <!-- alt+169 -->
        </div>
    </div>
    
    <!-- 返回顶部 -->
    <el-backtop :right="50" :bottom="40"></el-backtop>
</template>

<script>
import aplayer from 'vue3-aplayer'
import { CaretLeft, CaretRight } from '@element-plus/icons-vue'  //element-plus图标库
import startLoading from './views/start-loading.vue'
import themeSwitch from './views/theme-switch.vue'
import axios from 'axios'

export default {
    name: 'App',
    components: {
        aplayer,   // 音乐播放器组件
        CaretLeft, CaretRight,  //音乐播放器显示与隐藏按钮
        startLoading,  //启动动画组件
        themeSwitch,
    },

    data() {
        return {
            activeName: 'home',   //当前所处页面

            showLoading: true,   //启动动画显示
            dialogWidth: 700,  //搜索框弹窗宽度
            searchVisible: false,  //搜索框弹窗
            searchInput: '',  //搜索框输入内容

            lastScrollTop: 0,   //滚动条滚动后所在的位置
            headerHeight: 70,    // 根据实际header高度调整
            isHeaderHidden: false,   //隐藏与显示状态栏
            isHeaderTop: true,    //靠近顶部

            isMusicHidden: true,  // 音乐播放器显示与隐藏状态
            musicWeight: 300,  //音乐播放器宽度

            // 音乐列表
            music_list: [
                {
                    title: ' 陽だまりにて和む猫 (阳光下安静的猫)',
                    artist: ' ',
                    src: 'src/music/Falcom Sound Team jdk - 陽だまりにて和む猫 (阳光下安静的猫).mp3',
                    pic: 'src/music/陽だまりにて和む猫.png',     //注：pic文件名不支持空格
                },
                {
                    title: 'なごみ風',
                    artist: ' ',
                    src: 'src/music/渡辺善太郎 - なごみ風.mp3',
                    pic: 'src/music/なごみ風.png',    
                },
                {
                    title: 'Lyrical Amber',
                    artist: ' ',
                    src: 'src/music/Falcom Sound Team jdk - Lyrical Amber.mp3',
                    pic: 'src/music/Lyrical_Amber.png',
                },
            ]
        }
    },

    computed: {
        //标签栏显示与隐藏
        headerTransform() {
            return this.isHeaderHidden      //实现显示与隐藏效果
                ? `translateY(-${this.headerHeight}px)` 
                : 'translateY(0)'
        },
        //音乐播放器显示与隐藏
        musicTransform() {
            return this.isMusicHidden
                ? `translateX(-${this.musicWeight}px)`
                : 'translateX(0)' 
        },
    },

    methods: {
        // 实时搜索的防抖动（减少请求次数）
        debounce(func, delay) {
            let timeout;           // 每次调用返回的函数时，就会清除之前的定时器
            return this.delayEvent(func, delay, timeout);
        },

        delayEvent(func, delay, timeout) {          // 由于原return function（）不行，单独将function（）写成此函数
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);     // 用户停止输入delay时间后，才会发起搜索请求
        },

        // 搜索文章
        searchArticles() {
            const query = this.searchInput.trim()    // 去除前后空格
            if (query) {
                this.fetchArticles(query)
            }
            else {
                document.getElementById('search-results').innerHTML = ''   // 清空搜索结果
            }
        },

        fetchArticles(query) {
            console.log('搜索文章：', query)
            const baseUrl = window.location.origin  // 获取当前页面的 origin（协议://主机名:端口号），确保在文章详情页搜索去除article/
            axios.get(`${baseUrl}/api/articles/search/?q=${query}`)
                .then(response => {
                    const resultsDiv = document.getElementById('search-results')
                    resultsDiv.innerHTML = ''   // 清空之前的搜索结果
                    const articles = response.data

                    articles.forEach(article => {
                        const articleDiv = document.createElement('div');
                        articleDiv.className = 'article-searchResult'

                        const title = document.createElement('a');
                        title.className = 'title-link'
                        title.textContent = article.title;
                        title.style = "cursor: pointer;"
                        title.addEventListener('click', () => {
                            this.goToArticle(article.id)
                        })

                        articleDiv.appendChild(title)
                        resultsDiv.appendChild(articleDiv)
                    })
                })
                .catch(error => {
                    console.error('搜索文章时出现错误', error)
                })
        },

        // 跳转至文章详情页
        goToArticle(id){
            this.searchVisible = false
            this.$router.push({ name: 'ArticleDetail', params: { id } });
        },

        // 根据屏幕大小调整搜索弹窗宽度
        updateDialogWidth() {
            this.dialogWidth = window.innerWidth > 700 ? '700px' : '100%';
        },

        // 处理搜索点击事件
        handleSearchClick() {
            this.searchVisible = true
            this.updateDialogWidth()
        },

        //导航栏的显示与隐藏
        handleScroll() {
            const currentScrollTop = window.scrollY || document.documentElement.scrollTop    //当前滚动条距离顶部的距离
            const scrollDelta = currentScrollTop - this.lastScrollTop   //根据相对位置判断是否隐藏导航栏

            // 优化边界检测（当接近顶部时强制显示）
            if (currentScrollTop < 7) {
                this.isHeaderHidden = false
                this.isHeaderTop = true
            } else { this.isHeaderTop = false }

            // 判断滚动方向，并添加移动阈值（避免微小滚动触发）
            if (Math.abs(scrollDelta) > 5) {
                if (scrollDelta > 0 && !this.isHeaderHidden) {
                    this.isHeaderHidden = true
                } else if (scrollDelta < 0 && this.isHeaderHidden) {
                    this.isHeaderHidden = false
                }
            }
            this.lastScrollTop = currentScrollTop   
        },

        // 取音乐列表首个音乐
        firstMusic(music_list) {
            return music_list[0]
        },

        //音乐播放器隐藏与显示
        toggleMusicHidden() {
            this.isMusicHidden = !this.isMusicHidden
        }
    },

    watch: {
        '$route.path': {  // 监听页面跳转
            immediate: true,  // 立即执行一次，确保初始路径也能被处理
            handler(newPath) {
                this.activeName = newPath.slice(1) || 'home';
            },
        }
    },

    mounted() {    
        this.activeName = this.$route.path.slice(1) || 'home';    // 页面加载完成后，初始化activeName
        window.addEventListener('scroll', this.handleScroll)   // 监听滚动事件
        this.updateDialogWidth()   // 调整搜索弹窗宽度

        // 模拟加载完成，实际应用中根据页面加载情况来触发
        setTimeout(() => {
            this.showLoading = false;
        }, 3000);  // 3秒后模拟加载完成
    },

    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll)   // 移除滚动事件
    }
}
</script>