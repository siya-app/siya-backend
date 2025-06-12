import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize-config.js';
import User from '../user-model/user.model.js';
import Terrace from '../terrace-model/db/terrace-model-sequelize.js';

class Review extends Model {
  public id!: string;
  public rating!: number;
  public comment!: string;
  public userId!: string;
  public id_terrace!: string;
  public readonly createdAt!: Date;
}

Review.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    id_terrace: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Terrace,
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at', 
    },
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'review',
    updatedAt: false, 
    timestamps: true,
    createdAt: 'created_at',
  }
);

// associacions: per fer les relacions entre models (foreign keys)
Review.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Review, { foreignKey: 'userId' });

Review.belongsTo(Terrace, { foreignKey: 'id_terrace' });
Terrace.hasMany(Review, { foreignKey: 'id_terrace' });

export default Review;
