import * as httpRequest from '@/utils/httprequest';
import { table } from '@/utils/table';

const endpoint = 'Employees';

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
