import { createApiInstance } from '../../config/api-connection-config.js'
import { axiosRequest } from '../../config/api-connection-service.js';
import { ENV } from '../../config/env.js';

const TERRACE_API: string = ENV.TERRACE_API_URL || "";

if (!TERRACE_API) {
    throw new Error("Environment variable TERRACE_API_URL is not defined");
}

const apiTerrace = createApiInstance(TERRACE_API);

export async function fetchDataTerraces(): Promise<object[]> {

    try {
        const response = await axiosRequest(apiTerrace, TERRACE_API, { limit: 3 });

        const totalLength = response?.result?.total;

        const records = response?.result?.records;
        if (!records || records.length === 0) {
            console.log("❌ No terrace records found");
            return [];
        }

        console.log("✅🍸 Received data from api terraces,", "records.length", records.length, "total length:", totalLength);
        console.log("✅ Received terraces data.records");
        return response;

    } catch (error) {
        console.log("❌ Error fetching terraces, error:", error);
        return [];
    }
}