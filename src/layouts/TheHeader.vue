<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import { IconClock, IconEnglandFlag, IconLanguage, IconVietnamFlag } from '@/assets/icons';
import avatar from '@/assets/images/avatar.jpg';

import { HeaderResources } from '@/resources';
import { useDateFormatStore, useLanguageStore } from '@/stores';
import { DateFormatList, HeaderContextMenu, LanguageList } from '@/utils/enum';

const Language = useLanguageStore();
const DateFormat = useDateFormatStore();

// Define the data and methods for the menu
const isOpen = ref(false);
const toggleMenu = (event) => {
    event.stopPropagation();
    isOpen.value = !isOpen.value;
};

/**
 * Đối tượng lưu trữ dữ liệu menu
 * Created by: ttanh (05/10/2023)
 */
const contextMenuData = computed(() => ({
    [HeaderContextMenu.DateFormat]: {
        icon: IconClock,
        title: HeaderResources[Language.current].ContextMenu.DateFormat,
        options: {
            [DateFormatList.DMY]: { title: DateFormatList.DMY },
            [DateFormatList.MDY]: { title: DateFormatList.MDY },
            [DateFormatList.YMD]: { title: DateFormatList.YMD }
        }
    },
    [HeaderContextMenu.Language]: {
        icon: IconLanguage,
        title: HeaderResources[Language.current].ContextMenu.Language,
        options: {
            [LanguageList.VI]: { icon: IconVietnamFlag, title: 'Tiếng Việt' },
            [LanguageList.EN]: { icon: IconEnglandFlag, title: 'English' }
        }
    }
}));

/**
 * Đổi định dạng ngày tháng năm khi thay đổi tùy chọn date format và lưu vào session storage
 * Đổi ngôn ngữ khi thay đổi tùy chọn ngôn ngữ và lưu vào session storage
 * @param {object} param0 đối tượng chứa key của menu và key của option lựa chọn
 * Created by: ttanh (05/10/2023)
 */
const handleSelectOption = ({ menuKey, optionKey }) => {
    switch (menuKey) {
        case HeaderContextMenu.DateFormat:
            DateFormat.current = optionKey;
            localStorage.setItem('dateformat', optionKey);
            break;
        case HeaderContextMenu.Language:
            Language.current = optionKey;
            localStorage.setItem('language', optionKey);
            break;
        default:
            break;
    }
};

const closeContextMenu = () => (isOpen.value = false);

onMounted(() => document.addEventListener('click', closeContextMenu));
onBeforeUnmount(() => document.removeEventListener('click', closeContextMenu));
</script>

<template>
    <header id="header">
        <div class="left-column">
            <div class="icon-menu">
                <VIcon class="menu-img" />
            </div>

            <div class="branch">
                <div class="name">{{ HeaderResources[Language.current].BranchName }}</div>
                <div class="icon-arrow-down">
                    <VIcon class="arrow-down-img" />
                </div>
            </div>
        </div>

        <div class="right-column">
            <div class="icon-setting" @click="toggleMenu">
                <VIcon class="setting-img" />
                <VContextMenu
                    :open="isOpen"
                    :menus-data="contextMenuData"
                    @select-option="handleSelectOption"
                />
            </div>

            <div class="icon-bell">
                <VIcon class="bell-img" />
            </div>

            <div class="current-user">
                <img :src="avatar" alt="avatar-image" class="avatar-image" />
                <div class="name">{{ HeaderResources.VI.UserName }}</div>
                <div class="icon-arrow-down">
                    <VIcon class="arrow-down-img" />
                </div>
            </div>
        </div>
    </header>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';
/* === Styles for header === */
#header {
    height: var(--main-header-height);
    display: flex;
    padding: 12px 16px;
    justify-content: space-between;
    align-items: center;
}

#header .left-column {
    display: flex;
    gap: 16px;
    .icon-menu {
        position: relative;
        @include size(24px);
        cursor: pointer;
        .menu-img {
            width: 16px;
            height: 14px;
            background-position: -847px -35px;
        }
    }
    .branch {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        .name {
            font-weight: 500;
            text-transform: uppercase;
        }

        .icon-arrow-down {
            position: relative;
            @include size(14px);
            transform: rotate(90deg);
            filter: brightness(0);
            .arrow-down-img {
                width: 8px;
                height: 14px;
                background-position: -84px -361px;
            }
        }
    }
}
#header .right-column {
    display: flex;
    align-items: center;
    gap: 24px;

    .language-switcher {
        @include font(13);
        z-index: 20;
    }

    .icon-setting {
        position: relative;
        @include size(24px);
        cursor: pointer;
        .setting-img {
            width: 24px;
            height: 24px;
            background-position: -675px -30px;
        }
    }

    .icon-bell {
        position: relative;
        @include size(24px);
        cursor: pointer;
        .bell-img {
            width: 22px;
            height: 25px;
            background-position: -788px -30px;
        }
    }

    .current-user {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        .avatar-image {
            @include size(32px);
            border-radius: 999px;
        }
        .name {
            font-weight: 500;
            text-transform: capitalize;
        }
        .icon-arrow-down {
            @include size(14px);
            transform: rotate(90deg);
            filter: brightness(0);
            .arrow-down-img {
                width: 8px;
                height: 14px;
                background-position: -84px -361px;
            }
        }
    }
}
</style>
