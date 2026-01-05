const express = require("express");
const db = require("./database");

const {getAllTasks, getTaskById, createTask, updateTaskById, deleteTaskById} = require("./tasks")

const app = express();
const port = 3000;

app.use(express.json());

// server in ascolto
app.listen(port, () => {
    console.log(`The server is running on port http://localhost:${port}/tasks`);
});


// rotta GET /tasks
app.get("/tasks", (req, res) => {
    getAllTasks((err, rows) => {
        if (err) return res.status(500).json({error: "Database error"});
        res.json(rows);
    });
});

app.get("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    getTaskById(id, (err, row) => {
        
        if(err) return res.status(500).json({error: "db error"});

        // if id is not found
        if(!row) return res.status(404).json({error: "task not found"});

        res.status(200).json({
            id: row.id,
            title: row.title,
            description: row.description,
            completed: row.completed
        });
    });
});

// rotta POST /tasks
app.post("/tasks", (req, res) => {
    const { title, description } = req.body;
    if(!title) return res.status(400).json({error: "No title found"});

    createTask([title, description], function (err){
        
        if (err) return res.status(500).json({error: "Errore nell'insert..."});

        res.status(201).json({
            id: this.lastID,
            title,
            description,
            completed: 0
        });
    });
});



app.put("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const {title, description, completed} = req.body;

    if(!title) return res.status(400).json({error: "Title required"});

    updateTaskById([title, description, completed, id], function(err){
        if(err) return res.status(500).json({error: "Database error"});
        if(!this.changes) return res.status(404).json({error: "Task not found"});

        res.status(200).json({
            id,
            title,
            description,
            completed
        });
    });
});

// delete /tasks/:id
app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    deleteTaskById(id, function(err){
        if(err) return res.status(500).json({error: "db error"});
        if(!this.changes) return res.status(404).json({error: "task not found"});

        res.sendStatus(204);
    });
});


