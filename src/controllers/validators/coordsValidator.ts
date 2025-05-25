import type { BusinessApiType } from "../../models/zod/business-schema.js";
import { TerraceApiType } from "../../models/zod/terrace-schema.js";

export function matchByCoords(
    businesses: BusinessApiType[],
    terrace: TerraceApiType
): BusinessApiType[] {
    return businesses.filter(biz =>
        biz.Latitud === terrace.LATITUD &&
        biz.Longitud === terrace.LONGITUD
    );

}
