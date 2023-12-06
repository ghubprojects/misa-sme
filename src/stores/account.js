import * as AccountService from '@/services/account';
import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Store quản lý trạng thái phiếu chi
 * Created by: ttanh (20/08/2023)
 * Modified by: ttanh (29/09/2023)
 */
export const useAccountStore = defineStore('accountState', () => {
    const data = ref({});
    const selectedItem = ref({});
    const reloadData = ref(false);

    const getAllAsync = async (keyword, limit, offset) => {
        data.value = {};
        await AccountService.getAllAsync(keyword, limit, offset).then((res) => {
            data.value = res.data.Result;
        });
    };

    const getByIdAsync = async (id) => {
        const response = await AccountService.getByIdAsync(id);
        return response.data;
    };

    const addAsync = async (data) => {
        const response = await AccountService.addAsync(data);
        return response.data;
    };

    const updateAsync = async (data) => {
        const response = await AccountService.updateAsync(data);
        return response.data;
    };

    const updateInactiveAsync = async (id, inactive, forceChild) => {
        console.log(id, inactive, forceChild);
        const response = await AccountService.updateInactiveAsync(id, inactive, forceChild);
        return response.data;
    };

    const removeAsync = async (data) => {
        const response = await AccountService.removeAsync(data);
        return response.data;
    };

    return {
        data,
        selectedItem,
        reloadData,
        getAllAsync,
        getByIdAsync,
        addAsync,
        updateAsync,
        updateInactiveAsync,
        removeAsync
    };
});
