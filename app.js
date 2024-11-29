const mysql = require("mysql2");
const express = require("express");
const port = process.env.PORT || 4000;
// const mySqlQueries = require("./static/modules/mySqlQueries");
// const { user } = require("./static/js/test");


const app = express();
const urlencodedParser = express.urlencoded({ extended: true });


const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "alexandr_mini_app", 
    password: "Amaterasu"
});

app.set("view engine", "hbs");

app.use(express.static("static"))


app.get("/:userId", urlencodedParser, function (req, res) {
    const user_id = req.params.userId
    res.render("index.hbs", {
        userId: user_id
    });
});

app.get("/contacts/:userId", urlencodedParser, function (req, res) {
    const user_id = req.params.userId
    res.render("contacts.hbs", {
        userId: user_id
    });
});


app.get("/meets/:userId", urlencodedParser, function (req, res) {
    const user_id = req.params.userId
    res.render("meets.hbs", {
        userId: user_id
    });
});


app.listen(3000, function () {
    console.log("Сервер запущен на http://localhost:3000");
});