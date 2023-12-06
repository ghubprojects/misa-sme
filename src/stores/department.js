import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import * as DepartmentService from '@/services/department';
import { DepartmentFields } from '@/utils/enum';
import { useErrorStore } from './error';

/**
 * Store quản lý trạng thái đơn vị
 * Created by: ttanh (20/08/2023)
 * Modified by: ttanh (29/09/2023)
 */
export const useDepartmentStore = defineStore('departmentState', () => {
    const current = ref('')
    const list = ref([])
    const listName = ref([])
    const listAll = ref([])
    const listAllName = ref([])

    /**
     * Lấy dữ liệu danh sách đơn vị
     * Created by: ttanh (08/09/2023)
     * Modified by: ttanh (29/09/2023)
     */
    const getAllAsync = async () => {
        try {
            const response = await DepartmentService.getAllAsync()
            listAll.value = response.data.Data;
            listAllName.value = listAll.value && listAll.value.map(item => item[DepartmentFields.DepartmentName]);
        } catch (err) {
            console.log(err);
            if (err instanceof AxiosError) {
                const Error = useErrorStore();
                Error.setCurrent(err)
            }
        }
    }

    /**
    * Lấy dữ liệu danh sách nhân viên lọc và phân trang
    * @param {string} keyword từ khóa đơn vị tìm kiếm
    * Created by: ttanh (29/08/2023)
    * Modified by: ttanh (29/09/2023)
    */
    const getFilteringAsync = async (keyword) => {
        try {
            const response = await DepartmentService.getFilteringAsync(keyword)
            list.value = response.data.Data;
            listName.value = list.value && list.value.map(item => item[DepartmentFields.DepartmentName]);
        } catch (err) {
            console.log(err);
            if (err instanceof AxiosError) {
                const Error = useErrorStore();
                Error.setCurrent(err)
            }
        }
    }

    /**
     * Lấy đơn vị từ tên
     * @param {string} name tên đơn vị
     * @returns Dữ liệu đơn vị
     * Created by: ttanh (27/09/2023)
     * Modified by: ttanh (29/09/2023)
     */
    const getByNameAsync = async (name) => {
        try {
            const response = await DepartmentService.getFilteringAsync(name)
            return response.data
        } catch (err) {
            console.log(err);
            if (err instanceof AxiosError) {
                const Error = useErrorStore();
                Error.setCurrent(err)
            }
        }
    }

    /**
     * Lấy đơn vị từ ID
     * @param {id} id ID đơn vị
     * @returns Dữ liệu đơn vị
     * Created by: ttanh (29/08/2023)
     * Modified by: ttanh (29/09/2023)
     */
    const getByIdAsync = async (id) => {
        try {
            const response = await DepartmentService.getByIdAsync(id)
            return response.data
        } catch (err) {
            console.log(err);
            if (err instanceof AxiosError) {
                const Error = useErrorStore();
                Error.setCurrent(err)
            }
        }
    }

    return {
        current,
        list,
        listName,
        listAll,
        listAllName,
        getAllAsync,
        getFilteringAsync,
        getByIdAsync,
        getByNameAsync,
    };
});
