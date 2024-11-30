const all_tasks = "SELECT * FROM tasks WHERE user_id = ?";
const all_contacts = "SELECT * FROM contacts WHERE user_id = ?";
const all_meets = "SELECT meets.meeting_id, meets.user_id, meets.location, meets.title, users.username FROM meets \
INNER JOIN users ON users.user_id = meets.user_id \
WHERE meets.user_id = ?";

const task_info_1 = "SELECT tasks.task_id, users.username, tasks.contact_id, tasks.title, \
tasks.description, tasks.priority, tasks.attachments, tasks.status, tasks.due_date, tasks.created_at FROM tasks \
INNER JOIN users ON users.user_id = tasks.user_id \
WHERE tasks.user_id = ? AND tasks.task_id = ?";
const task_info_2 = "SELECT contacts.name, contacts.phone FROM contacts\
WHERE contacts.user_id = ? AND contacts.contact_id = ?"

const contact_info = "SELECT * FROM contacts \
WHERE user_id = ? AND contact_id = ?"

const meet_info = "SELECT meets.meeting_id, meets.title, meets.start_time, \
meets.end_time, meets.location, meets.participants, meets.notes, users.username FROM meets \
INNER JOIN users ON users.user_id = meets.user_id \
WHERE meets.user_id = ? AND meets.meeting_id = ?";
const meet_users = "SELECT username FROM users \
WHERE username IN "

module.exports.all_tasks = all_tasks;
module.exports.all_contacts = all_contacts;
module.exports.all_meets = all_meets;
module.exports.task_info_1 = task_info_1;
module.exports.task_info_2 = task_info_2;
module.exports.contact_info = contact_info;
module.exports.meet_info = meet_info;
module.exports.meet_users = meet_users;
