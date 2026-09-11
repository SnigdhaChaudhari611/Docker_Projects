import mysql from "mysql2";

export const db = mysql.createConnection({
    host:"database",
    user: "root",
    password:"root",
    database:"mydevify_social"
}) 
