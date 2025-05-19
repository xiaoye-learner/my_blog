<template>
    <div class="blog-home">
        <div class="home-header" ref="homeHeader">   <!-- ref：注册引用属性，可使用this.$refs访问该DOM元素 -->
            <img src="../icons/home.png" style="width: 100vw; height: 100vh; object-fit: cover;"></img>
            
            <div class="infoText">
                <h1>Hi,</h1>
                <h1>I'm <span class="name">XiaoYe</span></h1>
            </div>
            
            <div class="arrow-down" @click="scrollToBottom" style="cursor: pointer;">
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

        <div class="home-content">
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

        // 滚动到文章列表页面
        scrollToBottom() {
            this.$emit('scroll-to-header', this.$refs.homeHeader);  //向父组件App.vue传递自定义事件scroll-to-header，传ref
        }
    },
    
    computed: {
        // 页面显示的文章数组
        displayedArticles() {
            const start = (this.current_page - 1) * this.page_size   // 当前页面文章起始index
            const end = start + this.page_size
            return this.articles.slice(start, end)   // 截取当前页面显示的文章数组
        }
    },

    props: {
        height: {    // 波浪效果高度
            type: String,
            default: "4.5rem",
        },
    },
}
</script>