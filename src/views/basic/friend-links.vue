<template>
    <div class="blog-friend-links">
        <div class="blog-friend-links-header">
            <img src="/src/icons/friend-links.png" alt="页首图片" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6);"/>
            <h1>XiaoYeの友人帐</h1>
        </div>

        <el-card class="about-card">
            <h2>关于本博客:</h2>
            <p>博客地址:</p>
            <p>头像URL:</p>
            <p>一句话：</p>
            <p>简介：</p>
            <div class="button-container">
                <el-button type="primary" plain @click="dialogVisible = true">申请友链</el-button>
                <el-dialog v-model="dialogVisible" title="申请友链" :append-to-body="true" width="700" align-center>
                    <span><hr>因为信息需要，麻烦大佬你提供：<br>
                        <br><strong>1.博客地址</strong>
                        <br><strong>2.头像URL</strong> 
                        <br><strong>3.一句话的简介</strong><br>
                        <br>并将以上信息发送到邮箱：1520715621@qq.com，邮件标题最好添加“申请友链”之类的字样，万分感谢
                    </span>
                    <template #footer>
                        <div class="dialog-footer">
                            <el-button type="primary" @click="dialogVisible = false">确定</el-button>
                        </div>
                    </template>
                </el-dialog>
            </div>
        </el-card>

        <el-card class="friends-card">
            <el-row class="row-space" v-if="friend_list.length">
                <el-col class="col-space" :xs="12" :sm="8" v-for="(item, index) in friend_list" :key="index">
                    <el-card class="friend-card" style="cursor: pointer;">
                        <div class="background">
                            <img :src="item.image" :alt="item.image"></img>
                        </div>
                        <div class="avator">
                            <img :src="item.image" :alt="item.image">
                        </div>
                        <div class="info">
                            <p>{{ item.info }}</p>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialogVisible: false,

                friend_list: [
                    { 
                        image: 'src/icons_link/friend-link1.png', 
                        info: '信息1' 
                    },
                    { 
                        image: 'src/icons_link/friend-link1.png', 
                        info: '信息1' 
                    },
                    { 
                        image: 'src/icons_link/friend-link1.png', 
                        info: '信息1' 
                    },
                    { 
                        image: 'src/icons_link/friend-link1.png', 
                        info: '信息1' 
                    },
                ]
            }
        }
    }
</script>