<script setup>
import { InputSize, InputWidth } from '@/styles/types';
import { computed, ref, useSlots, watch } from 'vue';
import VIcon from './VIcon.vue';

const props = defineProps({
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
    placeholder: String,
    options: {
        type: Array,
        required: true
    },
    modelValue: {
        type: [String, Number, Boolean, null],
        default: null,
        required: true
    },
    required: Boolean,
    disabled: Boolean,
    class: String
});

const emit = defineEmits(['update:modelValue']);

const selectedValue = ref(props.modelValue);

// Biến lưu trữ trạng thái đóng mở dropdown
const isOpening = ref(false);
const isShow = ref(false);
const direction = ref('down');

const dropdownListRef = ref(null);

/**
 * Khi mở dropdown, lấy tọa độ dưới của dropdown menu và bảng dữ liệu,
 * nếu tọa độ dropdown > tọa độ bảng, hiển thị menu theo hướng lên trên
 * ngược lại, hiển thị menu theo hướng xuống dưới.
 * Created by: ttanh (20/9/2023)
 */
watch([isOpening], () => {
    if (
        dropdownListRef.value.getBoundingClientRect().bottom + 183 >
        document.documentElement.getBoundingClientRect().bottom - 20
    )
        direction.value = 'up';
    else direction.value = 'down';

    isShow.value = isOpening.value;
});

// lưu option khi click vào dropdown menu
const hanldleSelectOption = (option) => {
    selectedValue.value = option;
    isOpening.value = false;
    isShow.value = false;
    emit('update:modelValue', selectedValue.value);
    console.log(selectedValue.value);
};

watch(
    () => props.disabled,
    () => {
        selectedValue.value = props.disabled ? null : props.modelValue;
        emit('update:modelValue', selectedValue.value);
    }
);

/**
 * Ẩn dropdown menu
 * Created by: ttanh (08/10/2023)
 */
const hideDropdownMenu = () => {
    isOpening.value = false;
    isShow.value = false;
};

// // khi click ra ngoài document, đóng dropdown options.
// onMounted(() => document.addEventListener('click', hideDropdownMenu));

// // khi unmount, loại bỏ sự kiện click khỏi đối tượng document.
// onBeforeUnmount(() => document.removeEventListener('click', hideDropdownMenu));

/**
 * === COMPONENT STYLE ===
 */

/**
 * Biến hasIcon kiểm tra xem Textfield có icon không.
 * Nếu có, thêm class 'has-icon' cho input tag.
 */
const slots = useSlots();
const hasLabel = slots.label;

const inputClass = computed(() => [
    `input-${props.size}`,
    `input-width-${props.width}`,
    'input-has-icon'
]);

const dropdownMenuClass = computed(() => {
    return ['dropdown-menu', direction.value === 'up' && `position-up-${props.size}`];
});
</script>

<template>
    <div :class="['dropdown-list', props.class]" ref="dropdownListRef">
        <div class="label-group" v-if="hasLabel">
            <label :for="id">
                <slot name="label"></slot>
            </label>
            <span class="required-mark" v-if="required">&nbsp;*</span>
        </div>

        <div class="input-group" @click="isOpening = !isOpening">
            <input
                type="text"
                :id="id"
                :placeholder="placeholder"
                :disabled="disabled"
                :class="inputClass"
                :value="disabled ? null : selectedValue"
                @change="hanldleSelectOption"
                readonly
            />
            <div class="icon-arrow-down">
                <VIcon class="arrow-down-img" />
            </div>
        </div>

        <div v-if="isShow" :class="dropdownMenuClass">
            <div
                v-for="(option, index) in options"
                :key="index"
                :class="['dropdown-item', { selected: selectedValue === option }]"
                @click="hanldleSelectOption(option)"
            >
                {{ option }}
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';
@import '@/styles/components/input.scss';
@import '@/styles/components/dropdown.scss';

$--input-padding-x: 10px;

.dropdown-list {
    position: relative;
    cursor: pointer;
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

.label-group {
    margin-bottom: 8px;
    label {
        @include font(13, 500);
        color: $--label-color;
    }
    .required-mark {
        color: $--label-required-mark-color;
    }
}

.input-group {
    position: relative;
    input {
        @include font(13);
        font-family: var(--font-family-system);

        border-radius: 2px;
        border: 1px solid $--input-border-color;
        outline: none;
        cursor: pointer;

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
            background-color: rgb(var(--c-gray-200));
        }

        &.input-has-icon {
            padding-right: 28px;
        }
    }
    .icon-arrow-down {
        position: relative;
        @include size(14px);
        filter: brightness(0);
        transform: rotate(90deg) translateX(-50%) scale(0.8);

        position: absolute;
        top: 50%;
        right: 8px;
        cursor: pointer;
        .arrow-down-img {
            width: 8px;
            height: 14px;
            background-position: -84px -361px;
        }
    }
}
.position-up-large {
    bottom: $--input-large-height;
}
.position-up-medium {
    bottom: $--input-medium-height;
}
.position-up-small {
    bottom: $--input-small-height;
}
</style>
