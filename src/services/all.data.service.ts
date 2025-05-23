import { fetchDataBusiness } from "./business.service";
import { fetchDataTerraces } from "./terrace.service";
import type { BusinessApiType } from "../models/zod/business-schema";
import type { TerraceApiType } from "../models/zod/terrace-schema";

export async function fetchAllDataFromApis() {
    const [businesses, terraces] = await Promise.all([
        fetchDataBusiness() as Promise<BusinessApiType[]>,
        fetchDataTerraces() as Promise<TerraceApiType[]>
    ])
    return { businesses, terraces }
};