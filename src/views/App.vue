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
        
        <section
            class="music-player"
            :class="{ 'is-collapsed': isMusicHidden, 'is-tucked': isMusicTucked, 'is-closing': isMusicClosing, 'is-playing': isMusicPlaying, 'is-list-open': isMusicListOpen }"
            :style="musicPlayerStyle"
            aria-label="音乐播放器"
        >
            <audio
                ref="audioPlayer"
                :src="currentMusic.src"
                preload="metadata"
                @loadedmetadata="handleAudioLoaded"
                @timeupdate="handleAudioTimeUpdate"
                @ended="playNextMusic(true)"
                @play="isMusicPlaying = true"
                @pause="isMusicPlaying = false"
            ></audio>

            <div class="music-shell">
                <button class="music-cover-button" type="button" @click="toggleMusicHidden" :aria-label="isMusicHidden ? '展开播放器' : '收起播放器'">
                    <img :src="currentMusic.pic" :alt="currentMusic.title">
                    <span class="music-cover-ring"></span>
                </button>

                <div class="music-main">
                    <button class="music-title-button" type="button" @click="toggleMusicHidden">
                        <span class="music-kicker">Now Playing</span>
                        <strong>{{ currentMusic.title }}</strong>
                        <small>{{ currentMusic.artist || 'XiaoYe Lab Radio' }}</small>
                    </button>

                    <transition name="music-expand">
                        <div class="music-expanded" v-show="isMusicExpandedVisible">
                            <div class="music-progress-row">
                                <span>{{ formattedCurrentTime }}</span>
                                <input
                                    class="music-range music-progress"
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    :value="musicProgress"
                                    aria-label="播放进度"
                                    @input="seekMusic"
                                >
                                <span>{{ formattedDuration }}</span>
                            </div>

                            <div class="music-controls">
                                <button class="music-icon-button" type="button" aria-label="上一首" @click="playPrevMusic">
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M11 6 5 12l6 6V6Z"></path>
                                        <path d="M19 6 13 12l6 6V6Z"></path>
                                    </svg>
                                </button>

                                <button class="music-play-button" type="button" :aria-label="isMusicPlaying ? '暂停' : '播放'" @click="toggleMusicPlay">
                                    <svg v-if="!isMusicPlaying" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8 5v14l11-7L8 5Z"></path>
                                    </svg>
                                    <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M7 5h4v14H7V5Z"></path>
                                        <path d="M13 5h4v14h-4V5Z"></path>
                                    </svg>
                                </button>

                                <button class="music-icon-button" type="button" aria-label="下一首" @click="playNextMusic">
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="m13 6 6 6-6 6V6Z"></path>
                                        <path d="m5 6 6 6-6 6V6Z"></path>
                                    </svg>
                                </button>

                                <div class="music-volume">
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M4 10v4h4l5 4V6L8 10H4Z"></path>
                                        <path d="M16 9c1 .9 1.5 1.9 1.5 3s-.5 2.1-1.5 3"></path>
                                    </svg>
                                    <input
                                        class="music-range music-volume-range"
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        :value="musicVolume"
                                        aria-label="音量"
                                        @input="changeMusicVolume"
                                    >
                                </div>

                                <button class="music-icon-button" type="button" :class="{ active: isMusicListOpen }" aria-label="播放列表" @click="toggleMusicList">
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M5 7h14"></path>
                                        <path d="M5 12h14"></path>
                                        <path d="M5 17h9"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </transition>
                </div>

                <button class="music-quick-play" type="button" :aria-label="isMusicPlaying ? '暂停' : '播放'" @click="toggleMusicPlay">
                    <svg v-if="!isMusicPlaying" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 5v14l11-7L8 5Z"></path>
                    </svg>
                    <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7 5h4v14H7V5Z"></path>
                        <path d="M13 5h4v14h-4V5Z"></path>
                    </svg>
                </button>

                <button class="music-toggle" type="button" @click="toggleMusicHidden" :aria-label="isMusicHidden ? '展开播放器' : '收起播放器'">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path v-if="isMusicHidden" d="m9 6 6 6-6 6"></path>
                        <path v-else d="m15 6-6 6 6 6"></path>
                    </svg>
                </button>
            </div>

            <transition name="music-list">
                <div class="music-list-panel" v-if="!isMusicHidden && isMusicListOpen">
                    <button
                        v-for="(music, index) in music_list"
                        :key="music.src"
                        class="music-list-item"
                        :class="{ active: index === currentMusicIndex }"
                        type="button"
                        @click="selectMusic(index)"
                    >
                        <img :src="music.pic" :alt="music.title">
                        <span>
                            <strong>{{ music.title }}</strong>
                            <small>{{ music.artist || 'XiaoYe Lab Radio' }}</small>
                        </span>
                    </button>
                </div>
            </transition>
        </section>

        <div class="footer">
            <p>By XiaoYe | ©2025</p>    <!-- alt+169 -->
        </div>
    </div>
    
    <!-- 返回顶部 -->
    <el-backtop :right="50" :bottom="40"></el-backtop>
</template>

<script>
import startLoading from './start-loading.vue'
import themeSwitch from './theme-switch.vue'
import AmbientBackground from '@/components/AmbientBackground.vue'
import axios from 'axios'
import AOS from 'aos'
import hidamariAudio from '@/music/Falcom Sound Team jdk - 陽だまりにて和む猫 (阳光下安静的猫).mp3'
import hidamariCover from '@/music/陽だまりにて和む猫.png'
import nagomiAudio from '@/music/渡辺善太郎 - なごみ風.mp3'
import nagomiCover from '@/music/なごみ風.png'
import lyricalAmberAudio from '@/music/Falcom Sound Team jdk - Lyrical Amber.mp3'
import lyricalAmberCover from '@/music/Lyrical_Amber.png'

export default {
    name: 'App',
    components: {
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
            isMusicTucked: true,
            isMusicClosing: false,
            isMusicExpandedVisible: false,
            isMusicPlaying: false,
            isMusicListOpen: false,
            musicMotionTimer: null,
            musicMotionEndTimer: null,
            musicTuckTimer: null,
            currentMusicIndex: 0,
            musicCurrentTime: 0,
            musicDuration: 0,
            musicVolume: 0.72,

            // 音乐列表
            music_list: [
                {
                    title: '陽だまりにて和む猫',
                    artist: 'Falcom Sound Team jdk',
                    src: hidamariAudio,
                    pic: hidamariCover,
                },
                {
                    title: 'なごみ風',
                    artist: '渡辺善太郎',
                    src: nagomiAudio,
                    pic: nagomiCover,
                },
                {
                    title: 'Lyrical Amber',
                    artist: 'Falcom Sound Team jdk',
                    src: lyricalAmberAudio,
                    pic: lyricalAmberCover,
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
        appStyle() {
            return {
                '--nav-progress-offset': this.isHeaderHidden ? '0px' : '64px',
            };
        },

        currentMusic() {
            return this.music_list[this.currentMusicIndex] || this.music_list[0] || {};
        },

        musicProgress() {
            if (!this.musicDuration) return 0;
            return Math.min(100, (this.musicCurrentTime / this.musicDuration) * 100);
        },

        formattedCurrentTime() {
            return this.formatMusicTime(this.musicCurrentTime);
        },

        formattedDuration() {
            return this.formatMusicTime(this.musicDuration);
        },

        musicPlayerStyle() {
            const collapsed = this.isMusicHidden;
            const tucked = this.isMusicTucked;
            const closing = this.isMusicClosing;
            const width = closing || !collapsed
                ? 'min(390px, calc(100vw - 44px))'
                : 'min(318px, calc(100vw - 44px))';
            const left = closing
                ? (tucked ? '-282px' : '22px')
                : (collapsed ? '-210px' : '22px');

            return {
                '--music-progress': `${this.musicProgress}%`,
                '--music-volume': `${this.musicVolume * 100}%`,
                width,
                left,
            };
        },

    },

    methods: {
        // 资源预加载控制中心
        async preloadResources() {
            const totalTasks = 1;
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

        toggleMusicHidden() {
            if (this.musicMotionTimer) {
                clearTimeout(this.musicMotionTimer)
                this.musicMotionTimer = null
            }
            if (this.musicMotionEndTimer) {
                clearTimeout(this.musicMotionEndTimer)
                this.musicMotionEndTimer = null
            }
            if (this.musicTuckTimer) {
                clearTimeout(this.musicTuckTimer)
                this.musicTuckTimer = null
            }

            if (this.isMusicHidden) {
                this.isMusicHidden = false
                this.isMusicTucked = false
                this.isMusicClosing = false
                this.isMusicExpandedVisible = true
                return
            }

            this.closeMusicPlayer()
        },

        closeMusicPlayer() {
            if (this.musicMotionTimer) {
                clearTimeout(this.musicMotionTimer)
                this.musicMotionTimer = null
            }
            if (this.musicMotionEndTimer) {
                clearTimeout(this.musicMotionEndTimer)
                this.musicMotionEndTimer = null
            }
            if (this.musicTuckTimer) {
                clearTimeout(this.musicTuckTimer)
                this.musicTuckTimer = null
            }

            this.isMusicListOpen = false
            this.isMusicClosing = true
            this.isMusicTucked = false
            this.isMusicExpandedVisible = false

            this.musicMotionTimer = setTimeout(() => {
                this.isMusicHidden = true
                this.musicMotionTimer = null
            }, 320)

            this.musicTuckTimer = setTimeout(() => {
                this.isMusicTucked = true
                this.musicTuckTimer = null
            }, 1000)

            this.musicMotionEndTimer = setTimeout(() => {
                this.isMusicClosing = false
                this.musicMotionEndTimer = null
            }, 1660)
        },

        openMusicPlayer() {
            if (this.musicMotionTimer) {
                clearTimeout(this.musicMotionTimer)
                this.musicMotionTimer = null
            }
            if (this.musicMotionEndTimer) {
                clearTimeout(this.musicMotionEndTimer)
                this.musicMotionEndTimer = null
            }
            if (this.musicTuckTimer) {
                clearTimeout(this.musicTuckTimer)
                this.musicTuckTimer = null
            }

            this.isMusicClosing = false
            this.isMusicTucked = false
            this.isMusicHidden = false
            this.isMusicExpandedVisible = true
            this.musicMotionTimer = null
        },

        toggleMusicList() {
            this.isMusicListOpen = !this.isMusicListOpen
        },

        toggleMusicPlay() {
            const audio = this.$refs.audioPlayer
            if (!audio) return

            if (this.isMusicPlaying) {
                audio.pause()
                return
            }

            audio.play().catch(error => {
                console.error('音乐播放失败', error)
                this.isMusicPlaying = false
            })
        },

        selectMusic(index) {
            this.switchMusic(index, true)
            this.isMusicHidden = false
            this.isMusicListOpen = false
        },

        playPrevMusic() {
            const nextIndex = (this.currentMusicIndex - 1 + this.music_list.length) % this.music_list.length
            this.switchMusic(nextIndex, this.isMusicPlaying)
        },

        playNextMusic(forcePlay = false) {
            const nextIndex = (this.currentMusicIndex + 1) % this.music_list.length
            this.switchMusic(nextIndex, forcePlay || this.isMusicPlaying)
        },

        switchMusic(index, shouldPlay = false) {
            this.currentMusicIndex = index
            this.musicCurrentTime = 0
            this.musicDuration = 0

            this.$nextTick(() => {
                const audio = this.$refs.audioPlayer
                if (!audio) return

                audio.volume = this.musicVolume
                audio.load()

                if (shouldPlay) {
                    audio.play().catch(error => {
                        console.error('音乐播放失败', error)
                        this.isMusicPlaying = false
                    })
                }
            })
        },

        handleAudioLoaded() {
            const audio = this.$refs.audioPlayer
            this.musicDuration = Number.isFinite(audio?.duration) ? audio.duration : 0
        },

        handleAudioTimeUpdate() {
            const audio = this.$refs.audioPlayer
            if (!audio) return

            this.musicCurrentTime = audio.currentTime || 0
            this.musicDuration = Number.isFinite(audio.duration) ? audio.duration : this.musicDuration
        },

        seekMusic(event) {
            const audio = this.$refs.audioPlayer
            if (!audio || !this.musicDuration) return

            const value = Number(event.target.value)
            audio.currentTime = (value / 100) * this.musicDuration
            this.musicCurrentTime = audio.currentTime
        },

        changeMusicVolume(event) {
            const value = Number(event.target.value)
            this.musicVolume = Math.min(1, Math.max(0, value))

            const audio = this.$refs.audioPlayer
            if (audio) {
                audio.volume = this.musicVolume
            }
        },

        formatMusicTime(seconds) {
            if (!Number.isFinite(seconds) || seconds <= 0) return '00:00'

            const minutes = Math.floor(seconds / 60)
            const restSeconds = Math.floor(seconds % 60)
            return `${String(minutes).padStart(2, '0')}:${String(restSeconds).padStart(2, '0')}`
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

        this.$nextTick(() => {
            if (this.$refs.audioPlayer) {
                this.$refs.audioPlayer.volume = this.musicVolume
            }
        })
    },

    beforeUnmount() {
        if (this.searchTimer) {
            clearTimeout(this.searchTimer)
        }
        if (this.musicMotionTimer) {
            clearTimeout(this.musicMotionTimer)
        }
        if (this.musicMotionEndTimer) {
            clearTimeout(this.musicMotionEndTimer)
        }
        if (this.musicTuckTimer) {
            clearTimeout(this.musicTuckTimer)
        }
        window.removeEventListener('scroll', this.handleScroll)   // 移除滚动事件
        window.removeEventListener('resize', this.updateDialogWidth)   // 移除窗口变化事件
    }
}
</script>
