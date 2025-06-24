import  User  from "../../models/user-model/user.model.js" // ajusta según tu estructura

export const getUserById = async (id: string) => {
  return await User.findByPk(id);
};