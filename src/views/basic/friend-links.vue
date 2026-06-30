<template>
    <div class="blog-friend-links">
        <div class="blog-friend-links-header">
            <img :src="friendBg" alt="页首图片"/>
            <div class="page-hero-copy">
                <span class="eyebrow">LINKS</span>
                <h1>XiaoYe の友人帐</h1>
                <p>一些会在互联网角落里发光的小站。</p>
            </div>
        </div>

        <main class="friend-shell">
            <section class="site-card" data-aos="fade-up">
                <div>
                    <span class="eyebrow">MY SITE</span>
                    <h2>关于本博客</h2>
                    <p>如果你也在认真经营自己的小站，可以把信息整理好发给我，适合的话我会加到这里。</p>
                </div>

                <dl class="site-meta">
                    <div>
                        <dt>博客地址</dt>
                        <dd>{{ siteUrl }}</dd>
                    </div>
                    <div>
                        <dt>站点名</dt>
                        <dd>XiaoYe Lab</dd>
                    </div>
                    <div>
                        <dt>一句话</dt>
                        <dd>写代码、做实验，也记录一点生活里的小确幸。</dd>
                    </div>
                </dl>

                <button class="apply-button" @click="dialogVisible = true">申请友链</button>

                <el-dialog v-model="dialogVisible" class="friend-dialog" title="申请友链" :append-to-body="true" width="min(700px, calc(100% - 28px))" align-center>
                    <div class="friend-apply-copy">
                        <p>麻烦提供以下信息：</p>
                        <ul>
                            <li>博客地址</li>
                            <li>头像 URL</li>
                            <li>一句话简介</li>
                        </ul>
                        <p>发送到邮箱：520715621@qq.com，邮件标题可以写“申请友链”。</p>
                    </div>
                    <template #footer>
                        <div class="dialog-footer">
                            <el-button type="primary" @click="dialogVisible = false">确定</el-button>
                        </div>
                    </template>
                </el-dialog>
            </section>

            <section class="friends-section" data-aos="fade-up" data-aos-delay="80">
                <div class="section-heading">
                    <div>
                        <span class="eyebrow">FRIENDS</span>
                        <h2>友链列表</h2>
                    </div>
                    <p>{{ friend_list.length }} 个朋友的小站。</p>
                </div>

                <div class="friend-grid" v-if="friend_list.length">
                    <a
                        class="friend-card"
                        v-for="(item, index) in friend_list"
                        :key="index"
                        :href="item.href"
                        :aria-label="`访问 ${item.name}`"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <div class="friend-card-top">
                            <img class="friend-avatar" :src="item.image" :alt="`${item.name} 头像`"/>
                            <h3>{{ item.name }}</h3>
                        </div>
                        <p>{{ item.info }}</p>
                    </a>
                </div>

                <div class="friend-empty" v-else>
                    还没有友链。
                </div>
            </section>
        </main>
    </div>
</template>

<script>
import headerBgImage from '@/icons/friend-links.png';
import friendAvatar from '@/icons_link/friend-link1.png';

export default {
    data() {
        return {
            friendBg: headerBgImage,
            dialogVisible: false,
            siteUrl: window.location.origin,

            friend_list: [
                {
                    image: friendAvatar,
                    name: 'Friend Site',
                    info: '认真写点什么的人。',
                    href: '#',
                },
                {
                    image: friendAvatar,
                    name: 'Creative Lab',
                    info: '代码、设计和生活观察。',
                    href: '#',
                },
                {
                    image: friendAvatar,
                    name: 'Note Garden',
                    info: '慢慢整理知识的小花园。',
                    href: '#',
                },
            ]
        }
    }
}
</script>
