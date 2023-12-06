import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { ButtonResources, DialogResources, ErrorResources } from '@/resources';
import { useDialogStore } from './dialog';
import { useLanguageStore } from './language';
import { DialogType } from '@/utils/enum';

/**
 * Quản lí trạng thái lỗi
 */
export const useErrorStore = defineStore('errorState', () => {
    const code = ref(null);
    const message = ref('');

    /**
     * Reset thông báo lỗi global
     * Created by: ttanh (30/09/2023)
     */
    const hide = () => {
        code.value = null;
        message.value = '';
    };

    /**
     * Tạo thông báo lỗi global
     * @param {error} error
     * Created by: ttanh (30/10/2023)
     */
    const show = (error) => {
        console.log(error);

        const Language = useLanguageStore();
        const Dialog = useDialogStore();

        if (error instanceof AxiosError) {
            switch (error.code) {
                case 'ERR_NETWORK':
                    message.value = ErrorResources[Language.current].ConnectionError;
                    break;
                case 'ERR_BAD_REQUEST':
                case 'ERR_BAD_RESPONSE':
                    code.value = error.response.data.ErrorCode;
                    message.value = error.response.data.Errors
                        ? error.response.data.Errors[0]
                        : error.response.data.UserMessage;
                    break;
            }
        } else message.value = error;

        Dialog.show(
            DialogType.Error,
            DialogResources[Language.current].GlobalError.title,
            message.value,
            ButtonResources[Language.current].Close,
            Dialog.hide
        );
    };

    return {
        message,
        code,
        show,
        hide
    };
});
