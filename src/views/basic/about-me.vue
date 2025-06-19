<template>
    <div class="blog-about-me">
        <div class="blog-about-me-header">
            <img src="/src/icons/about-me.png" alt="页首图片" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6);"/>
            <h1>关于我</h1>
        </div>

        <el-card class="about-me-content" data-aos="zoom-in" data-aos-duration="1000">
            <div class="info">
                <div class="header">
                    <img src="/src/icons/avatar.png" alt="头像"></img>
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
        </el-card>
    </div>
</template>

<script>
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init({})

export default {
    components: {
        AOS,
    },
    data() {
        return {

        }
    },

    methods: {
        
    },
}
</script>