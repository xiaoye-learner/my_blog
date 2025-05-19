<template>
    <div class="blog-study">
        <div class="study-header">
            <img src="../icons/study.png" alt="页首图片" style="width: 100vw; height: 30vh; object-fit: cover;"/>
        </div>
        <el-tabs class="study-tabs" :tab-position="tabPosition" style="height: 100vh" >
            <el-tab-pane label="嵌入式">
                <el-row :gutter="20">
                    <el-col :span="12" v-for="(card, index) in cards" :key="index">
                        <el-card class="study-card" @click="goToMarkdown(card.id)" style="cursor: pointer;">
                            <div class="study-header">
                                <img :src="card.image" :alt="card.image" >
                                <div class="stduy-info">
                                    <h2 class="study-title">{{ card.title }}</h2>
                                    <div class="stduy-edit-time">
                                        <el-tag type="info">编辑时间：{{ card.editTime }}</el-tag>
                                    </div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="A I">AI</el-tab-pane>
            <el-tab-pane label="前端">前端</el-tab-pane>
            <el-tab-pane label="后端">后端</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    data() {
        return{
            tabPosition: 'left',     //左边显示选项卡
            cards: [
                { id:'1', image: '图片地址1', title: '标题1', editTime: '2023-01-01' },
                { id:'2', image: '图片地址2', title: '标题2', editTime: '2023-01-02' },
                { id:'3', image: '图片地址3', title: '标题3', editTime: '2023-01-03' },
                { id:'4', image: '图片地址4', title: '标题4', editTime: '2023-01-04' },
                { id:'5', image: '图片地址5', title: '标题5', editTime: '2023-01-05' },
                { id:'6', image: '图片地址6', title: '标题6', editTime: '2023-01-06' }
            ]
        }
    },

    methods: {
        // 跳转到文章详情页
        goToMarkdown(id) {
            this.$router.push({ name: 'Article', params: { id } });
        }
    }
}
</script>