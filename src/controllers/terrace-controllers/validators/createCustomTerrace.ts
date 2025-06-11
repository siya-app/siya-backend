import { BusinessApiType } from "../../../models/terrace-model/zod/business-schema.js";
import { TerraceApiType } from "../../../models/terrace-model/zod/terrace-schema.js";
import {defaultOpeningHours} from "../../../utils/terrace-utils/defaultOpeningHours.js";
import Terrace from "../../../models/terrace-model/db/terrace-model-sequelize.js";

export function createCustomTerrace(terrace: Partial<TerraceApiType>, biz: Partial<BusinessApiType>) {
     Terrace.create = {
        business_name: biz.Nom_Local,
        cadastro_ref: biz.Referencia_Cadastral,
        street_type: biz.Nom_Via,
        street_address: biz.Nom_Local,
        door_address: biz.Num_Policia_Inicial,
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

    return Terrace.create = {
            business_name!: string;
            cadastro_ref!: string;
            street_type!: string;
            street_address!: string;
            door_address!: number;
            activity_code!: number;
            group_activity_code!: number;
            district_name!: string;
            district_code!: number;
            neighbourhood_name!: string;
            neighbourhood_code!: number;
            opening_hours?: string;
            zip_code?: number;
            tables!: number;
            seats!: number;
            latitude!: number;
            longitude!: 
            average_price?: number;
            average_rating?: number;
            has_wifi?: boolean;
            pet_friendly?: boolean;
            can_smoke?: boolean;
            has_disabled_acces?: boolean;
            has_kitchen?: boolean;
            is_claimed?: boolean;
            instagram_account?: string;
            website?: string;
            profile_pic?: string;
            reservation_fee?: number;
    }
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