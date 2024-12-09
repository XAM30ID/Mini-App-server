const mysql = require("mysql2");
const express = require("express");
var hbs = require('hbs');
const port = process.env.PORT || 4000;
const BD_queries = require("./static/modules/BD_queries");


hbs.registerHelper('dateFormat', require('handlebars-dateformat'));
const app = express();
const urlencodedParser = express.urlencoded({ extended: true });


const pool = mysql.createPool({
    host: "2hb5f.h.filess.io",
    user: "MySqlServ_atroompast",
    database: "MySqlServ_atroompast", 
    password: "e2d720248c942afddb6f62f2d0a4208afe4f6f8f",
    port: 3307
});


// const pool = mysql.createPool({
//     connectionLimit: 5,
//     host: "localhost",
//     user: "root",
//     database: "alexandr_mini_app", 
//     password: "Amaterasu"
// });


app.set("view engine", "hbs");

app.use(express.static("static"))


app.get("/", urlencodedParser, function (req, res) {
    res.render("addresser.hbs", {
    });
}); 


app.get("/:userId", urlencodedParser, function (req, res) {
    const user_id = req.params.userId
    pool.query(BD_queries.all_contacts, [user_id], function (err, contacts) {
        if (err) return console.log(err);
        res.render("new_index.hbs", {
            userId: user_id,
            contacts: contacts
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

            res.render("new_task.hbs", {
                taskInfo: task_info[0],
                contact: null,
                userId: user_id
            });
        }

        else {
            pool.query(BD_queries.task_info_2, [user_id, task_info[0].contact_id], function (err, task_contact) {
                if (err) return console.log(err);
                res.render("new_task.hbs", {
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
        pool.query(BD_queries.task_by_contact, [user_id, contact_id], function (err, contact_tasks) {
            if (err) return console.log(err);
            res.render("new_contact.hbs", {
                contactInfo: contact_info[0],   
                userId: user_id,
                tasks: contact_tasks
            });
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
        pool.query(BD_queries.meet_users + "('" + meet_info[0].participants + "')", function (err, meet_users) {
            if (err) return console.log(err);
            res.render("meet.hbs", {
                meetInfo: meet_info[0],
                meetUsers: meet_users,
                userId: user_id
            });
        });
    });
});



app.get("/add-task/:userId/:taskId/:contactId", urlencodedParser, function (req, res) {
    const task_id1 = req.params.taskId;
    const user_id = req.params.userId;
    const contact_id = req.params.contactId;

    pool.query(BD_queries.all_tasks, [user_id], function (err, allTasks) {
        if (err) return console.log(err);
        var task_id;
        if (allTasks.length == 0) {
            task_id = 1;
        }
        else if (task_id1 == "new") {
            task_id = allTasks[allTasks.length - 1].task_id + 1;
        }
        else {
            task_id = task_id1;
        };

        pool.query(BD_queries.task_info_1, [user_id, task_id], function (err, task_info) {
            if (err) return console.log(err);
            if (task_info.length == 0 && contact_id.length == 0) {
                res.render("new_task_adding.hbs", {
                    userId: user_id,
                    taskId: task_id
                });
            }

            else if (task_info.length == 0 && contact_id.length > 0) {
                pool.query(BD_queries.task_info_2, [user_id, contact_id], function (err, task_contact) {
                    console.log
                    res.render("new_task_adding.hbs", {
                        userId: user_id,
                        taskId: task_id,
                        contact: task_contact[0]
                    });
                });
            }

            else {
                if (task_info[0].contact_id == null) {

                    res.render("new_task_adding.hbs", {
                        taskId: task_id,
                        taskInfo: task_info[0],
                        contact: null,
                        userId: user_id
                    });
                }

                else {
                    pool.query(BD_queries.task_info_2, [user_id, task_info[0].contact_id], function (err, task_contact) {
                        if (err) return console.log(err);
                        res.render("new_task_adding.hbs", {
                            taskInfo: task_info[0],
                            contact: task_contact[0],
                            userId: user_id,
                            taskId: task_id
                        });
                    });
                };
            };
        });
    });
});

app.post("/add-task/:userId/:taskId", urlencodedParser, function (req, res) {
    const task_id = req.params.taskId;
    const user_id = req.params.userId;
    if (!req.body) return res.sendStatus(400);

    const title = req.body.title;
    const description = req.body.description;
    const priority = req.body.priority;
    const status = req.body.status;
    const due_time = req.body.due_time;
    const contact = req.body.contact;

    pool.query(BD_queries.contact_from_username, [user_id, contact], function (err, task_contact) {
        if (err) return console.log(err);
        if (task_contact[0] == undefined) {
            task_contact = null;
        }
        else {
            task_contact = task_contact[0].contact_id
        };

        pool.query(BD_queries.task_exists, [user_id, task_id], function (err, is_editing) {
            if (err) return console.log(err);
            if (is_editing.length > 0) {
                pool.query(BD_queries.edit_task, [task_id, user_id, task_contact, title, description, 
                    priority, null, status, due_time, task_id, user_id], function (err, task_contact) {
                    if (err) return console.log(err);
                    res.redirect("/" + user_id)
                });
            }

            else {
                let currentDate = new Date();
                pool.query(BD_queries.add_task, [task_id, user_id, task_contact, title, description, 
                    priority, null, status, due_time, currentDate], function (err, task_contact) {
                    if (err) return console.log(err);
                    res.redirect("/" + user_id)
                });
            };
        });
    });
});


app.get("/add-contact/:userId/:contactId", urlencodedParser, function (req, res) {
    const contact_id1 = req.params.contactId;
    const user_id = req.params.userId;

    pool.query(BD_queries.all_contacts, [user_id], function (err, allContacts) {
        if (err) return console.log(err);
        var contact_id;
        if (allContacts.length == 0) {
            contact_id = 1;
        }
        else if (contact_id1 == "new") {
            contact_id = allContacts[allContacts.length - 1].contact_id + 1;
        }
        else {
            contact_id = contact_id1;
        };
        pool.query(BD_queries.contact_info, [user_id, contact_id], function (err, contact_info) {
            if (err) return console.log(err);
            if (contact_info.length == 0 || contact_info[0].contact_id == null) {
                res.render("new_contact_adding.hbs", {
                    userId: user_id,
                    contactId: contact_id
                });
            }

            // else {
            //     if (contact_info[0].contact_id == null) {

            //         res.render("new_contact_adding.hbs", {
            //             contactId: contact_id,
            //             userId: user_id
            //         });
            //     }

                else {
                    pool.query(BD_queries.contact_info, [user_id, contact_info[0].contact_id], function (err, contact_info) {
                        if (err) return console.log(err);
                        res.render("new_contact_adding.hbs", {
                            contactInfo: contact_info[0],
                            userId: user_id,
                            contactId: contact_id
                        });
                    });
                };
            // };
        });
    });
});

app.post("/add-contact/:userId/:contactId", urlencodedParser, function (req, res) {
    const contact_id = req.params.contactId;
    const user_id = req.params.userId;
    if (!req.body) return res.sendStatus(400);

    const name = req.body.name;
    const username = req.body.username;
    const phone = req.body.phone;
    const email = req.body.email;
    const notes = req.body.notes;

    pool.query(BD_queries.contact_info, [user_id, contact_id], function (err, is_editing) {
        if (err) return console.log(err);
        if (is_editing.length > 0) {
            let currentDate = new Date();
            pool.query(BD_queries.edit_contact, [contact_id, user_id, name, phone, email, notes, currentDate, username, contact_id, user_id], function (err, contact) {
                if (err) return console.log(err);
                res.redirect("/" + user_id)
            });
        }

        else {
            let currentDate = new Date();
            pool.query(BD_queries.add_contact, [contact_id, user_id, name, phone, email, notes, currentDate, currentDate, username], function (err, contact) {
                if (err) return console.log(err);
                res.redirect("/" + user_id)
            });
        };
    });
});


app.get("/add-meet/:userId/:meetId", urlencodedParser, function (req, res) {
    const meet_id1 = req.params.meetId;
    const user_id = req.params.userId;

    pool.query(BD_queries.all_meets, [user_id], function (err, allMeets) {
        if (err) return console.log(err);
        // console.log(allContacts);
        var meet_id;
        if (allMeets.length == 0) {
            meet_id = 1;
        }
        else if (meet_id1 == "new") {
            meet_id = allMeets[allMeets.length - 1].meeting_id + 1;
        }
        else {
            meet_id = meet_id1;
        };
        console.log(meet_id)
        pool.query(BD_queries.meet_info, [user_id, meet_id], function (err, meet_info) {
            if (err) return console.log(err);
            console.log(meet_info[0])
            if (meet_info.length == 0) {
                res.render("meet_adding.hbs", {
                    userId: user_id,
                    meetId: meet_id
                });
            }

            else {
                if (meet_info[0].meeting_id == null) {

                    res.render("meet_adding.hbs", {
                        meetId: meet_id,
                        userId: user_id
                    });
                }

                else {
                    pool.query(BD_queries.meet_info, [user_id, meet_info[0].meeting_id], function (err, meet_info) {
                        if (err) return console.log(err);
                        res.render("meet_adding.hbs", {
                            meetInfo: meet_info[0],
                            userId: user_id,
                            meetId: meet_id
                        });
                    });
                };
            };
        });
    });
});

app.post("/add-meet/:userId/:meetId", urlencodedParser, function (req, res) {
    const meet_id = req.params.meetId;
    const user_id = req.params.userId;
    if (!req.body) return res.sendStatus(400);

    const title = req.body.title;
    const start_time = req.body.start_time;
    const end_time = req.body.end_time;
    const location = req.body.title;
    const participants = req.body.participants;
    const notes = req.body.notes;

    pool.query(BD_queries.meet_info, [user_id, meet_id], function (err, is_editing) {
        if (err) return console.log(err);
        if (is_editing.length > 0) {
            pool.query(BD_queries.edit_meet, [meet_id, user_id, title, start_time, end_time, location, 
                participants, notes, meet_id, user_id], function (err, meet) {
                if (err) return console.log(err);
                res.redirect("/meets/" + user_id)
            });
        }

        else {
            pool.query(BD_queries.add_meet, [meet_id, user_id, title, start_time, end_time, location, 
                participants, notes], function (err, meet) {
                if (err) return console.log(err);
                res.redirect("/meets/" + user_id)
            });
        };
    });
});



app.get("/delete-task/:userId/:taskId", urlencodedParser, function (req, res) {
    const task_id = req.params.taskId;
    const user_id = req.params.userId;
    pool.query(BD_queries.delete_task, [task_id, user_id], function (err, task_info) {
        if (err) return console.log(err);
        res.redirect("/" + user_id)
    });
});

app.get("/delete-meet/:userId/:meetId", urlencodedParser, function (req, res) {
    const meet_id = req.params.meetId;
    const user_id = req.params.userId;
    pool.query(BD_queries.delete_meet, [meet_id, user_id], function (err, meet_info) {
        if (err) return console.log(err);
        res.redirect("/meets/" + user_id)
    });
});

app.get("/delete-contact/:userId/:contactId", urlencodedParser, function (req, res) {
    const contact_id = req.params.contactId;
    const user_id = req.params.userId;
    pool.query(BD_queries.delete_contact, [contact_id, user_id], function (err, contact_info) {
        if (err) return console.log(err);
        res.redirect("/contacts/" + user_id)
    });
});


app.listen(port, function () {
    console.log("Сервер запущен на http://localhost:3000");
});