<script setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { computed, onMounted, ref, useSlots, watch } from 'vue';

import { useDateFormatStore } from '@/stores';
import { InputSize, InputWidth } from '@/styles/types';

const props = defineProps({
    locale: {
        type: String,
        default: 'vi'
    },
    cancelText: {
        type: String,
        default: 'Hủy'
    },
    selectText: {
        type: String,
        default: 'Chọn'
    },
    nowButtonLabel: {
        type: String,
        default: 'Hôm nay'
    },

    size: {
        type: String,
        default: InputSize.Medium,
        validator(val) {
            return Object.values(InputSize).includes(val);
        }
    },
    width: {
        type: String,
        default: InputWidth.Medium,
        validator(val) {
            return Object.values(InputWidth).includes(val);
        }
    },
    id: {
        type: String,
        required: true
    },
    label: String,
    title: String,
    placeholder: String,
    modelValue: [Date, String],
    required: Boolean,
    minLength: Number,
    maxLength: Number,
    focus: Boolean,
    disabled: Boolean,
    pattern: RegExp,
    errMsgs: Object,
    showError: Boolean,
    formStore: Object,
    class: String
});

const emit = defineEmits(['update:model-value']);

const DateFormat = useDateFormatStore();

const modelValue = ref(
    props.modelValue instanceof String ? new Date(props.modelValue) : props.modelValue
);

watch(modelValue, () => {
    console.log(modelValue.value);
    emit('update:model-value', modelValue.value);
});

/**
 * Biến hasIcon kiểm tra xem Textfield có icon không.
 * Nếu có, thêm class 'has-icon' cho input tag.
 */
const slots = useSlots();
const hasIcon = slots.icon;

const inputRef = ref(null);
const inputValue = ref(props.modelValue);

/**
 * Khi mounted, nếu field có prop firstFocus, focus và select input text
 * Created by: ttanh (20/08/2023)
 * Modified by: ttanh (27/09/2023)
 */
onMounted(() => {
    if (props.focus) inputRef.value.focus();
    if (props.formStore && props.required && !props.modelValue)
        props.formStore.addError(props.id, props.errMsgs.empty);
});

const selectInputText = () => {
    inputRef.value.select();
};

/**
 * === CHỨC NĂNG VALIDATE INPUT ===
 */
watch(inputValue, () => {
    if (!props.formStore) return;
    if (props.required && (!inputValue.value || !inputValue.value.trim())) {
        props.formStore.addError(props.id, props.errMsgs.empty);
    } else if (props.pattern && !props.pattern.test(inputValue.value)) {
        props.formStore.addError(props.id, props.errMsgs.invalid);
    } else if (inputValue.value && inputValue.value.length < props.minLength) {
        props.formStore.addError(props.id, props.errMsgs.minLength);
    } else if (inputValue.value && inputValue.value.length === props.maxLength) {
        props.formStore.addError(props.id, props.errMsgs.maxLength);
    } else props.formStore.removeError(props.id);
});

// Flag kiểm tra khi độ dài input text lớn hơn width
const isOverflowInput = ref(false);

const allowShowError = ref(props.showError);

/**
 * Emit dữ liệu input.
 * Khi input được nhập, hiển thị errorMessage nếu input trống hoặc không hợp lệ.
 * Created by: ttanh (12/08/2023)
 */
const handleInput = (event) => {
    allowShowError.value = true;

    if (props.maxLength && event.target.value.length > props.maxLength) {
        event.target.value = event.target.value.substring(0, props.maxLength);
    }

    emit('update:model-value', event.target.value);
    inputValue.value = String(event.target.value);

    // nếu input vượt quá width, gán isOverflowInput = true để hiển thị tooltip khi hover.
    if (inputRef.value.scrollWidth > inputRef.value.clientWidth) isOverflowInput.value = true;
    else isOverflowInput.value = false;
};

const errorMessage = computed(() => {
    const error = props.formStore ? props.formStore.getError(props.id) : null;
    return error ? error.message : '';
});

const isShowErrorMessage = ref(false);

/**
 * Dựa vào props size và width được truyền vào,
 * gán custom class để style cho mỗi size và width của input tương ứng.
 */
const inputGroupClass = computed(() => ['input-group', `input-width-${props.width}`]);
const inputClass = computed(() => [
    `input-${props.size}`,
    `input-width-${props.width}`,
    { 'input-has-icon': hasIcon },
    { 'input-error': errorMessage.value && allowShowError.value },
    { 'input-overflow': isOverflowInput.value },
    props.class
]);
</script>

<template>
    <div
        class="textfield"
        @mouseenter="isShowErrorMessage = Boolean(errorMessage) && allowShowError"
        @mouseleave="isShowErrorMessage = false"
    >
        <div class="label-group" v-if="label">
            <label :for="id" :title="title">
                {{ label }}
            </label>
            <span class="required-mark" v-if="required">&nbsp;*</span>
        </div>
        <div :class="inputGroupClass">
            <!-- <input
                type="text"
                :id="id"
                :placeholder="placeholder"
                :disabled="disabled"
                :class="inputClass"
                :value="inputValue"
                @input="handleInput($event)"
                @focus="selectInputText"
                ref="inputRef"
            /> -->
            <VueDatePicker
                :locale="locale"
                :enable-time-picker="false"
                month-name-format="long"
                :cancelText="cancelText"
                :selectText="selectText"
                :action-row="{ showNow: true }"
                :now-button-label="nowButtonLabel"
                :day-names="['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']"
                :format="DateFormat.current"
                v-model="modelValue"
                :disabled="disabled"
            />
            <div class="icon" v-if="hasIcon">
                <slot name="icon"></slot>
            </div>
        </div>
        <span class="tooltip" v-if="isShowErrorMessage || isOverflowInput">
            {{ errorMessage ? errorMessage : inputValue }}
        </span>
    </div>
</template>

<style>
@import '@/styles/components/datepicker.scss';
</style>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';
@import '@/styles/components/input.scss';

$--input-padding-x: 10px;

.textfield {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.input-small {
    height: $--input-small-height;
    padding: $--input-small-padding-y $--input-padding-x;
}
.input-medium {
    height: $--input-medium-height;
    padding: $--input-medium-padding-y $--input-padding-x;
}
.input-large {
    height: $--input-large-height;
    padding: $--input-large-padding-y $--input-padding-x;
}

.input-group {
    position: relative;
    input {
        @include font(13);
        font-family: var(--font-family-system);
        text-overflow: ellipsis;

        border-radius: 2px;
        border: 1px solid $--input-border-color;
        outline: none;

        &::placeholder {
            @include font(13);
            color: $--input-placeholder-color;
        }
        &.input-error {
            border-color: $--input-error-border-color !important;
            &:hover,
            &:focus {
                border-color: $--input-error-border-color !important;
            }
        }

        &:not(.input-error):hover {
            background-color: $--input-hover-bg-color;
        }

        &:not(.input-error):focus {
            border-color: rgb(var(--c-primary));
        }

        &:disabled {
            color: rgb(var(--c-black));
        }

        &.input-has-icon {
            padding-right: 32px;
        }
    }

    .icon {
        @include size(20px);
        position: absolute;
        top: 50%;
        right: 8px;
        transform: translateY(-50%);
    }
}

.currency-cell {
    text-align: right !important;
}
</style>
