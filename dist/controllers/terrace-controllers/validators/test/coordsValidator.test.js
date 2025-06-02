// import { describe, it, expect } from 'vitest';
// import { matchByCoords } from '../coordsValidator.js';
// import type { TerraceApiType } from '../../../models/zod/terrace-schema.js';
// import type { BusinessApiType } from '../../../models/zod/business-schema.js';
export {};
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
//# sourceMappingURL=coordsValidator.test.js.map