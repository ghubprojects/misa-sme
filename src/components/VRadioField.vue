<script setup>
import { computed, provide, ref } from 'vue';
const props = defineProps({
    width: {
        type: String,
        default: 'medium',
        validator(val) {
            return ['extra-large', 'large', 'medium', 'small', 'extra-small'].includes(val);
        }
    },
    legend: String,
    disabled: Boolean,
    required: Boolean,
    defaultValue: {
        type: Number,
        required: true
    }
});

// Biến lưu trữ giá trị input.
const inputValue = ref('');

// Check empty input
const isEmpty = computed(() => {
    return props.required ? !inputValue.value || !inputValue.value.trim() : false;
});

// Check invalid input
const isInvalid = computed(() => {
    return props.pattern && !props.pattern.test(inputValue.value);
});

// Thông báo lỗi tương ứng với isEmpty / isInvalid
const errorMessage = computed(() => {
    if (isEmpty.value) {
        return props.errMsgs.isEmpty;
    } else if (isInvalid.value) {
        return props.errMsgs.isInvalid;
    } else {
        return '';
    }
});

// đặt giá trị mặc định cho radio button
provide('defaultValue', props.defaultValue);
</script>

<template>
    <div :class="['radiofield', `radiofield-width-${width}`]">
        <div class="legend-group" v-if="legend">
            <legend>
                {{ legend }}
            </legend>
            <span class="required-mark" v-if="required">&nbsp;*</span>
        </div>
        <div class="input-group">
            <slot name="input-group"></slot>
        </div>
        <span class="error-message" v-if="isInvalid">{{ errorMessage }}</span>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

$--label-color: rgb(var(--c-gray-900));
$--label-required-mark-color: rgb(var(--c-red-500));

$--input-small-height: 32px;
$--input-small-padding-y: 6px;

$--input-medium-height: 36px;
$--input-medium-padding-y: 8px;

$--input-large-height: 40px;
$--input-large-padding-y: 10px;

$--input-padding-x: 12px;
$--input-border-color: rgb(var(--c-gray-300));
$--input-placeholder-color: rgb(var(--c-gray-500));
$--input-hover-bg-color: rgb(var(--c-gray-100));
$--input-error-border-color: rgb(var(--c-red-500));

$--error-message-color: rgb(var(--c-white));
$--error-message-bg-color: rgb(var(--c-gray-900));

.radiofield {
    width: 200px;
    display: flex;
    flex-direction: column;
    & > .input-group {
        display: flex;
        gap: 8px;
        justify-content: space-between;
    }
}

.legend-group {
    margin-bottom: 8px;
    legend {
        @include font(13, 500);
        color: $--label-color;
    }
    .required-mark {
        color: $--label-required-mark-color;
    }
}

.input-group {
    height: 100%;
}

/* Style error message */
.error-message {
    position: absolute;
    left: 16px;
    bottom: -16px;
    display: none;

    @include font(12);
    padding: 4px;
    border-radius: 2px;
    color: $--error-message-color;
    background-color: $--error-message-bg-color;

    .input-group:has(.input-error:hover) + & {
        display: flex;
    }
}

/* === Size of input ===*/
.input-size-large {
    height: 40px;
}
.input-size-medium {
    height: 36px;
}
.input-size-small {
    height: 32px;
}

/* === Width of input === */
.radiofield-width-extra-large {
    width: 250px;
}
.radiofield-width-large {
    width: 200px;
}
.radiofield-width-medium {
    width: 180px;
}
.radiofield-width-small {
    width: 150px;
}
.radiofield-width-extra-small {
    width: 120px;
}
</style>
