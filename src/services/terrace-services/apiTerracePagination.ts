// import { axiosRequest } from "../../config/api-connection-service.js";
// import { TerraceApiType } from "../../models/terrace-model/zod/terrace-schema.js";
// import { apiTerrace } from "./terrace.service.js";
// import { ENV } from "../../config/env.js";
// import { writeFileSync } from "fs";


// type PaginatedAPIResponse<T> = {
//     result: {
//         total: number;
//         records: TerraceApiType[];
//         resource_id: string,
//         limit: number,
//         _links: { next?: string }
//     };
// };

// export async function fetchAllTerracePages(): Promise<TerraceApiType[]> {
//     const allData: TerraceApiType[] = [];
//     let nextUrl: string | null = ENV.TERRACE_API_URL;
//     let index = 0;

//     while (nextUrl) {
//         try {
//             const response = await axiosRequest(apiTerrace, nextUrl);
//             const records = response?.result?.records;
//             const totalLength: number = response?.result?.total

//             await new Promise((resolve) => setTimeout(resolve, 3000)); // pause to be kind to API

//             // console.log(totalLength, `🔍 iteration: ${index}`)

//             if (!records) {
//                 console.log("✔️ No more terraces to fetch, finishing loop");
//                 break;
//             }

//             // console.log(records.map((record:any, index: number) => record.EMPLACAMENT))

//             allData.push(...records);
//             console.log(`✅ Terrace page ${index + 1}: fetched ${records.length} items, total so far: ${allData.length}`);

//             const nextLink = response.result._links?.next;
//             nextUrl = nextLink
//                 ? `https://opendata-ajuntament.barcelona.cat/data${nextLink}`
//                 : null;

//             await new Promise((resolve) => setTimeout(resolve, 2000));
//             index++;

//         } catch (error: any) {
//             console.error("❌ Error fetching terraces:", error?.message || error);
//             break;
//         }
//     }

//     console.log(`🏁 All terraces fetched: ${allData.length}`);
//     writeFileSync("terraces1.json", JSON.stringify(allData, null, 2));
//     return allData;
// }


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

export async function fetchAllTerracePages(): Promise<void> {
    const outputFile = "terraces.json";
    const writeStream = createWriteStream(outputFile);
    let isFirstRecord = true;
    let nextUrl: string | null = ENV.TERRACE_API_URL;
    let index = 0;
    let totalRecordsFetched = 0;
    let records = [];

    // Start JSON array
    writeStream.write('[\n');

    try {
        while (nextUrl) {
            const response = await axiosRequest(apiTerrace, nextUrl);
            records = response?.result?.records;
            const totalLength: number = response?.result?.total;

            if (!records || records.length === 0) {
                console.log("✔️ No more terraces to fetch, finishing loop");
                break;
            }

            // Write records to file
            for (const record of records) {
                if (!isFirstRecord) {
                    writeStream.write(',\n');
                } else {
                    isFirstRecord = false;
                }
                writeStream.write('  ' + JSON.stringify(record, null, 2));
            }

            totalRecordsFetched += records.length;
            console.log(`✅ Terrace page ${index + 1}: fetched ${records.length} items, total so far: ${totalRecordsFetched}`);

            // Get next page URL
            const nextLink = response.result._links?.next;
            nextUrl = nextLink
                ? `https://opendata-ajuntament.barcelona.cat/data${nextLink}`
                : null;

            index++;

            // Add delay between requests
            if (nextUrl) {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }

        // End JSON array
        writeStream.write('\n]');
        console.log(`🏁 All terraces fetched: ${totalRecordsFetched}`);
        return records;
    } catch (error: any) {
        console.error("❌ Error fetching terraces:", error?.message || error);
        // Close the stream cleanly even on error
        writeStream.write(']');
        throw error;
    } finally {
        writeStream.end();
    }
}