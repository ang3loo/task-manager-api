const express = require("express");
const db = require("./database");

const app = express();
const port = 3000;

// rotta GET /health
app.get("/health", (req, res) => {
    res.json({"status": "ok"});
});

// rotta GET /tasks
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

// rotta POST /tasks
app.use(express.json());
app.post("/tasks", (req, res) => {
    const { title, description } = req.body;
    if(!title){
        res.status(400).json({error: "No title found"});
        return;
    }
    
    const sql2 = `INSERT INTO tasks (title, description) VALUES (?, ?)`;
    db.run(sql2,[title, description], function (err){
        
        if (err){
            res.status(500).json({error: "Errore nell'insert..."});
            return;
        }

        console.log(this.lastID);
        res.status(201).json({
            id: this.lastID,
            title,
            description,
            completed: 0
        });
    });
});


// server in ascolto
app.listen(port, () => {
    console.log(`The server is running on port http://localhost:${port}/tasks`);
});