// import { fetchAllDataFromApis } from "../../services/terrace-services/all.data.service.js";
// import { matchByCoords } from "./validators/coordsValidator.js";
// import { matchByCoordsAndAddress } from "./validators/addressValidator.js";
// import { createCustomTerrace } from "./validators/createCustomTerrace.js";
// import type { TerraceApiType } from "../../models/terrace-model/zod/terrace-schema.js";
// import type { BusinessApiType } from "../../models/terrace-model/zod/business-schema.js";
// import Terrace from "../../models/terrace-model/db/terrace-model-sequelize.js";

// export async function createCustomValidatedTerrace() {

//     const { businesses, terraces } = await fetchAllDataFromApis();
//     let customTerraces: any[] = [];
//     const unmatchedTerraces: TerraceApiType[] = [];

//     for (const terrace of terraces) {

//         let matchingRestaurants = matchByCoords(terrace, businesses);

//         if (!matchingRestaurants || matchingRestaurants.length === 0) {
//             // No coords match → add to unmatched for manual review
//             unmatchedTerraces.push(terrace);
//             continue;
//         }

//         if (matchingRestaurants.length === 1) {
//             // Only one match by coords → create directly
//             const custom = createCustomTerrace(terrace, matchingRestaurants[0]);
//             customTerraces.push(custom);
//             continue;
//         }

//         if (matchingRestaurants !== null) {
//             const { validMatches, invalidMatches } = matchByCoordsAndAddress(terrace, matchingRestaurants) || {};

//             if (!validMatches || validMatches.length !== 1) {
//                 unmatchedTerraces.push(terrace);
//             } else {
//                 const custom = createCustomTerrace(terrace, validMatches[terrace]);
//                 customTerraces.push(custom);
//             }
            
//         }
//     }

//     try {
//         if (customTerraces.length > 0) {
//             await Terrace.bulkCreate(customTerraces, {
//                 updateOnDuplicate: [
//                     'business_name',
//                     'tables',
//                     'seats',
//                     'opening_hours',
//                     'average_price',
//                     'average_rating',
//                     'has_wifi',
//                     'pet_friendly',
//                     'can_smoke',
//                     'has_kitchen'
//                 ]
//             })
//         }
//         console.log(`Inserted or updated ${customTerraces.length} terraces.`);

//         if (unmatchedTerraces.length > 0) {
//             console.warn(`There are ${unmatchedTerraces.length} unmatched terraces.`);
//         }

//     } catch(err) {
//         console.error('❌ Error saving terraces to DB:', err);
//     }
// }