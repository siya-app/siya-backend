import { BusinessApiType } from "../../models/zod/business-schema.js";
import { TerraceApiType } from "../../models/zod/terrace-schema.js";

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
        postal_code: undefined,
        district_name: biz.Codi_Districte,
        district_code: biz.Codi_Districte,
        neighbourhood_name: biz.Nom_Barri,
        neighbourhood_code: biz.Codi_Barri,
        opening_hours: undefined,
        tables: terrace.TAULES,
        seats: terrace.CADIRES,
        latitude: terrace.LATITUD,
        longitude: terrace.LONGITUD,
        average_price: undefined,
        average_rating: undefined,
        has_wifi: undefined,
        pet_friendly: undefined,
        can_smoke: undefined,
        has_kitchen: undefined,
    };
}