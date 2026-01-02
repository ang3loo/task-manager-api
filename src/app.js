const express = require("express");
const db = require("./database");

const app = express();
const port = 3000;


app.get("/health", (req, res) => {
    res.json({"status": "ok"});
});

app.listen(port, () => {
    console.log(`The server is running on port http://localhost:${port}/health`);
});