import { fetchAllDataFromApis } from "../../services/terrace-services/all.data.service.js";
import { matchByCoords } from "./validators/coordsValidator.js";
import { matchByCoordsAndAddress } from "./validators/addressValidator.js";
import { createCustomTerrace } from "./validators/createCustomTerrace.js";
import type { TerraceApiType } from "../../models/terrace-model/zod/terrace-schema.js";
// import type { BusinessApiType } from "../../models/terrace-model/zod/business-schema.js";
// import Terrace from "../../models/terrace-model/db/terrace-model-sequelize.js";

export async function createCustomValidatedTerrace() {

    const { businesses, terraces } = await fetchAllDataFromApis();
    let customTerraces: any[] = [];
    const unmatchedTerraces: TerraceApiType[] = [];

    for (let i = 0; i < terraces.length ; i++) {
        const terrace = terraces[i];

        let matchingRestaurants = matchByCoords(terrace, businesses);

        // if(matchingRestaurants !== null ) console.warn(matchingRestaurants[0])
        

        if (!matchingRestaurants || matchingRestaurants.length === 0) {
            // No coords match → add to unmatched for manual review
            unmatchedTerraces.push(terrace);
            console.warn(`no match with coords, trying matching by address`)
            continue;
        }

        if (matchingRestaurants.length === 1) {
            // Only one match by coords → create directly
            // find index but how - increment index dynamically
            const custom = createCustomTerrace(terrace, matchingRestaurants[(0)]);
            matchingRestaurants = [];
            customTerraces.push(custom);
            continue;

        } else {
            const { validMatches, invalidMatches } = matchByCoordsAndAddress(terrace, matchingRestaurants) || {};

            if (!validMatches || validMatches.length !== 1) {
                console.warn(terrace)
                unmatchedTerraces.push(terrace);
                matchingRestaurants = [];

            } else {
                // const custom = createCustomTerrace(terrace, validMatches[i]);
                // console.log(`custom -> ${custom}, validMatches[i] -> ${validMatches[i]}`)
                // customTerraces.push(custom);
                console.warn(`here we would create a terrace if it is a valid match`)
            }

        }
    }

    try {
        if (customTerraces.length > 0) {
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
        }

    } catch(err) {
        console.error('❌ Error saving terraces to DB:', err);
    }
}


// aqui iria el cron
// createCustomValidatedTerrace();

// for (let i = 0; i < terraces.length; i++) {
//     const terrace = terraces[i] as TerraceApiType;

//     let businessMatchedByCoords: BusinessApiType[] = businesses.filter(biz =>
//         biz.Latitud === terrace.LATITUD &&
//         biz.Longitud === terrace.LONGITUD);

//     if (businessMatchedByCoords.length > 1) {
//         const oneMatchOnlyBusiness = businessMatchedByCoords.find((match) => {
//             return (
//                 terrace.EMPLACAMENT.includes(match.Nom_Via) &&
//                 terrace.EMPLACAMENT.includes(match.Porta)
//             )
//         });
//         businessMatchedByCoords = oneMatchOnlyBusiness ? [oneMatchOnlyBusiness] : [];
//     }

//     for (const biz of businessMatchedByCoords) {
//         customTerraces.push({
//             id: biz.ID_Global,
//             business_name: biz.Nom_CComercial,
//             cadastro_ref: biz.Referencia_Cadastral,
//             street_type: biz.Nom_Via,
//             street_address: biz.Nom_Local,
//             door_address: parseInt(biz.Porta) || 0,
//             activity_code: parseInt(biz.Codi_Activitat_2022) || 0,
//             group_activity_code: parseInt(biz.Codi_Activitat_2022) || 0,
//             postal_code: undefined,
//             district_name: biz.Codi_Districte,
//             district_code: parseInt(biz.Codi_Districte) || 0,
//             neighbourhood_name: biz.Nom_Barri,
//             neighbourhood_code: parseInt(biz.Codi_Barri) || 0,
//             opening_hours: undefined,
//             tables: parseInt(terrace.TAULES) || 0,
//             seats: parseInt(terrace.CADIRES) || 0,
//             latitude: parseFloat(terrace.LATITUD) || 0,
//             longitude: parseFloat(terrace.LONGITUD) || 0,
//             average_price: undefined,
//             average_rating: undefined,
//             has_wifi: undefined,
//             pet_friendly: undefined,
//             can_smoke: undefined,
//             has_kitchen: undefined,
//         });
//     }
// }
// // bulkCreate prevents messing the loop
// // by saving the objects after it
// // if Terrace.create() would be inside the loop
// // --> low performance
// // updateOnDuplicate will change only the following properties
// // when updating ddbb
// //! what if a restaurant changes location?
// try {
//     await Terrace.bulkCreate(customTerraces, {
//         updateOnDuplicate: [
//             'business_name',
//             'tables',
//             'seats',
//             'opening_hours',
//             'average_price',
//             'average_rating',
//             'has_wifi',
//             'pet_friendly',
//             'can_smoke',
//             'has_kitchen'
//         ]
//     });

// } catch(err) {
//     console.error('❌ Error saving customTerraces to DB:', err);
//     console.error(err instanceof Error ? err.stack : err);
// }
