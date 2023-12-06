import { ref } from 'vue';

/**
 * Cách dùng:
 * const debouncedSearch = useDebounce(searchFunction, 300);
 * Sử dụng trong component:
 * watchEffect(() => {
 *   debouncedSearch(searchQuery);
 * });
 * @param {*} callback
 * @param {*} delay
 * @returns
 */
export default function useDebounce(callback, delay = 500) {
    // Tạo 1 ref lưu trữ timeout ID
    const timeoutId = ref(null);

    // Hàm được gọi mỗi khi giá trị thay đổi
    const debouncedFunction = (...args) => {
        // Clear timeout trước, nếu có
        if (timeoutId.value) clearTimeout(timeoutId.value);

        // Tạo timeout mới
        timeoutId.value = setTimeout(() => {
            callback(...args);
        }, delay);
    };

    return debouncedFunction;
}
