import { fetchDataBusiness } from "./business.service.js";
import { fetchDataTerraces } from "./terrace.service.js";
import type { BusinessApiType } from "../../models/terrace-model/zod/business-schema.js";
import type { TerraceApiType } from "../../models/terrace-model/zod/terrace-schema.js";

export async function fetchAllDataFromApis() {
    const [businesses, terraces] = await Promise.all([
        fetchDataBusiness() as Promise<BusinessApiType[]>,
        fetchDataTerraces() as Promise<TerraceApiType[]>
    ])
    return { businesses, terraces }
};
