import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";
//TODO esto son otras variables
export const sequelize = new Sequelize(process.env.MYSQL_DATABASE || '', process.env.MYSQL_USER || 'root', process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3000,
    dialect: 'mysql',
});
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
testConnection();
//# sourceMappingURL=sequelize-config.js.map