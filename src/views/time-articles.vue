<template>
    <div class="blog-time-articles">
        <div class="blog-study-header">
            <img src="../icons/time-articles.png" alt="页首图片" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6);"/>
            <h1>归档</h1>
        </div>

        <el-card class="time-articles-card">
            <div class="sorted-years" v-for="(year, index) in years">
                <div class="year-header">
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M512 896a320 320 0 1 0 0-640 320 320 0 0 0 0 640zm0 64a384 384 0 1 1 0-768 384 384 0 0 1 0 768z"></path><path fill="currentColor" d="M512 320a32 32 0 0 1 32 32l-.512 224a32 32 0 1 1-64 0L480 352a32 32 0 0 1 32-32z"></path><path fill="currentColor" d="M448 576a64 64 0 1 0 128 0 64 64 0 1 0-128 0zm96-448v128h-64V128h-96a32 32 0 0 1 0-64h256a32 32 0 1 1 0 64h-96z"></path></svg>
                    <h3 style="cursor: default;">{{ year.time }}</h3>
                </div>

                <el-timeline>          <!-- 对应年份时间轴 -->
                    <el-timeline-item
                    v-for="(article, index) in sortedArticles.slice().reverse()"
                    :key="index"
                    :timestamp="article.edited_time.toLocaleString('zh').split('T')[0]"
                    >
                        <a @click="goToArticle(article.id)" style="cursor: pointer;">
                            <h4>{{ article.title }}</h4>
                        </a>
                    </el-timeline-item>
                </el-timeline>
            </div>
        </el-card>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            years: [{
                time: '2025',
                // color: '#00a6ff',
            }],

            sortedArticles: [],    // 显示的文章列表
            total_articles: 0,    // 文章总数
        };
    },

    methods: {
        async fetchArticles() {
            try{
                const response = await axios.get(`api/articles/?page=${this.current_page}&page_size=${this.page_size}`)
                this.sortedArticles = response.data;       // 文章列表
            }catch(error){
                console.error(error)
            }
        },

        // 跳转至文章详情页
        goToArticle(id){
            this.$router.push({ name: 'ArticleDetail', params: { id } });
            // console.log('goToArticle:', id)
        },
    },

    created() {
        this.fetchArticles();
    }
};
</script>