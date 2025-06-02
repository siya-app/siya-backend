import { fetchDataBusiness } from "./business.service.js";
import { fetchDataTerraces } from "./terrace.service.js";
export async function fetchAllDataFromApis() {
    const [businesses, terraces] = await Promise.all([
        fetchDataBusiness(),
        fetchDataTerraces()
    ]);
    return { businesses, terraces };
}
;
//# sourceMappingURL=all.data.service.js.map