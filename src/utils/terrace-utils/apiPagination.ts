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

export async function fetchAllTerracePages(
): Promise<{ data: TerraceApiType[] | [] }> {


    const allData = [];
    let index: number = 0;
    const apiResponse: PaginatedAPIResponse<any> = await axiosRequest(apiTerrace, ENV.TERRACE_API_URL);
    const resource_id = apiResponse.result.resource_id;
    const limit = apiResponse.result.limit;
    const baseUrl = `${ENV.TERRACE_API_URL}?resource_id=${resource_id}&limit=${limit}`;
    let nextUrl: string | null = baseUrl;

    // const records = await fetchDataTerraces();
    // let nextUrl: string | null = '';

    // while (records.length > 0) {
    //     const response = await axiosRequest(nextUrl);
    //     const json = await response.json() as PaginatedAPIResponse<TerraceApiType>;
    //     console.log(response.json.records[index].EMPLACAMENT)

    //     const records = json.result.records as T[];
    //     if (records.length === 0) {
    //         nextUrl = null;
    //         break;
    //     }

    //     allData.push(...records);

    //     console.log(`✅ Page fetched: ${records.length} items`);

    //     // Get the next URL (if any)
    //     const nextLink = json.result._links?.next;
    //     nextUrl = nextLink
    //         ? `https://opendata-ajuntament.barcelona.cat${nextLink}`
    //         : null;

    //     await new Promise((resolve) => setTimeout(resolve, 2000));
    //     index ++;
    // }

    // return { data: allData };


    while (nextUrl) {

        try {
            const response = await axiosRequest(apiTerrace, nextUrl, limit);
            const totalLength = response?.result?.total;
            const records = response?.result?.records;

            if (records.length === 0 || index === 4) {
                console.log(`breaking the loop for this reason`)
                break; // ✅ stop when empty
            }
            allData.push(...records._id);

            const nextLink = response.result._links?.next;

            nextUrl = response.result._links?.next
                ? `https://opendata-ajuntament.barcelona.cat${nextLink}`
                : null;

            console.log("✅🍸 Received data from api terraces,", "records.length", records.length, "total length:", totalLength);
            console.log("✅ Received terraces data.records, addresses:", records[index].EMPLACAMENT);
            index++;

        } catch (error: any) {
            console.log("❌ Error fetching terraces, error:", error.errors);
        }

    }
    console.log(`alldata length --> ${allData.length} has duplicates? --> ${hasDuplicates(allData)}`)
    return { data: allData };
}

function hasDuplicates<T>(array: T[]): boolean {
    return new Set(array).size !== array.length;
}