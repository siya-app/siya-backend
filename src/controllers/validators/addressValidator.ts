import { matches } from "validator";
import type { BusinessApiType } from "../../models/zod/business-schema.js";
import { TerraceApiType } from "../../models/zod/terrace-schema.js";

// export type InvalidMatch = {
//     name: string,
//     address: string
//     lat: number,
//     long: number
// }

// export type CoordResult = {
//     matches: BusinessApiType[],
//     invalidMatches: InvalidMatch[]
// }

// export function refineMatchByAddress(
//     terrace: TerraceApiType,
//     businesses: BusinessApiType[]
// ): CoordResult | null {

//     let validMatchesByAddress: BusinessApiType[] = [];
//     let invalidMatchesByAddress: BusinessApiType[] = [];
//     const emplacement = terrace.EMPLACAMENT.toLowerCase();
//     if (businesses.length === 1) { return null

//     } else {
//         validMatchesByAddress = businesses.filter((biz) => {
//             const matchStreetName = emplacement.includes(biz.Nom_Via.toLowerCase() ?? []);
//             const matchStreetDoor = emplacement.includes(String(biz.Porta) ?? []);
//             return matchStreetName && matchStreetDoor;
//         });
//     }
// invalidMatchesByAddress.push(`invalid biz -> biz.name, biz.address...`)

//     return {
//         validMatchesByAddress,
//         invalidMatches

//     }
// }
export type InvalidMatch = {
    name: string;
    address: string;
    lat: string;
    long: string;
    reason: 'MISSING_STREET' | 'MISSING_NUMBER' | 'BOTH_MISSING';
}

export type CoordResult = {
    validMatches: BusinessApiType[];
    invalidMatches: InvalidMatch[];
}

function normalizeString(s: string): string {
    return s.toLowerCase().replace(/[^\w\s]/g, '').trim();
}

export function matchByCoordsAndAddress(
    terrace: TerraceApiType,
    businesses: BusinessApiType[]
): CoordResult | null {

    if (businesses.length <= 1) {
        return null;
    }

    const result: CoordResult = {
        validMatches: [],
        invalidMatches: []
    };

    const emplacement = normalizeString(terrace.EMPLACAMENT);

    businesses.forEach(biz => {
        const streetName = normalizeString(biz.Nom_Via) ?? '';
        const streetNumber = biz.Porta ? String(biz.Porta) : '';

        const hasStreet = streetName && emplacement.includes(streetName);
        const hasNumber = streetNumber && emplacement.includes(streetNumber);

        if (hasStreet && hasNumber) {
            result.validMatches.push(biz);
        } else {
            let reason: InvalidMatch['reason'] = 'BOTH_MISSING';
            if (hasStreet && !hasNumber) reason = 'MISSING_NUMBER';
            if (!hasStreet && hasNumber) reason = 'MISSING_STREET';

            result.invalidMatches.push({
                name: biz.Nom_CComercial || 'Unknown',
                address: terrace.EMPLACAMENT,
                lat: biz.Latitud,
                long: biz.Longitud,
                reason
            });
        }
    });

    return result;
}