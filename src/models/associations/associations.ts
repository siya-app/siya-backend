import User from '../user-model/user.model.js';
import Terrace from '../terrace-model/db/terrace-model-sequelize.js';

User.belongsTo(Terrace, {
  foreignKey: 'id_terrace',
  as: 'ownedTerrace', 
});


Terrace.hasMany(User, {
  foreignKey: 'restaurantId', 
  as: 'owners', 
});