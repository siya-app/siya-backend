import { fetchAllDataFromApis } from "../../services/terrace-services/all.data.service.js";
import { matchByCoords } from "./validators/coordsValidator.js";
// import { matchByCoordsAndAddress } from "./validators/addressValidator.js";
import { createCustomTerrace } from "./validators/createCustomTerrace.js";
import type { TerraceApiType } from "../../models/terrace-model/zod/terrace-schema.js";
import { CustomTerraceType } from "../../models/terrace-model/zod/customTerrace-schema.js";
import { match } from "assert";
import { BusinessApiType } from "../../models/terrace-model/zod/business-schema.js";
import { readJsonArray } from "../../utils/terrace-utils/readJson.js";
// import type { BusinessApiType } from "../../models/terrace-model/zod/business-schema.js";
// import Terrace from "../../models/terrace-model/db/terrace-model-sequelize.js";

const customTerracesData: any[] = [];
let businesses: BusinessApiType[] = [];
let terraces: TerraceApiType[] = [];
let uniqueBusinesses: BusinessApiType[] = [];

export async function createCustomValidatedTerrace() {

    // const { businesses, terraces } = await fetchAllDataFromApis();
    try {
        businesses = await readJsonArray<BusinessApiType>("./businesses-restaurants.json");
        terraces = await readJsonArray<TerraceApiType>("./terraces.json");
        console.log('Loaded businesses in createCustomValidatedTerrace():', businesses.length);
        console.log('Loaded terraces: in createCustomValidatedTerrace()', terraces.length);
    } catch (error) {
        console.error('❌ Error loading JSONs:', error);
    }

    let customTerraces: any[] = [];
    const unmatchedTerraces: TerraceApiType[] = [];

    for (let i = 0; i < terraces.length; i++) {
        const terrace = terraces[i];

        if (!terrace || !businesses) return console.error(`no data to validate`);

        let matchingBusinesses: BusinessApiType[] = matchByCoords(
            terrace,
            businesses,
            0.000063
        ) || [];

        uniqueBusinesses = Array.from(
            new Map(matchingBusinesses.map(biz => [biz.ID_Global, biz])).values()
        );

        if (uniqueBusinesses.length === 0) {
            unmatchedTerraces.push(terrace);
            continue;
        }

        uniqueBusinesses.forEach((biz) => {
            const custom = createCustomTerrace(terrace, biz);
            customTerracesData.push(custom);
        });

        customTerracesData.forEach((terr, j) => {
            console.log(`${j + 1} ${terr.business_name}`);
        })
    }

    try {
        if (customTerracesData.length > 0) {
            console.warn(`here we would bulkCreate terraces`)
            // await Terrace.bulkCreate(customTerraces, {
            //     updateOnDuplicate: [
            //         'business_name',
            //         'tables',
            //         'seats',
            //         'opening_hours',
            //         'average_price',
            //         'average_rating',
            //         'has_wifi',
            //         'pet_friendly',
            //         'can_smoke',
            //         'has_kitchen'
            //     ]
            // })
            console.warn(`customterraces is bigger than zero wiiii - the object would be created`)
        }
        console.warn(`Inserted or updated ${customTerraces.length} terraces.`);

        if (unmatchedTerraces.length > 0) {
            console.warn(`There are ${unmatchedTerraces.length} unmatched terraces.`);
            console.warn(`There are ${customTerracesData.length} matched terraces.`);
        }

    } catch (err) {
        console.error('❌ Error saving terraces to DB:', err);
    }

    // customTerracesData.forEach((biz: BusinessApiType, i: number) => console.log(`${i + 1}. ${biz.Nom_Local}`))

}