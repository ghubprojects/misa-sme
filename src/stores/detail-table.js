import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { table } from '@/utils/table';

/**
 * Store quản lý thông số bảng
 * Created by: ttanh (04/09/2023)
 * Modified by: ttanh (25/09/2023)
 */
export const useDetailTableStore = defineStore('detailTableState', () => {
    const totalRecord = ref(0);

    // số bản ghi mỗi trang
    const recordPerPage = ref(table.INIT_RECORD_PER_PAGE);

    // trang hiện tại
    const currentPage = ref(table.INIT_CURRENT_PAGE);

    // hàng bắt đầu truy xuất
    const offsetValue = ref(table.INIT_OFFSET_VALUE);

    // số trang
    const totalPages = computed(() => {
        return Math.ceil(totalRecord.value / recordPerPage.value);
    });

    /**
     * Reset currentPage và offsetValue của bảng
     * Created by: ttanh (10/09/2023)
     */
    const reset = () => {
        currentPage.value = table.INIT_CURRENT_PAGE;
        offsetValue.value = table.INIT_OFFSET_VALUE;
    };

    /**
     * Đi đến trang trước
     * Created by: ttanh (04/09/2023)
     * Modified by: ttanh (05/09/2023 )
     */
    const toPreviousPage = () => {
        currentPage.value--;
        offsetValue.value = (currentPage.value - 1) * recordPerPage.value;
        console.log(`page: ${currentPage.value} - offset: ${offsetValue.value}`);
    };

    /**
     * Đi đến trang kế tiếp
     * Created by: ttanh (04/09/2023)
     * Modified by: ttanh (05/09/2023)
     */
    const toNextPage = () => {
        currentPage.value++;
        offsetValue.value = (currentPage.value - 1) * recordPerPage.value;
        console.log(`page: ${currentPage.value} - offset: ${offsetValue.value}`);
    };

    /**
     * Đi đến trang bất kỳ
     * @param {int} page số trang
     * Created by: ttanh (06/09/2023)
     */
    const toPage = (page) => {
        currentPage.value = page;
        offsetValue.value = (currentPage.value - 1) * recordPerPage.value;
        console.log(`page: ${currentPage.value} - offset: ${offsetValue.value}`);
    };

    return {
        totalRecord,
        recordPerPage,
        currentPage,
        totalPages,
        offsetValue,
        reset,
        toPage,
        toNextPage,
        toPreviousPage
    };
});
