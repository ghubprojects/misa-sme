import { LanguageList } from '@/utils/enum';
import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Quản lý ngôn ngữ
 */
export const useLanguageStore = defineStore('languageState', () => {
    const current = ref(LanguageList.VI)

    return {
        current,
    };
});
