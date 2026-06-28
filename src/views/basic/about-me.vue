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
            <div class="info">
                <div class="header">
                    <img :src="avatarImg" alt="头像"></img>
                </div>
                <div class="infoText">
                    <span class="eyebrow">XIAOYE LAB</span>
                    <h1>Hi,</h1>
                    <h1>I'm XiaoYe</h1>
                    <p>写代码、做实验，也记录一点生活里的小确幸。</p>
                </div>
            </div>
            
            <div class="profile">
                <p>这里会慢慢沉淀前端、Linux、嵌入式、Kotlin 和一些学习杂谈。比起把自己包装成很厉害的人，我更想把每次学习里真正想明白的东西留下来。</p>
            </div>

            <el-divider></el-divider>

            <div class="skills-container">
                <h2>Skills</h2>
                
                <div class="skills-content">
                    <div class="chart-wrapper">
                        <div ref="skillChart" class="echart-box"></div>
                    </div>

                    <div class="progress-wrapper">
                        <h3>Category</h3>
                        
                        <div class="skill-item">
                            <div class="skill-label">Frontend Development <span>85%</span></div>
                            <el-progress :percentage="85" :stroke-width="12" :show-text="false" color="#409EFF"></el-progress>
                        </div>

                        <div class="skill-item">
                            <div class="skill-label">Backend Development <span>70%</span></div>
                            <el-progress :percentage="70" :stroke-width="12" :show-text="false" color="#8e44ad"></el-progress>
                        </div>

                        <div class="skill-item">
                            <div class="skill-label">Database <span>60%</span></div>
                            <el-progress :percentage="60" :stroke-width="12" :show-text="false" color="#00b894"></el-progress>
                        </div>
                        
                         <div class="skill-item">
                            <div class="skill-label">Tools <span>90%</span></div>
                            <el-progress :percentage="90" :stroke-width="12" :show-text="false" color="#f1c40f"></el-progress>
                        </div>
                    </div>
                </div>
            </div>

            <el-divider></el-divider>

            <div class="professional-skills">
                <h2>Professional Skills</h2>
                <div class="skills-grid">
                    <div class="skill-card" v-for="(item, index) in professionalSkills" :key="index">
                        <div class="card-icon" :style="{ backgroundColor: item.color + '15', color: item.color }">
                            <span>{{ item.icon }}</span>
                        </div>
                        
                        <div class="card-content">
                            <div class="card-header">
                                <h3>{{ item.name }}</h3>
                                <span class="level-tag" :style="{ color: item.color, borderColor: item.color + '40', backgroundColor: item.color + '10' }">
                                    {{ item.level }}
                                </span>
                            </div>
                            <p class="description">{{ item.description }}</p>
                            
                            <div class="experience-bar">
                                <div class="exp-info">
                                    <span>Experience</span>
                                    <span>{{ item.expTime }}</span>
                                </div>
                                <div class="progress-track">
                                     <div class="progress-fill" :style="{ width: item.percentage + '%', backgroundColor: item.color }"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import headerBgImage from '@/icons/about-me.png';
import avatarImage from '@/icons/avatar.png';
import * as echarts from 'echarts';

export default {
    data() {
        return {
            aboutBg: headerBgImage,
            avatarImg: avatarImage,
            chartInstance: null,    // 用于存储图表实例

            professionalSkills: [
                {
                    name: 'JavaScript',
                    icon: 'JS',
                    level: 'Advanced',
                    description: 'Modern JavaScript development, including ES6+ syntax and asynchronous programming.',
                    expTime: '3 years 6 months',
                    percentage: 85,
                    color: '#F0DB4F' // 黄色
                },
                {
                    name: 'TypeScript',
                    icon: 'TS',
                    level: 'Advanced',
                    description: 'A type-safe superset of JavaScript that enhances code quality and efficiency.',
                    expTime: '2 years 8 months',
                    percentage: 75,
                    color: '#3178C6' // 蓝色
                },
                {
                    name: 'React',
                    icon: 'Re',
                    level: 'Advanced',
                    description: 'Building user interfaces with Hooks, Context, and modern state management.',
                    expTime: '2 years 10 months',
                    percentage: 80,
                    color: '#61DAFB' // 青色
                },
                {
                    name: 'Vue.js',
                    icon: 'Vu',
                    level: 'Advanced',
                    description: 'The progressive JavaScript framework for building approachable web interfaces.',
                    expTime: '3 years',
                    percentage: 90,
                    color: '#42B883' // 绿色
                },
                {
                    name: 'Git',
                    icon: 'Gi',
                    level: 'Intermediate',
                    description: 'Distributed version control system for tracking changes in source code.',
                    expTime: '3 years',
                    percentage: 70,
                    color: '#F05032' // 橙红
                },
                {
                    name: 'MySQL',
                    icon: 'SQ',
                    level: 'Intermediate',
                    description: 'Open-source relational database management system.',
                    expTime: '2 years 6 months',
                    percentage: 65,
                    color: '#00758F' // 深蓝
                }
            ]
        }
    },
    mounted() {
        // 页面加载完成后初始化图表
        this.initChart();
        // 监听窗口大小变化，自适应图表
        window.addEventListener('resize', this.resizeChart);
    },
    beforeUnmount() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.chartInstance) {
            this.chartInstance.dispose();
        }
        // 销毁时移除监听和实例，防止内存泄漏
        window.removeEventListener('resize', this.resizeChart);
        if (this.chartInstance) {
            this.chartInstance.dispose();
        }
    },
    methods: {
        initChart() {
            const chartDom = this.$refs.skillChart;
            if (!chartDom) return;
            this.chartInstance = echarts.init(chartDom);

            const option = {
                tooltip: {
                    trigger: 'item',
                    // 格式化提示框：显示 "分类: 数值 (占比)"
                    formatter: '{b}: {c}% ({d}%)' 
                },
                legend: {
                    bottom: '0%',
                    left: 'center',
                    icon: 'circle',
                    textStyle: {
                        color: '#999'
                    }
                },
                series: [
                    {
                        name: 'Skill Distribution',
                        type: 'pie',
                        radius: ['45%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 18, // 字体稍微调小一点，防止文字太长换行
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { 
                                value: 85, 
                                name: 'Frontend', 
                                itemStyle: { color: '#409EFF' } // 对应右侧蓝色
                            },
                            { 
                                value: 70, 
                                name: 'Backend', 
                                itemStyle: { color: '#8e44ad' } // 对应右侧紫色
                            },
                            { 
                                value: 60, 
                                name: 'Database', 
                                itemStyle: { color: '#00b894' } // 对应右侧绿色
                            },
                            { 
                                value: 90, 
                                name: 'Tools', 
                                itemStyle: { color: '#f1c40f' } // 对应右侧黄色
                            }
                        ]
                    }
                ]
            };

            this.chartInstance.setOption(option);

            this.resizeObserver = new ResizeObserver(() => {
                this.chartInstance.resize();
            });
            this.resizeObserver.observe(chartDom);
        },

        resizeChart() {
            if (this.chartInstance) {
                this.chartInstance.resize();
            }
        }
    },
}
</script>
