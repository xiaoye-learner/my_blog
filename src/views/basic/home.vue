<template>
    <div class="blog-home">
        <div class="blog-home-header" ref="homeHeader">   <!-- ref：注册引用属性，可使用this.$refs访问该DOM元素 -->
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
            </div>
            
            <div class="arrow-down" id="arrow-down" @click="scrollToHomeContent" style="cursor: pointer;">
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

        <div class="home-content" ref="homeContent">
            <!-- 个人信息 -->
            <div class="personal-info">
                <el-card class="personal-card">
                    <div class="avatar">
                        <img src="/src/icons/avatar.png" alt="avatar"></img>
                    </div>

                    <div class="profile">
                        <h4>XiaoYe</h4>
                        <p style="white-space: pre;">一个又菜又爱玩的多领域玩家<b> >_< </b></p>
                    </div>
                </el-card>

                <el-card class="external-links-card">
                    <el-row :gutter="5">
                        <el-col :span="8">
                            <a v-for= "i in link_list" :key="i.animate" :href = "i.href" target="_blank">
                                <el-tooltip effect="light" :content="i.content" placement="top">
                                    <button class="links-button" :style="{ backgroundColor: i.color, cursor: 'pointer' }">
                                        <img :src="i.src" alt="link"/>
                                    </button>
                                </el-tooltip>
                            </a>
                        </el-col>
                    </el-row>
                </el-card>
            </div>
            
            <!-- 文章 -->
            <div class="article-list">
                <el-card class="article-card" v-for="(article, index) in displayedArticles.slice().reverse()" 
                :key="index" 
                @click="goToArticle(article.id)"
                style="cursor: pointer;"
                data-aos="fade-up" data-aos-duration="1000">
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
import 'aos/dist/aos.css';

AOS.init({
    offset: 40,  // 组件进入视窗40px就触发
})

export default {
    components: {
        AOS,
    },

    data() {
        return {
            currentIndex: 0,    //首页图片当前序号
            displayedArticles: [],    // 显示的文章列表
            current_page: 1,    // 当前页码
            page_size: 5,    // 每页显示的文章数量
            total_articles: 0,    // 文章总数

            height: 'calc(6rem + 15px)',  // 波浪效果高度

            // 首页图片列表
            img_list: [
                {
                    src: '/src/icons/home3.png',
                    alt: 'img',
                },
                {
                    src: '/src/icons/home.png',
                    alt: 'img',
                },
                {
                    src: '/src/icons/home2.png',
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
                    src: '/src/icons_link/GitHub.svg',
                },
                {
                    icon: 'icon-bilibili',
                    animate: 'BiliBili',
                    content: '哔哩哔哩',
                    color: '#0BA6D8',
                    href: 'https://space.bilibili.com/76999298',
                    src: '/src/icons_link/bilibili.svg'
                },
                {
                    icon: 'icon-music',
                    animate: 'Music',
                    content: '歌单',
                    color: '#65bbed',
                    href: 'https://www.kugou.com/songlist/gcid_3z160l9dbz1vz0b4/',
                    src: '/src/icons_link/music.svg'
                },
                // {
                //     icon: 'icon-anime',
                //     animate: 'Anime',
                //     content: '动漫新番表（外链）',
                //     color: '#e549ed',
                //     href: 'https://xf.hmacg.cn/',
                //     src: '/src/icons_link/anime.png'
                // }
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
            }catch(error){
                console.error(error)
            }
            // console.log(this.displayedArticles)
        },

        // 动态获取文章封面图片路径
        getCoverImagePath() {
            return '/articles/article_1/img/cover.jpg'
        },

        // 跳转至文章详情页
        goToArticle(id){
            this.$router.push({ name: 'ArticleDetail', params: { id } });
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
                const targetPosition = targetElement.offsetTop;   // 相对于父元素顶部的距离
                const startPosition = window.pageYOffset;   // 当前页面滚动条位置
                const distance = targetPosition - startPosition;
                const duration = 1000; // 滚动总时间（毫秒）
                let start = null;   // 在第一次调用step时赋值为当前的时间戳（滚动时间起点）

                window.requestAnimationFrame(step);   //在下次重绘之前调用指定的函数

                function step(timestamp) {    // 每次重绘之前调用，传入当前的时间戳
                    if (!start) start = timestamp;
                    const progress = timestamp - start;   //计算当前已经滚动的时间
                    window.scrollTo(0, easeInOutQuad(progress, startPosition, distance, duration));
                    if (progress < duration) {
                        window.requestAnimationFrame(step);   // 滚动未结束，继续调用函数继续滚动
                    }
                }

                // 缓动函数
                function easeInOutQuad(t, b, c, d) {   // 当前时间进度、起始位置、滚动距离、滚动总时间
                    t /= d / 2;   // 将时间进度 t 规范化为 0 到 2 之间的值
                    if (t < 1) return c / 2 * t * t + b;   // 未过半，加速
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;   //过半，减速
                }
            }
        },
    },
    
    computed: {
        // // 页面显示的文章数组
        // displayedArticles() {
        //     const start = (this.current_page - 1) * this.page_size   // 当前页面文章起始index
        //     const end = start + this.page_size
        //     return this.articles.slice(start, end)   // 截取当前页面显示的文章数组
        // }
    },

    created() {
        setInterval(this.showNextImage, 6000)  //6s切换一次首页图片
        this.fetchArticles();
    },
}
</script>