<template>
    <div class="blog-study">
        <div class="blog-study-header">
            <img src="../icons/study.png" alt="页首图片" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6);"/>
            <h1>学习总结&杂谈</h1>
        </div>
        <el-tabs class="study-tabs" :tab-position="tabPosition" style="height: 100vh" >
            <el-tab-pane v-for="(category, index) in categories" :key="index" :label="category.label" :lazy="true">
                <el-row :gutter="20">
                    <el-col :sm="24" :md="12">
                        <el-card class="study-card" v-for="(article, articleIndex) in category.articles.slice().reverse()" 
                        :key="articleIndex"
                        @click="goToArticle(article.id)" 
                        style="cursor: pointer;"
                        data-aos="zoom-in" data-aos-duration="1000">
                            <div class="study-header">
                                <img :src="article.article_cover" :alt="文章封面" style="object-fit: cover; width: 100%; height: 100%;"/>
                                <div class="stduy-info">
                                    <h2 class="study-title">{{ article.title }}</h2>
                                    <div class="stduy-edit-time">
                                        <el-tag type="info">{{ article.edited_time.toLocaleString('zh').replace('T', ' ').split('.')[0] }}</el-tag>
                                    </div>
                                </div>    
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init({})

export default {
    components: {
        AOS,
    },

    data() {
        return{
            tabPosition: 'left',     //左边显示选项卡
            displayedArticles: [],    // 显示的文章列表
            current_page: 1,    // 当前页码
            page_size: 20,    // 每页显示的文章数量
            categories: [
                {id: 1, label: '嵌入式', articles: []},  //分类为1（嵌入式）的文章列表
                {id: 2, label: '通信', articles: []},    //分类为2（通信）的文章列表
                {id: 3, label: '前端', articles: []},    //分类为3（前端）的文章列表
                {id: 4, label: '后端', articles: []},    //分类为4（后端）的文章列表
                {id: 5, label: '日语', articles: []},    //分类为5（日语）的文章列表
            ],
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
        },

        //文章分类筛选
        categoryArticles() {
            for(let i = 0; i < this.displayedArticles.length; i++) {
                const article = this.displayedArticles[i];
                const category = this.categories.find(cat => cat.id === article.category_id);  // 寻找数组中对应的对象
                if (category) {
                    category.articles.push(article);
                }
            }
        }
    },

    created() {
        this.fetchArticles();
    },
}
</script>