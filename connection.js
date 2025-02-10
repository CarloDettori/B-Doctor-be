import mysql from "mysql2"

const connection_db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection_db.connect((err) => {
    if (err) throw err
    console.log("connection to database completed!")
});

export default connection_db