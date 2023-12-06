<script setup>
import { storeToRefs } from 'pinia';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { useDebounce } from '@/composables';
import { useLanguageStore } from '@/stores';

import { IconExpandMore, IconSearch } from '@/assets/icons';
import { ButtonResources } from '@/resources';
import { ButtonSize, ButtonStyle, InputSize, InputWidth } from '@/styles/types';

const props = defineProps({
    columnsInfo: {
        type: Object,
        required: true
    },
    idField: {
        type: String,
        required: true
    },
    primaryField: {
        type: String,
        required: true
    },
    searchbarPlaceholder: {
        type: String
    },
    dataStore: {
        type: Object,
        required: true
    },
    formStore: {
        type: Object
    },
    loadData: {
        type: Boolean
    },
    classes: {
        type: Array,
        default: () => []
    },
    primaryRowOption: {
        type: Object
    },
    otherRowOptions: {
        type: Array
    }
});

const LanguageStore = useLanguageStore();
const { current: lang } = storeToRefs(LanguageStore);

const isLoading = ref(false);
const gradeField = 'grade';
const isParentField = 'is_parent';
const parentIDField = 'parent_id';

const primaryOption = computed(() => props.primaryRowOption);
const otherOptions = computed(() => props.otherRowOptions);

/**
 * === XỬ LÝ LẤY DANH SÁCH NHÂN VIÊN TỪ API ===
 */

const columns = ref([...props.columnsInfo]);
const { data, selectedItem, reloadData } = storeToRefs(props.dataStore);
const dataList = computed(() => data.value.Data ?? []);

const searchText = ref('');
const isFocusSearchInput = ref(false);

const loadData = async () => {
    try {
        isLoading.value = true;
        await props.dataStore.getAllAsync(searchText.value, null, null);
        isLoading.value = false;
        reloadData.value = false;
    } catch (error) {
        isLoading.value = false;
        console.log(error);
    }
};

// Load dữ liệu khi được mount
onMounted(loadData);

watch(reloadData, () => {
    if (reloadData.value) loadData();
});

/**
 * === THANH TÌM KIẾM ===
 */

/**
 * Sử dụng debouncing để tối ưu gọi API khi thay đổi từ khóa tìm kiếm
 */
const debouncedSearch = useDebounce(loadData, 500);
watch(searchText, () => {
    debouncedSearch(searchText.value);
    isFocusSearchInput.value = false;
});

/**
 * === EXPAND / COLLAPSE ===
 */
const expandedNodes = ref([]); // Mảng chứa ID các nút đã được mở rộng

// Mảng chứa ID các nút có thể mở rộng
const expandableNodes = computed(() =>
    dataList.value.filter((node) => node[isParentField] === true)
);

/**
 * Trả về true nếu tất cả các node có thể mở rộng đều đã được mở rộng, ngược lại trả về false.
 * Created by: ttanh (19/10/2023)
 */
const isAllExpanded = computed(() => expandableNodes.value.length === expandedNodes.value.length);

const toggleExpandNode = (nodeId) => {
    if (expandedNodes.value.includes(nodeId)) {
        // Nếu nodeId đã được mở rộng, thì loại bỏ nó
        expandedNodes.value = expandedNodes.value.filter((id) => id !== nodeId);
    } else {
        // Nếu nodeId chưa được mở rộng, thêm nó vào danh sách
        expandedNodes.value.push(nodeId);
    }
};

const findNodeExpansion = (nodeId) => {
    return expandedNodes.value.includes(nodeId);
};

/**
 * Mở rộng hoặc thu gọn tất cả các node mà có thể mở rộng.
 * Created by: ttanh (19/10/2023)
 */
const toggleExpandAll = () => {
    if (isAllExpanded.value) expandedNodes.value = [];
    else expandedNodes.value = expandableNodes.value.map((node) => node[props.idField]);
};

/**
 * Trả về một danh sách đã sắp xếp theo thuộc tính "AccountNumber".
 * Created by: ttanh (19/10/2023)
 */
const sortedData = computed(() => {
    return [...dataList.value].sort((a, b) =>
        a[props.primaryField].localeCompare(b[props.primaryField])
    );
});

/**
 * Trả về danh sách dữ liệu đã lọc dựa trên điều kiện của mỗi node.
 * Nếu node có grade là 1, nó sẽ được hiển thị,
 * ngược lại, node sẽ hiển thị nếu node cha của nó đã được mở rộng.
 * Created by: ttanh (19/10/2023)
 */
const filteredData = computed(() => {
    return sortedData.value.filter((node) => {
        if (node[gradeField] === 1) {
            return true;
        } else {
            return expandedNodes.value.includes(node[parentIDField]);
        }
    });
});

/**
 * Định dạng lại dữ liệu hiển thị trên bảng
 * @param {*} data
 * @param {*} column
 */
const formatDataCell = (data, column) => {
    if (data[column.field] === null || data[column.field] === undefined) {
        return '';
    } else if (column.formatData) {
        return column.formatData(data[column.field]);
    } else return data[column.field];
};

/**
 * === XỬ LÝ EXPAND DROPDOWN OPTIONS ===
 */

const isShowOptions = ref(false);

const close = () => (isShowOptions.value = false);

// khi click ra ngoài document, đóng dropdown options.
onMounted(() => document.addEventListener('click', close));

// khi unmount, loại bỏ sự kiện click khỏi đối tượng document.
onBeforeUnmount(() => document.removeEventListener('click', close));

const handleClickOption = (option) => {
    option.method();
    isShowOptions.value = false;
};

/**
 * SELECT ROW
 */
const blurSelectRow = () => (selectedItem.value = {});

onMounted(() => document.addEventListener('click', blurSelectRow));
onBeforeUnmount(() => document.removeEventListener('click', blurSelectRow));

/**
 * === RESIZE TABLE CELL ===
 */
const resizingColumnIndex = ref(null);
const startX = ref(null);

/**
 * Khi mousedown tại viền phải của table heading
 * Created by: ttanh (03/10/2023)
 */
const startResize = (event, columnIndex) => {
    resizingColumnIndex.value = columnIndex;
    startX.value = event.clientX;
};

/**
 * Khi mousedown và di chuyển chuột để resize cột
 * @param {event} event
 * Created by: ttanh (03/10/2023)
 */
const onMouseMove = (event) => {
    if (resizingColumnIndex.value) {
        const deltaX = event.clientX - startX.value;
        const newWidth = columns.value[resizingColumnIndex.value].width + deltaX;

        if (newWidth > columns.value[resizingColumnIndex.value].minWidth) {
            // Minimum column width
            columns.value[resizingColumnIndex.value].width = newWidth;
            startX.value = event.clientX;
        }
    }
};

/**
 * Khi mouseup, kết thúc resize
 * Created by: ttanh (03/10/2023)
 */
const stopResize = () => {
    resizingColumnIndex.value = null;
};

// Khi mounted, thêm event listener
onMounted(() => document.addEventListener('mouseup', stopResize));

// Trước khi unmount, loại bỏ event listener
onBeforeUnmount(() => document.removeEventListener('mouseup', stopResize));

/**
 * === XỬ LÝ PHÍM TẮT ===
 */

/**
 * Khi ấn phím CTRL F3, thực hiện focus vào input tìm kiếm
 * @param {event} event
 * Created by: ttanh (08/10/2023)
 */
const handleKeyDownTable = async (event) => {
    if (event.ctrlKey && event.code === 'F3') {
        event.preventDefault();
        isFocusSearchInput.value = true;
        // } else if (event.code === 'Delete') {
        //     event.preventDefault();
        //     const checkedEmployees = Employee.getPageCheckIds(Table.currentPage);
        //     if (checkedEmployees.length === 1) {
        //         try {
        //             const result = await Employee.getByIdAsync(checkedEmployees[0]);
        //             if (result.Succeeded) {
        //                 Employee.current = result.Data;
        //                 handleShowDeleteEmployeeDialog();
        //             }
        //         } catch (err) {
        //             console.log(err);
        //         }
        //     } else if (checkedEmployees.length > 1) {
        //         handleShowBulkDeleteDialog();
        //     }
        // } else if (event.code === 'Enter') {
        //     event.preventDefault();
        //     const checkedEmployees = Employee.getPageCheckIds(Table.currentPage);
        //     if (checkedEmployees.length === 1) {
        //         try {
        //             const result = await Employee.getByIdAsync(checkedEmployees[0]);
        //             if (result.Succeeded) {
        //                 Employee.current = result.Data;
        //                 handleShowEmployeeDetails(Employee.current);
        //             }
        //         } catch (err) {
        //             console.log(err);
        //         }
        //     }
    }
};

// Khi mounted, thêm event listener
onMounted(() => {
    document.addEventListener('keydown', handleKeyDownTable);
});

// Khi unMounted, thêm event listener
onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeyDownTable);
});
</script>

<template>
    <div
        id="data-table"
        :class="[{ 'not-allowed-cursor': isLoading }, ...classes]"
        @keydown.stop="handleKeyDownTable"
    >
        <!-- Header của bảng dữ liệu -->
        <div class="data-table-header">
            <!-- Thanh tìm kiếm -->
            <VTextField
                :size="InputSize.Medium"
                :width="InputWidth.ExtraLarge"
                v-model="searchText"
                id="search-input"
                class="search-input"
                :placeholder="searchbarPlaceholder"
                :maxLength="100"
                :focus="isFocusSearchInput"
                :tooltip="false"
            >
                <template #icon>
                    <IconSearch class="search-icon" />
                </template>
            </VTextField>

            <!-- Các công cụ thao tác với bảng (mở rộng, xuất khẩu excel, reload,...) -->
            <div class="tools">
                <span class="toggle-expand-all-button" @click="toggleExpandAll">
                    {{ isAllExpanded ? 'Thu gọn' : 'Mở rộng' }}
                </span>

                <!-- Button lấy lại dữ liệu -->
                <VButton
                    :style="ButtonStyle.Icon"
                    :size="ButtonSize.Small"
                    :tooltip="ButtonResources[lang].ReloadTooltip"
                    class="reload-button"
                    @click="loadData"
                >
                    <div class="icon-reload">
                        <VIcon class="reload-img" />
                    </div>
                </VButton>

                <VButton :size="ButtonSize.Medium" borderRadius @click="formStore.create">
                    Thêm
                </VButton>
            </div>
        </div>

        <VLoading v-if="isLoading" />
        <!-- Bảng dữ liệu -->
        <div v-else class="table-group">
            <table>
                <thead>
                    <tr @mousemove="onMouseMove">
                        <th
                            v-for="(column, index) in columns"
                            :key="column.field"
                            :title="column.title"
                            :class="[
                                `th-${column.field}`,
                                { 'th-options': column.field === 'Options' }
                            ]"
                        >
                            <div
                                v-if="column.field"
                                class="cell-data"
                                :style="[
                                    columns[index].width
                                        ? `width: ${columns[index].width}px`
                                        : 'width: 100%',
                                    `min-width: ${columns[index].minWidth}px`
                                ]"
                            >
                                <p style="width: inherit">{{ column.title }}</p>
                            </div>
                            <div class="resize" @mousedown="startResize($event, index)"></div>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <div v-if="!isLoading && filteredData.length <= 0" class="no-data-image">
                        <img src="src/assets/images/no-data.svg" alt="no-data-image" />
                        <p>Không có dữ liệu</p>
                    </div>
                    <tr
                        v-for="node in filteredData"
                        :key="node[idField]"
                        :class="{
                            'selected-row': selectedItem?.[idField] === node[idField],
                            'parent-row': node[isParentField],
                            'higher-elevation': selectedItem?.[idField] === node[idField]
                        }"
                        @click.capture="selectedItem = node"
                        @click.stop="selectedItem = node"
                        @dblclick="primaryOption.method(node)"
                    >
                        <td
                            v-for="column in columns"
                            :key="column.field"
                            :class="{ 'td-options': column.field === 'Options' }"
                        >
                            <div
                                v-if="column.field === primaryField"
                                :class="['cell-data', `td-level-${node[gradeField]}`]"
                            >
                                <button
                                    v-if="node[isParentField]"
                                    class="toggle-expand-button"
                                    @click="toggleExpandNode(node[idField])"
                                >
                                    <p
                                        v-if="findNodeExpansion(node[idField])"
                                        class="collapse-button"
                                    >
                                        –
                                    </p>
                                    <p v-else>+</p>
                                </button>
                                <button v-else style="visibility: hidden"></button>
                                <span> {{ formatDataCell(node, column) }} </span>
                            </div>
                            <div v-else-if="column.field === 'Options'" class="options-cell">
                                <div class="primary-option" @click="primaryOption.method">
                                    {{ primaryOption.title }}
                                </div>
                                <div class="dropdown">
                                    <IconExpandMore
                                        class="expand-more-icon"
                                        @click="isShowOptions = true"
                                    />
                                    <div
                                        v-if="
                                            isShowOptions && selectedItem[idField] === node[idField]
                                        "
                                        class="dropdown-menu"
                                    >
                                        <div
                                            v-for="(option, index) in otherOptions"
                                            :key="index"
                                            class="dropdown-menu-item"
                                            @click="handleClickOption(option)"
                                        >
                                            {{ option.title }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="cell-data">
                                <span> {{ formatDataCell(node, column) }} </span>
                            </div>
                        </td>
                    </tr>
                </tbody>

                <slot name="form"></slot>
            </table>
        </div>

        <!-- Công cụ phân trang của bảng -->
        <VTablePagination :total-record="data.TotalRecord ?? 0" :paging="false" />
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.toggle-expand-button {
    @include font(15);
    @include size(16px);

    display: grid;
    place-items: center;

    padding: 0;
    border-radius: 3px;
    border: 1px solid rgb(var(--c-gray-500));

    background: transparent;
    color: rgb(var(--c-gray-500));
    cursor: pointer;

    p {
        line-height: 1;
    }

    .collapse-button {
        margin-top: -2px;
    }
}

#data-table {
    @include font(13);
    max-height: calc(100% - 32px - 12px);
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: rgb(var(--c-white));
}

.data-table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 10px 12px;
    @include font(14);
}

.data-table-header .tools {
    display: flex;
    align-items: center;
    gap: 12px;

    .toggle-expand-all-button {
        @include font(13);
        color: rgb(var(--c-blue-600));
        cursor: pointer;
        text-wrap: nowrap;
    }

    .reload-button {
        .icon-reload {
            @include size(20px);
            transform: scale(0.9);
            .reload-img {
                width: 22px;
                height: 23px;
                background-position: -424px -201px;
            }
        }
        &:hover,
        &:active {
            .reload-img {
                width: 20px;
                height: 21px;
                background-position: -1098px -89px;
                transform: translate(-50%, -50%) scale(1.05);
            }
        }
    }

    .export-button {
        .icon-export {
            @include size(20px);
            transform: scale(0.9);
            .export-img {
                width: 23px;
                height: 20px;
                background-position: -705px -202px;
            }
        }
        &:hover,
        &:active {
            .export-img {
                width: 23px;
                height: 20px;
                background-position: -1265px -90px;
            }
        }
    }
}

.table-group {
    height: 100%;
    border: 1px solid rgb(var(--c-gray-300));
    border-bottom: 0;
    background-color: rgb(var(--c-white));
    overflow: auto;
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
    position: relative;
    &.selected-row > td {
        background-color: rgb(var(--c-light-green-100));
    }
    &.parent-row {
        font-weight: 700;
    }
    &.higher-elevation {
        z-index: 20;
    }
}

th {
    padding: 6px 10px;

    height: var(--table-row-height);
    background-color: rgb(var(--c-gray-200));

    border: 1px solid rgb(var(--c-gray-300));
    border-width: 0 1px 1px 0;

    .resize {
        width: 6px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        cursor: col-resize;
        resize: both;
    }
}

.th-options {
    position: sticky;
    right: 0;
    border-width: 0 0 1px 1px;
}

/* Table Data Row */
td {
    display: table-cell;
    padding: 0 10px;

    height: var(--table-row-height);
    background-color: rgb(var(--c-white));

    border-style: solid;
    border-color: rgb(var(--c-gray-300));
    border-width: 0 1px 1px 0;
    &.td-date-of-birth {
        text-align: center;
    }
    &.td-bank-branch {
        border-width: 0 0 1px 0;
    }
    &.td-options {
        position: sticky;
        right: 0;
        z-index: 10;

        padding-left: 12px;

        font-weight: 500;
        border-width: 0 0 1px 1px;
        .options-cell {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 4px;
        }
        .primary-option {
            color: rgb(var(--c-blue-600));
            cursor: pointer;
        }
    }

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

.dropdown {
    position: relative;
    .expand-more-icon {
        @include size(16px);
        cursor: pointer;
    }
    .expand-more-icon-border {
        border: 1px solid rgb(var(--c-blue-600));
    }
    .dropdown-menu {
        position: absolute;
        right: -8px;
        min-width: 100px;
        width: max-content;

        background-color: rgb(var(--c-white));
        font-weight: 400;
        border: 1px solid rgb(var(--c-gray-300));
        .dropdown-menu-item {
            padding: 6px 10px;
            cursor: pointer;
            &:hover {
                color: rgb(var(--c-primary));
                background-color: rgb(var(--c-gray-200));
            }
        }
    }
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
