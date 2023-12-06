<script setup>
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

import { TableResources } from '@/resources';
import { useLanguageStore } from '@/stores';
import { InputSize, InputWidth } from '@/styles/types';
import { table } from '@/utils/table';

const props = defineProps({
    totalRecord: Number,
    paging: Boolean,
    tableStore: Object
});

const Language = useLanguageStore();

const Table = ref(props.tableStore);

/**
 * Lấy giá trị recordPerPage từ selected option và load lại dữ liệu
 * @param {string} option
 * Created by: ttanh (04/09/2023)
 * Modified by: ttanh (05/09/2023)
 */
const handleChangeRecordPerPage = (option) => {
    console.log(option);
    const newValue = option.split(' ')[0];
    Table.value.recordPerPage = newValue;
};

/**
 * Đi đến trang dữ liệu trước
 * Created by: ttanh (04/09/2023)
 */
const handleToPreviousPage = () => {
    if (Table.value.currentPage > 1) Table.value.toPreviousPage();
};

/**
 * Đi đến trang dữ liệu kế tiếp
 * Created by: ttanh (04/09/2023)
 */
const handleToNextPage = () => {
    if (Table.value.currentPage < Table.value.totalPages) Table.value.toNextPage();
};

/**
 * Đi đến trang dữ liệu bất kỳ
 * @param {int} page
 * Created by: ttanh (06/09/2023)
 */
const handleToPage = (page) => Table.value.toPage(page);

/**
 * Force rerender cho dropdownlist khi language thay đổi
 * Created by: ttanh (05/10/2023)
 */
// Tạo key cho dropdownlist
const dropdownlistKey = ref(0);

// Force rerender bằng cách cập nhật giá trị cho dropdownlistKey
const forceRerender = () => {
    dropdownlistKey.value += 1;
};

// Theo dõi khi language thay đổi, gọi hàm forceRerender
const { current: currentLanguage } = storeToRefs(Language);
watch(currentLanguage, () => {
    forceRerender();
});
</script>

<template>
    <div class="table-pagination">
        <span>
            {{ TableResources[Language.current].Total }}
            <b> {{ totalRecord ?? tableStore.totalRecord }} </b>
            {{ TableResources[Language.current].Record }}
        </span>
        <div v-if="paging" class="paging-group">
            <VDropdownlist
                :size="InputSize.Medium"
                :width="InputWidth.Large"
                id="record-per-page"
                :key="dropdownlistKey"
                :options="
                    table.recordsPerPage.map(
                        (num) => `${num} ${TableResources[Language.current].RecordPerPage}`
                    )
                "
                :modelValue="`${Table.recordPerPage} ${
                    TableResources[Language.current].RecordPerPage
                }`"
                @update:modelValue="handleChangeRecordPerPage"
            />
            <div class="page-switcher">
                <div
                    :class="['before-page', { 'not-allowed-cursor': Table.currentPage === 1 }]"
                    @click="handleToPreviousPage"
                >
                    {{ TableResources[Language.current].Previous }}
                </div>
                <div class="page-list">
                    <div
                        v-for="(page, index) in table.generatePageNumbers(
                            Table.currentPage,
                            Table.totalPages
                        )"
                        :key="index"
                        :class="['page', { 'current-page': page === Table.currentPage }]"
                        @click="if (page !== '...') handleToPage(page);"
                    >
                        {{ page }}
                    </div>
                </div>
                <div
                    :class="[
                        'after-page',
                        { 'not-allowed-cursor': Table.currentPage === Table.totalPages }
                    ]"
                    @click="handleToNextPage"
                >
                    {{ TableResources[Language.current].Next }}
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.table-pagination {
    position: sticky;
    bottom: 0;
    left: 0;

    display: flex;
    justify-content: space-between;
    align-items: center;

    height: var(--table-pagination-height);
    padding: 12px;
    background-color: rgb(var(--c-white));
    border: 1px solid rgb(var(--c-gray-300));
    border: none;
    z-index: 1;
}
.paging-group {
    display: flex;
    align-items: center;
    gap: 16px;
    .page-switcher {
        display: flex;
        .before-page,
        .after-page {
            color: rgb(var(--c-gray-600));
            cursor: pointer;
        }
        .page-list {
            display: flex;
            align-items: center;
            margin: 0 12px;
            .page {
                padding: 0 6px;
                cursor: pointer;
            }
            .current-page {
                font-weight: 700;
                border: 1px solid rgb(var(--c-gray-300));
            }
        }
    }
}
</style>
