const all_tasks = "SELECT * FROM tasks WHERE user_id = ?";
const all_contacts = "SELECT * FROM contacts WHERE user_id = ?";
const all_meets = "SELECT meets.meeting_id, meets.user_id, meets.location, meets.title, users.username FROM meets \
INNER JOIN users ON users.user_id = meets.user_id \
WHERE meets.user_id = ?";

const task_info_1 = "SELECT tasks.task_id, users.username, tasks.contact_id, tasks.title, \
tasks.description, tasks.priority, tasks.attachments, tasks.status, tasks.due_date, tasks.created_at FROM tasks \
INNER JOIN users ON users.user_id = tasks.user_id \
WHERE tasks.user_id = ? AND tasks.task_id = ?";
const task_info_2 = "SELECT contacts.name, contacts.phone FROM contacts \
WHERE contacts.user_id = ? AND contacts.contact_id = ?"

const contact_info = "SELECT * FROM contacts \
WHERE user_id = ? AND contact_id = ?"

const meet_info = "SELECT meets.meeting_id, meets.title, meets.start_time, \
meets.end_time, meets.location, meets.participants, meets.notes, users.username FROM meets \
INNER JOIN users ON users.user_id = meets.user_id \
WHERE meets.user_id = ? AND meets.meeting_id = ?";
const meet_users = "SELECT username FROM users \
WHERE username IN "

const add_task = "INSERT INTO tasks (task_id, user_id, contact_id, title, \
description, priority, attachments, status, due_date, created_at) \
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
const contact_from_username = "SELECT contact_id FROM contacts \
WHERE contacts.user_id = ? AND contacts.username = ?"
const edit_task = "UPDATE tasks SET task_id=?, user_id=?, contact_id=?, title=?, \
description=?, priority=?, attachments=?, status=?, due_date=? \
WHERE task_id=? AND user_id=?"
const task_exists = "SELECT * FROM tasks WHERE user_id=? AND task_id=?"

const add_contact = "INSERT INTO contacts (contact_id, user_id, name, phone, email, notes, created_at, updated_at, username) \
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
const edit_contact = "UPDATE contacts SET contact_id=?, user_id=?, name=?, phone=?, email=?, notes=?, updated_at=?, username=? \
WHERE contact_id=? AND user_id=?"

const add_meet = "INSERT INTO meets (meeting_id, user_id, title, start_time, end_time, location, participants, notes) \
VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
const edit_meet = "UPDATE meets SET meeting_id=?, user_id=?, title=?, start_time=?, end_time=?, location=?, participants=?, notes=? \
WHERE meeting_id=? AND user_id=?"

const delete_task = "DELETE FROM tasks WHERE task_id=? AND user_id=?";
const delete_contact = "DELETE FROM contacts WHERE contact_id=? AND user_id=?";
const delete_meet = "DELETE FROM meets WHERE meeting_id=? AND user_id=?";


module.exports.all_tasks = all_tasks;
module.exports.all_contacts = all_contacts;
module.exports.all_meets = all_meets;
module.exports.task_info_1 = task_info_1;
module.exports.task_info_2 = task_info_2;
module.exports.contact_info = contact_info;
module.exports.meet_info = meet_info;
module.exports.meet_users = meet_users;
module.exports.add_task = add_task;
module.exports.edit_task = edit_task;
module.exports.task_exists = task_exists;
module.exports.contact_from_username = contact_from_username;
module.exports.add_contact = add_contact;
module.exports.edit_contact = edit_contact;
module.exports.add_meet = add_meet;
module.exports.edit_meet = edit_meet;
module.exports.delete_task = delete_task;
module.exports.delete_contact = delete_contact;
module.exports.delete_meet = delete_meet;
