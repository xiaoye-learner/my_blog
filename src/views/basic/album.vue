<template>
    <div class="blog-album">
        <div class="blog-album-header">
            <img src="/src/icons/album.png" alt="页首图片" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6);"/>
            <h1>相册</h1>
        </div>
        <el-tabs :tab-position="tabPosition" style="height: 100vh" class="demo-tabs">
            <el-tab-pane label="Anime">
                <el-row class="row-space" v-if="photo_anime_list.length">
                    <el-col class="col-space" :xs="12" :sm="8" :md="6" v-for="(item, index) in photo_anime_list" :key="index">
                        <el-card class="photo_list-card">
                            <el-image :src="item.image" :alt="item.image" fit="cover"
                                style="width: 100%; height: 100%;" 
                                v-loading="item.loading"
                            ></el-image>
                        </el-card>
                    </el-col>
                </el-row>
            </el-tab-pane>

            <el-tab-pane label="生活">
                <el-row class="row-space" v-if="photo_life_list.length">
                    <el-col class="col-space" :xs="12" :sm="8" :md="6" v-for="(item, index) in photo_life_list" :key="index">
                        <el-card class="photo_list-card">
                            <img :src="item.image" :alt="item.image"></img>
                        </el-card>
                    </el-col>
                </el-row>
            </el-tab-pane>
            
            <el-tab-pane label="旅游">旅游</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tabPosition: 'left',     //顶部显示选项卡
                photo_life_list: [
                    { image: '图片地址1'},
                    { image: '图片地址2'},
                    { image: '图片地址3'},
                    { image: '图片地址4'},
                    { image: '图片地址5'},
                    { image: '图片地址6'}
                ],

                photo_anime_list: [
                    { 
                        image: 'https://gitee.com/xiaoye2301/blog_images/raw/master/%E6%8F%92%E7%94%BB1.jpg',
                        loading: true,
                    },
                    {   
                        image: 'https://gitee.com/xiaoye2301/blog_images/raw/master/_20250523171604.jpg',
                        loading: true,
                    },
                    {   
                        image: 'https://gitee.com/xiaoye2301/blog_images/raw/master/_20250523171624.jpg',
                        loading: true,
                    },
                    {   image: 'https://gitee.com/xiaoye2301/blog_images/raw/master/_202505231716241.jpg',
                        loading: true,
                    },
                    {   image: 'https://gitee.com/xiaoye2301/blog_images/raw/master/_202505231716242.jpg',
                        loading: true,
                    },
                ],
            }
        },

        methods: {
            //图片加载
            loadImage(item){
                const img = new Image();
                img.src = item.image;

                img.onload = () => {
                    item.loading = false;
                };

                img.onerror = () => {
                    console.error('图片加载失败', item.image);
                    item.loading = false;
                };
            }
        },

        mounted() {
            //遍历图片执行加载
            this.photo_anime_list.forEach(item => {
                this.loadImage(item);
            })
        }
    }
</script>