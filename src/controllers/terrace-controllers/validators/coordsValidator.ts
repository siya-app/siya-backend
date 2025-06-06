import type { BusinessApiType } from "../../../models/terrace-model/zod/business-schema.js";
import { TerraceApiType } from "../../../models/terrace-model/zod/terrace-schema.js";

export function matchByCoords(
    terrace: TerraceApiType,
    businesses: BusinessApiType[],
    coordinateTolerance = 0.000001 // ~1.1 cm precision
): BusinessApiType[] | null {

    if (!Array.isArray(businesses)) return null;

    const matches = businesses.filter(biz => {
        const latDiff = Math.abs(parseFloat(biz.Latitud) - parseFloat(terrace.LATITUD));
        const longDiff = Math.abs(parseFloat(biz.Longitud) - parseFloat(terrace.LONGITUD));
        return latDiff < coordinateTolerance && longDiff < coordinateTolerance;
    })

    return matches.length > 0 ? matches : null;

}