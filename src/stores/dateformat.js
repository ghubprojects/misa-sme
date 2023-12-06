import { DateFormatList } from '@/utils/enum';
import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Quản lý định dạng thời gian
 */
export const useDateFormatStore = defineStore('dateFormatState', () => {
    const current = ref(DateFormatList.DMY)

    return {
        current,
    };
});
