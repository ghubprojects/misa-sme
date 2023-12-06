import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { FormMode } from '@/utils/enum';
import { useAccountStore } from './account';
import { AccountFields, AccountFormFields } from '@/utils/fields';

const { account_number, current_account_number } = AccountFields;

/**
 * Tạo 1 empty object để lưu trữ các trường dữ liệu
 * @returns Đối tượng trống lưu trữ các trường
 * Created by: ttanh (25/08/2023)
 * Modified by: ttanh (04/09/2023)
 */
const getEmptyData = () => {
    const newObject = {};
    for (const item of Object.values(AccountFormFields)) {
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
    newObject[current_account_number.field] = '';
    console.log(newObject);
    return newObject;
};

export const useAccountFormStore = defineStore('accountFormState', () => {
    const validateFieldsOrder = ref(Object.values(AccountFormFields));
    const initFields = computed(() => getEmptyData());

    const currentItem = ref({});

    const isLoading = ref(false);
    const isValidating = ref(false);

    /**
     * === FORM DATA MANAGER ===
     */
    const mode = ref(FormMode.Hide);

    const bindingFormatData = (item) => {
        for (const field in AccountFormFields) {
            if (AccountFormFields[field].formatData)
                item[field] = AccountFormFields[field].formatData(item[field]);
        }
        currentItem.value = item;
        console.log('format data:', item);
    };

    const bindingConvertData = (item) => {
        for (const field in AccountFormFields) {
            if (AccountFormFields[field].convertData) {
                item[field] = AccountFormFields[field].convertData(item[field]);
            }
        }
        currentItem.value = item;
        console.log('convert data:', item);
    };

    // tạo form  mới
    const create = () => {
        mode.value = FormMode.Create;
        bindingFormatData(initFields.value);
    };

    // mở form nhân bản
    const duplicate = () => {
        const AccountStore = useAccountStore();
        mode.value = FormMode.Duplicate;
        let selectedItemClone = AccountStore.selectedItem;
        selectedItemClone[AccountFields.account_id.field] = AccountFields.account_id.defaultValue;
        bindingFormatData(selectedItemClone);
    };

    // hiển thị thông tin
    const view = () => {
        const AccountStore = useAccountStore();
        mode.value = FormMode.View;
        bindingFormatData(AccountStore.selectedItem);
    };

    // form cập nhật thông tin
    const update = () => {
        const AccountStore = useAccountStore();
        mode.value = FormMode.Update;
        bindingFormatData(AccountStore.selectedItem);
    };

    // ẩn thông tin
    const hide = () => {
        mode.value = FormMode.Hide;
        validateErrors.value = [];
        bindingFormatData(initFields.value);
        console.log(currentItem.value);
    };

    /**
     * === VALIDATE ===
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
        else if (field === account_number.field) return true;
        else return false;
    };

    return {
        currentItem,
        isLoading,
        isValidating,

        mode,
        create,
        duplicate,
        view,
        update,
        hide,
        bindingConvertData,
        bindingFormatData,

        validateErrors,
        isShowError,
        getError,
        addError,
        removeError,
        getFocusState
    };
});
