import * as httpRequest from '@/utils/httprequest';
import { table } from '@/utils/table';

const endpoint = 'Accounts';

export const getAllAsync = async (
    keyword = null,
    limit = table.INIT_RECORD_PER_PAGE,
    offset = table.INIT_OFFSET_VALUE
) => {
    return await httpRequest.get(endpoint, {
        params: { keyword, limit, offset }
    });
};

export const getByIdAsync = async (id) => {
    return await httpRequest.get(`${endpoint}/${id}`);
};

export const addAsync = async (data) => {
    return await httpRequest.post(endpoint, data);
};

export const updateAsync = async (data) => {
    return await httpRequest.put(endpoint, data);
};
export const removeAsync = async (data) => {
    return await httpRequest.remove(endpoint, { data });
};

export const updateInactiveAsync = async (id, inactive, force_child) => {
    return await httpRequest.put(`${endpoint}/UpdateInactive`, {
        id,
        inactive,
        force_child
    });
};
