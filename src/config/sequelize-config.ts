import dotenv from "dotenv";
dotenv.config(); // Asegúrate de que esta línea esté al principio para cargar las variables de entorno

import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    process.env.DB_DATABASE || '',    // Usar DB_DATABASE
    process.env.DB_USER || '',       // Usar DB_USER
    process.env.DB_PASSWORD || '',   // Usar DB_PASSWORD
    {
        host: process.env.DB_HOST || 'localhost', // Usar DB_HOST
        // Asegúrate que el puerto por defecto sea 5432 para PostgreSQL si DB_PORT no está definido
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
        dialect: 'postgres', // Correcto para Supabase
        dialectOptions: {
            ssl: {
                require: true, // Requerido por Supabase
                rejectUnauthorized: false, // Puede ser necesario en desarrollo para evitar errores de certificado
            },
        },
        logging: console.log, // Puedes cambiar a true para ver las consultas SQL en la consola
    }
);

// Exportar función opcional para testear conexión
export async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');
    } catch (error) {
        console.error('❌ No se pudo conectar a la base de datos:', error);
    }
}