import axios, { type AxiosInstance } from "axios";

let API_BASE_URL: string = '';

// API INSTANCE
export const createApiInstance = (baseURL: string): AxiosInstance => { 
    return axios.create({
        baseURL,
        timeout: 3000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
}

export const api = createApiInstance(API_BASE_URL);