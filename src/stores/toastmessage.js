import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Quản lý thông báo toast message
 */
export const useToastMessageStore = defineStore('toastMessageState', () => {
    const isShow = ref(false);
    const init = {
        type: '',
        message: ''
    };

    const current = ref(init);

    // show toast message và đặt thời gian hiển thị là 5 giây.
    const show = (type, message) => {
        if (type) current.value.type = type;
        if (message) current.value.message = message;
        isShow.value = true;
        setTimeout(() => (isShow.value = false), 5000);
    };

    // ẩn toast message
    const hide = () => {
        current.value = init;
        isShow.value = false;
    };

    return {
        current,
        isShow,
        show,
        hide
    };
});
