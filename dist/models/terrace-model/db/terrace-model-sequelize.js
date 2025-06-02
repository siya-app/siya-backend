import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../../config/sequelize-config.js';
import { validFoodCategoryTags, validEmotionalTags, validCoverTypes, validPlacementTypes, validDietaryRestrictionTypes } from '../zod/customTerrace-schema.js';
import { tagValidator } from '../../../utils/terrace-utils/tagValidator.js';
import { defaultOpeningHours } from '../../../utils/terrace-utils/defaultOpeningHours.js';
//TODO find default images!!
class Terrace extends Model {
}
Terrace.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    business_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cadastro_ref: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    street_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    street_address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    door_address: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    activity_code: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    group_activity_code: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    district_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    district_code: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    neighbourhood_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    neighbourhood_code: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    postal_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    tables: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    seats: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    latitude: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    average_price: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    average_rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
    },
    has_wifi: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    pet_friendly: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    can_smoke: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    has_disabled_acces: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    has_kitchen: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    has_promos: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    reservation_fee: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    is_premium: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    instagram_account: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    food_category: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        validate: {
            isValidFoodTags(value) {
                tagValidator(value, validFoodCategoryTags);
            }
        }
    },
    placement_type: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        validate: {
            isValidPlacementType(value) {
                tagValidator(value, validPlacementTypes);
            }
        }
    },
    emotional_tags: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        validate: {
            isValidEmotionalTags(value) {
                tagValidator(value, validEmotionalTags);
            }
        }
    },
    cover_type: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        validate: {
            isValidCoverType(value) {
                tagValidator(value, validCoverTypes);
            }
        }
    },
    dietary_restrictions: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        validate: {
            isValidDietaryRestrictionsType(value) {
                tagValidator(value, validDietaryRestrictionTypes);
            }
        }
    },
    profile_pic: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: () => {
            const defaultImages = [
                "terrace1.jpg",
                "terrace2.jpg",
            ];
            return defaultImages[Math.floor(Math.random() * defaultImages.length)];
        },
    },
    opening_hours: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: defaultOpeningHours,
        validate: {
            isValidHours(value) {
                if (!Array.isArray(value))
                    throw new Error('Must be an array');
                if (value.length !== 7)
                    throw new Error('Must have 7 days');
                value.forEach(day => {
                    if (!/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(day.hours)) {
                        throw new Error(`Invalid hours format for ${day.day}`);
                    }
                });
            }
        }
    },
}, {
    sequelize,
    modelName: 'Terrace',
    tableName: 'terraces',
    timestamps: false,
});
export default Terrace;
// has_promos
// reservation_fee
// is_premium
// is_verified
// instagram_account
//# sourceMappingURL=terrace-model-sequelize.js.map