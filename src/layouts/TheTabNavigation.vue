<script setup>
import { useRoute } from 'vue-router';

defineProps({
    routes: {
        type: Array
    },
    item: {
        type: String
    }
});

const currentRoute = useRoute();
</script>

<template>
    <div v-if="routes" class="tab-list">
        <RouterLink
            v-for="(route, index) in routes"
            :key="index"
            :to="route.to"
            :class="['tab-item', { 'tab-item-active': route.to === currentRoute.name }]"
        >
            {{ route.title }}
        </RouterLink>
    </div>
    <div v-else class="tab-list">
        <div :class="['tab-item', 'tab-item-no-active']">
            {{ item }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

$--tab-router-padding: 4px 20px;
$--tab-router-color-active: rgb(var(--c-primary));

.tab-list {
    display: flex;
    list-style: none;

    width: 100%;
    height: var(--tab-navigation-height);
    padding: 0;
    border-bottom: 1px solid rgb(var(--c-gray-300));
}

.tab-item {
    @include font(13);
    padding: $--tab-router-padding;
    border-bottom: 4px solid transparent;

    color: rgb(var(--c-black));
    transition: all 0.2s ease;
    text-decoration: none;
    cursor: pointer;

    &:hover {
        color: rgb(var(--c-primary));
    }

    &.tab-item-active {
        font-weight: 700;
        box-shadow: 0 0 2px rgb(var(--c-black), 0.16);
        background-color: #f2ebbf;
        border-bottom: 4px solid $--tab-router-color-active;
    }

    &.tab-item-no-active {
        font-weight: 700;
        box-shadow: 0 0 2px rgb(var(--c-black), 0.16);
        background-color: #f2ebbf;
        border-bottom: none;

        display: flex;
        align-items: center;
    }
}
</style>
