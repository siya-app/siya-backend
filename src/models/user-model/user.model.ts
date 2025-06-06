
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize-config.js';

class User extends Model {
  public id!: string;
  public email!: string;
  public name!: string;
  public age!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate : {
          isEmail : true
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birth_date : {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
    type: DataTypes.ENUM('client', 'owner'), 
    defaultValue: 'client',
    allowNull: false,
  }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true
  }
);

export default User;
