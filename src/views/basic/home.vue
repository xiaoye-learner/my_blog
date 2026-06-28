<template>
    <div class="blog-home">
        <div class="blog-home-header">
            <div class="slideshow">
                <img v-for="(img, index) in img_list" :key="index" 
                :src="img.src" 
                :class="[`img-${index}`, { active: index === currentIndex }]"
                :alt="img.alt"
                style="object-fit: cover;"></img>
            </div>

            <div class="infoText">
                <h1>Hi,</h1>
                <h1>I'm <span class="name">XiaoYe</span></h1>
                <p class="hero-subtitle">Code, notes, music and small joys.</p>
            </div>
            
            <div class="arrow-down" @click="scrollToHomeContent" style="cursor: pointer;">
                <el-icon :size="35" color="#ffffff"><ArrowDownBold /></el-icon>
            </div>

            <!-- 波浪效果 -->
            <svg class="waves"
                :style="{ height }"
                viewBox="0 24 150 28"
                preserveAspectRatio="none"
                shape-rendering="auto"
                >
                <defs>
                <path
                    id="gentle-wave"
                    d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                />
                </defs>
                <g class="parallax">           <!-- 产生视差 -->
                    <use xlink:href="#gentle-wave" x="48" y="0" />
                    <use xlink:href="#gentle-wave" x="48" y="3" />
                    <use xlink:href="#gentle-wave" x="48" y="5" />
                    <use xlink:href="#gentle-wave" x="48" y="7" />
                </g>
            </svg>
        </div>

        <div class="home-content" ref="homeContent" :class="{ 'show-all-posts': showAllPosts }">
            <div class="home-dashboard" :aria-hidden="showAllPosts" :inert="showAllPosts">
                <section class="dashboard-card intro-card" data-aos="fade-up" data-aos-duration="800">
                    <div class="avatar">
                        <img :src="avatarImg" alt="avatar"></img>
                    </div>
                    <div class="intro-copy">
                        <span class="eyebrow">XiaoYe Lab</span>
                        <h2>写代码、做实验，也记录一点生活里的小确幸。</h2>
                        <p>这里会慢慢沉淀前端、Linux、嵌入式、Kotlin 和一些学习杂谈。</p>
                    </div>
                    <div class="intro-links">
                        <a v-for="i in link_list" :key="i.animate" :href="i.href" target="_blank" :aria-label="i.content">
                            <el-tooltip effect="light" :content="i.content" placement="top">
                                <button class="links-button" :style="{ backgroundColor: i.color, cursor: 'pointer' }">
                                    <img :src="i.src" alt="link"/>
                                </button>
                            </el-tooltip>
                        </a>
                    </div>
                </section>

                <section class="dashboard-card stats-card" data-aos="fade-up" data-aos-duration="800">
                    <span class="eyebrow">SITE STATUS</span>
                    <div class="stats-grid">
                        <div>
                            <strong>{{ articleCount }}</strong>
                            <span>文章</span>
                        </div>
                        <div>
                            <strong>{{ categoryCount }}</strong>
                            <span>分类</span>
                        </div>
                        <div>
                            <strong>{{ latestTime }}</strong>
                            <span>最近更新</span>
                        </div>
                    </div>
                </section>

                <section class="dashboard-card music-card" data-aos="fade-up" data-aos-duration="800">
                    <span class="eyebrow">NOW PLAYING</span>
                    <h3>Lyrical Amber</h3>
                    <p>安静一点，把页面留给文章和旋律。</p>
                    <div class="music-wave">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </section>

                <section class="dashboard-card recent-card" data-aos="fade-up" data-aos-duration="800">
                    <div class="section-heading">
                        <span class="eyebrow">RECENT POSTS</span>
                        <button class="view-all-button" @click="showAllArticles">查看全部</button>
                    </div>
                    <div class="recent-list">
                        <article v-for="article in recentArticles" :key="article.id" @click="goToArticle(article.id)" style="cursor: pointer;">
                            <img :src="article.article_cover" alt="cover_image" v-if="article.article_cover != null"></img>
                            <div>
                                <span class="recent-category">{{ categoryName(article.category_id) }}</span>
                                <h3>{{ article.title }}</h3>
                                <p>
                                    <span>{{ formatDate(article.edited_time) }}</span>
                                    <span>阅读文章</span>
                                </p>
                            </div>
                        </article>
                    </div>
                </section>

                <section class="dashboard-card category-card" data-aos="fade-up" data-aos-anchor=".music-card" data-aos-duration="800">
                    <span class="eyebrow">KNOWLEDGE MAP</span>
                    <h3>正在整理的知识路径</h3>
                    <div class="category-tags">
                        <span v-for="tag in featureTags" :key="tag">{{ tag }}</span>
                    </div>
                </section>
            </div>
            <!-- 文章 -->
            <div class="article-list" :aria-hidden="!showAllPosts" :inert="!showAllPosts">
                <div class="article-section-heading">
                    <div>
                        <span class="eyebrow">ALL POSTS</span>
                        <h2>文章列表</h2>
                    </div>
                    <button class="view-all-button ghost" @click="hideAllArticles">返回概览</button>
                </div>
                <el-card class="article-card" v-for="(article, index) in displayedArticles.slice().reverse()" 
                :key="index" 
                @click="goToArticle(article.id)"
                style="cursor: pointer;"
                :data-aos="articleRevealReady ? 'fade-up' : null"
                :data-aos-delay="articleRevealReady ? index * 80 : null"
                :data-aos-duration="articleRevealReady ? 700 : null">
                <!-- 文章封面图片 -->
                <img :src="article.article_cover" alt="cover_image" v-if="article.article_cover != null"></img>
                <h4 v-else>暂无封面</h4>

                <!-- 文章相关信息 -->
                <div class="article-info">
                    <h3>{{ article.title }}</h3>
                    <hr>
                    <p>{{ article.edited_time.toLocaleString('zh').replace('T', ' ').split('.')[0] }}</p>
                </div>
                </el-card>

                <!-- 分页 -->
                <el-pagination   
                    @current-change="handleCurrentChange"  
                    :current-page="current_page"
                    :page-size="page_size"

                    layout="prev, pager, next"
                    :total="total_articles"
                ></el-pagination>
            </div>
        </div>
    </div> 
</template>

<script>
import axios from 'axios';
import AOS from 'aos';
import avatarImage from '@/icons/avatar.png';
import homeImage1 from '@/icons/home3.png';
import homeImage2 from '@/icons/home.png';
import homeImage3 from '@/icons/home2.png';
import githubIcon from '@/icons_link/GitHub.svg';
import bilibiliIcon from '@/icons_link/bilibili.svg';
import musicIcon from '@/icons_link/music.svg';

export default {
    props: {
        initialData: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            avatarImg: avatarImage,
            showAllPosts: false,
            articleRevealReady: false,
            articleRevealTimer: null,
            
            currentIndex: 0,    //首页图片当前序号
            displayedArticles: this.initialData || [],    // 显示的文章列表
            current_page: 1,    // 当前页码
            page_size: 5,    // 每页显示的文章数量
            total_articles: 0,    // 文章总数

            height: 'calc(6rem + 15px)',  // 波浪效果高度

            // 首页图片列表
            img_list: [
                {
                    src: homeImage1,
                    alt: 'img',
                },
                {
                    src: homeImage2,
                    alt: 'img',
                },
                {
                    src: homeImage3,
                    alt: 'img',
                },
            ],     

            // 超链接列表
            link_list: [
                {
                    icon: 'icon-github',
                    animate: 'Github',
                    content: 'Github',
                    color: '#3d3d3d',
                    href: 'https://github.com/xiaoye-learner',
                    src: githubIcon,
                },
                {
                    icon: 'icon-bilibili',
                    animate: 'BiliBili',
                    content: '哔哩哔哩',
                    color: '#0BA6D8',
                    href: 'https://space.bilibili.com/76999298',
                    src: bilibiliIcon,
                },
                {
                    icon: 'icon-music',
                    animate: 'Music',
                    content: '歌单',
                    color: '#65bbed',
                    href: 'https://www.kugou.com/songlist/gcid_3z160l9dbz1vz0b4/',
                    src: musicIcon,
                },
                {
                    icon: 'icon-anime',
                    animate: 'Anime',
                    content: '动漫新番表（外链）',
                    color: '#e549ed',
                    href: 'https://xf.hmacg.cn/',
                    src: '/src/icons_link/anime.png'
                },
            ]
        }
    },

    methods: {
        //轮播显示首页图片
        showNextImage(){
            this.currentIndex = (this.currentIndex + 1) % this.img_list.length;
        },

        async fetchArticles() {
            try{
                const response = await axios.get(`api/articles/?page=${this.current_page}&page_size=${this.page_size}`)
                this.displayedArticles = response.data;       // 文章列表
                this.total_articles = response.data.length;
                if (this.showAllPosts) {
                    this.prepareArticleReveal(80);
                }
            }catch(error){
                console.error(error)
            }
            // console.log(this.displayedArticles)
        },

        // 跳转至文章详情页
        goToArticle(id){
            this.$router.push({ name: 'ArticleDetail', params: { id } });
        },

        showAllArticles() {
            this.showAllPosts = true;
            this.prepareArticleReveal(480);
        },

        hideAllArticles() {
            this.resetArticleReveal();
            this.showAllPosts = false;
        },

        resetArticleReveal() {
            if (this.articleRevealTimer) {
                clearTimeout(this.articleRevealTimer);
                this.articleRevealTimer = null;
            }
            this.articleRevealReady = false;
        },

        prepareArticleReveal(delay = 480) {
            this.resetArticleReveal();
            this.articleRevealTimer = setTimeout(() => {
                this.articleRevealReady = true;
                this.articleRevealTimer = null;
                this.$nextTick(() => {
                    if (AOS.refreshHard) {
                        AOS.refreshHard();
                    } else {
                        AOS.refresh();
                    }
                });
            }, delay);
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

        // 更新当前页码
        handleCurrentChange(new_page) {
            this.current_page = new_page
            this.fetchArticles();
        },

        // 页面滚动到首页内容区域
        scrollToHomeContent() {
            const targetElement = this.$refs.homeContent;
            if (targetElement) {
                const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                targetElement.scrollIntoView({
                    behavior: reduceMotion ? 'auto' : 'smooth',
                    block: 'start',
                });
            }
        },
    },
    
    watch: {
        initialData(newVal) {      // 监听 props 变化（应对异步数据延迟到达的情况）
            if (newVal && newVal.length > 0) {
                this.displayedArticles = newVal;
            }
        }
    },

    computed: {
        sortedArticles() {
            return [...this.displayedArticles].sort((a, b) => new Date(b.edited_time) - new Date(a.edited_time));
        },

        latestArticle() {
            return this.sortedArticles[0] || null;
        },

        recentArticles() {
            return this.sortedArticles.slice(0, 3);
        },

        articleCount() {
            return this.displayedArticles.length;
        },

        categoryCount() {
            return new Set(this.displayedArticles.map(article => article.category_id)).size;
        },

        latestTime() {
            if (!this.latestArticle) return '--';
            return this.formatDate(this.latestArticle.edited_time).split(' ')[0];
        },

        featureTags() {
            const baseTags = ['Vue', 'Linux', 'Kotlin', 'Shell', 'Embedded', 'Notes'];
            const articleTags = this.sortedArticles.map(article => this.categoryName(article.category_id));
            return [...new Set([...articleTags, ...baseTags])].slice(0, 8);
        },
    },

    created() {
        if (this.displayedArticles.length === 0) {     // 如果 props 里已经有数据了，就不用请求第一页了
             this.fetchArticles();
        }
        
        setInterval(this.showNextImage, 6000);    // 6s切换一次首页图片
    },

    beforeUnmount() {
        this.resetArticleReveal();
    },
}
</script>
