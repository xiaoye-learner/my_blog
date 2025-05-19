<template>
    <div class="blog-album">
        <div class="album-header">
            <img src="../icons/album.png" alt="页首图片" style="width: 100vw; height: 30vh; object-fit: cover;"/>
        </div>
        <el-tabs :tab-position="tabPosition" style="height: 100vh" class="demo-tabs">
            <el-tab-pane label="生活">
                <el-row class="row-space" v-if="photo_list.length">
                    <el-col class="col-space" :xs="12" :sm="6" v-for="(item, index) in photo_list" :key="index">
                        <el-card class="photo_list-card">
                            <img :src="item.image" :alt="item.image"></img>
                        </el-card>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="Anime">Anime</el-tab-pane>
            <el-tab-pane label="旅游">旅游</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tabPosition: 'top',     //左边显示选项卡
                photo_list: [
                    { image: '图片地址1'},
                    { image: '图片地址2'},
                    { image: '图片地址3'},
                    { image: '图片地址4'},
                    { image: '图片地址5'},
                    { image: '图片地址6'}
                ]
            }
        }
    }
</script>