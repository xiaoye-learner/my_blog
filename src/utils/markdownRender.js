import MarkdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItTocDoneRight from 'markdown-it-toc-done-right';
import hljs from 'highlight.js';

// 创建markdown-it实例
const md = new MarkdownIt({
    html: true,      // 允许HTML标签
    linkify: true,   // 自动转换URL为链接
    typographer: true,    // 优化排版

    //设置代码高亮
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
})

// 添加锚点插件
md.use(markdownItAnchor, {
    permalink: false,     // 显示锚点链接
    permalinkBefore: true,  // 在标题前显示锚点
    permalinkSymbol: '#',
})

// 添加目录插件
md.use(markdownItTocDoneRight, {
    tocClassName: 'article-toc',   // 目录容器class
    listType: 'ul',        // 使用无序列表
    level: [1, 2, 3],      // 包含h1-h3标题
    callback: function(html) {
        md.tocHtml = html
    }
})

// 导出markdown-it实例
export default md