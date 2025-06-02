import { createApiInstance } from '../../config/api-connection-config.js';
import { axiosRequest } from '../../config/api-connection-service.js';
import { ENV } from '../../config/env.js';
const BUSINESS_API = ENV.BUSINESS_API_URL || "";
if (!BUSINESS_API) {
    throw new Error("Environment variable BUSINESS_API_URL is not defined");
}
// console.log(BUSINESS_API);
const apiBusiness = createApiInstance(BUSINESS_API);
export async function fetchDataBusiness() {
    try {
        const response = await axiosRequest(apiBusiness, BUSINESS_API, { limit: 3 });
        // console.log("✅👔 Received data from api business");
        // console.log("✅ Received data:", response.Nom_CComercial);
        const records = response?.result?.records;
        if (!records)
            return [];
        // console.log("✅ Received businesses data.records");
        console.warn("✅👔 Received data from api businesses:", records.length);
        return records;
    }
    catch (error) {
        console.log("❌ Error fetching businesses, error:", error);
        return [];
    }
}
// fetchDataBusiness();
//# sourceMappingURL=business.service.js.map