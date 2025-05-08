<template>
    <div class="blog-home">
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
                <el-empty description="内容暂为空"></el-empty>  <!-- 空白占位符 -->
            </el-card>

            <!-- 分页 -->
            <el-pagination   
                @current-change="handleCurrentChange"   
                :current-page="current_page"
                :page-size="page_size"

                layout="prev, pager, next"
                :total="articles.length"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
  export default {
    data() {
        return {
            articles: Array(20),   // 20篇文章内容
            current_page: 1,    // 当前页码
            page_size: 5    // 每页显示的文章数量
        }
    },

    methods: {
        //更新当前页码
        handleCurrentChange(new_page) {
            this.current_page = new_page
        },
    },
    
    computed: {
        // 页面显示的文章数组
        displayedArticles() {
            const start = (this.current_page - 1) * this.page_size   // 当前页面文章起始index
            const end = start + this.page_size
            return this.articles.slice(start, end)   // 截取当前页面显示的文章数组
        }
    }
  }
</script>