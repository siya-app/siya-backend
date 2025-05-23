import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize-config'

class Terrace extends Model { 
    public id!: string;
    public business_name!: string;
    public cadastro_ref!: string;
    public street_type!: string;
    public street_address!: string;
    public door_address!: number;
    public activity_code!: number;
    public group_activity_code!: number;
    public district_name!: string;
    public district_code!: number;
    public neighbourhood_name!: string;
    public neighbourhood_code!: number;
    public opening_hours?: string;
    public postal_code?: number;
    public tables!: number;
    public seats!: number;
    public latitude!: number;
    public longitude!: number;
    public average_price?: number;
    public average_rating?: number;
    public has_wifi?: boolean;
    public pet_friendly?: boolean;
    public can_smoke?: boolean;
    public has_disabled_acces?: boolean;
    public has_kitchen?: boolean;
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
    opening_hours: {
        type: DataTypes.STRING,
        allowNull: true
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
}, {
    sequelize,
    tableName: 'terraces',
    timestamps: false,
});

export default Terrace;