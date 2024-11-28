const mysql = require("mysql2");
const express = require("express");

res.render('../views/contacts', {user: user})
res.render('../views/meets', {user: user})
res.render('../views/index', {user: user})


const app = express();
const urlencodedParser = express.urlencoded({ extended: true });

const defaultUser = ["Obito", "Rin"]

var user = defaultUser;

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "event_store", 
    password: "Amaterasu"
});

app.set("view engine", "hbs");

app.use(express.static("static"))


app.get("/", urlencodedParser, function (req, res) {
    res.render("index.hbs", {
    });
    // console.log(tg.)
});


app.get("/", urlencodedParser, function (req, res) {
    res.render("index.hbs", {
    });
});


app.get("/", urlencodedParser, function (req, res) {
    res.render("index.hbs", {
    });
});


app.listen(3000, function () {
    console.log("Сервер запущен на http://localhost:3000");
});