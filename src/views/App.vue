<template>
    <startLoading :show="showLoading" :progress="loadingProgress"/>  <!-- 启动动画 -->
    
    <div class="app" :style="appStyle">
        <!-- 导航栏 -->
        <header :class="{ 'is-top': isHeaderTop }" :style="{ 
            transform: headerTransform 
            }">   <!-- 导航栏显示与隐藏动态样式绑定 -->
            <nav class="site-nav">
                <router-link class="site-brand" to="/">
                    <span class="brand-main">XiaoYe</span>
                    <span class="brand-sub">Lab</span>
                </router-link>

                <ul class="nav-menu">
                    <li class="nav-search">
                        <div class="search nav-icon-button" @click="handleSearchClick" style="cursor: pointer;">
                            <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true">
                                <circle cx="11" cy="11" r="6.5"></circle>
                                <path d="M16.2 16.2 20 20"></path>
                            </svg>
                        </div>

                        <el-dialog v-model="searchVisible" class="search-dialog" title="搜索文章" :append-to-body="true" :width="dialogWidth" :lock-scroll="false" align-center @opened="focusSearchInput">
                            <div class="search-panel">
                                <div class="search-box">
                                    <el-input
                                        ref="searchInputRef"
                                        v-model="searchInput"
                                        clearable
                                        placeholder="输入关键词，搜索文章标题"
                                        @input="queueSearch"
                                        @keydown.down.prevent="selectNextSearchResult"
                                        @keydown.up.prevent="selectPrevSearchResult"
                                        @keydown.enter.prevent="confirmSearchSelection"
                                    />
                                </div>

                                <div class="search-results">
                                    <div v-if="searchLoading" class="search-state">正在搜索...</div>
                                    <div v-else-if="searchError" class="search-state error">{{ searchError }}</div>
                                    <div v-else-if="!searchInput.trim()" class="search-state">输入关键词后会显示匹配文章。</div>
                                    <div v-else-if="hasSearched && searchResults.length === 0" class="search-state">没有找到相关文章。</div>

                                    <template v-else>
                                        <button
                                            v-for="(article, index) in searchResults"
                                            :key="article.id"
                                            class="search-result-card"
                                            :class="{ 'is-active': selectedSearchIndex === index }"
                                            @click="goToArticle(article.id)"
                                        >
                                            <span class="result-category">{{ categoryName(article.category_id) }}</span>
                                            <strong>{{ article.title }}</strong>
                                            <small>{{ formatDate(article.edited_time) }}</small>
                                        </button>
                                    </template>
                                </div>
                            </div>
                        </el-dialog>
                    </li>
                    <li :class="{ active: activeName === 'home' }">   <!-- 根据路由的activeName动态加入class=active -->
                        <router-link to="/"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M512 128 128 447.936V896h255.936V640H640v256h255.936V447.936z"></path></svg>
                            <p>主页</p></router-link>
                    </li>
                    <li :class="{ active: activeName === 'study' }">
                        <router-link to="/study"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="m512 863.36 384-54.848v-638.72L525.568 222.72a96 96 0 0 1-27.136 0L128 169.792v638.72l384 54.848zM137.024 106.432l370.432 52.928a32 32 0 0 0 9.088 0l370.432-52.928A64 64 0 0 1 960 169.792v638.72a64 64 0 0 1-54.976 63.36l-388.48 55.488a32 32 0 0 1-9.088 0l-388.48-55.488A64 64 0 0 1 64 808.512v-638.72a64 64 0 0 1 73.024-63.36z"></path><path fill="currentColor" d="M480 192h64v704h-64z"></path></svg>
                            <p>文章</p></router-link>
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
        <main class="route-stage">
            <AmbientBackground/>
            <router-view v-slot="{ Component, route }">   <!-- 根据路由渲染不同的组件 -->
                <component :is="Component" :key="route.fullPath" />
            </router-view>
        </main>
        
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
import startLoading from './start-loading.vue'
import themeSwitch from './theme-switch.vue'
import AmbientBackground from '@/components/AmbientBackground.vue'
import axios from 'axios'
import AOS from 'aos'

export default {
    name: 'App',
    components: {
        aplayer,   // 音乐播放器组件
        CaretLeft, CaretRight,  //音乐播放器显示与隐藏按钮
        startLoading,  //启动动画组件
        themeSwitch,
        AmbientBackground,
    },

    data() {
        return {
            activeName: 'home',   // 当前所处页面

            showLoading: true,   // 启动动画显示
            loadingProgress: 0,   // 启动进度
            homeArticles: [], // 用来暂存首页文章数据
            dialogWidth: 700,  // 搜索框弹窗宽度
            searchVisible: false,  // 搜索框弹窗
            searchInput: '',  // 搜索框输入内容
            searchResults: [],
            searchLoading: false,
            searchError: '',
            hasSearched: false,
            searchTimer: null,
            selectedSearchIndex: -1,

            lastScrollTop: 0,   // 滚动条滚动后所在的位置
            headerHeight: 70,    // 根据实际header高度调整
            isHeaderHidden: false,   // 隐藏与显示状态栏
            isHeaderTop: true,    // 靠近顶部

            isMusicHidden: true,  // 音乐播放器显示与隐藏状态
            musicWeight: 300,  // 音乐播放器宽度

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

        appStyle() {
            return {
                '--nav-progress-offset': this.isHeaderHidden ? '0px' : '64px',
            };
        },

    },

    methods: {
        // 资源预加载控制中心
        async preloadResources() {
            const modules = import.meta.glob('/src/icons/*.png', { eager: true, import: 'default' });
            const imageSources = Object.values(modules);      // 所有图片的正确打包路径

            // 追踪图片加载与接口请求
            const totalTasks = imageSources.length + 1;
            let completedTasks = 0;

            // 更新进度的辅助函数
            const updateProgress = (sourceName) => {
                completedTasks++;
                // 计算百分比
                this.loadingProgress = Math.floor((completedTasks / totalTasks) * 100);

                console.log(`[完成] ${sourceName} | 当前进度: ${this.loadingProgress}% (${completedTasks}/${totalTasks})`);

                // 如果全部完成
                if (completedTasks === totalTasks) {
                    setTimeout(() => {
                        this.showLoading = false;
                    }, 200); 
                }
            };

            // 开始加载图片
            if (imageSources.length === 0) updateProgress(); // 防御代码
            imageSources.forEach(src => {
                const img = new Image();
                const fileName = src.split('/').pop();

                img.onload = () => updateProgress(`图片: ${fileName}`);
                img.onerror = () => updateProgress(`图片(失败): ${fileName}`);
                img.src = src;
            });

            // 请求后端数据
            const baseUrl = window.location.origin;
            axios.get(`${baseUrl}/api/articles/?page=1&page_size=5`)
                .then(response => {
                    console.log('[HTTP] 文章数据请求成功，数据长度:', response.data.length);
                    this.homeArticles = response.data;      // 请求成功，把数据存起来，准备传给 Home.vue
                    updateProgress('API: 文章列表');
                })
                .catch(error => {
                    console.error('预加载文章失败', error);
                    // 即使失败也要让进度条走完，否则卡死
                    updateProgress('API: 文章列表(失败)');
                });
        },

        queueSearch() {
            if (this.searchTimer) {
                clearTimeout(this.searchTimer);
            }

            if (!this.searchInput.trim()) {
                this.searchResults = [];
                this.hasSearched = false;
                this.searchError = '';
                this.searchLoading = false;
                this.selectedSearchIndex = -1;
                return;
            }

            this.searchLoading = true;
            this.searchError = '';
            this.hasSearched = true;
            this.selectedSearchIndex = -1;

            this.searchTimer = setTimeout(() => {
                this.searchArticles();
            }, 300);    // 用户停止输入300ms后再发起搜索请求
        },

        // 搜索文章
        searchArticles() {
            const query = this.searchInput.trim()    // 去除前后空格
            if (query) {
                this.fetchArticles(query)
            }
            else {
                this.searchResults = []   // 清空搜索结果
                this.hasSearched = false
                this.searchError = ''
                this.selectedSearchIndex = -1
            }
        },

        fetchArticles(query) {
            console.log('搜索文章：', query)
            const baseUrl = window.location.origin  // 获取当前页面的 origin（协议://主机名:端口号），确保在文章详情页搜索去除article/
            this.searchLoading = true
            this.searchError = ''
            this.hasSearched = true
            axios.get(`${baseUrl}/api/articles/search/?q=${encodeURIComponent(query)}`)
                .then(response => {
                    this.searchResults = response.data
                    this.selectedSearchIndex = -1
                })
                .catch(error => {
                    console.error('搜索文章时出现错误', error)
                    this.searchError = '搜索失败，请稍后再试。'
                    this.searchResults = []
                    this.selectedSearchIndex = -1
                })
                .finally(() => {
                    this.searchLoading = false
                })
        },

        // 跳转至文章详情页
        async goToArticle(id){
            this.searchVisible = false
            await this.$nextTick()
            this.resetSearchState()
            await this.$router.push({ name: 'ArticleDetail', params: { id } });
            this.searchVisible = false
        },

        resetSearchState() {
            if (this.searchTimer) {
                clearTimeout(this.searchTimer)
                this.searchTimer = null
            }

            this.searchInput = ''
            this.searchResults = []
            this.searchError = ''
            this.searchLoading = false
            this.hasSearched = false
            this.selectedSearchIndex = -1
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

        focusSearchInput() {
            this.$nextTick(() => {
                setTimeout(() => {
                    this.$refs.searchInputRef?.focus?.()
                    document.querySelector('.search-dialog input')?.focus()
                }, 180)
            })
        },

        selectNextSearchResult() {
            if (this.searchLoading || this.searchResults.length === 0) return
            this.selectedSearchIndex = (this.selectedSearchIndex + 1) % this.searchResults.length
        },

        selectPrevSearchResult() {
            if (this.searchLoading || this.searchResults.length === 0) return
            this.selectedSearchIndex = this.selectedSearchIndex <= 0
                ? this.searchResults.length - 1
                : this.selectedSearchIndex - 1
        },

        confirmSearchSelection() {
            if (this.searchLoading) return

            if (this.searchResults.length > 0) {
                const safeIndex = this.selectedSearchIndex >= 0 ? this.selectedSearchIndex : 0
                this.goToArticle(this.searchResults[safeIndex].id)
                return
            }

            this.searchArticles()
        },

        resolveActiveName(path) {
            const firstSegment = path.split('/')[1] || 'home'

            if (firstSegment === 'article') return 'study'

            return firstSegment
        },

        categoryName(id) {
            const categoryMap = {
                1: '前端',
                2: '后端',
                3: '嵌入式',
                4: '通信',
                5: '日语',
            };
            return categoryMap[id] || '随笔';
        },

        formatDate(date) {
            if (!date) return '暂无时间';
            return date.toLocaleString('zh').replace('T', ' ').split('.')[0];
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
        },

        refreshRouteReveal() {
            this.$nextTick(() => {
                requestAnimationFrame(() => {
                    if (AOS.refreshHard) {
                        AOS.refreshHard()
                    } else {
                        AOS.refresh()
                    }
                })
            })
        }
    },

    watch: {
        searchVisible(visible) {
            if (visible) {
                this.focusSearchInput()
            }
        },

        '$route.path': {  // 监听页面跳转
            immediate: true,  // 立即执行一次，确保初始路径也能被处理
            handler(newPath) {
                this.activeName = this.resolveActiveName(newPath);
                this.searchVisible = false;
                this.refreshRouteReveal();
            },
        }
    },

    mounted() {    
        this.activeName = this.resolveActiveName(this.$route.path);    // 页面加载完成后，初始化activeName
        window.addEventListener('scroll', this.handleScroll)   // 监听滚动事件
        window.addEventListener('resize', this.updateDialogWidth)   // 监听窗口变化并同步搜索弹窗宽度
        this.updateDialogWidth()   // 调整搜索弹窗宽度

        this.preloadResources();
    },

    beforeUnmount() {
        if (this.searchTimer) {
            clearTimeout(this.searchTimer)
        }
        window.removeEventListener('scroll', this.handleScroll)   // 移除滚动事件
        window.removeEventListener('resize', this.updateDialogWidth)   // 移除窗口变化事件
    }
}
</script>
