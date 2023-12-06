<script setup>
import { IconDialogWarning, IconDialogError, IconInfo } from '@/assets/icons';
import { useDialogStore } from '@/stores/dialog';
import { ButtonSize, ButtonStyle } from '@/styles/types';
import { DialogType } from '@/utils/enum';
import { computed } from 'vue';

const DialogStore = useDialogStore();

/**
 * Mảng lưu trữ icon tương ứng với mỗi type (error, warning, info)
 */
const typeMappings = {
    [DialogType.Error]: {
        icon: IconDialogError
    },
    [DialogType.Warning]: {
        icon: IconDialogWarning
    },
    [DialogType.Info]: {
        icon: IconInfo
    }
};

const typeMapping = typeMappings[DialogStore.type] || typeMappings[DialogType.Warning];
const icon = computed(() => typeMapping.icon);
</script>

<template>
    <div class="dialog">
        <div class="dialog-container">
            <div class="dialog-wrapper">
                <div class="dialog-icon">
                    <component :is="icon" class="icon" />
                </div>
                <div class="dialog-content">
                    <div v-if="DialogStore.title != ''" class="dialog-title">
                        {{ DialogStore.title }}
                    </div>
                    <div class="dialog-message">{{ DialogStore.message }}</div>
                </div>
            </div>

            <div class="separate-line"></div>

            <div :class="['dialog-footer', { 'footer-align-center': !DialogStore.secondaryText }]">
                <VButton
                    v-if="DialogStore.secondaryText"
                    :style="ButtonStyle.Outline"
                    :size="ButtonSize.Medium"
                    @click="DialogStore.onClickSecondary"
                >
                    {{ DialogStore.secondaryText }}
                </VButton>
                <VButton
                    :style="ButtonStyle.Primary"
                    :size="ButtonSize.Medium"
                    @click="DialogStore.onClickPrimary"
                >
                    {{ DialogStore.primaryText }}
                </VButton>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';
.dialog {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    background-color: var(--modal-background);
}

.dialog-container {
    max-width: 440px;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 16px 20px 10px;
    border-radius: 3px;
    background-color: rgb(var(--c-white));
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
}

.dialog-wrapper {
    display: flex;
    align-items: center;
    gap: 16px;
    .dialog-icon {
        @include size(40px);
        display: flex;
    }

    .dialog-content {
        @include font(13);
        line-height: 24px;
        .dialog-title {
            font-weight: 700;
            padding-bottom: 6px;
        }
    }
}

.separate-line {
    border-top: 1px solid #b8bcc3;
    width: 100%;
    margin-top: 16px;
    margin-bottom: 10px;
}

.dialog-footer {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    &.footer-align-center {
        justify-content: center;
    }
}
</style>
