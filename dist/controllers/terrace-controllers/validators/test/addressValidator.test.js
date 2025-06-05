// import { describe, it, expect } from 'vitest';
// import { matchByCoordsAndAddress, CoordResult, InvalidMatch } from '../addressValidator.js';
// import type { TerraceApiType } from '../../../models/zod/terrace-schema.js';
// import type { BusinessApiType } from '../../../models/zod/business-schema.js';
export {};
// const makeBusiness = (
//     streetName: string,
//     streetNumber: string,
//     name = 'Test Biz',
//     lat = '41.123',
//     long = '2.123'
// ): BusinessApiType => ({
//     Nom_CComercial: name,
//     Codi_Districte: '01',
//     Codi_Activitat_2022: '123',
//     ID_Global: 'xyz',
//     Referencia_Cadastral: 'ref',
//     Nom_Via: streetName,
//     Longitud: long,
//     Porta: streetNumber,
//     Nom_Local: 'Biz Place',
//     Codi_Barri: '05',
//     Codi_Activitat_2016: '456',
//     Latitud: lat,
//     Codi_Grup_Activitat: '789',
//     Nom_Districte: 'Eixample',
//     Nom_Barri: 'Sagrada Família',
// });
// const terrace: TerraceApiType = {
//     LATITUD: '41.123',
//     LONGITUD: '2.123',
//     CODI_DISTRICTE: '01',
//     NOM_DISTRICTE: 'Eixample',
//     CODI_BARRI: '05',
//     NOM_BARRI: 'Sagrada Família',
//     EMPLACAMENT: 'Av. Gaudí, 66',
//     OCUPACIO: '',
//     TAULES: '4',
//     CADIRES: '8',
//     TAULES_VORERA: '',
//     CADIRES_VORERA: '',
//     TAULES_CALCADA: '',
//     CADIRES_CALCADA: '',
//     SUPERFICIE_OCUPADA: '',
//     DATA_EXPLO: '',
//     VIGENCIA: '',
//     ORDENACIO: '',
//     X_ETRS89: '',
//     Y_ETRS89: '',
//     _id: 1,
// };
// describe('matchByCoordsAndAddress', () => {
//     it('returns null if businesses length <= 1', () => {
//         const result = matchByCoordsAndAddress(terrace, [makeBusiness('Av. Gaudí', '66')]);
//         expect(result).toBeNull();
//         expect(matchByCoordsAndAddress(terrace, [])).toBeNull();
//     });
//     it('returns validMatches and invalidMatches correctly when multiple businesses', () => {
//         const biz1 = makeBusiness('Av. Gaudí', '66', 'Match 1');
//         const biz2 = makeBusiness('Av. Gaudí', '99', 'Missing Number');
//         const biz3 = makeBusiness('Fake Street', '66', 'Missing Street');
//         const biz4 = makeBusiness('Fake Street', '99', 'Both Missing');
//         const biz5 = makeBusiness('Av. Gaudí', '66', 'Match 2');
//         const businesses = [biz1, biz2, biz3, biz4, biz5];
//         const result = matchByCoordsAndAddress(terrace, businesses);
//         expect(result).not.toBeNull();
//         expect(result!.validMatches.length).toBe(2);
//         expect(result!.invalidMatches.length).toBe(3);
//         // Check valid matches have correct names
//         const validNames = result!.validMatches.map(b => b.Nom_CComercial);
//         expect(validNames).toContain('Match 1');
//         expect(validNames).toContain('Match 2');
//         // Check invalid matches have correct reasons
//         const reasons = result!.invalidMatches.map(i => i.reason);
//         expect(reasons).toContain('MISSING_NUMBER');
//         expect(reasons).toContain('MISSING_STREET');
//         expect(reasons).toContain('BOTH_MISSING');
//         // Check invalid matches contain correct names
//         const invalidNames = result!.invalidMatches.map(i => i.name);
//         expect(invalidNames).toContain('Missing Number');
//         expect(invalidNames).toContain('Missing Street');
//         expect(invalidNames).toContain('Both Missing');
//     });
//     it('handles empty strings and missing values', () => {
//         const biz1 = makeBusiness('', '', 'Empty Street and Number');
//         const biz2 = makeBusiness('Av. Gaudí', '', 'No Number');
//         const biz3 = makeBusiness('', '66', 'No Street');
//         const result = matchByCoordsAndAddress(terrace, [biz1, biz2, biz3, makeBusiness('Av. Gaudí', '66', 'Valid')]);
//         expect(result).not.toBeNull();
//         expect(result!.validMatches.length).toBe(1);
//         expect(result!.validMatches[0].Nom_CComercial).toBe('Valid');
//         const reasons = result!.invalidMatches.map(i => i.reason);
//         expect(reasons).toContain('BOTH_MISSING');
//         expect(reasons).toContain('MISSING_NUMBER');
//         expect(reasons).toContain('MISSING_STREET');
//     });
//     it('matches case-insensitive street names and exact number', () => {
//         const biz1 = makeBusiness('av. gaudí', '66', 'Lowercase street');
//         const biz2 = makeBusiness('AV. GAUDÍ', '66', 'Uppercase street');
//         const biz3 = makeBusiness('Av. Gaudí', '66', 'Exact case street');
//         const result = matchByCoordsAndAddress(terrace, [biz1, biz2, biz3]);
//         expect(result).not.toBeNull();
//         expect(result!.validMatches.length).toBe(3);
//     });
// });
//# sourceMappingURL=addressValidator.test.js.map