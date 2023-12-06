import * as SupplierService from '@/services/supplier';
import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Store quản lý trạng thái phiếu chi
 * Created by: ttanh (20/08/2023)
 * Modified by: ttanh (29/09/2023)
 */
export const useSupplierStore = defineStore('supplierState', () => {
    const data = ref({});
    const selectedItem = ref({});
    const reloadData = ref(false);

    const getAllAsync = async (keyword, limit, offset) => {
        data.value = {};
        await SupplierService.getAllAsync(keyword, limit, offset).then((res) => {
            data.value = res.data.Result;
        });
    };

    const getByIdAsync = async (id) => {
        const response = await SupplierService.getByIdAsync(id);
        return response.data;
    };

    return {
        data,
        selectedItem,
        reloadData,
        getAllAsync,
        getByIdAsync
    };
});
