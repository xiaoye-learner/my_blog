<template>
    <div class="blog-about-me">
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
            <el-card class="article-card" v-for="(article, index) in displayedArticles" :key="index">
                <h3>{{ article.title }}</h3>
                <p>{{ article.edited_time }}</p>
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
                this.displayedArticles = response.data;

                console.log('response:', response)
                console.log('displayedArticles:', this.displayedArticles)
                console.log('total_articles:',this.total_articles)
            }catch(error){
                console.error(error)
            }
        },
        //更新当前页码
        handleCurrentChange(new_page) {
            this.current_page = new_page
            // this.fetchArticles();
        },
    },
    
    created() {
        this.fetchArticles();
    }
}
</script>