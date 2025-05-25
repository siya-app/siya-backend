import { describe, it, expect } from 'vitest';
import { refineMatchByAddress } from '../addressValidator.js';
import type { TerraceApiType } from '../../../models/zod/terrace-schema.js'
import type { BusinessApiType } from '../../../models/zod/business-schema.js';

const business = (via: string, porta: string): BusinessApiType => ({
    Nom_CComercial: "Test Biz",
    Codi_Districte: "01",
    Codi_Activitat_2022: "123",
    ID_Global: "xyz",
    Referencia_Cadastral: "ref",
    Nom_Via: via,
    Longitud: "2.123",
    Porta: porta,
    Nom_Local: "Biz Place",
    Codi_Barri: "05",
    Codi_Activitat_2016: "456",
    Latitud: "41.123",
    Codi_Grup_Activitat: "789",
    Nom_Districte: "Eixample",
    Nom_Barri: "Sagrada Família",
});

const terrace: TerraceApiType = {
    LATITUD: "41.123",
    LONGITUD: "2.123",
    CODI_DISTRICTE: "01",
    NOM_DISTRICTE: "Eixample",
    CODI_BARRI: "05",
    NOM_BARRI: "Sagrada Família",
    EMPLACAMENT: "Av. Gaudí, 66",
    OCUPACIO: "",
    TAULES: "4",
    CADIRES: "8",
    TAULES_VORERA: "",
    CADIRES_VORERA: "",
    TAULES_CALCADA: "",
    CADIRES_CALCADA: "",
    SUPERFICIE_OCUPADA: "",
    DATA_EXPLO: "",
    VIGENCIA: "",
    ORDENACIO: "",
    X_ETRS89: "",
    Y_ETRS89: "",
    _id: 1,
};

describe('refineMatchByAddress', () => {
    it('returns the business if only one is passed', () => {
        const result = refineMatchByAddress(terrace, [business("Av. Gaudí", "66")]);
        expect(result).toHaveLength(1);
    });

    it('returns the match when Nom_Via and Porta are included in EMPLACAMENT', () => {
        const businesses = [
            business("Av. Gaudí", "66"),
            business("Carrer Falsa", "123"),
        ];
        const result = refineMatchByAddress(terrace, businesses);
        expect(result).toHaveLength(1);
        expect(result[0].Nom_Via).toBe("Av. Gaudí");
    });

    it('returns empty if no matches are found', () => {
        const businesses = [
            business("Carrer Falsa", "123"),
            business("Gran Via", "22"),
        ];
        const result = refineMatchByAddress(terrace, businesses);
        expect(result).toEqual([]);
    });

    it('returns empty if only Nom_Via matches but not Porta', () => {
        const businesses = [business("Av. Gaudí", "999")];
        const result = refineMatchByAddress(terrace, businesses);
        expect(result).toEqual([]);
    });

    it('returns empty if only Porta matches but not Nom_Via', () => {
        const businesses = [business("Passeig de Gràcia", "66")];
        const result = refineMatchByAddress(terrace, businesses);
        expect(result).toEqual([]);
    });

    it('returns multiple matches if more than one match', () => {
        const businesses = [
            business("Av. Gaudí", "66"),
            business("Av. Gaudí", "66"), // duplicate on purpose
        ];
        const result = refineMatchByAddress(terrace, businesses);
        expect(result).toHaveLength(2);
    });

    it('is case-sensitive (optional)', () => {
        const businesses = [business("av. gaudí", "66")];
        const result = refineMatchByAddress(terrace, businesses);
        expect(result).toHaveLength(1); // ✅ now it passes!
    });
});