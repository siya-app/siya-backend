
import { axiosRequest } from "../../config/api-connection-service.js";
import { BusinessApiType } from "../../models/terrace-model/zod/business-schema.js";
import { apiBusiness } from "./business.service.js";
import { ENV } from "../../config/env.js";
import { createWriteStream } from "fs";

type PaginatedAPIResponse<T> = {
    result: {
        total: number;
        records: BusinessApiType[];
        resource_id: string;
        limit: number;
        _links: { next?: string };
    };
};

export async function fetchAllBusinessPages(): Promise<BusinessApiType[]> {
    const allBusinesses: BusinessApiType[] = [];
    let nextUrl: string | null = ENV.BUSINESS_API_URL;
    let index = 0;

    try {
        while (nextUrl) {
            const response = await axiosRequest(apiBusiness, nextUrl);
            const records = response?.result?.records;

            if (!records || records.length === 0) {
                console.log("✔️ No more businesses to fetch");
                break;
            }

            // Filter by activity code
            for (const record of records) {
                if (record.Codi_Activitat_2022 === "1400002" ||
                    record.Codi_Activitat_2022 === "1400003") {
                    allBusinesses.push(record);
                }
            }

            console.log(
                `✅ Page ${index + 1}: fetched ${records.length} businesses, total saved: ${allBusinesses.length}`
            );

            const nextLink = response.result._links?.next;
            nextUrl = nextLink
                ? `https://opendata-ajuntament.barcelona.cat/data${nextLink}`
                : null;

            index++;
            if (nextUrl) await new Promise((res) => setTimeout(res, 3000));
        }

        console.log(`🏁 Finished fetching businesses: ${allBusinesses.length}`);
        return allBusinesses;
    } catch (error: any) {
        console.error("❌ Error fetching businesses:", error?.message || error);
        throw error;
    }
}

// export async function fetchAllBusinessPages(): Promise<BusinessApiType[]> {
//     const outputFile = "businesses-restaurants.json";
//     const writeStream = createWriteStream(outputFile);
//     let isFirstRecord = true;
//     let nextUrl: string | null = ENV.BUSINESS_API_URL;
//     let index = 0;
//     let totalRecordsFetched = 0;
//     let records = [];

//     // Start JSON array with pretty formatting
//     writeStream.write('[\n');

//     try {
//         while (nextUrl) {
//             const response = await axiosRequest(apiBusiness, nextUrl);
//             records = response?.result?.records;

//             if (!records || records.length === 0) {
//                 console.log("✔️ No more businesses to fetch");
//                 break;
//             }
//             // Write records with indentation
//             for (const record of records) {

//                 if (record.Codi_Activitat_2022 === "1400002" || record.Codi_Activitat_2022 === "1400003") {
//                     if (!isFirstRecord) {
//                         writeStream.write(',\n'); // Newline + comma between records
//                     } else {
//                         isFirstRecord = false;
//                     }
//                     // Pretty-print each record (indent 2 spaces)
//                     writeStream.write('  ' + JSON.stringify(record, null, 2));
//                 }
//             }

//             totalRecordsFetched += records.length;
//             console.log(`✅ Businesses page ${index + 1}: Fetched ${records.length} | Total: ${totalRecordsFetched}`);

//             // Get next page URL
//             const nextLink = response.result._links?.next;
//             nextUrl = nextLink
//                 ? `https://opendata-ajuntament.barcelona.cat/data${nextLink}`
//                 : null;

//             index++;

//             // Throttle requests (adjust delay as needed)
//             if (nextUrl) await new Promise(resolve => setTimeout(resolve, 3000));
//         }

//         // Close JSON array
//         writeStream.write('\n]');
//         console.log(`🏁 Finished! Total businesses saved: ${totalRecordsFetched}`);
//         return records;
//     } catch (error: any) {
//         console.error("❌ Error:", error?.message || error);
//         // Ensure JSON is valid even if error occurs
//         writeStream.write('\n]');
//         throw error;
//     } finally {
//         writeStream.end();
//     }

// }