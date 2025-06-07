import { axiosRequest } from "../../config/api-connection-service.js";
import { TerraceApiType } from "../../models/terrace-model/zod/terrace-schema.js";
import { apiTerrace } from "../../services/terrace-services/terrace.service.js";
import { ENV } from "../../config/env.js";
import axios from "axios";
import { response } from "express";



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
            const response = await axiosRequest(apiTerrace, nextUrl, { limit: 100 });
            const records = response?.result?.records;

            // console.log(records.map((record:any, index: number) => record.EMPLACAMENT))
            const totalLength = response?.result?.total;

            if (!records || records.length === 0) {
                console.log("✔️ No more records to fetch");
                break;
            }

            allData.push(...records);
            console.log(`✅ Page ${index + 1}: fetched ${records.length} items, total so far: ${allData.length}`);

            const nextLink = response.result._links?.next;
            nextUrl = nextLink
                ? `https://opendata-ajuntament.barcelona.cat${nextLink}`
                : null;

            await new Promise((resolve) => setTimeout(resolve, 1000)); // pause to be kind to API
            index++;

        } catch (error: any) {
            console.log("❌ Error fetching terraces:", error?.message || error);
            break;
        }
    }

    console.log(`🏁 All records fetched: ${allData.length}`);
    return allData;
}