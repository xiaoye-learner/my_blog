<template>
    <div class="blog-markdown">
        <el-card class="markdown-card">
            <div v-html="renderedMarkdown"></div>  <!-- 渲染后的Markdown内容作为HTML内容插入div -->
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
            markdownContent: ''
        };
    },
    computed: {
        renderedMarkdown() {     //将MarkdownContent转化成HTML内容
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
            return md.render(this.markdownContent);  //使用md实例转换成HTML字符串
        }
    },
    mounted() {
        this.fetchMarkdownFile(this.$route.params.id);  //获取push后的id，并传入fetchMarkdownFile方法中获取Markdown文件内容
    },
    methods: {
        async fetchMarkdownFile(filename) {
            try {
                const response = await axios.get(`/articles/article_1/${filename}.md`); //以路径发起请求，获取响应
                this.markdownContent = response.data;  //将响应的内容读取
            } catch (error) {
                console.error('Error fetching the markdown file:', error);
            }
        }
    },
};
</script>
  