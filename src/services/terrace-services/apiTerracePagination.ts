import { axiosRequest } from "../../config/api-connection-service.js";
import { TerraceApiType } from "../../models/terrace-model/zod/terrace-schema.js";
import { apiTerrace } from "./terrace.service.js";
import { ENV } from "../../config/env.js";
import { createWriteStream } from "fs";

type PaginatedAPIResponse<T> = {
    result: {
        total: number;
        records: TerraceApiType[];
        resource_id: string;
        limit: number;
        _links: { next?: string };
    };
};

export async function fetchAllTerracePages(): Promise<TerraceApiType[]> {
    const allTerraces: TerraceApiType[] = [];
    let nextUrl: string | null = ENV.TERRACE_API_URL;
    let index = 0;

    try {
        while (nextUrl) {
            const response = await axiosRequest(apiTerrace, nextUrl);
            const records = response?.result?.records;

            if (!records || records.length === 0) {
                console.log("✔️ No more terraces to fetch");
                break;
            }

            allTerraces.push(...records);

            console.log(
                `✅ Page ${index + 1}: fetched ${records.length} terraces, total so far: ${allTerraces.length}`
            );

            const nextLink = response.result._links?.next;
            nextUrl = nextLink
                ? `https://opendata-ajuntament.barcelona.cat/data${nextLink}`
                : null;

            index++;
            if (nextUrl) await new Promise((res) => setTimeout(res, 3000));
        }

        console.log(`🏁 Finished fetching terraces: ${allTerraces.length}`);
        return allTerraces;
    } catch (error: any) {
        console.error("❌ Error fetching terraces:", error?.message || error);
        throw error;
    }
}

// export async function fetchAllTerracePages(): Promise<TerraceApiType[]> {
//     const outputFile = "terraces.json";
//     const writeStream = createWriteStream(outputFile);
//     let isFirstRecord = true;
//     let nextUrl: string | null = ENV.TERRACE_API_URL;
//     let index = 0;
//     let totalRecordsFetched = 0;
//     let records = [];

//     // starts JSON array
//     writeStream.write('[\n');

//     try {
//         while (nextUrl) {
//             const response = await axiosRequest(apiTerrace, nextUrl);
//             records = response?.result?.records;
//             const totalLength: number = response?.result?.total;

//             if (!records || records.length === 0) {
//                 console.log("✔️ No more terraces to fetch, finishing loop");
//                 break;
//             }

//             // write records to file
//             for (const record of records) {
//                 if (!isFirstRecord) {
//                     writeStream.write(',\n');
//                 } else {
//                     isFirstRecord = false;
//                 }
//                 writeStream.write('  ' + JSON.stringify(record, null, 2));
//             }

//             totalRecordsFetched += records.length;
//             console.log(`✅ Terrace page ${index + 1}: fetched ${records.length} items, total so far: ${totalRecordsFetched}`);

//             const nextLink = response.result._links?.next;
//             nextUrl = nextLink
//                 ? `https://opendata-ajuntament.barcelona.cat/data${nextLink}`
//                 : null;

//             index++;

//             if (nextUrl) {
//                 await new Promise(resolve => setTimeout(resolve, 3000));
//             }
//         }

//         // ends JSON array
//         writeStream.write('\n]');
//         console.log(`🏁 All terraces fetched: ${totalRecordsFetched}`);
//         return records;

//     } catch (error: any) {
//         console.error("❌ Error fetching terraces:", error?.message || error);
//         // close the stream even on error
//         writeStream.write(']');
//         throw error;

//     } finally {
//         writeStream.end();
//     }
// }