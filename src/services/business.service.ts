import { createApiInstance } from '../config/api-connection-config.js'
import { axiosRequest } from '../config/api-connection-service.js';
import { ENV } from '../config/env.js';

const BUSINESS_API: string = ENV.BUSINESS_API_URL || "";

if (!process.env.BUSINESS_API_URL) {
    throw new Error("Environment variable BUSINESS_API_URL is not defined");
}

console.log(BUSINESS_API);

const apiBusiness = createApiInstance(BUSINESS_API);

export async function fetchDataBusiness(): Promise<object[]> {

    try {
        const response = await axiosRequest(apiBusiness, BUSINESS_API);
        console.log("✅ Received data:", response);

        const records = response.result.records;
        if (!records) return [];

        console.log("✅ Received businesses data.records:", records);
        return records;

    } catch(error) {
        console.log("❌ Error fetching terraces, error:", error);
        return [];
    }
}

// fetchDataBusiness();
