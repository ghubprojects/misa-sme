<script setup>
import { computed, onMounted, ref } from 'vue';
import { ButtonStyle, ButtonSize, ColorScheme, TooltipDirection } from '@/styles/types';

const props = defineProps({
    style: {
        type: String,
        default: ButtonStyle.Primary,
        validator(val) {
            return Object.values(ButtonStyle).includes(val);
        }
    },
    size: {
        type: String,
        default: ButtonSize.Medium,
        validator(val) {
            return Object.values(ButtonSize).includes(val);
        }
    },
    colorScheme: {
        type: String,
        default: ColorScheme.Primary,
        validator(val) {
            return Object.values(ColorScheme).includes(val);
        }
    },
    tooltip: String,
    tooltipDirection: {
        type: String,
        default: TooltipDirection.Down,
        validator(val) {
            return Object.values(TooltipDirection).includes(val);
        }
    },
    class: String || Object || Array,
    disabled: Boolean,
    href: String,
    focus: Boolean,
    widthFull: Boolean,
    borderRadius: Boolean
});

const buttonRef = ref(null);

// Khi mounted, nếu prop focus = true, focus button
onMounted(() => {
    if (props.focus) buttonRef.value.focus();
});

// Lưu trữ trạng thái disabled của button
const isDisabled = computed(() => props.disabled);

/**
 * === COMPONENT STYLE ===
 */
const buttonClass = computed(() => [
    'button',
    `button-${props.style}`,
    `button-${props.size}`,
    { 'button-width-full': props.widthFull },
    { 'button-border-radius': props.borderRadius },
    props.style === ButtonStyle.Icon ? `button-icon-${props.size}` : '',
    `button-${props.colorScheme}-colorscheme`,
    props.class
]);
</script>

<template>
    <div style="position: relative">
        <a :href="href" target="_blank">
            <button
                :class="buttonClass"
                :disabled="isDisabled"
                ref="buttonRef"
                @click="buttonRef.blur"
            >
                <slot name="icon"></slot>
                <slot></slot>
            </button>
        </a>
        <span :class="['tooltip', `tooltip-${tooltipDirection}`]" v-if="tooltip">
            {{ tooltip }}
        </span>
    </div>
</template>

<style scoped lang="scss">
@import '@/styles/mixins.scss';

$--button-min-width: 80px;
$--button-padding-x: 16px;

$--button-small-height: 20px;
$--button-medium-height: 26px;
$--button-large-height: 30px;
$--button-extra-large-height: 38px;

$--button-small-padding-y: 4px;
$--button-medium-padding-y: 6px;
$--button-large-padding-y: 11px;
$--button-extra-large-padding-y: 15px;

$--button-primary-color: rgb(var(--c-white));
$--button-primary-bg-color: rgb(var(--c-primary));
$--button-primary-hover-bg-color: rgb(var(--c-light-green-500));
$--button-primary-pressed-bg-color: rgb(var(--c-green-600));

$--button-secondary-color: rgb(var(--c-primary));
$--button-secondary-bg-color: rgb(var(--c-white));
$--button-secondary-hover-bg-color: rgb(var(--c-gray-100));
$--button-secondary-pressed-bg-color: rgb(var(--c-gray-200));

$--button-outline-color: rgb(var(--c-gray-900));
$--button-outline-bg-color: rgb(var(--c-white));
$--button-outline-border-color: #babec5;
$--button-outline-hover-bg-color: rgb(var(--c-gray-100));
$--button-outline-pressed-bg-color: rgb(var(--c-gray-200));

$--button-icon-color: rgb(var(--c-green-500));
$--button-icon-bg-color: rgb(var(--c-light-green-100));
$--button-icon-pressed-bg-color: rgb(var(--c-green-500));
$--button-icon-padding: 12px;

$--button-icon-small-width: 20px;
$--button-icon-medium-width: 36px;
$--button-icon-large-width: 40px;
$--button-icon-extra-large-width: 48px;

$--button-red-colorscheme-color: rgb(var(--c-white));
$--button-red-colorscheme-bg-color: rgb(var(--c-red-500));
$--button-red-colorscheme-hover-bg-color: rgb(var(--c-red-400));
$--button-red-colorscheme-pressed-bg-color: rgb(var(--c-red-600), 0.8);

$--tooltip-color: rgb(var(--c-white));
$--tooltip-bg-color: rgb(var(--c-gray-900));

.button-wrapper-small {
    height: $--button-small-height;
}
.button-wrapper-medium {
    height: $--button-medium-height;
}
.button-wrapper-large {
    height: $--button-large-height;
}

.button-wrapper-extra-large {
    height: $--button-extra-large-height;
}

.button-small {
    height: $--button-small-height;
    padding: $--button-small-padding-y $--button-padding-x;
    @include font(13);
}
.button-medium {
    height: $--button-medium-height;
    padding: $--button-medium-padding-y $--button-padding-x;
    @include font(13);
}
.button-large {
    height: $--button-large-height;
    padding: $--button-large-padding-y $--button-padding-x;
    @include font(14);
}

.button-extra-large {
    height: $--button-extra-large-height;
    padding: $--button-extra-large-padding-y $--button-padding-x;
    @include font(14);
}

.button-icon-small {
    width: $--button-icon-small-width;
}
.button-icon-medium {
    width: $--button-icon-medium-width;
}
.button-icon-large {
    width: $--button-icon-large-width;
}

.button-icon-extra-large {
    width: $--button-icon-extra-large-width;
}

.button-width-full {
    width: 100%;
}

.button-border-radius {
    border-radius: 30px !important;
}

a {
    display: flex;
    justify-content: center;
}

.button {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;

    background-color: transparent;
    font-family: var(--font-family-system);
    font-weight: 500;
    cursor: pointer;
    text-wrap: nowrap;

    &:not(.button-icon) {
        // min-width: $--button-min-width;
    }

    &:focus-within {
        outline: rgb(var(--c-black)) auto 1px;
    }
}

.button-primary {
    color: $--button-primary-color;
    background-color: $--button-primary-bg-color;
    border: none;
    &:hover:not(:disabled) {
        background-color: $--button-primary-hover-bg-color;
    }
    &:active:not(:disabled) {
        background-color: $--button-primary-pressed-bg-color;
    }
}

.button-secondary {
    color: $--button-secondary-color;
    background-color: $--button-secondary-bg-color;
    border: none;
    &:hover:not(:disabled) {
        background-color: $--button-secondary-hover-bg-color;
    }
    &:active:not(:disabled) {
        background-color: $--button-secondary-pressed-bg-color;
    }
}

.button-outline {
    border: 1px solid $--button-outline-border-color;
    color: $--button-outline-color;
    background-color: $--button-outline-bg-color;
    &:hover:not(:disabled) {
        background-color: $--button-outline-hover-bg-color;
    }
    &:active:not(:disabled) {
        background-color: $--button-outline-pressed-bg-color;
    }
}

.button-icon {
    padding: $--button-icon-padding !important;
    color: $--button-icon-color;
    background-color: transparent;
    border: none;
}

.button:disabled {
    cursor: not-allowed;
    opacity: 0.56;
}

.button-red-colorscheme {
    color: $--button-red-colorscheme-color;
    background-color: $--button-red-colorscheme-bg-color;
    border: none;
    &:hover:not(:disabled) {
        background-color: $--button-red-colorscheme-hover-bg-color;
    }
    &:active:not(:disabled) {
        background-color: $--button-red-colorscheme-pressed-bg-color;
    }
}

/* Style tooltip */
.tooltip {
    display: none;
    z-index: 15;

    padding: 4px;
    border-radius: 2px;

    @include font(12);
    text-wrap: nowrap;

    color: $--tooltip-color;
    background-color: $--tooltip-bg-color;

    &.tooltip-down {
        @include centerAbsolute();
        top: 56px;
    }

    &.tooltip-up {
        position: absolute;
        bottom: 32px;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    &.tooltip-left {
        position: absolute;
        right: 52px;
    }

    &.tooltip-right {
        position: absolute;
        left: 52px;
    }
}

a:hover + .tooltip {
    display: flex;
}
</style>
