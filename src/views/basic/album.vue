<template>
    <div class="blog-album">
        <div class="blog-album-header">
            <img :src="albumBg" alt="页首图片"/>
            <div class="page-hero-copy">
                <span class="eyebrow">GALLERY</span>
                <h1>相册</h1>
                <p>收集一些画面，也收集一些当时的心情。</p>
            </div>
        </div>

        <main class="album-stage" :class="{ 'show-album-detail': activeAlbum }">
            <transition name="album-view">
                <section class="album-landing" v-if="!activeAlbum" key="album-landing">
                    <div class="album-landing-head">
                        <div>
                            <span class="eyebrow">LIGHT GALLERY</span>
                            <h2>光影画廊</h2>
                            <p>定格时间，封存路过生活时心动的画面。</p>
                        </div>

                        <label class="album-search">
                            <span>⌕</span>
                            <input v-model.trim="searchKeyword" type="text" placeholder="搜索相册名或照片描述..."/>
                        </label>
                    </div>

                    <div class="album-collections" v-if="filteredAlbumSections.length">
                        <button
                            class="album-showcase-card"
                            v-for="album in filteredAlbumSections"
                            :key="album.key"
                            :style="{ '--card-accent': album.color }"
                            @click="openAlbum(album.key)"
                        >
                            <div class="photo-stack-large">
                                <img
                                    v-for="(photo, photoIndex) in previewPhotos(album)"
                                    :key="`${album.key}-${photoIndex}-${photo.image}`"
                                    :class="['stack-photo', `stack-${photoIndex + 1}`]"
                                    :src="photo.image"
                                    :alt="album.title"
                                />
                            </div>

                            <div class="album-card-copy">
                                <small>{{ album.photos.length }} 张照片 · Click to Open</small>
                                <h3>{{ album.title }}</h3>
                                <div>
                                    <time>{{ album.date }}</time>
                                    <p>{{ album.description }}</p>
                                </div>
                            </div>
                        </button>
                    </div>

                    <div class="album-empty" v-else>
                        没有找到匹配的相册集。
                    </div>
                </section>

                <section class="album-detail" v-else key="album-detail">
                    <div class="album-detail-head">
                        <div>
                            <span class="eyebrow">PHOTO WALL</span>
                            <h2>{{ activeAlbumInfo.title }}</h2>
                            <p>{{ activeAlbumInfo.description }}</p>
                        </div>

                        <button class="album-back" @click="backToAlbums">返回相册集</button>
                    </div>

                    <div class="masonry-container" v-if="activePhotos.length">
                        <div class="masonry-item" v-for="(item, index) in activePhotos" :key="index">
                            <el-card class="photo_list-card" :body-style="{ padding: '0px' }">
                                <button
                                    class="photo-preview-trigger"
                                    type="button"
                                    :aria-label="`${activeAlbumInfo.title} ${index + 1}`"
                                    @click="openPhotoPreview(index)"
                                >
                                    <el-image
                                        :src="item.image"
                                        :alt="activeAlbumInfo.title"
                                        fit="cover"
                                        v-loading="item.loading"
                                        @load="item.loading = false"
                                        @error="item.loading = false"
                                    ></el-image>
                                </button>
                            </el-card>
                        </div>
                    </div>

                    <div class="album-empty" v-else>
                        这个相册还在整理中。
                    </div>
                </section>
            </transition>
        </main>

        <el-image-viewer
            v-if="previewVisible"
            :url-list="activePhotoUrls"
            :initial-index="previewIndex"
            :hide-on-click-modal="true"
            :teleported="true"
            :show-progress="true"
            @close="closePhotoPreview"
        ></el-image-viewer>
    </div>
</template>

<script>
import headerBgImage from '@/icons/album.png';

export default {
    data() {
        return {
            albumBg: headerBgImage,
            activeAlbum: '',
            searchKeyword: '',
            previewVisible: false,
            previewClosing: false,
            previewIndex: 0,
            previewCloseTimer: null,
            photo_life_list: [
                { image: 'https://gitee.com/xiaoye2301/blog_images/raw/master/%E6%8F%92%E7%94%BB1.jpg', loading: true },
                { image: 'https://gitee.com/xiaoye2301/blog_images/raw/master/_20250523171604.jpg', loading: true },
                { image: 'https://gitee.com/xiaoye2301/blog_images/raw/master/_20250523171624.jpg', loading: true },
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
                {
                    image: 'https://gitee.com/xiaoye2301/blog_images/raw/master/_202505231716241.jpg',
                    loading: true,
                },
                {
                    image: 'https://gitee.com/xiaoye2301/blog_images/raw/master/_202505231716242.jpg',
                    loading: true,
                },
            ],
        }
    },

    computed: {
        albumSections() {
            return [
                {
                    key: 'anime',
                    title: '动漫',
                    date: '2025.05',
                    description: '一些偏插画感、色彩更明亮的收藏图。',
                    color: '#8ea0ff',
                    photos: this.photo_anime_list,
                    covers: this.photo_anime_list,
                },
                {
                    key: 'life',
                    title: '生活碎片',
                    date: '2025.04',
                    description: '日常里随手留下的画面。',
                    color: '#78d8ff',
                    photos: this.photo_life_list,
                    covers: this.photo_life_list,
                },
                {
                    key: 'travel',
                    title: '旅行札记',
                    date: '整理中',
                    description: '准备留给旅行照片的位置。',
                    color: '#fe8599',
                    photos: [],
                    covers: [...this.photo_life_list, ...this.photo_anime_list].slice(1, 4),
                },
            ];
        },

        filteredAlbumSections() {
            const keyword = this.searchKeyword.toLowerCase();
            if (!keyword) return this.albumSections;

            return this.albumSections.filter(album => {
                return `${album.title} ${album.description}`.toLowerCase().includes(keyword);
            });
        },

        activeAlbumInfo() {
            return this.albumSections.find(album => album.key === this.activeAlbum) || this.albumSections[0];
        },

        activePhotos() {
            return this.activeAlbumInfo?.photos || [];
        },

        activePhotoUrls() {
            return this.activePhotos.map(item => item.image);
        },
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
        },

        previewPhotos(album) {
            return album.covers?.length ? album.covers.slice(0, 3) : this.photo_anime_list.slice(0, 3);
        },

        openAlbum(key) {
            this.activeAlbum = key;
        },

        backToAlbums() {
            this.activeAlbum = '';
        },

        openPhotoPreview(index) {
            if (this.previewCloseTimer) {
                window.clearTimeout(this.previewCloseTimer);
            }

            document.body.classList.remove('album-preview-closing');
            this.previewClosing = false;
            this.previewIndex = index;
            this.previewVisible = true;
        },

        closePhotoPreview() {
            if (this.previewClosing) return;

            this.previewClosing = true;
            document.body.classList.add('album-preview-closing');

            this.previewCloseTimer = window.setTimeout(() => {
                this.previewVisible = false;
                this.previewClosing = false;
                this.previewCloseTimer = null;
                document.body.classList.remove('album-preview-closing');
            }, 380);
        },
    },

    mounted() {
        //遍历图片执行加载
        [...this.photo_anime_list, ...this.photo_life_list].forEach(item => {
            this.loadImage(item);
        })
    },

    beforeUnmount() {
        if (this.previewCloseTimer) {
            window.clearTimeout(this.previewCloseTimer);
        }

        document.body.classList.remove('album-preview-closing');
    },
}
</script>
