import axios from "axios";
let API_BASE_URL = '';
// API INSTANCE
export const createApiInstance = (baseURL) => {
    return axios.create({
        baseURL,
        timeout: 3000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
};
export const api = createApiInstance(API_BASE_URL);
//# sourceMappingURL=api-connection-config.js.map