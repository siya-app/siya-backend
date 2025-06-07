import { axiosRequest } from "../../config/api-connection-service.js";
import { TerraceApiType } from "../../models/terrace-model/zod/terrace-schema.js";
import { apiBusiness } from "./business.service.js";
import { ENV } from "../../config/env.js";
import { BusinessApiType, BusinessSchema } from "../../models/terrace-model/zod/business-schema.js";


type PaginatedAPIResponse<T> = {
    result: {
        total: number;
        records: TerraceApiType[];
        resource_id: string,
        limit: number,
        _links: { next?: string }
    };
};

export async function fetchAllBusinessPages(): Promise<BusinessApiType[]> {
    const allRestaurantsData: BusinessApiType[] = [];
    let nextUrl: string | null = ENV.BUSINESS_API_URL;
    let index = 0;

    while (nextUrl) {
        try {
            const response = await axiosRequest(apiBusiness, nextUrl);
            const records = response?.result?.records;
            const totalLength: number = response?.result?.total

            await new Promise((resolve) => setTimeout(resolve, 3000)); // pause to be kind to API

            console.log(totalLength, `🔍 iteration: ${index}`)

            if (!records) {
                console.log("✔️ No more records to fetch");
                break;
            }


            // console.log(records.map((record:any, index: number) => record.Nom_Local + index));

            records.map((record: BusinessApiType) => {
                if (record.Codi_Activitat_2022 === "1400002") {
                    console.log(record.Nom_Local)
                    allRestaurantsData.push(record)
                }
            })
            console.log(`✅ Page ${index + 1}: fetched ${records.length} items, total so far: ${allRestaurantsData.length}`);

            const nextLink = response.result._links?.next;
            console.log(nextLink)
            nextUrl = nextLink
                ? `https://opendata-ajuntament.barcelona.cat/data${nextLink}`
                : null;

            await new Promise((resolve) => setTimeout(resolve, 1000)); // pause to be kind to API
            index++;

        } catch (error: any) {
            console.log("❌ Error fetching terraces:", error?.message || error);
            break;
        }
    }

    console.log(`🏁 All records fetched: ${allRestaurantsData.length}`);
    return allRestaurantsData;
}