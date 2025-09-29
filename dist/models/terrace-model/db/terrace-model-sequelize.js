import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../../config/sequelize-config.js';
//TODO find default images!!
export class Terrace extends Model {
    id;
    business_name;
    cadastro_ref;
    address;
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
    tags;
    phone_num;
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
        unique: true
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
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.DOUBLE,
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
    tags: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        get() {
            const rawValue = this.getDataValue('tags');
            return {
                cover: [],
                dietary: [],
                emotional: [],
                food: [],
                placement: [],
                ...rawValue
            };
        }
    },
    phone_num: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    }
}, {
    sequelize,
    modelName: 'Terrace',
    tableName: 'terraces',
    schema: 'public',
    timestamps: false,
});
export default Terrace;
//# sourceMappingURL=terrace-model-sequelize.js.map