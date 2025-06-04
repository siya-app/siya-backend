// import { CustomTerraceType } from "../../models/terrace-model/zod/customTerrace-schema.js";
import { CustomTerraceType } from "../../../models/terrace-model/zod/customTerrace-schema.js";

export const mockCustomTerrace: CustomTerraceType = {
    id: "terrace-001",
    business_name: "Terrassa Guapa",
    cadastro_ref: "REF-XYZ-123",
    address: "C. Santa Eulalia, 46",
    activity_code: 1010,
    group_activity_code: 1000,
    district_name: "Eixample",
    district_code: 2,
    neighbourhood_name: "La Dreta de l'Eixample",
    neighbourhood_code: 21,
    zip_code: "08008",
    tables: 8,
    seats: 32,
    latitude: "41.390205",
    longitude: "2.154007",
    average_price: 24.5,
    average_rating: 4.3,
    has_wifi: true,
    pet_friendly: true,
    can_smoke: false,
    has_disabled_access: true,
    has_kitchen: false,
    reservation_fee: 2.5,
    is_claimed: true,
    instagram_account: "@terrassaguapa",
    website: "https://terrassaguapa.cat",
    profile_pic: "https://linktoterrace1.com",
}

export function mockCreateCustomTerrace() {
    return mockCustomTerrace;
}