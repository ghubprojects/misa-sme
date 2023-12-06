import { defineStore } from 'pinia';
import { ref } from 'vue';
import { DialogType } from '@/utils/enum';

/**
 * Quản lý thông báo Dialog
 */
export const useDialogStore = defineStore('dialogState', () => {
    const isOpen = ref(false);

    const type = ref(DialogType.Warning);
    const title = ref(null);
    const message = ref(null);

    const primaryText = ref(null);
    const onClickPrimary = ref(null);

    const secondaryText = ref(null);
    const onClickSecondary = ref(null);

    /**
     * Hiển thị Dialog
     * @param {string} p_type
     * @param {string} p_title
     * @param {string} p_message
     * @param {string} p_primaryText
     * @param {function} p_onClickPrimary
     * @param {string} p_secondaryText
     * @param {function} p_onClickSecondary
     * Created by: ttanh (19/10/2023)
     */
    const show = (
        p_type,
        p_title,
        p_message,
        p_primaryText,
        p_onClickPrimary,
        p_secondaryText,
        p_onClickSecondary
    ) => {
        type.value = p_type;
        title.value = p_title;
        message.value = p_message;
        primaryText.value = p_primaryText;
        onClickPrimary.value = p_onClickPrimary;
        secondaryText.value = p_secondaryText;
        onClickSecondary.value = p_onClickSecondary;
        isOpen.value = true;
    };

    /**
     * Ẩn Dialog
     * Created by: ttanh (19/10/2023)
     */
    const hide = () => {
        type.value = DialogType.Warning;
        title.value = null;
        message.value = null;
        primaryText.value = null;
        onClickPrimary.value = null;
        secondaryText.value = null;
        onClickSecondary.value = null;
        isOpen.value = false;
    };

    return {
        show,
        hide,
        isOpen,
        type,
        title,
        message,
        primaryText,
        onClickPrimary,
        secondaryText,
        onClickSecondary
    };
});
