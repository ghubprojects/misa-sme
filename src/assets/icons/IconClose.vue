<script setup>
defineProps({
    title: String
});
</script>

<template>
    <div class="icon">
        <div class="close-icon"></div>
        <span class="tooltip" v-if="title">
            {{ title }}
        </span>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

$--tooltip-color: rgb(var(--c-white));
$--tooltip-bg-color: rgb(var(--c-gray-900));

.close-icon {
    background: url('@/assets/images/sprites.svg') no-repeat -143px -143px;
}

/* Style tooltip */
.tooltip {
    @include centerAbsolute();

    display: none;
    top: 52px;
    z-index: 15;

    padding: 4px;
    border-radius: 2px;

    @include font(12);
    text-wrap: nowrap;

    color: $--tooltip-color;
    background-color: $--tooltip-bg-color;
}

.icon:hover > .tooltip {
    display: flex;
}
</style>
