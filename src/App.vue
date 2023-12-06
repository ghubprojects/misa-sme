<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';

import { TheHeader, TheSidebar } from './layouts';

import {
    useDateFormatStore,
    useDialogStore,
    useLanguageStore,
    useToastMessageStore
} from './stores';
import { DateFormatList, LanguageList } from './utils/enum';

const Language = useLanguageStore();
const DateFormat = useDateFormatStore();

const ToastMessage = useToastMessageStore();
const Dialog = useDialogStore();

/**
 * Khi mounted,
 * lấy language từ session storage và lưu trữ trong global state Language
 * và lấy dateformat từ session storage và lưu trữ trong global state DateFormat
 * Ngôn ngữ mặc định là: VI (Tiếng Việt)
 * Định dạng thời gian mặc định là: DMY (dd/mm/yyyy)
 * Created by: ttanh (04/10/2023)
 * Modified by: ttanh (06/10/2023)
 */
onMounted(() => {
    Language.current = localStorage.getItem('language') ?? LanguageList.VI;
    DateFormat.current = localStorage.getItem('dateformat') ?? DateFormatList.DMY;
});
</script>

<template>
    <div id="main">
        <TheSidebar />
        <div id="content-container">
            <TheHeader />
            <RouterView />
        </div>
        <VToastMessage v-if="ToastMessage.isShow" :type="ToastMessage.current.type" />
        <VDialog v-if="Dialog.isOpen" />
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/global.scss';

#main {
    display: flex;
    #content-container {
        width: calc(100% - var(--sidebar-width));
        height: 100vh;
    }
}
</style>
