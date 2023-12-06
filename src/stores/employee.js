import * as EmployeeService from '@/services/employee';
import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Store quản lý trạng thái phiếu chi
 * Created by: ttanh (20/08/2023)
 * Modified by: ttanh (29/09/2023)
 */
export const useEmployeeStore = defineStore('employeeState', () => {
    const data = ref({});
    const selectedItem = ref({});
    const reloadData = ref(false);

    const getAllAsync = async (keyword, limit, offset) => {
        data.value = {};
        await EmployeeService.getAllAsync(keyword, limit, offset).then((res) => {
            data.value = res.data.Result;
        });
    };

    const getByIdAsync = async (id) => {
        const response = await EmployeeService.getByIdAsync(id);
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
