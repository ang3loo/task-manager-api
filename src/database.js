const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("database.sqlite", (err) =>{
    if (err){
        console.error(err.message);
    }else{
        console.log("Connected to SQLite database.");
    }
});

const sql = `CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  completed INTEGER DEFAULT 0
);`;

db.run(sql, (err) => {
    if (err){
        console.error(err.message);
    }else{
        console.log("Tasks table ready.")
    }
});

module.exports = db;