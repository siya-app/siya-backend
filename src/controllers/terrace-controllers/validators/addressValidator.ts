import { matches } from "validator";
import type { BusinessApiType } from "../../../models/terrace-model/zod/business-schema.js";
import { TerraceApiType } from "../../../models/terrace-model/zod/terrace-schema.js";

export type InvalidMatch = {
    name: string;
    address: string;
    lat: string;
    long: string;
    reason: 'MISSING_STREET' | 'MISSING_NUMBER' | 'BOTH_MISSING';
}

function normalizeString(s: string): string {
    return s.toLowerCase().replace(/[^\w\s]/g, '').trim();
}

export function matchByCoordsAndAddress(
    terrace: TerraceApiType,
    businesses: BusinessApiType[]
) {

    const validMatches: object[] = [];
    const invalidMatches: object[] = [];

    const emplacement = normalizeString(terrace.EMPLACAMENT);

    businesses.forEach(biz => {
        const streetName = normalizeString(biz.Nom_Via) ?? '';
        const streetNumber = biz.Porta ? String(biz.Porta) : '';

        const hasStreet = streetName && emplacement.includes(streetName);
        const hasNumber = streetNumber && emplacement.includes(streetNumber);

        if (hasStreet && hasNumber) {
            validMatches.push(biz);

        } else {
            let reason: InvalidMatch['reason'] = 'BOTH_MISSING';
            if (hasStreet && !hasNumber) reason = 'MISSING_NUMBER';
            if (!hasStreet && hasNumber) reason = 'MISSING_STREET';

            invalidMatches.push({
                name: biz.Nom_Local || 'Unknown name',
                address: terrace.EMPLACAMENT,
                lat: biz.Latitud,
                long: biz.Longitud,
                reason
            });
        }
    });

    return {
        validMatches,
        invalidMatches
    };
}