<script setup>
import { cashRoutes } from '@/router/constants';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

defineProps({
    icon: {
        type: Object,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    }
});

/**
 * Kiểm tra xem item có được chọn không, dựa vào route hiện tại
 * Created by: ttanh (17/10/2023)
 */
const isSelected = computed(() => {
    const currentRoute = useRoute();
    return cashRoutes.map((route) => route.to).includes(currentRoute.name);
});
</script>

<template>
    <RouterLink :to="to" class="link">
        <div :class="['menu-item', { 'selected-item': isSelected }]">
            <component :is="icon" class="icon" />
            <div class="title">{{ title }}</div>
        </div>
    </RouterLink>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

$--menu-item-padding-x: 12px;
$--menu-item-padding-y: 10px;
$--menu-item-border-radius: 6px;
$--menu-item-text-color: rgba(var(--c-white));
$--menu-item-bg-color: rgba(var(--c-gray-600), 0.9);

.link {
    text-decoration: none;
}

/* Styles for menu-item */
.menu-item {
    display: flex;
    gap: 12px;
    align-items: center;

    padding: $--menu-item-padding-y $--menu-item-padding-x;
    border-left: 6px solid transparent;
    // border-radius: $--menu-item-border-radius;
    cursor: pointer;

    &:hover {
        background-color: $--menu-item-bg-color;
    }

    .icon {
        @include size(24px);
    }

    .title {
        @include font(14, 500);
        color: $--menu-item-text-color;
    }

    &.selected-item {
        background-color: $--menu-item-bg-color;
        border-left: 6px solid rgb(var(--c-primary));
    }
}
</style>
