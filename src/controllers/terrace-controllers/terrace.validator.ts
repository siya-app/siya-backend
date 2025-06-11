import { fetchAllDataFromApis } from "../../services/terrace-services/all.data.service.js";
import { matchByCoords } from "./validators/coordsValidator.js";
// import { matchByCoordsAndAddress } from "./validators/addressValidator.js";
import { createCustomTerrace } from "./validators/createCustomTerrace.js";
import { createOrUpdateTerrace } from "./validators/createOrUpdateTerrace.js";
import type { TerraceApiType } from "../../models/terrace-model/zod/terrace-schema.js";
import { CustomTerraceType } from "../../models/terrace-model/zod/customTerrace-schema.js";
import { match } from "assert";
import { BusinessApiType } from "../../models/terrace-model/zod/business-schema.js";
import { readJsonArray } from "../../utils/terrace-utils/readJson.js";
// import type { BusinessApiType } from "../../models/terrace-model/zod/business-schema.js";
import Terrace from "../../models/terrace-model/db/terrace-model-sequelize.js";

const customTerracesData: any[] = [];
let businesses: BusinessApiType[] = [];
let terraces: TerraceApiType[] = [];
let fullBusinesses: BusinessApiType[] = [];
let fullTerraces: TerraceApiType[] = [];
let uniqueBusinesses: BusinessApiType[] = [];
let count = 0;

export async function createCustomValidatedTerrace() {

    // const { businesses, terraces } = await fetchAllDataFromApis();
    try {
        fullBusinesses = await readJsonArray<BusinessApiType>("./businesses-restaurants.json");
        fullTerraces = await readJsonArray<TerraceApiType>("./terraces.json");
        businesses = fullBusinesses.slice(0,100);
        terraces = fullTerraces.slice(0,200);
        console.log('Loaded businesses in createCustomValidatedTerrace():', businesses.length);
        console.log('Loaded terraces: in createCustomValidatedTerrace()', terraces.length);
    } catch (error) {
        console.error('❌ Error loading JSONs:', error);
    }

    const unmatchedTerraces: TerraceApiType[] = [];

    for (let i = 0; i < terraces.length; i++) {
        const terrace = terraces[i];

        if (!terrace || !businesses) {
            console.error(`no data to validate`);
            continue;
        }

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

        for (const biz of uniqueBusinesses) {
            count++;
            console.warn(biz.Nom_Local)
            await createOrUpdateTerrace(terrace, biz);
        }

    }

        if (unmatchedTerraces.length > 0) {
            console.warn(`There are ${unmatchedTerraces.length} unmatched terraces.`);
            console.warn(`There are ${customTerracesData.length} matched terraces.`);
        }

}