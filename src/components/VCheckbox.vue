<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    id: String,
    label: String,
    modelValue: Boolean
});

const emit = defineEmits(['update:modelValue']);

const isChecked = ref(props.modelValue);

const handleChange = () => {
    emit('update:modelValue', isChecked.value);
};

watch(
    () => props.modelValue,
    (newValue) => {
        isChecked.value = newValue;
    }
);
</script>

<template>
    <div class="checkbox">
        <div class="checkbox-input">
            <input type="checkbox" :id="id" v-model="isChecked" @change="handleChange" />
            <span class="checkmark"></span>
        </div>
        <label :for="id" v-if="label">{{ label }}</label>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';
/* Styles for checkbox */
.checkbox {
    position: relative;
    display: flex;
    align-items: center;
}

/* Styles for checkbox-input */
.checkbox-input {
    position: relative;
    display: flex;
}

/* Styles for default input */
.checkbox-input > input[type='checkbox'] {
    margin: 0;
    opacity: 0;

    @include size(19px);
    z-index: 3;
    cursor: pointer;
}

/* Style for checkmark */
.checkbox-input > .checkmark {
    @include centerAbsolute('both');
    @include size(18px);
    border: 1px solid rgb(var(--c-gray-400));
    border-radius: 2px;
}

/* When input is checked, change background-color of checkmark*/
.checkbox-input > input[type='checkbox']:checked + .checkmark {
    background-color: rgb(var(--c-white));
    border: 1px solid rgb(var(--c-primary));
}

/* When input is checked, display check icon */
.checkbox-input > input[type='checkbox']:checked + .checkmark::before {
    @include centerAbsolute('both');

    content: '';
    display: block;
    transform: translate(-50%, -50%) scale(90%);

    /* Get check icon in file sprites */
    background: url('@/assets/images/sprites.svg') no-repeat -1273px -363px;
    width: 14px;
    height: 11px;
    filter: sepia(1) hue-rotate(100deg) brightness(0.5) saturate(10) grayscale(0.4);
}

/* Style for label */
.checkbox label {
    display: inline-block;
    position: relative;
    padding-left: 8px;
    cursor: pointer;
    -webkit-user-select: none;
    user-select: none;
}
</style>
