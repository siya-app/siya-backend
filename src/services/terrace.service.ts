import { createApiInstance } from '../config/api-connection-config'
import { axiosRequest } from '../config/api-connection-service';

const API_TERRACE: string = process.env.TERRACE_API_URL || "";

if (!process.env.TERRACE_API_URL) {
    throw new Error("Environment variable TERRACE_API_URL is not defined");
}

const apiTerrace = createApiInstance(API_TERRACE);

export async function fetchDataTerraces(): Promise<object[]> {

    try {
        const response = await axiosRequest(apiTerrace, API_TERRACE);
        console.log("✅ Received data:", response);

        const records = response.result.records;
        if (!records) return [];

        console.log("✅ Received terraces data.records:", records);
        return records;

    } catch(error) {
        console.log("❌ Error fetching terraces, error:", error);
        return [];
    }
}

// fetchDataTerraces();