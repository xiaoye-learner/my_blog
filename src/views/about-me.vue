<template>
    <div class="blog-about-me">
        <div class="about-me-header">
            <img src="../icons/about-me.png" alt="页首图片" style="width: 100vw; height: 30vh; object-fit: cover;"/>
        </div>

        <div class="about-me-content">
            <!-- 个人信息 -->
            <div class="personal-info">
                <el-card class="personal-card">
                    <div class="avatar">
                        <img src="../icons/avatar.png" alt="avatar"></img>
                    </div>

                    <div class="profile">
                        <h4>XiaoYe</h4>
                        <p style="white-space: pre;">开发ing<b> >_< </b></p>
                    </div>
                </el-card>
            </div>
            
            <!-- 文章 -->
            <div class="article-list">
                <el-card class="article-card" v-for="(article, index) in displayedArticles" 
                :key="index" 
                @click="goToArticle(article.id)"
                style="cursor: pointer;">
                <!-- 文章封面图片 -->
                <img :src="getCoverImagePath()" alt="cover_image" v-if="getCoverImagePath()"></img>
                <h4 v-else>暂无封面</h4>

                <!-- 文章相关信息 -->
                <div class="article-info">
                    <h3>{{ article.title }}</h3>
                    <p>{{ article.edited_time.toLocaleString('zh').replace('T', ' ').replace('Z', '') }}</p>
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
import axios from 'axios'

  export default {
    data() {
        return {
            displayedArticles: [],    // 显示的文章列表
            current_page: 1,    // 当前页码
            page_size: 5,    // 每页显示的文章数量
            total_articles: 0    // 文章总数
        }
    },

    methods: {
        async fetchArticles() {
            try{
                const response = await axios.get(`api/articles/?page=${this.current_page}&page_size=${this.page_size}`)
                this.displayedArticles = response.data;       // 文章列表

                console.log('response:', response)
                console.log('displayedArticles:', this.displayedArticles.edited_time)
                console.log('total_articles:',this.total_articles)
            }catch(error){
                console.error(error)
            }
        },

        //动态获取文章封面图片路径
        getCoverImagePath() {
            return '/articles/article_1/img/cover.jpg'
        },

        //跳转至文章详情页
        goToArticle(id){
            this.$router.push({ name: 'ArticleDetail', params: { id } });
            console.log('goToArticle:', id)
        },

        //更新当前页码
        handleCurrentChange(new_page) {
            this.current_page = new_page
            this.fetchArticles();
        },
    },
    
    created() {
        this.fetchArticles();
    }
}
</script>