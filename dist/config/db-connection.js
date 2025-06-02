import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();
// -- Connection pool for MySQL database interactions --
// A connection pool is a collection of reusable database connections
// and it helps improve performance by reusing connections
// rather than creating new ones for each request.
export const pool = mysql
    .createPool({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
})
    .promise();
//# sourceMappingURL=db-connection.js.map