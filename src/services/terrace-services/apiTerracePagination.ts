import { axiosRequest } from "../../config/api-connection-service.js";
import { TerraceApiType } from "../../models/terrace-model/zod/terrace-schema.js";
import { apiTerrace } from "./terrace.service.js";
import { ENV } from "../../config/env.js";
import { writeFileSync } from "fs";


type PaginatedAPIResponse<T> = {
    result: {
        total: number;
        records: TerraceApiType[];
        resource_id: string,
        limit: number,
        _links: { next?: string }
    };
};

export async function fetchAllTerracePages(): Promise<TerraceApiType[]> {
    const allData: TerraceApiType[] = [];
    let nextUrl: string | null = ENV.TERRACE_API_URL;
    let index = 0;

    while (nextUrl) {
        try {
            const response = await axiosRequest(apiTerrace, nextUrl);
            const records = response?.result?.records;
            const totalLength: number = response?.result?.total

            await new Promise((resolve) => setTimeout(resolve, 3000)); // pause to be kind to API

            // console.log(totalLength, `🔍 iteration: ${index}`)

            if (!records) {
                console.log("✔️ No more terraces to fetch, finishing loop");
                break;
            }

            // console.log(records.map((record:any, index: number) => record.EMPLACAMENT))

            allData.push(...records);
            console.log(`✅ Page ${index + 1}: fetched ${records.length} items, total so far: ${allData.length}`);

            const nextLink = response.result._links?.next;
            nextUrl = nextLink
                ? `https://opendata-ajuntament.barcelona.cat/data${nextLink}`
                : null;

            await new Promise((resolve) => setTimeout(resolve, 1000));
            index++;

        } catch (error: any) {
            console.error("❌ Error fetching terraces:", error?.message || error);
            break;
        }
    }

    console.log(`🏁 All terraces fetched: ${allData.length}`);
    writeFileSync("data/terraces.json", JSON.stringify(allData, null, 2));
    return allData;
}