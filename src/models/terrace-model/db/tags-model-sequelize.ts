// import { Model, DataTypes } from 'sequelize';
// import { sequelize } from '../../../config/sequelize-config.js';
// import Terrace from './terrace-model-sequelize.js';


// export const Tag = sequelize.define('Tag', {
//     name: { type: DataTypes.STRING, allowNull: false },
//     category: {
//         type: DataTypes.ENUM('cover', 'dietary', 'emotional', 'food', 'placement'), // Postgres only
//         allowNull: false
//     }
// });

// const TerraceTag = sequelize.define('TerraceTag', {}, { timestamps: false });
// // This will create columns terraceId and tagId automatically when used as through table.

// Terrace.belongsToMany(Tag, { through: TerraceTag });
// Tag.belongsToMany(Terrace, { through: TerraceTag });