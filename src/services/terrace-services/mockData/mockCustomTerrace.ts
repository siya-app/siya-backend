import { CustomTerraceType } from "../../../models/terrace-model/zod/customTerrace-schema.js";
import { defaultOpeningHours } from "../../../utils/terrace-utils/defaultOpeningHours.js";

export const mockCustomTerrace: CustomTerraceType = {
    id: "biz-12345",
    business_name: "Sunset Café",
    cadastro_ref: "REF-67890",
    street_type: "Avenue",
    street_address: "Sunset Boulevard",
    door_address: 42,
    activity_code: 5630,
    group_activity_code: 5630,
    postal_code: 8902,
    district_name: "Downtown",
    district_code: 1,
    neighbourhood_name: "Arts District",
    neighbourhood_code: 12,
    opening_hours: defaultOpeningHours,
    tables: 10,
    seats: 40,
    latitude: String(41.3851),
    longitude: String(2.1734),
    average_price: undefined,
    average_rating: undefined,
    has_wifi: undefined,
    pet_friendly: undefined,
    can_smoke: undefined,
    has_kitchen: undefined,
    has_promos: false,
    reservation_fee: 0,
    is_premium: false,
    is_verified: false,
    instagram_account: ''
}

export function mockCreateCustomTerrace() {
    return mockCustomTerrace;
}