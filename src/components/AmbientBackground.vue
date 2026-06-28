<template>
    <div class="ambient-background" aria-hidden="true">
        <div class="sakura-field">
            <span
                v-for="petal in sakuraPetals"
                :key="`sakura-${petal}`"
                class="sakura-petal"
                :style="particleStyle(petal, 'sakura')"
            ></span>
        </div>

        <div class="firefly-field">
            <span
                v-for="firefly in fireflies"
                :key="`firefly-${firefly}`"
                class="firefly"
                :style="particleStyle(firefly, 'firefly')"
            ></span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AmbientBackground',

    data() {
        return {
            sakuraPetals: Array.from({ length: 52 }, (_, index) => index),
            fireflies: Array.from({ length: 38 }, (_, index) => index),
        };
    },

    methods: {
        particleStyle(index, type) {
            if (type === 'sakura') {
                return {
                    '--x': `${(index * 31) % 100}vw`,
                    '--size': `${10 + (index % 6) * 1.4}px`,
                    '--duration': `${18 + (index % 9) * 2}s`,
                    '--delay': `${-(index * 1.25)}s`,
                    '--drift': `${index % 2 === 0 ? 1 : -1}`,
                    '--opacity': `${0.44 + (index % 5) * 0.055}`,
                };
            }

            return {
                '--x': `${(index * 43) % 100}vw`,
                '--y': `${(index * 29) % 100}vh`,
                '--size': `${4 + (index % 5)}px`,
                '--duration': `${10 + (index % 8) * 1.6}s`,
                '--delay': `${-(index * 1.2)}s`,
                '--drift-x': `${index % 2 === 0 ? 1 : -1}`,
                '--drift-y': `${index % 3 === 0 ? 1 : -1}`,
            };
        },
    },
};
</script>

<style lang="less">
.ambient-background {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
    contain: strict;
}

.sakura-field,
.firefly-field {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity var(--theme-transition-duration) var(--theme-transition-ease);
}

.sakura-field {
    opacity: 1;
}

.sakura-petal {
    position: absolute;
    top: -12vh;
    left: var(--x);
    width: var(--size);
    height: calc(var(--size) * 0.48);
    border-radius: 72% 42% 70% 46%;
    opacity: var(--opacity);
    background: linear-gradient(135deg, rgba(255, 151, 191, 0.78), rgba(255, 104, 160, 0.62));
    box-shadow: 0 6px 14px rgba(170, 86, 126, 0.12);
    filter: saturate(0.96) blur(0.12px);
    transform-origin: 30% 50%;
    animation:
        sakura-fall var(--duration) linear infinite,
        sakura-sway calc(var(--duration) * 0.45) ease-in-out infinite alternate;
    animation-delay: var(--delay);
}

.firefly-field {
    mix-blend-mode: screen;
}

.firefly {
    position: absolute;
    top: var(--y);
    left: var(--x);
    width: var(--size);
    height: var(--size);
    border-radius: 999px;
    background: #b8ffd7;
    box-shadow:
        0 0 8px rgba(158, 255, 207, 0.95),
        0 0 26px rgba(116, 241, 178, 0.78),
        0 0 54px rgba(92, 219, 255, 0.42);
    opacity: 0.86;
    animation:
        firefly-drift var(--duration) ease-in-out infinite alternate,
        firefly-pulse calc(var(--duration) * 0.36) ease-in-out infinite;
    animation-delay: var(--delay);
}

.dark-mode {
    .sakura-field {
        opacity: 0;
    }

    .firefly-field {
        opacity: 1;
    }
}

@keyframes sakura-fall {
    0% {
        transform: translate3d(0, -12vh, 0) rotate(0deg);
    }

    100% {
        transform: translate3d(calc(var(--drift) * 18vw), 116vh, 0) rotate(680deg);
    }
}

@keyframes sakura-sway {
    0% {
        margin-left: -24px;
    }

    100% {
        margin-left: 36px;
    }
}

@keyframes firefly-drift {
    0% {
        transform: translate3d(0, 0, 0);
    }

    100% {
        transform: translate3d(calc(var(--drift-x) * 44px), calc(var(--drift-y) * 58px), 0);
    }
}

@keyframes firefly-pulse {
    0%,
    100% {
        opacity: 0.36;
        filter: blur(0);
    }

    45% {
        opacity: 0.96;
        filter: blur(0.4px);
    }
}

@media (prefers-reduced-motion: reduce) {
    .sakura-petal,
    .firefly {
        animation: none;
    }
}
</style>
