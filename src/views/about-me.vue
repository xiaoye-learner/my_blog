<template>
    <div class="blog-about-me">
        <div class="blog-about-me-header">
            <img src="../icons/about-me.png" alt="页首图片" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6);"/>
            <h1>关于我</h1>
        </div>

        <el-card class="about-me-content">
            <div class="info">
                <div class="header">
                    <img src="../icons/avatar.png" alt="头像"></img>
                </div>
                <div class="line"></div>
                <div class="infoText">
                    <h1>Hi,</h1>
                    <h1>I'm XiaoYe</h1>
                </div>
            </div>

            <div class="profile">
                <p>个人简介部分</p>
            </div>
            <!-- <div class="music" @click="miniMusic">
                <aplayer ref="aplayer" 
                    :music="firstMusic(music_list)" 
                    :list="music_list"
                    :repeat="list"
                    :listFolded="true"
                    :mini="false"/>
            </div> -->
        </el-card>
    </div>
</template>

<script>
import aplayer from 'vue3-aplayer'

export default {
    components: {
        aplayer
    },

    data() {
        return {
            ismini: true,
            music_list: [
                {
                    title: 'なごみ風',
                    artist: ' ',
                    src: 'src/music/渡辺善太郎 - なごみ風.mp3'
                },
                {
                    title: 'Lyrical Amber',
                    artist: ' ',
                    src: 'src/music/Falcom Sound Team jdk - Lyrical Amber.mp3'
                },
            ]
        }
    },

    methods: {
        firstMusic(music_list){
            return music_list[0]
        },

        miniMusic(){
            this.ismini = !this.ismini
        }
    },
}
</script>