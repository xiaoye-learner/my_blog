<template>
    <div class="blog-study">
        <div class="blog-study-header">
            <img :src="studyBg" alt="页首图片"/>
            <div class="study-hero-copy">
                <span class="eyebrow">ARTICLE LIBRARY</span>
                <h1>总结&杂谈</h1>
                <p>把零散的学习记录整理成可以慢慢翻阅的知识目录。</p>
            </div>
        </div>

        <main class="study-shell">
            <div class="study-section-heading">
                <div>
                    <span class="eyebrow">EXPLORE NOTES</span>
                    <h2>文章分类</h2>
                </div>
                <p>选择一个方向，继续进入完整文章阅读。</p>
            </div>

            <el-tabs class="study-tabs" :tab-position="tabPosition" @tab-change="prepareCardReveal">
                <el-tab-pane v-for="(category, index) in categories" :key="index" :label="category.label" :lazy="true">
                    <div class="study-list" v-if="category.articles.length > 0">
                        <el-card class="study-card"  
                            v-for="(article, articleIndex) in category.articles.slice().reverse()" 
                            :key="articleIndex"
                            @click="goToArticle(article.id)" 
                            style="cursor: pointer;">
                            <div class="study-card-body">
                                <img :src="article.article_cover" alt="文章封面"/>
                                <div class="study-info">
                                    <div class="study-card-tags">
                                        <span class="study-category">{{ category.label }}</span>
                                        <span class="study-date">{{ formatDate(article.edited_time) }}</span>
                                    </div>
                                    <h2 class="study-title">{{ article.title }}</h2>
                                    <div class="study-meta">
                                        <span>阅读文章</span>
                                    </div>
                                </div>    
                            </div>
                        </el-card>
                    </div>
                    <div class="study-empty" v-else>
                        暂时还没有这个分类的文章。
                    </div>
                </el-tab-pane>
            </el-tabs>
        </main>
    </div>
</template>

<script>
import axios from 'axios';
import headerBgImage from '@/icons/study.png';

export default {
    data() {
        return{
            studyBg: headerBgImage,
            tabPosition: 'left',     //左边显示选项卡
            displayedArticles: [],    // 显示的文章列表
            current_page: 1,    // 当前页码
            page_size: 20,    // 每页显示的文章数量
            categories: [
                {id: 3, label: '嵌入式', articles: []},  //分类为1（嵌入式）的文章列表
                {id: 4, label: '通信', articles: []},    //分类为2（通信）的文章列表
                {id: 1, label: '前端', articles: []},    //分类为3（前端）的文章列表
                {id: 2, label: '后端', articles: []},    //分类为4（后端）的文章列表
                {id: 5, label: '日语', articles: []},    //分类为5（日语）的文章列表
            ],
            cardRevealObserver: null,
        }
    },

    methods: {
        // 跳转到文章详情页
        goToMarkdown(id) {
            this.$router.push({ name: 'Article', params: { id } });
        },

        // 跳转至文章详情页
        goToArticle(id){
            this.$router.push({ name: 'ArticleDetail', params: { id } });
        },

        async fetchArticles() {
            try{
                const response = await axios.get(`api/articles/?page=${this.current_page}&page_size=${this.page_size}`)
                this.displayedArticles = response.data;       // 文章列表
            }catch(error){
                console.error(error)
            }
            // console.log(this.displayedArticles[0])
            this.categoryArticles();
            this.prepareCardReveal();
        },

        formatDate(date) {
            if (!date) return '暂无时间';
            return date.toLocaleString('zh').replace('T', ' ').split('.')[0];
        },

        //文章分类筛选
        categoryArticles() {
            this.categories.forEach(category => {
                category.articles = [];
            });

            for(let i = 0; i < this.displayedArticles.length; i++) {
                const article = this.displayedArticles[i];
                const category = this.categories.find(cat => cat.id === article.category_id);  // 寻找数组中对应的对象
                if (category) {
                    category.articles.push(article);
                }
            }
        },

        prepareCardReveal() {
            if (this.cardRevealObserver) {
                this.cardRevealObserver.disconnect();
                this.cardRevealObserver = null;
            }

            this.$nextTick(() => {
                requestAnimationFrame(() => {
                    const cards = Array.from(this.$el.querySelectorAll('.study-card'));

                    if (cards.length === 0) return;

                    cards.forEach((card, index) => {
                        card.classList.remove('is-visible');
                        card.style.setProperty('--study-reveal-delay', `${Math.min(index * 90, 260)}ms`);
                    });

                    if (!('IntersectionObserver' in window)) {
                        cards.forEach(card => card.classList.add('is-visible'));
                        return;
                    }

                    this.cardRevealObserver = new IntersectionObserver((entries, observer) => {
                        entries.forEach(entry => {
                            if (!entry.isIntersecting) return;

                            entry.target.classList.add('is-visible');
                            observer.unobserve(entry.target);
                        });
                    }, {
                        threshold: 0.16,
                        rootMargin: '0px 0px -8% 0px',
                    });

                    cards.forEach(card => this.cardRevealObserver.observe(card));
                });
            });
        }
    },

    created() {
        this.fetchArticles();
    },

    mounted() {
        this.prepareCardReveal();
    },

    beforeUnmount() {
        if (this.cardRevealObserver) {
            this.cardRevealObserver.disconnect();
        }
    },
}
</script>
