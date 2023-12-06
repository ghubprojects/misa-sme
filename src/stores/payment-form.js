import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { FormMode } from '@/utils/enum';
import { PaymentFormFields } from '@/utils/fields';

/**
 * Tạo 1 empty object để lưu trữ các trường dữ liệu
 * @returns Đối tượng trống lưu trữ các trường
 * Created by: ttanh (25/08/2023)
 * Modified by: ttanh (04/09/2023)
 */
const getEmptyData = () => {
    const newObject = {};
    for (const item of Object.values(PaymentFormFields)) {
        if (item.defaultValue !== undefined) {
            newObject[item.field] = item.defaultValue;
            continue;
        }
        switch (item.type) {
            case Number:
                newObject[item.field] = 0;
                break;
            case Date:
                newObject[item.field] = new Date();
                break;
            case String:
                newObject[item.field] = '';
                break;
            case Boolean:
                newObject[item.field] = false;
        }
    }
    console.log(newObject);
    return newObject;
};

export const usePaymentFormStore = defineStore('paymentFormState', () => {
    const validateFieldsOrder = ref(Object.values(PaymentFormFields));
    const initFields = computed(() => getEmptyData());

    const currentItem = ref({});
    const currentData = ref({});

    const isLoading = ref(false);
    const isValidating = ref(false);

    const tableRoute = ref('payment-list');
    const formRoute = ref('payment-info');

    /**
     * Quản lý form dữ liệu
     * Created by: ttanh (20/08/2023)
     */
    const mode = ref(FormMode.Hide);

    // tạo form  mới
    const create = () => {
        mode.value = FormMode.Create;
        currentItem.value = initFields.value;
        currentData.value = initFields.value;
    };

    // hiển thị thông tin
    const view = (item) => {
        mode.value = FormMode.View;
        currentItem.value = item;
        currentData.value = item;
    };

    // mở form nhân bản
    const duplicate = (item) => {
        mode.value = FormMode.Duplicate;
        currentItem.value = item;
        currentData.value = item;
    };

    // hiển thị thông tin
    const update = (item) => {
        mode.value = FormMode.Update;
        currentItem.value = item;
        currentData.value = item;
    };

    // ẩn thông tin
    const router = useRouter();
    const hide = () => {
        mode.value = FormMode.Hide;
        validateErrors.value = [];
        // currentItem.value = initFields.value;
        router.push({ name: tableRoute.value });
    };

    /**
     * Validate
     */
    const validateErrors = ref([]);
    const isShowError = ref(false);

    const removeError = (field) => {
        validateErrors.value = validateErrors.value.filter((err) => err.field !== field);
        console.log(validateErrors.value);
    };

    const addError = (field, message) => {
        removeError(field);
        validateErrors.value.push({ field, message });
        validateErrors.value = validateErrors.value.sort((a, b) => {
            return (
                validateFieldsOrder.value.indexOf(a.field) -
                validateFieldsOrder.value.indexOf(b.field)
            );
        });

        console.log(validateErrors.value);
    };

    const getError = (field) => {
        return validateErrors.value.find((err) => err.field === field);
    };

    const getFocusState = (field) => {
        if (validateErrors.value.length > 0) return validateErrors.value[0].field === field;
        else return false;
    };

    return {
        currentItem,
        currentData,
        isLoading,
        isValidating,
        tableRoute,
        formRoute,

        mode,
        create,
        duplicate,
        update,
        view,
        hide,

        validateErrors,
        isShowError,
        getError,
        addError,
        removeError,
        getFocusState
    };
});
