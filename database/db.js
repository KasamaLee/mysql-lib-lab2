const mysql2 = require('mysql2/promise')

const db = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Tk_10175560',
    database: 'mysql_todo_list',
    connectionLimit: 20
});

module.exports = db;