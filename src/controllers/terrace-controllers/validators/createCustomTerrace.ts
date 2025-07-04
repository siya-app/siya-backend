// import { BusinessApiType } from "../../models/zod/business-schema.js";
// import { TerraceApiType } from "../../models/zod/terrace-schema.js";
// import {defaultOpeningHours} from "../../utils/defaultOpeningHours.js";
import { BusinessApiType } from "../../../models/terrace-model/zod/business-schema.js";
import { TerraceApiType } from "../../../models/terrace-model/zod/terrace-schema.js";
import { defaultOpeningHours } from "../../../utils/terrace-utils/defaultOpeningHours.js";




export function createCustomTerrace(terrace: Partial<TerraceApiType>, biz: Partial<BusinessApiType>) {
    return {
        id: biz.ID_Global,
        business_name: biz.Nom_CComercial,
        cadastro_ref: biz.Referencia_Cadastral,
        street_type: biz.Nom_Via,
        street_address: biz.Nom_Local,
        door_address: biz.Porta,
        activity_code: biz.Codi_Activitat_2022,
        group_activity_code: biz.Codi_Activitat_2022,
        district_name: biz.Codi_Districte,
        district_code: biz.Codi_Districte,
        neighbourhood_name: biz.Nom_Barri,
        neighbourhood_code: biz.Codi_Barri,
        postal_code: undefined,
        tables: terrace.TAULES,
        seats: terrace.CADIRES,
        latitude: terrace.LATITUD,
        longitude: terrace.LONGITUD,
        average_price: undefined,
        average_rating: undefined,
        has_wifi: undefined,
        pet_friendly: undefined,
        can_smoke: undefined,
        has_disabled_acces: undefined,
        has_kitchen: undefined,
        has_promos: false,
        reservation_fee: 0,
        is_premium: false,
        is_verified: false,
        instagram_account: '',
        food_category: [],
        placement_type: [],
        emotional_tags: [],
        cover_type: [],
        dietary_restrictions: [],
        profile_pic: '',
        opening_hours: defaultOpeningHours
    };
}

// {
//     "id": "test-001",
//     "business_name": "Terrassa Guapa",
//     "cadastro_ref": "123-XYZ",
//     "street_type": "Carrer",
//     "street_address": "Del Sol",
//     "door_address": 10,
//     "activity_code": 123,
//     "group_activity_code": 456,
//     "district_name": "Eixample",
//     "district_code": 1,
//     "neighbourhood_name": "La Dreta de l'Eixample",
//     "neighbourhood_code": 101,
//     "opening_hours": "10:00-22:00",
//     "postal_code": 8010,
//     "tables": 5,
//     "seats": 20,
//     "latitude": "41.390205",
//     "longitude": "2.154007",
//     "average_price": 20,
//     "average_rating": 4.2,
//     "has_wifi": true,
//     "pet_friendly": false,
//     "can_smoke": false,
//     "has_disabled_acces": true,
//     "has_kitchen": false
//   }