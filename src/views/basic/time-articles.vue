<template>
    <div class="blog-time-articles">
        <div class="blog-time-articles-header">
            <img :src="timeBg" alt="页首图片"/>
            <div class="page-hero-copy">
                <span class="eyebrow">ARCHIVE</span>
                <h1>归档</h1>
                <p>把时间线摊开，按年份和月份重新遇见写过的内容。</p>
            </div>
        </div>

        <main class="archive-shell">
            <section class="archive-heading" data-aos="fade-up">
                <div>
                    <span class="eyebrow">TIMELINE</span>
                    <h2>文章时间轴</h2>
                </div>
                <p>{{ sortedArticles.length }} 篇记录，按最近更新时间排序。</p>
            </section>

            <section class="archive-board" data-aos="fade-up" data-aos-delay="80">
                <div class="archive-year" v-for="group in groupedArticles" :key="group.year">
                    <div class="year-marker">
                        <span>{{ group.year }}</span>
                        <small>{{ group.items.length }} posts</small>
                    </div>

                    <div class="archive-list">
                        <button
                            class="archive-item"
                            v-for="article in group.items"
                            :key="article.id"
                            @click="goToArticle(article.id)"
                        >
                            <time>
                                <strong>{{ formatMonthDay(article.edited_time) }}</strong>
                                <small>{{ formatClock(article.edited_time) }}</small>
                            </time>
                            <div>
                                <span class="archive-category">{{ categoryName(article.category_id) }}</span>
                                <h3>{{ article.title }}</h3>
                            </div>
                            <span class="archive-arrow">阅读</span>
                        </button>
                    </div>
                </div>

                <div class="archive-empty" v-if="!sortedArticles.length">
                    暂时还没有归档内容。
                </div>
            </section>
        </main>
    </div>
</template>

<script>
import axios from 'axios';
import headerBgImage from '@/icons/time-articles.png';

export default {
    data() {
        return {
            timeBg: headerBgImage,
            sortedArticles: [],    // 显示的文章列表
        };
    },

    computed: {
        groupedArticles() {
            const groups = new Map();

            this.sortedArticles.forEach(article => {
                const year = this.formatDate(article.edited_time).slice(0, 4) || '未知';
                if (!groups.has(year)) groups.set(year, []);
                groups.get(year).push(article);
            });

            return [...groups.entries()].map(([year, items]) => ({ year, items }));
        },
    },

    methods: {
        async fetchArticles() {
            try {
                const response = await axios.get('api/articles/?page=1&page_size=50')
                this.sortedArticles = [...response.data].sort((a, b) => new Date(b.edited_time) - new Date(a.edited_time));
            } catch(error) {
                console.error(error)
            }
        },

        // 跳转至文章详情页
        goToArticle(id) {
            this.$router.push({ name: 'ArticleDetail', params: { id } });
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

        formatDate(date) {
            if (!date) return '';
            return date.toLocaleString('zh').replace('T', ' ').split('.')[0];
        },

        formatMonthDay(date) {
            const formatted = this.formatDate(date);
            const [datePart] = formatted.split(' ');
            const [, month, day] = datePart.split('-');
            return month && day ? `${month}.${day}` : '--.--';
        },

        formatClock(date) {
            const formatted = this.formatDate(date);
            const time = formatted.split(' ')[1] || '';
            return time ? time.slice(0, 5) : '--:--';
        },
    },

    created() {
        this.fetchArticles();
    }
};
</script>
