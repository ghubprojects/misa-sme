import * as PaymentService from '@/services/payment';
import { PaymentFields } from '@/utils/fields';
import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Store quản lý trạng thái phiếu chi
 * Created by: ttanh (20/08/2023)
 * Modified by: ttanh (29/09/2023)
 */
export const usePaymentStore = defineStore('paymentState', () => {
    const data = ref({});
    const detailData = ref({});

    const reloadData = ref(false);
    const reloadDetailData = ref(false);

    const selectedItem = ref({});
    const selectedDetailItem = ref({});

    const supplierCodeField = PaymentFields.supplier_code.field;
    const supplierNameField = PaymentFields.supplier_name.field;

    const getAllDetailsAsync = async (id, keyword, limit, offset) => {
        try {
            detailData.value = {};
            await PaymentService.getAllDetailsAsync(id, keyword, limit, offset).then((res) => {
                detailData.value = res.data.Result;
                for (const detail of detailData.value.Data) {
                    detail[supplierCodeField] = selectedItem.value[supplierCodeField];
                    detail[supplierNameField] = selectedItem.value[supplierNameField];
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    const getAllAsync = async (keyword, limit, offset) => {
        data.value = {};
        await PaymentService.getAllAsync(keyword, limit, offset).then((res) => {
            data.value = res.data.Result;
        });
    };

    const getByIdAsync = async (id) => {
        const response = await PaymentService.getByIdAsync(id);
        return response.data.Result;
    };

    const addAsync = async (data) => {
        const response = await PaymentService.addAsync(data);
        return response.data;
    };

    /**
     * Cập nhật thông tin nhân viên
     * @param {object} data dữ liệu nhân viên sau khi thay đổi
     * Created by: ttanh (20/08/2023)
     * Modified by: ttanh (21/09/2023)
     */
    const updateAsync = async (data) => {
        const response = await PaymentService.updateAsync(data);
        return response.data;
    };

    /**
     * Xóa nhân viên
     * @param {object} data dữ liệu nhân viên bị xóa
     * Created by: ttanh (20/08/2023)
     * Modified by: ttanh (10/09/2023)
     */
    const removeAsync = async (data) => {
        const response = await PaymentService.removeAsync(data);
        return response.data;
    };

    /**
     * Xóa nhiều nhân viên theo ID
     * @param {array} idList Danh sách ID nhân viên bị xóa
     * Created by: ttanh (20/08/2023)
     */
    const removeMultipleAsync = async (idList) => {
        if (idList.length) {
            const response = await PaymentService.removeMultipleAsync(idList);
            return response.data;
        }
    };

    return {
        data,
        detailData,
        reloadData,
        reloadDetailData,
        selectedItem,
        selectedDetailItem,
        getAllAsync,
        getAllDetailsAsync,
        getByIdAsync,
        addAsync,
        updateAsync,
        removeAsync,
        removeMultipleAsync
    };
});
