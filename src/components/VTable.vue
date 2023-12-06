<script setup>
import { storeToRefs } from 'pinia';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { IconExpandMore, IconSearch } from '@/assets/icons';
import noDataImg from '@/assets/images/no-data.svg';
import { useDebounce } from '@/composables';

import {
    useDetailTableStore,
    useDialogStore,
    useLanguageStore,
    useTableStore,
    useToastMessageStore
} from '@/stores';

import {
    ButtonResources,
    DialogResources,
    ErrorResources,
    TableResources,
    ToastMessageResources
} from '@/resources';
import { ButtonSize, ButtonStyle, ColorScheme, InputSize, InputWidth } from '@/styles/types';
import { ResponseToDataConverter } from '@/utils/datahandler';
import { DialogType, FormMode, TableRole, TableRowOption, ToastMessageType } from '@/utils/enum';
import VTablePagination from './VTablePagination.vue';

const props = defineProps({
    role: {
        type: String,
        default: TableRole.Master,
        validator(val) {
            return Object.values(TableRole).includes(val);
        }
    },
    columnsInfo: {
        type: Object,
        required: true
    },
    idField: {
        type: String,
        required: true
    },
    primaryField: String,
    searchbarPlaceholder: {
        type: String
    },
    exportUrl: {
        type: String
    },
    accumulateColumn: String,
    paging: Boolean,
    showPagination: {
        type: Boolean,
        default: true
    },
    dataStore: {
        type: Object,
        required: true
    },
    formStore: Object,
    options: Object,
    editable: Boolean,
    canAddRow: Boolean,
    canDeleteRow: Boolean,
    classes: Array
});

const TableStore = useTableStore();
const DetailTableStore = useDetailTableStore();

const DialogStore = useDialogStore();
const ToastMessageStore = useToastMessageStore();
const LanguageStore = useLanguageStore();

const isLoading = ref(false);
const isAddingRow = ref(false);

const { current: lang } = storeToRefs(LanguageStore);
const { data, detailData, reloadData, reloadDetailData, selectedItem, selectedDetailItem } =
    storeToRefs(props.dataStore);

/**
 *
 */
const handleSelectRow = (item) => {
    isAddingRow.value = false;
    switch (props.role) {
        case TableRole.Master:
            selectedItem.value = item;
            break;
        case TableRole.DetailForm:
            selectedDetailItem.value = item;
            break;
    }
};

/**
 * === XỬ LÝ LẤY DANH SÁCH NHÂN VIÊN TỪ API ===
 */

const columns = ref([...props.columnsInfo]);
const dataList = computed(() => {
    switch (props.role) {
        case TableRole.Master:
            return data.value.Data ?? [];
        case TableRole.Detail:
        case TableRole.DetailForm:
            return detailData.value.Data ?? [];
        default:
            return [];
    }
});

// lưu trữ từ khóa tìm kiếm
const searchText = ref('');
const isFocusSearchInput = ref(false);

const route = useRoute();
const loadData = async () => {
    try {
        isLoading.value = true;

        switch (props.role) {
            case TableRole.Master:
                if (props.paging)
                    await props.dataStore.getAllAsync(
                        searchText.value,
                        TableStore.recordPerPage,
                        TableStore.offsetValue
                    );
                else await props.dataStore.getAllAsync();
                TableStore.totalRecord = data.value.TotalRecord;
                selectedItem.value = data.value.Data[0];
                reloadData.value = false;
                break;
            case TableRole.Detail:
                if (props.paging)
                    await props.dataStore.getAllDetailsAsync(
                        selectedItem.value[props.idField] ?? null,
                        null,
                        DetailTableStore.recordPerPage,
                        DetailTableStore.offsetValue
                    );
                else
                    await props.dataStore.getAllDetailsAsync(
                        selectedItem.value[props.idField] ?? null
                    );
                DetailTableStore.totalRecord = detailData.value.TotalRecord;
                reloadDetailData.value = false;
                break;
            case TableRole.DetailForm:
                console.log(route.params.id);
                if (props.paging)
                    await props.dataStore.getAllDetailsAsync(
                        route.params.id ?? null,
                        null,
                        DetailTableStore.recordPerPage,
                        DetailTableStore.offsetValue
                    );
                else await props.dataStore.getAllDetailsAsync(route.params.id ?? null);
                DetailTableStore.totalRecord = detailData.value.TotalRecord;
                break;
        }
        isLoading.value = false;
    } catch (error) {
        isLoading.value = false;
        console.log(error);
    }
};

// Load dữ liệu khi được mount
onMounted(async () => {
    await loadData();
});

watch(reloadData, () => {
    if (reloadData.value) loadData();
});

watch(reloadDetailData, () => {
    if (reloadDetailData.value) loadData();
});

watch(selectedItem, () => {
    if (props.role === TableRole.Detail) loadData();
});

/**
 * Khi recordPerPage hoặc currentPage thay đổi, load lại dữ liệu
 * Created by: ttanh (07/09/2023)
 */
const { recordPerPage, currentPage } = storeToRefs(
    props.role === TableRole.Detail ? DetailTableStore : TableStore
);
watch([recordPerPage, currentPage], () => {
    if (props.role !== TableRole.DetailForm) loadData();
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
 * Quản lý checklist
 * Created by: ttanh (07/10/2023)
 */
const checklist = ref([]);

const findCheck = (id) => checklist.value.find((item) => item.id === id);

const getPageCheck = (page) => checklist.value.filter((item) => item.page === page);

const uncheckPage = (page) =>
    (checklist.value = checklist.value.filter((check) => check.page !== page));

const checkPage = (page) => {
    uncheckPage(page);
    checklist.value.push(
        ...dataList.value.value.map((item) => ({
            id: item[props.idField],
            page: page
        }))
    );
};

const toggleCheckPage = (page) => {
    if (getPageCheck(page).length === dataList.value.length) uncheckPage(page);
    else checkPage(page);
};

const getPageCheckIds = (page) =>
    checklist.value.map((item) => {
        if (item.page === page && item.id) return item.id;
    });

const removeCheckById = (id) => {
    checklist.value = checklist.value.filter((item) => {
        if (item.id !== id) return item;
    });
};

/**
 * Định dạng lại dữ liệu nhân viên lấy từ API.
 * @param {object} data dữ liệu nhân viên
 * @param {string} property trường dữ liệu cần định dạng lại
 * Created by: ttanh (20/08/2023)
 * Modified by: ttanh (03/09/2023)
 */
const formatDataCell = (data, column, index) => {
    if (column.field === 'Index') return index;

    if (data[column.field] === null || data[column.field] === undefined) return '';

    switch (column.dataType) {
        case Date:
            return ResponseToDataConverter.convertDate(data[column.field]);
        case Number:
            if (column.formatType === 'Currency') {
                return ResponseToDataConverter.convertCurrency(data[column.field]);
            }
    }
    return data[column.field];
};

/**
 * === FORM ===
 */

const router = useRouter();
const bindingForm = (mode, data) => {
    try {
        if (props.role === TableRole.Detail) return;

        switch (mode) {
            case FormMode.Create:
                props.formStore.create();
                router.push(`${props.formStore.formRoute}`);
                break;
            case FormMode.View:
                props.formStore.view(data);
                router.push(`${props.formStore.formRoute}/${data[props.idField]}`);
                break;
            case FormMode.Update:
                props.formStore.update(data);
                router.push(`${props.formStore.formRoute}/${data[props.idField]}`);
                break;
            case FormMode.Duplicate:
                props.formStore.duplicate(data);
                router.push(`${props.formStore.formRoute}`);
                break;
        }
    } catch (error) {
        console.log(error);
    }
};

/**
 * === XỬ LÝ EXPAND DROPDOWN OPTIONS ===
 */
const showOptionsItem = ref(null);

/**
 * Ngăn chặn nổi bọt sự kiện ra window khi click vào ExpandIcon và mở dropdown options
 * @param {event} event sự kiện click
 * @param {object} employee nhân viên có dropdown được mở
 * Created by: ttanh (12/08/2023)
 * Modified by: ttanh (15/08/2023)
 */
const handleClickExpandIcon = (event, item) => {
    event.stopPropagation();
    showOptionsItem.value = item;
};

// đóng dropdown options
const closeDropdownOptions = () => {
    showOptionsItem.value = null;
};

// khi click ra ngoài document, đóng dropdown options.
onMounted(() => document.addEventListener('click', closeDropdownOptions));

// khi unmount, loại bỏ sự kiện click khỏi đối tượng document.
onBeforeUnmount(() => document.removeEventListener('click', closeDropdownOptions));

/**
 * === XÓA 1 NHÂN VIÊN ===
 */

const showDialogDelete = (refId, refNoFinance) => {
    DialogStore.show(
        DialogResources[lang.value].DeletePayment.title,
        DialogResources[lang.value].DeletePayment.message(refNoFinance),
        ButtonResources[lang.value].DeletePayment,
        () => handleDelete(refId, refNoFinance),
        ButtonResources[lang.value].Cancel,
        DialogStore.hide,
        ColorScheme.Red
    );
};

/**
 * Thực hiện xóa nhân viên theo ID
 * 1. nếu thành công, reset employee current và employee checklist và hiện message thông báo thành công
 * 2. nếu thất bại, hiện message thông báo lỗi
 * @param {object} employee nhân viên bị xóa
 * Created by: ttanh (15/08/2023)
 * Modified by: ttanh (05/09/2023)
 */
const handleDelete = async (refId, refNoFinance) => {
    // const result = await Employee.removeByIdAsync(employee.EmployeeID);

    // // check affected rows is 1
    // if (result.Succeeded && result.Data === 1) {
    //     try {
    //         handleLoadData();

    //         Employee.current = {};
    //         Employee.checklist = [];
    //         // Employee.removeCheckById(employee[EmployeeFields.EmployeeID]);

    //         ToastMessage.show(
    //             ToastMessageType.Success,
    //             ToastMessageResources[lang.value].DeleteEmployee.success(
    //                 employee.EmployeeCode
    //             )
    //         );
    //     } catch (err) {
    //         ToastMessage.show(
    //             ToastMessageType.Error,
    //             ToastMessageResources[lang.value].DeleteEmployee.error(employee.EmployeeCode)
    //         );
    //         console.log(err);
    //     }
    // }

    // isDeleting.value = false;
    try {
        console.log(ToastMessageResources[lang.value].DeletePayment.success(refNoFinance));
        ToastMessageStore.show(
            ToastMessageType.Success,
            ToastMessageResources[lang.value].DeletePayment.success(refNoFinance)
        );
    } catch (err) {
        ToastMessageStore.show(
            ToastMessageType.Error,
            ToastMessageResources[lang.value].DeletePayment.error(refNoFinance)
        );
        console.log(err);
    }
    DialogStore.hide();
};

/**
 * === XÓA NHIỀU ===
 */

// Hiện Dialog Xóa nhiều
const showDialogDeleteMultiplePayments = () => {
    DialogStore.show(
        DialogType.Warning,
        DialogResources[lang.value].DeleteMultiplePayments.title,
        DialogResources[lang.value].DeleteMultiplePayments.message,
        ButtonResources[lang.value].Yes,
        handleDeleteMultiplePayments,
        ButtonResources[lang.value].No,
        DialogStore.hide
    );
};

/**
 * Xử lý xóa nhiều nhân viên
 * 1. lấy tất cả ID của nhân viên trong checklist
 * 2. xóa tất cả nhân viên có ID trong checklist
 * 3. nếu thành công, reset employee checklist và hiện message thông báo thành công
 * 4. nếu thất bại, hiện message thông báo lỗi
 * Created by: ttanh (12/08/2023)
 * Modified by: ttanh (15/08/2023)
 */
const handleDeleteMultiplePayments = async () => {
    // try {
    //     console.log('page checked ids:', Employee.getPageCheckIds(Table.currentPage));
    //     const result = await Employee.removeMultipleAsync(
    //         Employee.getPageCheckIds(Table.currentPage)
    //     );
    //     // check affected rows is page checked ids length
    //     if (
    //         result.Succeeded &&
    //         result.Data === Employee.getPageCheckIds(Table.currentPage).length
    //     ) {
    //         try {
    //             handleLoadData();
    //             Employee.checklist = [];
    //             // Employee.uncheckPage(Table.currentPage);
    //             ToastMessage.show(
    //                 ToastMessageType.Success,
    //                 ToastMessageResources[lang.value].DeleteMultipleEmployees.success
    //             );
    //         } catch (err) {
    //             ToastMessage.show(
    //                 ToastMessageType.Error,
    //                 ToastMessageResources[lang.value].DeleteMultipleEmployees.error
    //             );
    //             console.log(err);
    //         }
    //     }
    // } catch (err) {
    //     ToastMessage.show(
    //         ToastMessageType.Error,
    //         ToastMessageResources[lang].DeleteMultipleEmployees.error
    //     );
    //     console.log(err);
    // }
    // isDeleting.value = false;
    try {
        ToastMessageStore.show(
            ToastMessageType.Success,
            ToastMessageResources[lang.value].DeleteMultiplePayments.success
        );
    } catch (err) {
        ToastMessageStore.show(
            ToastMessageType.Error,
            ToastMessageResources[lang.value].DeleteMultiplePayments.error
        );
        console.log(err);
    }
    DialogStore.hide();
};

/**
 * === SỬA DỮ LIỆU NHÂN VIÊN ===
 */

const isUpdating = ref(false);

/**
 * === ACTION: THÊM DÒNG / XÓA DÒNG ===
 */
const handleAddRow = () => {
    isAddingRow.value = true;
    dataList.value.push({});
};

const handleDeleteRow = () => {};

/**
 * === FIXED COLUMNS
 */
const paddingX = 10;

/**
 * Lấy mảng left position cho các cột cố định
 * @param {int} paddingX padding chiều ngang của 1 ô
 * @returns Mảng left position
 * Created by: ttanh (04/10/2023)
 */
const leftPositionsForFixedCols = computed(() => {
    const widthArray = columns.value.map((column) => column.width);
    const leftPositionArray = widthArray.reduce(
        (acc, currentValue, index) => {
            const currentWidth = currentValue + 2 * paddingX + 0.8;
            if (index === 0) acc.push(currentWidth);
            else acc.push(acc[index] + currentWidth);
            return acc;
        },
        [0]
    );
    return leftPositionArray;
});

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
const stopResize = () => (resizingColumnIndex.value = null);

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
    }
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
    // }
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
        <div v-if="role === TableRole.Master" class="data-table-header">
            <!-- Các hành động thực hiện hàng loạt -->
            <div class="bulk-actions" v-if="getPageCheck(TableStore.currentPage).length > 1">
                <span class="checked-count">
                    {{ TableResources[lang].Selected }}
                    <b> {{ getPageCheck(TableStore.currentPage).length }} </b>
                </span>
                <span class="uncheck-all-button" @click="uncheckPage(TableStore.currentPage)">
                    {{ TableResources[lang].Unselect }}
                </span>
                <span
                    class="check-all-pages-button"
                    v-if="getPageCheck(TableStore.currentPage).length === dataList.length"
                >
                    {{ TableResources[lang].SelectAllPages }}
                </span>
                <VButton
                    :style="ButtonStyle.Primary"
                    :size="ButtonSize.Medium"
                    :colorScheme="ColorScheme.Red"
                    class="bulk-delete-button"
                    @click="showDialogDeleteMultiplePayments"
                >
                    <template #icon>
                        <div class="icon-delete">
                            <VIcon class="delete-img" />
                        </div>
                    </template>
                    <p class="button-text">
                        {{ ButtonResources[lang].BulkDelete }}
                    </p>
                </VButton>
            </div>

            <!-- Các công cụ thao tác với bảng (tìm kiếm, xuất khẩu excel, reload,...) -->
            <div class="tools">
                <!-- Thanh tìm kiếm -->
                <VTextField
                    :size="InputSize.Medium"
                    :width="InputWidth.ExtraLarge"
                    id="search-input"
                    class="search-input"
                    :tooltip="false"
                    :maxLength="100"
                    :placeholder="searchbarPlaceholder"
                    v-model="searchText"
                    :firstFocus="isFocusSearchInput"
                >
                    <template #icon>
                        <IconSearch class="search-icon" />
                    </template>
                </VTextField>

                <!-- Button lấy lại dữ liệu -->
                <VButton
                    :style="ButtonStyle.Icon"
                    :size="ButtonSize.Medium"
                    :tooltip="ButtonResources[lang].ReloadTooltip"
                    class="reload-button"
                    @click="loadData"
                >
                    <div class="icon-reload">
                        <VIcon class="reload-img" />
                    </div>
                </VButton>

                <!-- Button xuất khẩu dữ liệu sang excel -->
                <VButton
                    :style="ButtonStyle.Icon"
                    :size="ButtonSize.Medium"
                    :tooltip="ButtonResources[lang].ExportTooltip"
                    class="export-button"
                    :href="`${exportUrl}?keyword=${searchText}`"
                >
                    <div class="icon-export">
                        <VIcon class="export-img" />
                    </div>
                </VButton>

                <VButton
                    :style="ButtonStyle.Primary"
                    :size="ButtonSize.Medium"
                    borderRadius
                    @click="formStore.create"
                >
                    Chi tiền
                </VButton>
            </div>
        </div>

        <!-- Bảng dữ liệu -->
        <VLoading v-if="isLoading" />
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
                                // { fixed: table.fixedColumns.includes(column.field) }
                            ]"
                            :style="[
                                // table.fixedColumns.includes(column.name) &&
                                // `left: ${leftPositionsForFixedCols[index]}px`
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
                            <VCheckbox
                                v-else
                                id="multiple-employees-checkbox"
                                :checked="
                                    dataList.length > 0 &&
                                    getPageCheck(TableStore.currentPage).length === dataList.length
                                "
                                @click="toggleCheckPage(TableStore.currentPage)"
                            />
                            <div class="resize" @mousedown="startResize($event, index)"></div>
                        </th>
                    </tr>
                </thead>

                <tbody
                    :style="{ height: !isLoading && dataList.length <= 0 ? 172 + 'px' : 'auto' }"
                >
                    <div v-if="!isLoading && dataList.length <= 0" class="no-data-image">
                        <img :src="noDataImg" alt="no-data-image" />
                        <p>Không có dữ liệu</p>
                    </div>
                    <tr
                        v-for="(item, itemIndex) in dataList"
                        :key="item[idField]"
                        :class="[
                            {
                                'selected-row':
                                    (role === TableRole.Master &&
                                        (findCheck(item[idField]) ||
                                            selectedItem[idField] === item[idField])) ||
                                    (role === TableRole.DetailForm &&
                                        selectedDetailItem[idField] === item[idField])
                            },
                            {
                                'higher-elevation':
                                    showOptionsItem && showOptionsItem[idField] === item[idField]
                            }
                        ]"
                        @click.stop="handleSelectRow(item)"
                        @dblclick="bindingForm(options[0], item)"
                    >
                        <td
                            v-for="(column, index) in columns"
                            :key="column.field"
                            :class="[
                                { 'td-options': column.field === 'Options' }
                                // { fixed: table.fixedColumns.includes(column.name) }
                            ]"
                            :style="[
                                // table.fixedColumns.includes(column.name) &&
                                // `left: ${leftPositionsForFixedCols[index]}px`
                            ]"
                        >
                            <div v-if="column.field === 'CheckItem'" class="checkbox">
                                <div class="checkbox-input">
                                    <input
                                        type="checkbox"
                                        :value="{
                                            id: item[idField],
                                            page: TableStore.currentPage
                                        }"
                                        v-model="checklist"
                                        @click.stop
                                    />
                                    <span class="checkmark"></span>
                                </div>
                            </div>
                            <div
                                v-else-if="column.field === 'Options'"
                                class="options-cell"
                                @click.stop
                            >
                                <span
                                    v-if="options[0] === TableRowOption.Update"
                                    class="update-button"
                                    @click="bindingForm(FormMode.Update, item)"
                                >
                                    {{ TableResources[lang].Update }}
                                </span>
                                <span
                                    v-else-if="options[0] === TableRowOption.View"
                                    class="view-button"
                                    @click="bindingForm(FormMode.View, item)"
                                >
                                    Xem
                                </span>
                                <div class="dropdown">
                                    <IconExpandMore
                                        class="expand-more-icon"
                                        @click="handleClickExpandIcon($event, item)"
                                    />
                                    <div
                                        v-if="
                                            showOptionsItem &&
                                            showOptionsItem[idField] === item[idField]
                                        "
                                        class="dropdown-menu"
                                    >
                                        <div
                                            v-if="
                                                options.includes(TableRowOption.Update) &&
                                                options[0] !== TableRowOption.Update
                                            "
                                            class="dropdown-menu-item"
                                            @click="formStore.update(item)"
                                        >
                                            {{ TableResources[lang].Update }}
                                        </div>
                                        <div
                                            v-if="options.includes(TableRowOption.Delete)"
                                            class="dropdown-menu-item"
                                            @click="
                                                showDialogDelete(item[idField], item[primaryField])
                                            "
                                        >
                                            {{ TableResources[lang].Delete }}
                                        </div>
                                        <div
                                            v-if="options.includes(TableRowOption.Duplicate)"
                                            class="dropdown-menu-item"
                                            @click="formStore.duplicate(item)"
                                        >
                                            {{ TableResources[lang].Duplicate }}
                                        </div>

                                        <div
                                            v-if="options.includes(TableRowOption.CeaseUsing)"
                                            class="dropdown-menu-item"
                                        >
                                            {{ TableResources[lang].CeaseUsing }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                v-else
                                :class="[
                                    'cell-data',
                                    { 'text-left': column.dataType === String },
                                    {
                                        'text-center':
                                            column.dataType === Date || column.field === 'Index'
                                    },
                                    { 'text-right': column.dataType === Number }
                                ]"
                            >
                                <span
                                    v-if="
                                        !editable ||
                                        item[idField] !== selectedDetailItem[idField] ||
                                        column.field === 'Index'
                                    "
                                >
                                    {{ formatDataCell(item, column, itemIndex + 1) }}
                                </span>
                                <VTextField
                                    v-else-if="
                                        editable && item[idField] === selectedDetailItem[idField]
                                    "
                                    :size="InputSize.Medium"
                                    :width="InputWidth.Full"
                                    :id="column.field"
                                    :model-value="formatDataCell(item, column, itemIndex + 1)"
                                    :focus="false"
                                    :class="{ 'currency-cell': column.formatType === 'Currency' }"
                                    @update:model-value="(a) => console.log(a)"
                                />
                            </div>
                        </td>
                    </tr>
                </tbody>

                <tfoot v-if="false">
                    <tr>
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
                        </th>
                    </tr>
                </tfoot>

                <slot name="form"></slot>
            </table>
        </div>

        <div class="actions">
            <VButton
                v-if="canAddRow"
                :style="ButtonStyle.Outline"
                :size="ButtonSize.Medium"
                @click="handleAddRow"
            >
                Thêm dòng
            </VButton>
            <VButton
                v-if="canDeleteRow"
                :style="ButtonStyle.Outline"
                :size="ButtonSize.Medium"
                @click="handleDeleteRow"
            >
                Xóa hết dòng
            </VButton>
        </div>

        <!-- Công cụ phân trang của bảng -->
        <VTablePagination
            v-if="showPagination"
            :paging="paging"
            :tableStore="role === TableRole.Detail ? DetailTableStore : TableStore"
        />
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

#data-table {
    @include font(13);
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
    &:not(:has(.bulk-delete-button)) {
        justify-content: flex-end;
    }
}

.data-table-header .bulk-actions {
    @include font(13);
    display: flex;
    align-items: center;
    gap: 16px;

    .uncheck-all-button {
        color: rgb(var(--c-red-500));
        cursor: pointer;
    }

    .check-all-pages-button {
        color: rgb(var(--c-blue-600));
        cursor: pointer;
    }

    .bulk-delete-button {
        margin: 0 4px;
        .icon-delete {
            @include size(16px);
            transform: scale(calc(16 / 15));
            margin-right: 6px;
            margin-left: -4px;
            .delete-img {
                @include size(15px);
                background-position: -464px -313px;
                filter: brightness(0) invert(1);
            }
        }
        .button-text {
            @include font(13, 500);
        }
    }
}

.not-allowed-button {
    cursor: not-allowed;
}

.data-table-header .tools {
    display: flex;
    align-items: center;
    gap: 12px;
    input.search-input {
        @include font(13);
        height: 60px;
        font-style: italic !important;

        &::placeholder {
            @include font(13);
            font-style: italic !important;
        }
        & + i > .search-icon {
            @include size(20px);
            cursor: pointer;
        }
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
            width: calc(100% - var(--sidebar-width) - var(--main-content-padding-x) * 2 - 2px);
            padding: 24px;
            display: grid;
            place-items: center;
        }
    }

    tfoot {
        position: sticky;
        bottom: 0;
    }
}

tr {
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
        .update-button,
        .view-button {
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

.actions {
    margin-top: 12px;
    display: flex;
    gap: 16px;
}

// Checkbox style
/* Styles for checkbox */
.checkbox {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
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
    border-radius: 4px;
}

/* When input is checked, change background-color of checkmark*/
.checkbox-input > input[type='checkbox']:checked + .checkmark {
    background-color: rgb(var(--c-primary));
    border: none;
}

/* When input is checked, display check icon */
.checkbox-input > input[type='checkbox']:checked + .checkmark::before {
    @include centerAbsolute('both');

    content: '';
    display: block;
    transform: translate(-50%, -50%) scale(80%);

    /* Get check icon in file sprites */
    background: url('@/assets/images/sprites.svg') no-repeat -1273px -363px;
    width: 14px;
    height: 11px;
    filter: brightness(200%);
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
