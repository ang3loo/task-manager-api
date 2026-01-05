const db = require("./database");


function getAllTasks(callback){
    const sql = `SELECT * FROM tasks;`;
    db.all(sql, callback);
}

function getTaskById(id, callback){
    const sql = `SELECT * FROM tasks WHERE id = ?;`;
    db.get(sql, [id], callback);
}

function createTask(params, callback){
    const sql = `INSERT INTO tasks (title, description) VALUES (?, ?)`;
    db.run(sql, params, callback);
}

function updateTaskById(params, callback){
    
    const sql = `UPDATE tasks
    SET title = ?, description = ?, completed = ?
    WHERE id = ?;
    `;
    db.run(sql, params, callback); 
}

function deleteTaskById(id, callback){
    const sql = `DELETE FROM tasks WHERE id = ?;`;
    db.run(sql, [id], callback);
}

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTaskById,
    deleteTaskById
};