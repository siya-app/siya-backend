
import type { TerraceApiType } from '../../../../models/terrace-model/zod/terrace-schema.js';
import type { BusinessApiType } from '../../../../models/terrace-model/zod/business-schema.js';
import { readJsonArray } from '../../../../utils/terrace-utils/readJson.js';
import { describe, it, expect, beforeAll } from 'vitest';
import { matchByCoordsAndAddress } from '../addressValidator.js';

let businesses: BusinessApiType[] = [];
let terraces: TerraceApiType[] = [];

beforeAll(async () => {
    try {
        const fullBusinesses = await readJsonArray<BusinessApiType>("./businesses-restaurants.json");
        const fullTerraces = await readJsonArray<TerraceApiType>("./terraces.json");
        businesses = fullBusinesses.slice(0, 100);
        terraces = fullTerraces.slice(0, 6000);
        console.log('Loaded businesses in match x coords:', businesses.length);
        console.log('Loaded terraces: in match x coords', terraces.length);
    } catch (error) {
        console.error('❌ Error loading JSONs:', error);
    }
});

describe('matchByCoordsAndAddress', () => {
    it('returns both valid and invalid matches', () => {
        const terrace = terraces[0];
        const matchingBusinesses = businesses.slice(0, 5); // Test with first 5 businesses
        
        const result = matchByCoordsAndAddress(terrace, matchingBusinesses);
        
        expect(result).toHaveProperty('validMatches');
        expect(result).toHaveProperty('invalidMatches');
        expect(Array.isArray(result.validMatches)).toBe(true);
        expect(Array.isArray(result.invalidMatches)).toBe(true);
    });

    it('finds valid matches when address components match', () => {
        // Find a terrace and business that likely match
        const testTerrace = terraces.find(t => 
            t.EMPLACAMENT && t.EMPLACAMENT.match(/\d+/)
        );
        
        if (!testTerrace) {
            console.warn('No terrace with address number found in test data');
            return;
        }
        
        // Create a matching business
        const addressParts = testTerrace.EMPLACAMENT.split(' ');
        const streetName = addressParts.slice(0, -1).join(' ');
        const streetNumber = addressParts[addressParts.length - 1];
        
        const testBusiness: BusinessApiType = {
            ...businesses[0],
            Nom_Via: streetName,
            Porta: streetNumber
        };
        
        const result = matchByCoordsAndAddress(testTerrace, [testBusiness]);
        
        expect(result.validMatches).toHaveLength(1);
        expect(result.invalidMatches).toHaveLength(0);
    });

    it('flags invalid matches when street name is missing', () => {
        const testTerrace = terraces[0];
        const testBusiness: BusinessApiType = {
            ...businesses[0],
            Nom_Via: 'NON_EXISTENT_STREET', // Won't match
            Porta: '123'
        };
        
        const result = matchByCoordsAndAddress(testTerrace, [testBusiness]);
        
        expect(result.validMatches).toHaveLength(0);
        expect(result.invalidMatches[0].reason).toBe('MISSING_STREET');
    });

    it('flags invalid matches when street number is missing', () => {
        const testTerrace = terraces[0];
        const addressParts = testTerrace.EMPLACAMENT.split(' ');
        const streetName = addressParts.slice(0, -1).join(' ');
        
        const testBusiness: BusinessApiType = {
            ...businesses[0],
            Nom_Via: streetName,
            Porta: 'NON_EXISTENT_NUMBER' // Won't match
        };
        
        const result = matchByCoordsAndAddress(testTerrace, [testBusiness]);
        
        expect(result.validMatches).toHaveLength(0);
        expect(result.invalidMatches[0].reason).toBe('MISSING_NUMBER');
    });

    it('handles empty business array', () => {
        const result = matchByCoordsAndAddress(terraces[0], []);
        
        expect(result.validMatches).toHaveLength(0);
        expect(result.invalidMatches).toHaveLength(0);
    });

    it('logs matching statistics', () => {
        const testTerrace = terraces[0];
        const matchingBusinesses = businesses.slice(0, 10); // Test with first 10 businesses
        
        const result = matchByCoordsAndAddress(testTerrace, matchingBusinesses);
        
        console.log(`Tested terrace at: ${testTerrace.EMPLACAMENT}`);
        console.log(`- Valid matches: ${result.validMatches.length}`);
        console.log(`- Invalid matches: ${result.invalidMatches.length}`);
        
        expect(result.validMatches.length + result.invalidMatches.length)
            .toBe(matchingBusinesses.length);
    });
});