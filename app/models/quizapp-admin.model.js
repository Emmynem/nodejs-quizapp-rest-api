const sql = require("./db");

// constructor
const QuizappAdmin = function (admin) {
    this.firstName = admin.firstName;
    this.lastName = admin.lastName;
    this.email = admin.email;
    this.password = admin.password;
    this.added_date = admin.added_date;
};

// Creating a new admin via signup
QuizappAdmin.signup = (newAdmin, result) => {
        sql.query("SELECT firstName FROM admin WHERE email = ?", [newAdmin.email], (err, res) => {
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
                sql.query("INSERT INTO admin SET ?", newAdmin, (err, res) => {
                    if (err) {
                        console.log("Error: ", err);
                        result(err, null);
                        return;
                    }
                    console.log("Admin added : ", { id: res.insertId, ...newAdmin });
                    result(null, { id: res.insertId, ...newAdmin });
                });
            }
        });
};

QuizappAdmin.login = (loginDetails, result) => {
    sql.query("SELECT id, firstName, lastName, email FROM admin WHERE email = ? AND password = ?", 
    [loginDetails.email, loginDetails.password], 
    (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        if(res.length == 0){
            result({ kind: "login_incorrect" }, null);
            return;
        }
        console.log("Login feedback details: ", res);
        result(null, res);
    });
};

QuizappAdmin.getAdmins = result => {
    sql.query("SELECT id, firstName, lastName, email, added_date FROM admin", (err, res) => {
        if(err){
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        console.log("Admins: ", res);
        result(null, res);
    });
};

QuizappAdmin.getAdmin = (id, result) => {
    sql.query("SELECT id, firstName, lastName, email, added_date FROM admin WHERE id = ?", [id], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log(`Admin ID ${id} details: `, res[0]);
            result(null, res[0]);
            return;
        }
        result({ kind: "not_found" }, null);
    });
};

QuizappAdmin.updateAdmin = (id, updateDetails, result) => {
    sql.query("UPDATE admin SET firstName = ?, lastName = ? WHERE id = ?",
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
        console.log(`Updated admin with id ${id}: `, { id: id, ...updateDetails });
        result(null, { id: id, ...updateDetails });
    });
};

QuizappAdmin.removeAdmin = (id, result) => {
    sql.query("DELETE FROM admin WHERE id = ?", [id], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("Deleted admin with id: ", id);
        result(null, res);
    });
};

// Now export this module
module.exports = QuizappAdmin;
