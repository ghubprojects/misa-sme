import * as httpRequest from '@/utils/httprequest';
import { table } from '@/utils/table';

const endpoint = 'Payments';

/**
 * Lấy danh sách nhân viên phân trang và lọc theo mã nhân viên, tên nhân viên
 * @param {string} keyword Từ khóa tìm kiếm
 * @param {int} limit Số bản ghi mỗi trang
 * @param {int} offset Hàng bắt đầu truy xuất
 * @returns Danh sách nhân viên
 * Created by: ttanh (26/08/2023)
 * Modified by: ttanh (05/09/2023)
 */
export const getAllAsync = async (
    keyword = '',
    limit = table.INIT_RECORD_PER_PAGE,
    offset = table.INIT_OFFSET_VALUE
) => {
    return await httpRequest.get(endpoint, {
        params: { keyword, limit, offset }
    });
};

/**
 * Lấy nhân viên theo ID
 * @param {string} id ID nhân viên
 * @returns Danh sách nhân viên
 * Created by: ttanh (26/08/2023)
 */
export const getByIdAsync = async (id) => {
    return await httpRequest.get(`${endpoint}/${id}`);
};

/**
 * Thêm mới nhân viên
 * @param {object} data dữ liệu nhân viên mới
 * @returns danh sách nhân viên
 * Created by: ttanh (26/08/2023)
 */
export const addAsync = async (data) => {
    return await httpRequest.post(endpoint, data);
};

/**
 * Cập nhật nhân viên
 * @param {*} data dữ liệu cập nhật
 * @returns danh sách nhân viên
 * Created by: ttanh (26/08/2023)
 */
export const updateAsync = async (data) => {
    return await httpRequest.put(endpoint, data);
};

/**
 * Xóa nhân viên theo ID
 * @param {*} id ID nhân viên
 * @returns Danh sách nhân viên
 * Created by: ttanh (26/08/2023)
 * Modified by: ttanh (10/09/2023)
 */
export const removeByIdAsync = async (id) => {
    return await httpRequest.remove(`${endpoint}/${id}`);
};

/**
 * Xóa nhiều nhân viên
 * @returns Danh sách nhân viên
 * Created by: ttanh (26/08/2023)
 */
export const removeMultipleAsync = async (ids) => {
    return await httpRequest.remove(endpoint, {
        data: ids
    });
};

/**
 * Xóa tất cả nhân viên
 * @returns Danh sách nhân viên
 * Created by: ttanh (26/08/2023)
 * Modified by: ttanh (20/09/2023)
 */
export const removeAllAsync = async () => {
    return await httpRequest.remove(endpoint);
};
