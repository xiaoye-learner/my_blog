<template>
    <div class="blog-article-detail">
        <div class="blog-article-detail-header">
            <img :src="article.article_cover" alt="页首图片" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6);"/>
            <div class="blog-article-detail-info">
                <div class="title">
                    <h2>{{ article.title }}</h2>
                    <p>编辑时间: {{ article.edited_time?.toLocaleString('zh').replace('T', ' ').split('.')[0] || '暂无编辑时间' }}</p>
                </div>
            </div>
        </div>
        
        <div class="blog-article-detail-container">
            <div class="blog-article-detail-toc">
                <h3>目录</h3>
                <div v-html="toc"></div>
            </div>

            <el-card class="blog-article-detail-content">
                <div v-html="content"></div>
            </el-card>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import md from '@/utils/markdownRender';

export default {
    name: 'ArticleDetail',
    props: {
        articleId: {
            type: [String, Number],
            required: true
        }
    },

    data() {
        return {
            article: {},
            content: '',
            toc: '',
        };
    },

    methods: {
        async fetchArticle() {
            try {
                const id = this.$route.params.id      //点击文章的id
                const response = await axios.get(`/api/articles/${id}`)   //选定id下的文章内容
                this.article = response.data; 
                this.renderMarkdown();
            } catch(error) {
                console.error('获取文章失败', error)
            }
        },

        renderMarkdown() {
            // 先渲染内容以生成目录
            md.tocHtml = ''
            this.content = md.render(this.article.content_md)
            this.toc = md.tocHtml || '<p>暂无目录</p>'
        },
    },

    watch: {
        '$route.params.id': function(){    // 监听文章id变换，确保文章之间可以切换
            this.fetchArticle()
        },
    },

    created() {
        this.fetchArticle();
    },
};
</script>