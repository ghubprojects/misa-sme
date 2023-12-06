<script setup>
import { IconOption } from '@/assets/icons';
import { MenuItemResources } from '@/resources';
import { useLanguageStore } from '@/stores';
import { menuItemList } from '@/utils/menuitem';
import SidebarItem from './SidebarItem.vue';
import logoSrc from '@/assets/images/logo.svg';

const Language = useLanguageStore();
</script>

<template>
    <div id="sidebar">
        <div class="logo">
            <IconOption class="option-icon" />
            <RouterLink to="/">
                <img :src="logoSrc" alt="logo-image" class="logo-image" />
            </RouterLink>
        </div>
        <div class="menu">
            <SidebarItem
                v-for="(menuItem, index) in menuItemList"
                :key="index"
                :icon="menuItem.icon"
                :title="MenuItemResources[Language.current][menuItem.title]"
                :to="menuItem.to"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';
#sidebar {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgba(var(--c-gray-900), 0.9);
}

.logo {
    display: flex;
    gap: 20px;
    align-items: center;
    height: var(--main-header-height);
    cursor: pointer;
    .option-icon {
        @include size(24px);
    }

    .logo-image {
        height: 32px;
    }
}

.menu {
    display: flex;
    // padding: 12px 0;
    flex-direction: column;
    gap: 4px;

    width: var(--sidebar-width);
    max-height: calc(100vh - var(--main-header-height));
    height: 100%;
    overflow-y: overlay;
}
</style>
