import type { BusinessApiType } from "../../models/zod/business-schema";
import { TerraceApiType } from "../../models/zod/terrace-schema";

export function objectsMatchByCoords(businesses: BusinessApiType[], terraces: TerraceApiType[]) {

    let businessMatchedByCoords: BusinessApiType[] = [];

    for (let i = 0; i < terraces.length; i++) {

        const terrace = terraces[i] as TerraceApiType;

        businessMatchedByCoords = businesses.filter(biz =>
            biz.Latitud === terrace.LATITUD &&
            biz.Longitud === terrace.LONGITUD);
    }

    return businessMatchedByCoords;
}
