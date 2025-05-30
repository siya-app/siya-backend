import { z } from "zod";
import { typeValidator } from "../../utils/typeValidator.js";
import { tagValidator } from "../../utils/tagValidator.js";
import { defaultOpeningHours } from "../../utils/defaultOpeningHours.js";

export const DietaryRestrictionSchema = z.enum([
    'Vegetarian', 'Vegan', 'NonVegetarian', 'GlutenFree'
]);

export const validDietaryRestrictionTypes = typeValidator(DietaryRestrictionSchema);

export const FoodCategorySchema = z.union([
    z.literal('Asian'),
    z.literal('MiddleEastern'),
    z.literal('Mediterranean'),
    z.literal('American'),
    z.literal('Latin'),
    z.literal('Indian'),
    z.literal('Japanese'),
    z.literal('Chinese'),
    z.literal('Thai'),
    z.literal('Vietnamese'),
    z.literal('Italian'),
    z.literal('Greek'),
    z.literal('Spanish'),
    z.literal('Mexican'),
    z.literal('Peruvian'),
    z.literal('Chicken'),
    z.literal('Pizza'),
    z.literal('Burger'),
    z.literal('Brunch'),
    z.literal('Breakfast'),
    z.literal('Kebab'),
    z.literal('Tapas'),
    z.literal('DailyMenu'),
    z.null()
]);

export const validFoodCategoryTags = typeValidator(FoodCategorySchema);

export const PlacementTypeSchema = z.union([
    z.literal('Garden'),
    z.literal('Park'),
    z.literal('Square'),
    z.literal('Street'),
    z.literal('Interior'),
    z.literal('Rooftop'),
    z.literal('Seaside'),
    z.null()
]);

export const validPlacementTypes = typeValidator(PlacementTypeSchema)

export const EmotionalTagsSchema = z.union([
    z.literal('Relaxed'),
    z.literal('Lively'),
    z.literal('Romantic'),
    z.literal('Groups'),
    z.literal('Friends'),
    z.literal('Silent'),
    z.literal('Cozy'),
    z.literal('Trendy'),
    z.literal('Elegant'),
    z.literal('Casual'),
    z.literal('FamilyFriendly'),
    z.literal('Youthful'),
    z.literal('PetLovers'),
    z.null()
]);

export const validEmotionalTags = typeValidator(EmotionalTagsSchema);

export const CoverTypeSchema = z.union([
    z.literal('None'),
    z.literal('Umbrella'),
    z.literal('PartialCover'),
    z.literal('FullCover'),
    z.literal('Retractable'),
    z.literal('Ceiling'),
    z.null()
]);

export const validCoverTypes = typeValidator(CoverTypeSchema);


export const UserRatingSchema = z.union([
    z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5),
    z.literal(6), z.literal(7), z.literal(8), z.literal(9), z.literal(10),
    z.null()
]);

export const ReviewSchema = z.object({
    user_comment: z.string(),
    user_rating: UserRatingSchema,
    user_pictures: z.record(z.any()) // TODO: shape object in the future
});

export const PromoSchema = z.object({
    title: z.string(),
    description: z.string(),
    price: z.number()
});

export const BusinessSchema = z.object({
    id: z.string(),
    business_name: z.string(),
    phone_num: z.string().optional(),
    email: z.string().optional(),
    profile_pic: z.record(z.any()).optional(),
    is_verified: z.boolean(),
});

const DaySchema = z.object({
    day: z.enum([
        "monday", "tuesday", "wednesday",
        "thursday", "friday", "saturday", "sunday"
    ]),
    hours: z.string()
        .regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, {
            message: "Hours must be in format 'HH:MM-HH:MM' (e.g., '09:00-17:00')",
        })
        .default("00:00-00:00"),
});

export const CustomTerraceSchema = z.object({
    id: z.string(),
    business_name: z.string(),
    cadastro_ref: z.string(),
    street_type: z.string(),
    street_address: z.string(),
    door_address: z.number(),
    activity_code: z.number(),
    group_activity_code: z.number(),
    postal_code: z.number(),
    district_name: z.string(),
    district_code: z.number(),
    neighbourhood_name: z.string(),
    neighbourhood_code: z.number(),
    tables: z.number(),
    seats: z.number(),
    latitude: z.string(),
    longitude: z.string(),
    has_wifi: z.boolean().optional(),
    pet_friendly: z.boolean().optional(),
    can_smoke: z.boolean().optional(),
    average_price: z.number().optional(),
    average_rating: z.number().optional(),
    has_disabled_acces: z.boolean().optional(),
    has_kitchen: z.boolean().optional(),
    dietary_restrictions: z.array(DietaryRestrictionSchema).optional(),
    food_category: z.array(FoodCategorySchema).optional(),
    placement_type: z.array(PlacementTypeSchema).optional(),
    emotional_tags: z.array(EmotionalTagsSchema).optional(),
    cover_type: z.array(CoverTypeSchema).optional(),
    profile_pic: z.string().optional(),
    has_promos: z.boolean(),
    reservation_fee: z.number(),
    is_premium: z.boolean(),
    is_verified: z.boolean(),
    instagram_account: z.string(),
    opening_hours: z.array(DaySchema)
        .length(7)
        .refine(
            (days) => new Set(days.map(day => day.day)).size === 7,
            { message: "All 7 unique days must be provided" }
        )
        .default(defaultOpeningHours),
});

export type DietaryRestrictionType = z.infer<typeof DietaryRestrictionSchema>;
export type FoodCategoryType = z.infer<typeof FoodCategorySchema>;
export type PlacementType = z.infer<typeof PlacementTypeSchema>;
export type EmotionalTagsType = z.infer<typeof EmotionalTagsSchema>;
export type CoverType = z.infer<typeof CoverTypeSchema>;
export type UserRatingType = z.infer<typeof UserRatingSchema>;
export type ReviewType = z.infer<typeof ReviewSchema>;
export type PromoType = z.infer<typeof PromoSchema>;
export type CustomTerraceType = z.infer<typeof CustomTerraceSchema>;
export type BusinessType = z.infer<typeof BusinessSchema>;