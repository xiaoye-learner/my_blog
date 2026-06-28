<template>
    <div class="blog-article-detail">
        <div class="reading-progress" :style="{ width: `${readingProgress}%` }"></div>

        <section class="blog-article-detail-header" data-aos="fade-up">
            <img :src="coverImage" alt="文章封面" />
            <div class="hero-shade"></div>

            <div class="blog-article-detail-info">
                <div class="title">
                    <h1>{{ article.title || '加载文章中...' }}</h1>
                    <p>把内容留给阅读，把节奏留给页面。</p>
                </div>
                <div class="article-meta">
                    <span>{{ categoryName(article.category_id) }}</span>
                    <span>{{ formattedTime }}</span>
                    <span>{{ readingMinutes }} min read</span>
                </div>
            </div>
        </section>
        
        <div class="blog-article-detail-container">
            <el-card class="blog-article-detail-content" data-aos="fade-up" data-aos-delay="80">
                <div class="article-content-inner" v-html="content" ref="contentRef"></div>
            </el-card>

            <aside class="blog-article-detail-toc" data-aos="fade-up" data-aos-delay="140">
                <div class="toc-card">
                    <div class="toc-head">
                        <div>
                            <span class="eyebrow">ON THIS PAGE</span>
                            <h3>文章目录</h3>
                        </div>
                        <button class="back-button" @click="goBack">返回上一级</button>
                    </div>
                    <div class="toc-links" v-html="toc" @click="handleTocClick"></div>
                </div>
            </aside>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import md from '@/utils/markdownRender';
import AOS from 'aos';

export default {
    name: 'ArticleDetail',

    data() {
        return {
            article: {},
            content: '',
            toc: '',
            readingProgress: 0,

            observer: null, // IntersectionObserver实例
            headings: [], // 存储所有标题元素
            tocLinks: [], // 存储所有目录链接
            isManualClick: false,   // 标记为是否手动点击目录（点击目录标题的优先级更高）
            clickTimer: null, // 点击恢复定时器
        };
    },

    methods: {
        async fetchArticle() {
            try {
                const id = this.$route.params.id      //点击文章的id
                const response = await axios.get(`/api/articles/${id}`)   //选定id下的文章内容
                this.article = response.data; 
                this.renderMarkdown();
                this.$nextTick(() => {
                    this.initScrollObserver();
                    this.updateReadingProgress();
                    if (AOS.refreshHard) {
                        AOS.refreshHard();
                    } else {
                        AOS.refresh();
                    }
                })
            } catch(error) {
                console.error('获取文章失败', error)
            }
        },

        renderMarkdown() {
            // 先渲染内容以生成目录
            md.tocHtml = ''
            this.content = md.render(this.article.content_md)
            this.toc = md.tocHtml || '<p>暂无目录</p>'

            // 默认选中第一个标题（需在 DOM 更新后执行）
            this.$nextTick(() => {
                const firstTocLink = document.querySelector('.blog-article-detail-toc a');
                if (firstTocLink) {
                    firstTocLink.classList.add('active');
                }
                this.initCopyButtons();
            });
        },

        // 代码块的复制按钮
        initCopyButtons() {
            const content = this.$refs.contentRef;
            if (!content) return;

            // 获取所有代码块容器 pre
            const preTags = content.querySelectorAll('pre');
            
            preTags.forEach(pre => {
                // 防止重复添加
                if (pre.parentNode.classList.contains('code-block-wrapper')) return;

                // 创建外层包装容器 (为了定位按钮，不管代码块怎么滚动，按钮都固定在容器右上角)
                const wrapper = document.createElement('div');
                wrapper.className = 'code-block-wrapper';
                
                // 将 wrapper 插入到 pre 之前
                pre.parentNode.insertBefore(wrapper, pre);
                
                // 将 pre 移动到 wrapper 内部
                wrapper.appendChild(pre);

                // 创建复制按钮
                const btn = document.createElement('span');
                btn.className = 'copy-code-btn';
                btn.innerText = '复制';

                // 绑定点击复制事件
                btn.onclick = () => {
                    // 获取内部 code 标签的文本
                    const code = pre.querySelector('code').innerText;
                    
                    // 使用 Clipboard API 复制
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(code).then(() => {
                            btn.innerText = '成功';
                            btn.classList.add('copied');
                            // 2秒后恢复原状
                            setTimeout(() => {
                                btn.innerText = '复制';
                                btn.classList.remove('copied');
                            }, 2000);
                        }).catch(err => {
                            console.error('复制失败', err);
                            btn.innerText = '失败';
                        });
                    } else {
                        btn.innerText = '不支持';
                    }
                };

                // 6. 将按钮加入 wrapper
                wrapper.appendChild(btn);
            });
        },

        handleTocClick(e) {
            // 确保点击的是A标签（兼容包含子元素的情况）
            const link = e.target.closest('a');
            
            if (link) {
                // 阻止浏览器默认的锚点跳转行为
                e.preventDefault();

                // 获取目标元素的ID
                const href = link.getAttribute('href'); // 获取如 "#title-1"
                if (href && href.startsWith('#')) {
                    const id = href.substring(1); // 去掉 # 号，拿到 "title-1"
                    const targetElement = document.getElementById(id);

                    // 3. 执行平滑滚动
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth', // 关键参数：平滑滚动
                            block: 'start'      // 滚动到元素顶部
                        });
                    }
                }

                // 标记为手动点击，并清除之前的定时器
                this.isManualClick = true;
                if (this.clickTimer) clearTimeout(this.clickTimer);

                // 移除所有active类
                this.tocLinks.forEach(link => {
                    link.classList.remove('active');
                });
                // 给当前点击的a标签添加active类
                link.classList.add('active');

                // 800ms 后恢复滚动检测
                this.clickTimer = setTimeout(() => {
                    this.isManualClick = false;
                }, 800);
            }
        },

        updateReadingProgress() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            this.readingProgress = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0;
        },

        goBack() {
            if (window.history.length > 1) {
                this.$router.back();
            } else {
                this.$router.push({ name: 'Home' });
            }
        },

        categoryName(id) {
            const categoryMap = {
                1: '前端',
                2: '后端',
                3: '嵌入式',
                4: '通信',
                5: '日语',
            };
            return categoryMap[id] || '随笔';
        },

        initScrollObserver() {
            // 获取所有标题元素
            this.headings = Array.from(this.$refs.contentRef.querySelectorAll('h1, h2, h3, h4, h5, h6'));
            // 获取所有目录链接
            this.tocLinks = Array.from(document.querySelectorAll('.blog-article-detail-toc a'));

            if (this.observer) {
                this.observer.disconnect();
            }

            // 创建IntersectionObserver观察标题元素
            this.observer = new IntersectionObserver(
                (entries) => {
                    // 如果是手动点击期间，跳过滚动逻辑
                    if (this.isManualClick) return;

                    entries.forEach(entry => {
                        const id = entry.target.getAttribute('id');
                        const correspondingLink = document.querySelector(`.blog-article-detail-toc a[href="#${id}"]`);
                        
                        if (entry.isIntersecting) {
                            this.tocLinks.forEach(link => link.classList.remove('active'));
                            if (correspondingLink) correspondingLink.classList.add('active');
                        }
                    });
                },
                {
                    rootMargin: '-10% 0px -70% 0px', // 调整检测区域（缩小到视口高度的10%-30%（由于标题定位到20%））
                    threshold: 0.1
                }
            );

            // 开始观察所有标题
            this.headings.forEach(heading => {
                this.observer.observe(heading);
            });
        }
    },

    computed: {
        coverImage() {
            return this.article.article_cover || '/p3.jpg';
        },

        formattedTime() {
            return this.article.edited_time?.toLocaleString('zh').replace('T', ' ').split('.')[0] || '暂无编辑时间';
        },

        readingMinutes() {
            const text = this.article.content_md || '';
            return Math.max(1, Math.ceil(text.length / 650));
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

    mounted() {
        window.addEventListener('scroll', this.updateReadingProgress, { passive: true });
        window.addEventListener('resize', this.updateReadingProgress);
    },

    beforeUnmount() {
        if (this.observer) {
            this.observer.disconnect();
        }
        if (this.clickTimer) {
            clearTimeout(this.clickTimer);
        }
        window.removeEventListener('scroll', this.updateReadingProgress);
        window.removeEventListener('resize', this.updateReadingProgress);
    },
};
</script>
