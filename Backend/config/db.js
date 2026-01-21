import mysql from "mysql2/promise";

const db = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "ratingsdb",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default db;
