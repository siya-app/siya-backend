import type { BusinessApiType } from "../../models/zod/business-schema.js";
import { TerraceApiType } from "../../models/zod/terrace-schema.js";

export function refineMatchByAddress(
    terrace: TerraceApiType,
    businesses: BusinessApiType[]
): BusinessApiType[] {

    let matchesByAddress: BusinessApiType[] = [];
    let isMatching: boolean = false;
    const emplacement = terrace.EMPLACAMENT.toLowerCase();
    if (businesses.length === 1) {
        return businesses;

    } else {
        matchesByAddress = businesses.filter((biz) => {
            emplacement.includes(biz.Nom_Via.toLowerCase()) &&
            emplacement.includes(biz.Porta)
        });
    }

    return matchesByAddress;
}