<script setup>
import { computed } from 'vue';

import { IconError, IconInfo, IconSuccess, IconWarning } from '@/assets/icons/';
import VIcon from './VIcon.vue';

import { useLanguageStore, useToastMessageStore } from '@/stores';
import { ToastMessageType } from '@/utils/enum';
import { ToastMessageResources } from '@/resources';

const props = defineProps({
    type: {
        type: String,
        required: true,
        default: ToastMessageType.Warning
    }
});

const Language = useLanguageStore();
const ToastMessage = useToastMessageStore();

/**
 * Mảng lưu trữ icon, title, titleClass tương ứng với mỗi type (success, error, warning, info)
 */
const typeMappings = {
    [ToastMessageType.Success]: {
        icon: IconSuccess,
        title: ToastMessageResources[Language.current].Title.success,
        titleClass: ['title', 'title-success']
    },
    [ToastMessageType.Error]: {
        icon: IconError,
        title: ToastMessageResources[Language.current].Title.error,
        titleClass: ['title', 'title-error']
    },
    [ToastMessageType.Warning]: {
        icon: IconWarning,
        title: ToastMessageResources[Language.current].Title.warning,
        titleClass: ['title', 'title-warning']
    },
    [ToastMessageType.Info]: {
        icon: IconInfo,
        title: ToastMessageResources[Language.current].Title.info,
        titleClass: ['title', 'title-info']
    }
};

const typeMapping = typeMappings[props.type] || typeMappings[ToastMessageType.Warning];
const icon = computed(() => typeMapping.icon);
const title = computed(() => typeMapping.title);
const titleClass = computed(() => typeMapping.titleClass);
</script>

<template>
    <div class="toast-message">
        <div class="content">
            <div class="message-icon">
                <component :is="icon" class="icon" />
            </div>
            <div :class="titleClass">{{ title }}&nbsp;</div>
            <div class="dialog-text">
                {{ ToastMessage.current.message }}
            </div>
        </div>
        <div class="icon-close" @click="ToastMessage.hide">
            <VIcon class="close-img" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.toast-message {
    @include centerAbsolute('left');
    top: 40px;

    max-width: 500px;
    width: 100%;
    height: 56px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 16px;
    border-radius: 4px;

    background-color: rgb(var(--c-white));
    filter: drop-shadow(0 4px 40px rgba(0, 0, 0, 0.078));
    z-index: 200;
    .content {
        display: flex;
        align-items: center;
    }
}

.title {
    font-weight: 500;
    &.title-success {
        color: rgb(var(--c-toast-msg-success));
    }
    &.title-error {
        color: var(--c-toast-msg-error);
    }
    &.title-warning {
        color: var(--c-toast-msg-warning);
    }
    &.title-info {
        color: var(--c-toast-msg-info);
    }
}

.message-icon {
    display: flex;
    margin-right: 8px;
    .icon {
        @include size(24px);
    }
}

.icon-close {
    position: relative;
    @include size(16px);
    cursor: pointer;
    .close-img {
        @include size(18px);
        transform: translate(-50%, -50%) scale(calc(12 / 18));
        background-position: -147px -147px;
    }
}
</style>
