<template>
    <div class="blog-friend-links">
        <div class="blog-friend-links-header">
            <img src="../icons/friend-links.png" alt="页首图片" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6);"/>
            <h1>XiaoYeの友人帐</h1>
        </div>

        <el-card class="about-card">
            <h2>关于友链:</h2>
            <p>头像URL:</p>
            <div class="button-container">
                <el-button>申请友链</el-button>
            </div>
        </el-card>

        <el-card class="friends-card">
            <el-row class="row-space" v-if="friend_list.length">
                <el-col class="col-space" :xs="12" :sm="8" v-for="(item, index) in friend_list" :key="index">
                    <el-card class="friend-card">
                        <img :src="item.image" :alt="item.image"></img>
                        <p>{{ item.info }}</p>
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
                friend_list: [
                    { image: '图片地址1', info: '信息1' },
                    { image: '图片地址2', info: '信息2' },
                    { image: '图片地址3', info: '信息3' },
                    { image: '图片地址4', info: '信息4' },
                    { image: '图片地址5', info: '信息5' },
                    { image: '图片地址6', info: '信息6' },
                ]
            }
        }
    }
</script>