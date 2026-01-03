const express = require("express");
const db = require("./database");

const app = express();
const port = 3000;


app.get("/health", (req, res) => {
    res.json({"status": "ok"});
});

const sql = "SELECT * FROM tasks;";
app.get("/tasks", (req, res) => {
    db.all(sql, (err, rows) => {
        if (err){
            res.status(500).json({error: "Database error"});
            return;
        }
        res.json(rows);
    });
});



app.listen(port, () => {
    console.log(`The server is running on port http://localhost:${port}/tasks`);
});