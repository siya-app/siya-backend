import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../../config/sequelize-config.js';
//TODO find default images!!
class Terrace extends Model {
    id;
    business_name;
    cadastro_ref;
    street_type;
    street_address;
    door_address;
    activity_code;
    group_activity_code;
    district_name;
    district_code;
    neighbourhood_name;
    neighbourhood_code;
    opening_hours;
    zip_code;
    tables;
    seats;
    latitude;
    longitude;
    average_price;
    average_rating;
    has_wifi;
    pet_friendly;
    can_smoke;
    has_disabled_acces;
    has_kitchen;
    is_claimed;
    instagram_account;
    website;
    profile_pic;
    reservation_fee;
}
Terrace.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
    address: {
        type: DataTypes.STRING,
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
    zip_code: {
        type: DataTypes.STRING,
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
    has_disabled_access: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    has_kitchen: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    reservation_fee: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    is_claimed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    instagram_account: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profile_pic: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
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