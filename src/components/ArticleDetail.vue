<template>
    <div class="blog-article-detail">
        <div class="blog-article-detail-header">
            <div class="title">
                <h2>{{ article.title }}</h2>
                <p>编辑时间: {{ article.edited_time.toLocaleString('zh').replace('T', ' ').replace('Z', '') }}</p>
            </div>
        </div>
        
        <el-card class="blog-article-detail-content">
            <div v-html="compiledMarkdown"></div>
        </el-card>
    </div>
</template>

<script>
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

export default {
    data() {
        return {
            article: {},
        };
    },
    computed: {
        compiledMarkdown() {               //将markdown转换成HTML
            const md = new MarkdownIt({
                highlight: function (str, lang) {
                    if (lang && hljs.getLanguage(lang)) {
                        try {
                            return '<pre class="hljs"><code>' +
                                   hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                                   '</code></pre>';
                        } catch (__) {}
                    }
                    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
                }
            });
            return md.render(this.article.content_md);  //使用md实例转换成HTML字符串
        }
    },
    methods: {
        async fetchArticle() {
            try{
                const id = this.$route.params.id      //点击文章的id
                const response = await axios.get(`/api/articles/${id}`)   //选定id下的文章内容
                this.article = response.data; 
                
                console.log(`api/articles/${id}`)
                console.log(response)
            }catch(error){
                console.error(error)
            }
        }
    },
    created() {
        this.fetchArticle();
    },
};
</script>