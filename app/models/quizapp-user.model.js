const sql = require("./db");

// constructor
const QuizappUser = function (user) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.password = user.password;
    this.added_date = user.added_date;
};

// Creating a new user via signup
QuizappUser.signup = (newAdmin, result) => {
    sql.query("SELECT firstName FROM users WHERE email = ?", [newAdmin.email], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        if (res.length > 0) {
            result({ kind: "found_email" }, null);
            return;
        }
        else {
            sql.query("INSERT INTO users SET ?", newAdmin, (err, res) => {
                if (err) {
                    console.log("Error: ", err);
                    result(err, null);
                    return;
                }
                console.log("User added : ", { id: res.insertId, ...newAdmin });
                result(null, { id: res.insertId, ...newAdmin });
            });
        }
    });
};

QuizappUser.login = (loginDetails, result) => {
    sql.query("SELECT id, firstName, lastName, email FROM users WHERE email = ? AND password = ?",
        [loginDetails.email, loginDetails.password],
        (err, res) => {
            if (err) {
                console.log("Error: ", err);
                result(err, null);
                return;
            }
            if (res.length == 0) {
                result({ kind: "login_incorrect" }, null);
                return;
            }
            console.log("Login feedback details: ", res);
            result(null, res);
        });
};

QuizappUser.getUsers = result => {
    sql.query("SELECT id, firstName, lastName, email, added_date FROM users", (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        console.log("Admins: ", res);
        result(null, res);
    });
};

QuizappUser.getUser = (id, result) => {
    sql.query("SELECT id, firstName, lastName, email, added_date FROM users WHERE id = ?", [id], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log(`User ID ${id} details: `, res[0]);
            result(null, res[0]);
            return;
        }
        result({ kind: "not_found" }, null);
    });
};

QuizappUser.updateUser = (id, updateDetails, result) => {
    sql.query("UPDATE users SET firstName = ?, lastName = ? WHERE id = ?",
        [updateDetails.firstName, updateDetails.lastName, id], (err, res) => {
            if (err) {
                console.log("Error: ", err);
                result(err, null);
                return;
            }
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }
            console.log(`Updated user with id ${id}: `, { id: id, ...updateDetails });
            result(null, { id: id, ...updateDetails });
        });
};

QuizappUser.removeUser = (id, result) => {
    sql.query("DELETE FROM users WHERE id = ?", [id], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("Deleted user with id: ", id);
        result(null, res);
    });
};

// Now export this module
module.exports = QuizappUser;