import { axiosRequest } from "../../config/api-connection-service.js";
import { TerraceApiType } from "../../models/terrace-model/zod/terrace-schema.js";
import { fetchDataTerraces } from "../../services/terrace-services/terrace.service.js";



type PaginatedAPIResponse<T> = {
    result: {
        total: number;
        records: TerraceApiType[];
        _links: { next?: string }
    };
};

export async function fetchAllPages<TerraceApiType>(
): Promise<{ data: TerraceApiType[] }> {

    const data = await fetchDataTerraces();
    let nextUrl: string | null = data.
    const allData: TerraceApiType[] = [];
    let index: number = 0;

    while (nextUrl) {
        index ++;
        const response = await axiosRequest(nextUrl);
        const json = await response.json() as PaginatedAPIResponse<TerraceApiType>;
        console.log(response.json.records[index].EMPLACAMENT)

        const records = json.result.records as T[];
        if (records.length === 0) {
            nextUrl = null;
            break;
        }

        allData.push(...records);

        console.log(`✅ Page fetched: ${records.length} items`);

        // Get the next URL (if any)
        const nextLink = json.result._links?.next;
        nextUrl = nextLink
            ? `https://opendata-ajuntament.barcelona.cat${nextLink}`
            : null;

        await new Promise((resolve) => setTimeout(resolve, 2000)); // 🕒 avoid rate limits
    }

    return { data: allData };
}