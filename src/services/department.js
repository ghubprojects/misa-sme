import * as httpRequest from '@/utils/httprequest';

const endpoint = 'Departments'

/**
 * Lấy danh sách tất cả đơn vị
 * @returns danh sách đơn vị
 * Created by: ttanh (08/09/2023)
 * Modified by: ttanh (29/09/2023)
 */
export const getAllAsync = async () => {
    return await httpRequest.get(endpoint);
};

/**
 * Lấy danh sách đơn vị lọc theo tên đơn vị
 * @param {string} keyword từ khóa tìm kiếm
 * @returns danh sách đơn vị
 * Created by: ttanh (26/08/2023)
 * Modified by: ttanh (29/09/2023)
 */
export const getFilteringAsync = async (keyword = '') => {
    return await httpRequest.get(endpoint, {
        params: { keyword }
    })
}

/**
 * Lấy đơn vị theo ID
 * @param {string} id ID đơn vị
 * @returns danh sách đơn vị
 * Created by: ttanh (26/08/2023)
 * Modified by: ttanh (29/09/2023)
 */
export const getByIdAsync = async (id) => {
    return await httpRequest.get(`${endpoint}/${id}`);
};