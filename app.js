const mysql = require("mysql2");
const express = require("express");
var hbs = require('hbs');
const port = process.env.PORT || 4000;
const BD_queries = require("./static/modules/BD_queries");


hbs.registerHelper('dateFormat', require('handlebars-dateformat'));
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
    pool.query(BD_queries.all_tasks, [user_id], function (err, tasks) {
        if (err) return console.log(err);
        res.render("index.hbs", {
            userId: user_id,
            task: tasks
        });
    });
});  

app.get("/contacts/:userId", urlencodedParser, function (req, res) {
    const user_id = req.params.userId
    pool.query(BD_queries.all_contacts, [user_id], function (err, contacts) {
        if (err) return console.log(err);
        res.render("contacts.hbs", {
            userId: user_id,
            contact: contacts
        });
    });
});


app.get("/meets/:userId", urlencodedParser, function (req, res) {
    const user_id = req.params.userId
    pool.query(BD_queries.all_meets, [user_id], function (err, meets) {
        if (err) return console.log(err);
        res.render("meets.hbs", {
            userId: user_id,
            meet: meets
        });
    });
});



app.get("/task/:taskId/:userId", urlencodedParser, function (req, res) {
    const task_id = req.params.taskId;
    const user_id = req.params.userId;
    pool.query(BD_queries.task_info_1, [user_id, task_id], function (err, task_info) {
        if (err) return console.log(err);

        if (task_info[0].contact_id == null) {

            res.render("task.hbs", {
                taskInfo: task_info[0],
                contact: null,
                userId: user_id
            });
        }

        else {
            pool.query(BD_queries.task_info_2, [user_id, task_info[0].contact_id], function (err, task_contact) {
                if (err) return console.log(err);
                res.render("task.hbs", {
                    taskInfo: task_info[0],
                    contact: task_contact[0],
                    userId: user_id
                });
            });
        };
    });
});


app.get("/contact/:contactId/:userId", urlencodedParser, function (req, res) {
    const contact_id = req.params.contactId;
    const user_id = req.params.userId;
    pool.query(BD_queries.contact_info, [user_id, contact_id], function (err, contact_info) {
        if (err) return console.log(err);
        res.render("contact.hbs", {
            contactInfo: contact_info[0],   
            userId: user_id
        });
    });
});


app.get("/meet/:meetId/:userId", urlencodedParser, function (req, res) {
    const meet_id = req.params.meetId;
    const user_id = req.params.userId;
    pool.query(BD_queries.meet_info, [user_id, meet_id], function (err, meet_info) {
        if (err) return console.log(err);
        if (meet_info[0].participants == null) {
            meet_info[0].participants = -1
        };

        pool.query(BD_queries.meet_users + ["(" + meet_info[0].participants + ")"], function (err, meet_users) {
            if (err) return console.log(err);
            res.render("meet.hbs", {
                meetInfo: meet_info[0],
                meetUsers: meet_users[0],
                userId: user_id
            });
        });
    });
});


app.listen(port, function () {
    console.log("Сервер запущен на http://localhost:3000");
});