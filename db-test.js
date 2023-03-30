const sqlite3 = require('sqlite3');
const path = require('node:path');

//Path to sqllite3 database
const dbPath = path.join(__dirname,'db','dnrb.db');

const db = new sqlite3.Database(dbPath, (err) => {
    console.log('Error connecting to (or creating) SQLite3 database');
    return;
})