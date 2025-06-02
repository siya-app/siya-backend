import axios from "axios";
// CREATE (POST)
export const axiosCreate = async (api, endpoint, input) => {
    try {
        const response = await api.post(endpoint, input);
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Error creating object, error: ${error}`);
            console.error("API Error:", error.response?.data.message);
        }
        else {
            console.error("Unexpected Error:", error);
        }
        return null;
    }
};
// READ (GET) - API_KEY --> queryParams
export const axiosRequest = async (api, url, queryParams) => {
    let apiResponse = null;
    let apiError = null;
    try {
        const response = await api.get(url, {
            params: queryParams
        });
        return apiResponse = response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            apiError = {
                name: error.name || "AxiosError",
                message: error.message,
                status: error.response?.status
            };
        }
        else {
            return apiError = {
                name: "UnknownError",
                message: "An unknown error occurred",
                status: undefined
            };
        }
    }
    return null;
};
// UPDATE (PUT)
export const axiosUpdate = async (api, endpoint, id, updatedObj) => {
    try {
        const response = await api.put(`${endpoint}/${id}`, updatedObj);
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Error updating object id:${id}, error: ${error}`);
            console.error("API Error:", error.response?.data.message);
        }
        else {
            console.error("Unexpected Error:", error);
        }
        return null;
    }
};
// DELETE
export const axiosDelete = async (api, endpoint, id) => {
    try {
        await api.delete(`${endpoint}/${id}`);
        return console.log(`User id:${id} deleted successfully.`);
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Error deleting object id: ${id}, eror: ${error}`);
            console.error("API Error:", error.response?.data.message);
        }
        else {
            console.error("Unexpected Error:", error);
        }
        return null;
    }
};
//# sourceMappingURL=api-connection-service.js.map