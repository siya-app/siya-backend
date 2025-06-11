import { faker } from '@faker-js/faker';
import { UserSchema } from '../models/user-model/zod/user.schema.js';
import { CustomTerraceType } from '../models/terrace-model/zod/customTerrace-schema.js';

// Funció per generar un usuari fals
export function generateFakeUser(): UserSchema {
  return {
    email: faker.internet.email(),
    name: faker.person.fullName(),
    password_hash: faker.internet.password({ length: 12, memorable: true }) + 'A1!',
    birth_date: faker.date.birthdate().toISOString(),
  };
}

// Funció per generar una terrassa falsa
export function generateFakeTerrace(): CustomTerraceType {
  return {
    business_name: faker.company.name(),
    cadastro_ref: faker.string.uuid(),
    address: faker.location.streetAddress(),
    activity_code: faker.number.int({ min: 1000, max: 9999 }),
    group_activity_code: faker.number.int({ min: 1000, max: 9999 }),
    district_name: faker.location.city(),
    district_code: faker.number.int({ min: 1, max: 10 }),
    neighbourhood_name: faker.location.city(),
    neighbourhood_code: faker.number.int({ min: 100, max: 999 }),
    zip_code: faker.location.zipCode(),
    tables: faker.number.int({ min: 5, max: 20 }),
    seats: faker.number.int({ min: 20, max: 100 }),
    latitude: faker.location.latitude().toString(),
    longitude: faker.location.longitude().toString(),
    average_price: faker.number.float({ min: 10, max: 40 }),
    average_rating: faker.number.float({ min: 1, max: 5 }),
    has_wifi: faker.datatype.boolean(),
    pet_friendly: faker.datatype.boolean(),
    can_smoke: faker.datatype.boolean(),
    has_disabled_access: faker.datatype.boolean(),
    has_kitchen: faker.datatype.boolean(),
    reservation_fee: faker.number.float({ min: 0, max: 5 }),
    is_claimed: faker.datatype.boolean(),
    instagram_account: faker.internet.userName(),
    website: faker.internet.url(),
    profile_pic: faker.image.url(),
  };
}

// Generar i mostrar 5 usuaris i 5 terrasses falses
const fakeUsers = Array.from({ length: 5 }, generateFakeUser);
const fakeTerraces = Array.from({ length: 5 }, generateFakeTerrace);

console.log('FAKE USERS:\n', fakeUsers);
console.log('FAKE TERRACES:\n', fakeTerraces);

// OPCIONAL: Aquí podries afegir codi per inserir les dades a Supabase si tens accés
// import { supabaseAdmin } from '../config/supabase-admin';
// await supabaseAdmin.from('users').insert(fakeUsers);
// await supabaseAdmin.from('terraces').insert(fakeTerraces);
