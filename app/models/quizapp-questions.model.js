const sql = require("./db");

// constructor
const QuizappQuestions = function (question) {
    this.admin_id = question.admin_id;
    this.question = question.question;
    this.option1 = question.option1;
    this.option2 = question.option2;
    this.option3 = question.option3;
    this.option4 = question.option4;
    this.answer = question.answer;
    this.added_date = question.added_date;
};

QuizappQuestions.addQuestion = (newQuestion, result) => {
    sql.query("SELECT firstName FROM admin WHERE id = ?", [newQuestion.admin_id], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        if (res.length == 0) {
            result({ kind: "not_found_admin" }, null);
            return;
        }
        else {
            sql.query("INSERT INTO questions SET ?", newQuestion, (err, res) => {
                if (err) {
                    console.log("Error: ", err);
                    result(err, null);
                    return;
                }
                console.log("Question added : ", { id: res.insertId, ...newQuestion });
                result(null, { id: res.insertId, ...newQuestion });
            });
        }
    });
};

QuizappQuestions.getQuestions = result => {
    sql.query("SELECT question, option1, option2, option3, option4, answer FROM questions", (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        console.log("Questions: ", res);
        result(null, res);
    });
};

QuizappQuestions.getAdminQuestions = result => {
    sql.query("SELECT id, question, option1, option2, option3, option4, answer FROM questions", (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        console.log("Questions: ", res);
        result(null, res);
    });
};

QuizappQuestions.getQuestion = (id, result) => {
    sql.query("SELECT id, question, option1, option2, option3, option4, answer FROM questions WHERE id = ?", [id], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log(`Question ID ${id} details: `, res[0]);
            result(null, res[0]);
            return;
        }
        result({ kind: "not_found" }, null);
    });
};

QuizappQuestions.updateQuestion = (id, updateDetails, result) => {
    sql.query("SELECT question FROM questions WHERE id = ?", [id], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        if (res.length == 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        else {
            sql.query("SELECT firstName FROM admin WHERE id = ?", [updateDetails.admin_id], (err, res) => {
                if (err) {
                    console.log("Error: ", err);
                    result(err, null);
                    return;
                }
                if (res.length == 0) {
                    result({ kind: "not_found_admin" }, null);
                    return;
                }
                else {
                    sql.query("UPDATE questions SET admin_id = ?, question = ?, option1 = ?, option2 = ?, option3 = ?, option4 = ?, answer = ?, added_date = ? WHERE id = ?",
                        [updateDetails.admin_id, updateDetails.question, updateDetails.option1, updateDetails.option2, updateDetails.option3, updateDetails.option4, updateDetails.answer, updateDetails.added_date, id],
                        (err, res) => {
                            if (err) {
                                console.log("Error: ", err);
                                result(err, null);
                                return;
                            }
                            if (res.affectedRows == 0) {
                                result({ kind: "not_found" }, null);
                                return;
                            }
                            console.log(`Updated question with id ${id}: `, { id: id, ...updateDetails });
                            result(null, { id: id, ...updateDetails });
                        });
                }
            });
        }
    });
};

QuizappQuestions.removeQuestion = (id, admin_id, result) => {
    sql.query("SELECT firstName FROM admin WHERE id = ?", [admin_id], (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        if (res.length == 0) {
            result({ kind: "not_found_admin" }, null);
            return;
        }
        else {
            sql.query("DELETE FROM questions WHERE id = ?", [id], (err, res) => {
                if (err) {
                    console.log("Error: ", err);
                    result(err, null);
                    return;
                }
                if (res.affectedRows == 0) {
                    result({ kind: "not_found" }, null);
                    return;
                }
                console.log("Deleted question with id: ", id);
                result(null, res);
            });
        }
    });
};

// Now export this module
module.exports = QuizappQuestions;