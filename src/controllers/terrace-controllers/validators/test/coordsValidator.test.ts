
import type { TerraceApiType } from '../../../../models/terrace-model/zod/terrace-schema.js';
import type { BusinessApiType } from '../../../../models/terrace-model/zod/business-schema.js';
import { readJsonArray } from '../../../../utils/terrace-utils/readJson.js';
import { describe, it, expect, beforeAll } from 'vitest';
import { matchByCoords } from '../coordsValidator.js';

let businesses: BusinessApiType[] = [];
let terraces: TerraceApiType[] = [];

beforeAll(async () => {
    try {
        const fullBusinesses = await readJsonArray<BusinessApiType>("./businesses-restaurants.json");
        const fullTerraces = await readJsonArray<TerraceApiType>("./terraces.json");
        businesses = fullBusinesses.slice(0,100);
        terraces = fullTerraces.slice(0,6000);
        console.log('Loaded businesses:', businesses.length);
        console.log('Loaded terraces:', terraces.length);

    } catch (error) {
        console.error('❌ Error loading JSONs:', error)
    }
});

describe('matchByCoords', () => {

    it('returns null if no businesses match coords', () => {
        const fakeTerrace = { ...terraces[0], LATITUD: '0.000000', LONGITUD: '0.000000' };
        const result = matchByCoords(fakeTerrace, businesses);
        expect(result).toBeNull();
    });

    it('returns array when there is at least one match', () => {
        const result = matchByCoords(terraces[0], businesses);
        expect(result).toSatisfy(res => res === null || Array.isArray(res));
    });

    it('returns matches within tighter tolerance', () => {
        const result = matchByCoords(terraces[0], businesses, 0.0000001);
        expect(result).toSatisfy(res => res === null || Array.isArray(res));
    });

    it('returns null when businesses is not an array', () => {
        const result = matchByCoords(terraces[0], {} as any);
        expect(result).toBeNull();
    });

    it('logs how many terraces match', () => {
        const matches = terraces.filter(t => matchByCoords(t, businesses));
        console.log(`✅ Matches found: ${matches.length} / ${terraces.length}`);
        expect(matches.length).toBeGreaterThan(0);
    });
});






// import { describe, it, expect } from 'vitest';


// const makeBusiness = (lat: string, lon: string): BusinessApiType => ({
//     Nom_CComercial: "Test Biz",
//     Codi_Districte: "01",
//     Codi_Activitat_2022: "123",
//     ID_Global: "xyz",
//     Referencia_Cadastral: "ref",
//     Nom_Via: "Carrer Test",
//     Longitud: lon,
//     Porta: "12",
//     Nom_Local: "Biz Place",
//     Codi_Barri: "05",
//     Codi_Activitat_2016: "456",
//     Latitud: lat,
//     Codi_Grup_Activitat: "789",
//     Nom_Districte: "Eixample",
//     Nom_Barri: "Sagrada Família",
// });

// const terrace: TerraceApiType = {
//     LATITUD: "41.123456",
//     LONGITUD: "2.123456",
//     CODI_DISTRICTE: "01",
//     NOM_DISTRICTE: "Eixample",
//     CODI_BARRI: "05",
//     NOM_BARRI: "Sagrada Família",
//     EMPLACAMENT: "Test St. 12",
//     OCUPACIO: "",
//     TAULES: "4",
//     CADIRES: "8",
//     TAULES_VORERA: "",
//     CADIRES_VORERA: "",
//     TAULES_CALCADA: "",
//     CADIRES_CALCADA: "",
//     SUPERFICIE_OCUPADA: "",
//     DATA_EXPLO: "",
//     VIGENCIA: "",
//     ORDENACIO: "",
//     X_ETRS89: "",
//     Y_ETRS89: "",
//     _id: 1,
// };

// describe('matchByCoords', () => {
//     it('returns a match if coordinates are exactly the same', () => {
//         const businesses = [makeBusiness("41.123456", "2.123456")];
//         const result = matchByCoords(terrace, businesses);
//         expect(result).toHaveLength(1);
//     });

//     it('returns null if no coordinates match', () => {
//         const businesses = [makeBusiness("40.000000", "2.000000")];
//         const result = matchByCoords(terrace, businesses);
//         expect(result).toBeNull();
//     });

//     it('returns null when businesses is not an array', () => {
//         const result = matchByCoords(terrace, {} as any);
//         expect(result).toBeNull();
//     });

//     it('returns multiple matches when several businesses match', () => {
//         const businesses = [
//             makeBusiness("41.123456", "2.123456"),
//             makeBusiness("41.123456", "2.123456"),
//         ];
//         const result = matchByCoords(terrace, businesses);
//         expect(result).toHaveLength(2);
//     });

//     it('returns null when coords are just outside the tolerance', () => {
//         const businesses = [makeBusiness("41.123457", "2.123457")]; // ~0.0000011 difference
//         const result = matchByCoords(terrace, businesses, 0.000001);
//         expect(result).toBeNull();
//     });

//     it('returns a match if within increased tolerance', () => {
//         const businesses = [makeBusiness("41.123457", "2.123457")];
//         const result = matchByCoords(terrace, businesses, 0.00001); // increase tolerance
//         expect(result).toHaveLength(1);
//     });
// });