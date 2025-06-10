import { fetchAllTerracePages } from "./apiTerracePagination.js";
import { fetchAllBusinessPages } from "./apiBusinessPagination.js";
export async function fetchAllDataFromApis() {
    const [businesses, terraces] = await Promise.all([
        fetchAllBusinessPages(),
        fetchAllTerracePages()
    ]);
    return { businesses, terraces };
}
;
//# sourceMappingURL=all.data.service.js.map