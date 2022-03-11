const sql = require("./db");

// constructor
const QuizappResults = function (result) {
    this.user_email = result.user_email;
    this.percentage = result.percentage;
    this.added_date = result.added_date;
};

QuizappResults.addResult = (newResult, result) => {
    sql.query("SELECT firstName FROM users WHERE email = ?", [newResult.user_email], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        if (res.length == 0) {
            result({ kind: "not_found_user" }, null);
            return;
        }
        else {
            sql.query("INSERT INTO results SET ?", newResult, (err, res) => {
                if (err) {
                    console.log("Error: ", err);
                    result(err, null);
                    return;
                }
                console.log("Question added : ", { id: res.insertId, ...newResult });
                result(null, { id: res.insertId, ...newResult });
            });
        }
    });
};

// Now export this module
module.exports = QuizappResults;