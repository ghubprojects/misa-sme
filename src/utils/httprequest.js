import { useErrorStore } from '@/stores';
import axios from 'axios';
import { AxiosError } from 'axios';

/**
 * Tạo axios instance
 * create by: ttanh (25/08/2023)
 */
const request = axios.create({
    baseURL: 'https://localhost:7089/api/'
});

/**
 * Tạo get request đến API
 * @param {string} url API path
 * @param {object} configs bao gồm params, etc
 * @returns response từ API
 * Created by: ttanh (25/08/2023)
 */
export const get = async (url, configs = {}) => {
    try {
        const response = await request.get(url, configs);
        return response;
    } catch (err) {
        if (err instanceof AxiosError) {
            const Error = useErrorStore();
            Error.show(err);
        }
    }
};

/**
 * Tạo post request đến API
 * @param {string} url API path
 * @param {object} configs bao gồm params, etc
 * @returns response từ API
 * Created by: ttanh (25/08/2023)
 */
export const post = async (url, configs = {}) => {
    try {
        const response = await request.post(url, configs);
        return response;
    } catch (err) {
        if (err instanceof AxiosError) {
            const Error = useErrorStore();
            Error.show(err);
        }
    }
};

/**
 * Tạo post request đến API
 * @param {string} url API path
 * @param {object} configs bao gồm params, etc
 * @returns response từ API
 * Created by: ttanh (21/09/2023)
 */
export const put = async (url, configs = {}) => {
    try {
        const response = await request.put(url, configs);
        console.log(url, configs);
        return response;
    } catch (err) {
        if (err instanceof AxiosError) {
            const Error = useErrorStore();
            Error.show(err);
        }
    }
};

/**
 * Tạo delete request đến API
 * @param {string} url API path
 * @param {object} configs bao gồm params, etc
 * @returns response từ API
 * Created by: ttanh (10/09/2023)
 */
export const remove = async (url, configs = {}) => {
    try {
        const response = await request.delete(url, configs);
        console.log(url, configs);
        return response;
    } catch (err) {
        if (err instanceof AxiosError) {
            const Error = useErrorStore();
            Error.show(err);
        }
    }
};

export default request;
