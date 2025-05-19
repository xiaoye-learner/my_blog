<template>
    <div class="blog-life">
        <div class="life-header">
            <img src="../icons/life.png" alt="页首图片" style="width: 100vw; height: 30vh; object-fit: cover;"/>
        </div>
        <el-tabs class="life-tabs" :tab-position="tabPosition" style="height: 100vh">
            <el-tab-pane label="2025年">
                <div class="life_talk-container">     <!-- 说说 -->                    
                    <div class="life_talk-item" v-for="(talk, index) in life_talk" :key="index">
                        <div class="life_talk-header">      <!-- 说说头部（头像与内容）信息 -->
                            
                            <div class="avatar">
                                <span>{{ talk.author }}</span>
                            </div>

                            <div class="life_talk-content">
                                <div class="life_talk-text">
                                    <p v-html="talk.content"></p>
                                </div>
                            </div>
                        </div>

                        <div class="life_talk-footer">      <!-- 说说页脚（时间）信息 -->
                            <span>{{ talk.date }}</span>
                        </div>
                        <hr />     <!-- 隔开每条说说 -->
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tabPosition: 'left',     //左边显示选项卡
            // 存储每一条说说的列表
            life_talk: [
                {
                    author: "小张",
                    content:
                        "11111",
                    date: "2025-05-05"
                },
                {
                    author: "小李",
                    content: "2222222",
                    date: "2025-05-05"
                },
                {
                    author: "小王",
                    content: "333333333333",
                    date: "2025-05-05"
                }
            ]
        }
    }
}
</script>