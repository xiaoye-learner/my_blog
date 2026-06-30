<template>
    <div class="blog-about-me">
        <div class="blog-about-me-header">
            <img :src="aboutBg" alt="页首图片"/>
            <div class="page-hero-copy">
                <span class="eyebrow">PROFILE</span>
                <h1>关于我</h1>
                <p>一些关于 XiaoYe Lab 背后这个人的碎片。</p>
            </div>
        </div>

        <el-card class="about-me-content" data-aos="fade-up">
            <section class="info">
                <div class="header">
                    <img :src="avatarImg" alt="头像"/>
                </div>
                <div class="infoText">
                    <span class="eyebrow">XIAOYE LAB</span>
                    <h1>Hi,</h1>
                    <h1>I'm XiaoYe</h1>
                    <p>写代码、做实验，也记录一点生活里的小确幸。</p>
                </div>
            </section>

            <section class="profile">
                <p>这里会慢慢沉淀前端、Linux、嵌入式、Kotlin 和一些学习杂谈。比起把自己包装成很厉害的人，我更想把每次学习里真正想明白的东西留下来。</p>
            </section>

            <section class="quick-facts" aria-label="个人标签">
                <div v-for="item in quickFacts" :key="item.label">
                    <span>{{ item.label }}</span>
                    <strong>{{ item.value }}</strong>
                </div>
            </section>

            <section class="about-section">
                <div class="section-heading">
                    <span class="eyebrow">NOW</span>
                    <h2>正在折腾</h2>
                </div>
                <div class="focus-grid">
                    <article class="focus-card" v-for="item in focusItems" :key="item.title">
                        <span>{{ item.mark }}</span>
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.description }}</p>
                    </article>
                </div>
            </section>

            <section class="about-section split-section">
                <div class="writing-panel">
                    <div class="section-heading">
                        <span class="eyebrow">WRITING</span>
                        <h2>常写内容</h2>
                    </div>
                    <div class="topic-list">
                        <div v-for="item in writingTopics" :key="item.title">
                            <strong>{{ item.title }}</strong>
                            <p>{{ item.description }}</p>
                        </div>
                    </div>
                </div>

                <div class="tag-panel">
                    <div class="section-heading">
                        <span class="eyebrow">STACK</span>
                        <h2>技术栈</h2>
                    </div>
                    <div class="tech-tags">
                        <span v-for="item in techTags" :key="item">{{ item }}</span>
                    </div>
                </div>
            </section>

            <section class="about-section">
                <div class="section-heading">
                    <span class="eyebrow">TIMELINE</span>
                    <h2>学习轨迹</h2>
                </div>
                <div class="timeline-list">
                    <article v-for="item in timelineItems" :key="item.time">
                        <time>{{ item.time }}</time>
                        <div>
                            <h3>{{ item.title }}</h3>
                            <p>{{ item.description }}</p>
                        </div>
                    </article>
                </div>
            </section>
        </el-card>
    </div>
</template>

<script>
import headerBgImage from '@/icons/about-me.png';
import avatarImage from '@/icons/avatar.png';

export default {
    data() {
        return {
            aboutBg: headerBgImage,
            avatarImg: avatarImage,
            quickFacts: [
                { label: '主线', value: '前端 / Vue' },
                { label: '兴趣', value: 'Linux / 嵌入式' },
                { label: '记录', value: '学习笔记' },
                { label: '节奏', value: '慢慢来' },
            ],
            focusItems: [
                {
                    mark: '01',
                    title: '把博客继续打磨好',
                    description: '优化页面体验、文章阅读、归档和一些小交互，让它更像一个舒服的长期作品。',
                },
                {
                    mark: '02',
                    title: '整理学习里的关键问题',
                    description: '把 Linux、Shell、Kotlin、前端工程里真正绕过弯的地方写清楚。',
                },
                {
                    mark: '03',
                    title: '保留一点生活感',
                    description: '音乐、相册、友链和碎碎念也会放在这里，技术之外也要有呼吸。',
                },
            ],
            writingTopics: [
                {
                    title: '前端工程',
                    description: 'Vue、组件拆分、页面动效、工程化和实际踩坑。',
                },
                {
                    title: '系统与工具',
                    description: 'Linux 常用命令、Shell 脚本、环境配置和效率工具。',
                },
                {
                    title: '移动与嵌入式',
                    description: 'Kotlin、Android 基础，以及嵌入式学习过程中的整理。',
                },
            ],
            techTags: ['Vue', 'Vite', 'Less', 'JavaScript', 'Linux', 'Shell', 'Kotlin', 'MySQL', 'Git', 'Markdown'],
            timelineItems: [
                {
                    time: '现在',
                    title: '打磨 XiaoYe Lab',
                    description: '让博客的视觉、阅读和内容组织更稳定，也更有个人味道。',
                },
                {
                    time: '近期',
                    title: '整理 Linux 与 Shell 笔记',
                    description: '把常用命令、脚本语法和系统服务管理拆成更易查阅的文章。',
                },
                {
                    time: '持续',
                    title: '补齐前端与移动端知识',
                    description: '围绕 Vue、Kotlin 和工程实践做长期积累，不追求一口气写完。',
                },
            ],
        };
    },
};
</script>
