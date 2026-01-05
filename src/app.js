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

const sql_get_id = "SELECT * FROM tasks WHERE id = ?;";
app.get("/tasks/:id", (req, res) => {
    const {id} = req.params;
    db.get(sql_get_id, [id], (err, row) => {
        //console.log(id)
        if(err){
            res.status(500).json({error: "db error"});
            return;
        }

        // if id is not found
        if(!row){
            res.status(404).json({error: "task not found"});
            return;
        }

        res.status(200).json({
            id: row.id,
            title: row.title,
            description: row.description,
            completed: row.completed
        });
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
    
    const sql_insert = `INSERT INTO tasks (title, description) VALUES (?, ?)`;
    db.run(sql_insert,[title, description], function (err){
        
        if (err){
            res.status(500).json({error: "Errore nell'insert..."});
            return;
        }

        //console.log(this.lastID);
        res.status(201).json({
            id: this.lastID,
            title,
            description,
            completed: 0
        });
    });
});


const sql_update_all = `UPDATE tasks
SET title = ?, description = ?, completed = ?
WHERE id = ?;
`;

app.put("/tasks/:id", (req, res) => {
    const {id} = req.params;
    const {title, description, completed} = req.body;

    if(!title){
        res.status(400).json({error: "Title required"});
        return;
    }

    db.run(sql_update_all, [title, description, completed, id], function(err){
        if(err){
            res.status(500).json({error: "Database error"});
            return;
        }
        if(!this.changes){
            res.status(404).json({error: "Task not found"});
            return;
        }

        res.status(200).json({
            id,
            title,
            description,
            completed
        });

    });
});

// delete /tasks/:id
const sql_del_id = "DELETE FROM tasks WHERE id = ?;";
app.delete("/tasks/:id", (req, res) => {
    const {id} = req.params;
    const itemId = Number(id);

    db.run(sql_del_id, [itemId], function(err){
        if(err){
            res.status(500).json({error: "db error"});
            return;
        }
        if(!this.changes){
            res.status(404).json({error: "task not found"});
            return;
        }

        res.sendStatus(204);
    });
});


// server in ascolto
app.listen(port, () => {
    console.log(`The server is running on port http://localhost:${port}/tasks`);
});