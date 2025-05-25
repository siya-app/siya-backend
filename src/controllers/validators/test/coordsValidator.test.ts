import { describe, it, expect } from 'vitest';
import { matchByCoords } from '../coordsValidator.js';

describe('matchByCoords', () => {
    const businesses = [
        { Latitud: '41.123', Longitud: '2.123', Nom_Via: 'Av. Gaudí', Porta: '66' },
        { Latitud: '41.000', Longitud: '2.000', Nom_Via: 'Carrer Fake', Porta: '10' },
    ] as any[];

    const terrace = { LATITUD: '41.123', LONGITUD: '2.123', EMPLACAMENT: 'Av. Gaudí, 66' };

    it('should return only matching businesses by coords', () => {
        const result = matchByCoords(businesses, terrace);
        expect(result.length).toBe(1);
        expect(result[0].Nom_Via).toBe('Av. Gaudí');
    });
});