<script setup>
import { InputSize, InputWidth } from '@/styles/types';
import { computed, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue';
import VIcon from './VIcon.vue';

const props = defineProps({
    type: {
        type: String,
        default: 'Options',
        validator(val) {
            return ['Options', 'Table'].includes(val);
        }
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
    modelValue: {
        type: [String, Object, Number]
    },
    items: {
        type: Array
    },
    tableInfo: {
        type: Object
    },
    required: Boolean,
    maxLength: Number,
    focus: Boolean,
    disabled: Boolean,
    pattern: RegExp,
    errMsgs: Object,
    showError: Boolean,
    formStore: Object,
    class: String
});

const emit = defineEmits(['update:modelValue']);

const gradeField = 'grade';
const isParentField = 'is_parent';
const parentIDField = 'parent_id';

const filteredItems = ref(
    props.type === 'Table' ? props.tableInfo.dataStore.data.Data : props.items
);

const inputRef = ref(null);
const selectedValue = ref(props.modelValue);
const selectedRow = ref(
    props.tableInfo && props.tableInfo.dataStore.data.Data
        ? props.tableInfo.dataStore.data.Data.find(
              (item) => item[props.tableInfo.primaryField] === selectedValue.value
          )
        : null
);

const currentIndex = computed(() => {
    let index;
    switch (props.type) {
        case 'Options':
            index = filteredItems.value.indexOf(selectedValue.value);
            break;
        case 'Table':
            index = filteredItems.value.indexOf(selectedRow.value);
            break;
    }
    console.log(index);
    return index;
});

const isShowDropdown = ref(false);
const allowShowError = ref(props.showError);

watch(selectedValue, () => {
    switch (props.type) {
        case 'Options':
            if (!selectedValue.value.trim()) {
                filteredItems.value = props.items;
            }

            filteredItems.value = props.items.filter((item) =>
                item.toLowerCase().includes(selectedValue.value.toLowerCase())
            );
            break;
        case 'Table':
            if (!selectedValue.value.trim())
                filteredItems.value = props.tableInfo.dataStore.data.Data;

            if (props.tableInfo.dataStore.data.Data.length > 0)
                filteredItems.value = props.tableInfo.dataStore.data.Data.filter((item) => {
                    return item[props.tableInfo.primaryField]
                        .toLowerCase()
                        .includes(selectedValue.value.toLowerCase());
                });
            break;
    }
});

/**
 * Khi mounted, lấy dữ liệu đơn vị và nếu field có prop firstFocus, focus và select input text
 */
onMounted(() => {
    if (props.focus) inputRef.value.select();
    if (props.formStore && props.required && !props.value)
        props.formStore.addError(props.id, props.errMsgs.empty);
});

/**
 * Click ra ngoài sẽ đóng dropdown
 */
const showDropdown = () => (isShowDropdown.value = true);
const closeDropdown = () => (isShowDropdown.value = false);
onMounted(() => document.addEventListener('click', closeDropdown));
onBeforeUnmount(() => document.removeEventListener('click', closeDropdown));

/**
 * Hiện dropdown items khi focus vào input hoặc click expand button
 * @param {event} event
 * Created by: ttanh (09/09/2023)
 */
const toggleShowItemList = (event) => {
    event.stopPropagation();
    isShowDropdown.value = !isShowDropdown.value;
};

/**
 * Xử lý chọn item và đóng dropdown
 * @param {string} item
 * Created by: ttanh (26/09/2023)
 */
const handleSelectItem = (item) => {
    switch (props.type) {
        case 'Options':
            selectedValue.value = item;
            console.log('select:', item);
            emit('update:modelValue', item);
            break;
        case 'Table':
            selectedValue.value = item[props.tableInfo.primaryField];
            console.log('select:', item);
            emit('update:modelValue', item);
            break;
        default:
            break;
    }

    closeDropdown();
};

/**
 * Two-way binding và hiện dropdown
 * @param {event} event
 * Created by: ttanh (26/09/2023)
 */
const handleInput = () => {
    allowShowError.value = true;
    selectedValue.value = inputRef.value.value;
    showDropdown();
};

/**
 * === CHỨC NĂNG VALIDATE INPUT ===
 */
watch(selectedValue, () => {
    if (!props.formStore) return;
    if (props.required && (!selectedValue.value || !selectedValue.value.trim())) {
        props.formStore.addError(props.id, props.errMsgs.empty);
    } else if (selectedValue.value && filteredItems.value.length <= 0) {
        props.formStore.addError(props.id, props.errMsgs.invalid);
    } else props.formStore.removeError(props.id);
});

const errorMessage = computed(() => {
    const error = props.formStore ? props.formStore.getError(props.id) : null;
    return error ? error.message : '';
});

const isShowErrorMessage = ref(false);

/**
 * === XỬ LÝ PHÍM TẮT ===
 * @param {event} event
 */

/**
 * Xử lý lựa chọn item bằng bàn phím
 * @param {event} event
 * Created by: ttanh (28/09/2023)
 * Modified by: ttanh (29/09/2023)
 */
const handleSelectItemByKeyboard = (event) => {
    if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
        event.preventDefault();
        if (isShowDropdown.value) {
            if (event.code === 'ArrowUp') {
                currentIndex.value =
                    currentIndex.value > 0
                        ? currentIndex.value - 1
                        : filteredItems.value.length - 1;
            } else if (event.code === 'ArrowDown') {
                currentIndex.value =
                    currentIndex.value < filteredItems.value.length - 1
                        ? currentIndex.value + 1
                        : 0;
            }
        }
    } else if (event.code === 'Enter') {
        event.preventDefault();
        if (!isShowDropdown.value) toggleShowItemList(event);
        else handleSelectItem(filteredItems.value[currentIndex.value]);
    }
};

/**
 * === COMPONENT STYLE ===
 */
const inputClass = computed(() => [
    `input-${props.size}`,
    `input-width-${props.width}`,
    { 'input-error': errorMessage.value && allowShowError.value },
    props.class
]);
</script>

<template>
    <div
        class="combobox"
        @mouseenter="isShowErrorMessage = Boolean(errorMessage) && allowShowError"
        @mouseleave="isShowErrorMessage = false"
        @keydown="handleSelectItemByKeyboard"
    >
        <div class="label-group" v-if="label">
            <label :for="id">
                {{ label }}
            </label>
            <span class="required-mark" v-if="required">&nbsp;*</span>
        </div>

        <div class="input-group" @click="toggleShowItemList">
            <input
                type="text"
                :id="id"
                :placeholder="placeholder"
                :disabled="disabled"
                :class="inputClass"
                :value="selectedValue"
                @input="handleInput"
                @focus="inputRef.select"
                ref="inputRef"
            />

            <div class="expand-button" @click="inputRef.select">
                <div class="icon-arrow-down">
                    <VIcon class="arrow-down-img" />
                </div>
            </div>
        </div>

        <span v-if="isShowErrorMessage" class="tooltip">
            {{ errorMessage }}
        </span>

        <div v-if="type === 'Options' && isShowDropdown && items.length > 0" class="dropdown-menu">
            <div
                v-for="(item, index) in filteredItems"
                :key="index"
                :class="['dropdown-item', { selected: currentIndex === index }]"
                @click="handleSelectItem(item)"
            >
                {{ item }}
            </div>
            <div v-if="filteredItems.length <= 0" class="dropdown-item">
                Không có dữ liệu hiển thị.
            </div>
        </div>

        <div v-if="type === 'Table' && isShowDropdown" class="dropdown-menu">
            <table>
                <thead>
                    <tr>
                        <th
                            v-for="(column, index) in tableInfo.columns"
                            :key="index"
                            :title="column.title"
                        >
                            <div
                                v-if="column.field"
                                class="cell-data"
                                :style="[
                                    tableInfo.columns[index].width
                                        ? `width: ${tableInfo.columns[index].width}px`
                                        : 'width: 100%',
                                    `min-width: ${tableInfo.columns[index].minWidth}px`
                                ]"
                            >
                                <p style="width: inherit">{{ column.title }}</p>
                            </div>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <div v-if="filteredItems.length <= 0" class="dropdown-item no-data">
                        Không có dữ liệu hiển thị.
                    </div>
                    <tr
                        v-for="(item, index) in filteredItems"
                        :key="index"
                        :class="{
                            'selected-row': currentIndex === index,
                            'parent-row': item[isParentField]
                        }"
                        @click="handleSelectItem(item)"
                    >
                        <td v-for="(column, index) in tableInfo.columns" :key="index">
                            <div class="cell-data">
                                <span> {{ item[column.field] }} </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';
@import '@/styles/components/input.scss';
@import '@/styles/components/dropdown.scss';

$--input-padding-left: 10px;
$--input-padding-right: 44px;

.combobox {
    position: relative;
    cursor: pointer;
}

.input-small {
    height: $--input-small-height;
    padding: $--input-small-padding-y $--input-padding-right $--input-small-padding-y
        $--input-padding-left;
}

.input-medium {
    height: $--input-medium-height;
    padding: $--input-medium-padding-y $--input-padding-right $--input-medium-padding-y
        $--input-padding-left;
}

.input-large {
    height: $--input-large-height;
    padding: $--input-medium-padding-y $--input-padding-right $--input-medium-padding-y
        $--input-padding-left;
}

.input-group {
    position: relative;
    &:focus {
        border-color: rgb(var(--c-primary));
    }
    input {
        @include font(13);
        font-family: var(--font-family-system);
        text-overflow: ellipsis;

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
            & + .expand-button {
                border-color: $--input-error-border-color !important;
            }
        }

        &:not(.input-error):hover {
            background-color: $--input-hover-bg-color;
        }

        &:not(.input-error):focus,
        &:not(.input-error):focus + .expand-button {
            border-color: rgb(var(--c-primary));
        }
    }

    .expand-button {
        position: absolute;
        top: 0;
        right: 0;

        @include size(26px);
        .icon-arrow-down {
            position: relative;
            @include size(12px);
            filter: brightness(0);
            top: 50%;
            transform: rotate(90deg) translate(-50%, -50%) scale(0.7);
            cursor: pointer;
            .arrow-down-img {
                width: 8px;
                height: 14px;
                background-position: -84px -361px;
            }
        }
    }
}

table {
    @include font(13);
    width: 100%;
    border-spacing: 0px;
    thead {
        position: sticky;
        top: 0;
        z-index: 10;
        background-color: rgb(var(--c-gray-200));
    }
    tbody {
        position: relative;
        z-index: 0;

        .no-data-image {
            position: fixed;
            top: 50%;
            width: calc(100% - var(--sidebar-width) - var(--main-content-padding-x) * 2 - 2px);

            display: grid;
            place-items: center;
        }
    }
}

tr {
    &.selected-row > td {
        background-color: rgb(var(--c-light-green-100));
    }
    &.parent-row {
        font-weight: 700;
    }
}

th {
    padding: 6px 10px;
    text-align: left;

    height: var(--table-row-height);
    background-color: rgb(var(--c-gray-200));
}

.th-options {
    position: sticky;
    right: 0;
}

/* Table Data Row */
td {
    display: table-cell;
    padding: 0 10px;

    height: var(--table-row-height);
    background-color: rgb(var(--c-white));

    .cell-data {
        display: flex;
        gap: 6px;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}

.fixed {
    position: sticky;
    z-index: 50;
}

.td-level-1 {
    padding-left: 10px !important;
}

.td-level-2 {
    padding-left: 30px !important;
}

.td-level-3 {
    padding-left: 50px !important;
}

.td-level-4 {
    padding-left: 70px !important;
}

.td-level-5 {
    padding-left: 90px !important;
}

.td-level-6 {
    padding-left: 110px !important;
}

.td-level-7 {
    padding-left: 130px !important;
}

.td-level-8 {
    padding-left: 150px !important;
}

.td-level-9 {
    padding-left: 170px !important;
}

.td-level-10 {
    padding-left: 190px !important;
}
</style>
