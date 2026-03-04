const mysql2 = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql2.createPool({
    host: process.env.DB_LOCALHOST ?? "localhost",
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "senai",
    database: process.env.DB_DATABASE ?? "api_jwt_bcrypt"
})

module.exports = db;