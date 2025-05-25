import { BusinessApiType } from "../../models/zod/business-schema.js";
import { TerraceApiType } from "../../models/zod/terrace-schema.js";

export function createCustomTerrace(terrace: TerraceApiType, biz: BusinessApiType) {
    return {
        id: biz.ID_Global,
        business_name: biz.Nom_CComercial,
        cadastro_ref: biz.Referencia_Cadastral,
        street_type: biz.Nom_Via,
        street_address: biz.Nom_Local,
        door_address: parseInt(biz.Porta) || 0,
        activity_code: parseInt(biz.Codi_Activitat_2022) || 0,
        group_activity_code: parseInt(biz.Codi_Activitat_2022) || 0,
        postal_code: undefined,
        district_name: biz.Codi_Districte,
        district_code: parseInt(biz.Codi_Districte) || 0,
        neighbourhood_name: biz.Nom_Barri,
        neighbourhood_code: parseInt(biz.Codi_Barri) || 0,
        opening_hours: undefined,
        tables: parseInt(terrace.TAULES) || 0,
        seats: parseInt(terrace.CADIRES) || 0,
        latitude: parseFloat(terrace.LATITUD) || 0,
        longitude: parseFloat(terrace.LONGITUD) || 0,
        average_price: undefined,
        average_rating: undefined,
        has_wifi: undefined,
        pet_friendly: undefined,
        can_smoke: undefined,
        has_kitchen: undefined,
    };
}