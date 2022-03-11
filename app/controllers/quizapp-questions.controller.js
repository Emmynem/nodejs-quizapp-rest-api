const QuizappQuestions = require("../models/quizapp-questions.model");

const validateValues = (values, res) => {
    const answersOption = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

    if (values.question == "" || values.question == undefined) {
        res.status(400).send({
            message: "Question is required"
        });
        return 0;
    }
    else if (values.option1 == "" || values.option1 == undefined) {
        res.status(400).send({
            message: "Option 1 is required"
        });
        return 0;
    }
    else if (values.option2 == "" || values.option2 == undefined) {
        res.status(400).send({
            message: "Option 2 is required"
        });
        return 0;
    }
    else if (values.option3 == "" || values.option3 == undefined) {
        res.status(400).send({
            message: "Option 3 is required"
        });
        return 0;
    }
    else if (values.option4 == "" || values.option4 == undefined) {
        res.status(400).send({
            message: "Option 4 is required"
        });
        return 0;
    }
    else if (values.answer == "" || values.answer == undefined) {
        res.status(400).send({
            message: "Answer is required"
        });
        return 0;
    }
    else if (!answersOption.includes(values.answer)) {
        res.status(400).send({
            message: "Answer has to be - Option 1, Option 2, Option 3 or Option 4"
        });
        return 0;
    }
    else {
        return 1;
    }
};

exports.questions = (req, res) => {
    QuizappQuestions.getQuestions((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving questions."
            });
        else res.send(data);
    });
};

exports.admin_questions = (req, res) => {
    QuizappQuestions.getAdminQuestions((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving questions."
            });
        else res.send(data);
    });
};

exports.question = (req, res) => {
    QuizappQuestions.getQuestion(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Question with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Question with id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.add_question = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const question = new QuizappQuestions({
        admin_id: req.body.admin_id,
        question: req.body.question,
        option1: req.body.option1,
        option2: req.body.option2,
        option3: req.body.option3,
        option4: req.body.option4,
        answer: req.body.answer,
        added_date: new Date()
    });

    if (validateValues(question, res) == 1) {
        QuizappQuestions.addQuestion(new QuizappQuestions(question), (err, data) => {
            if (err) {
                if (err.kind === "not_found_admin") {
                    res.status(404).send({
                        message: `Not found Admin with id ${question.admin_id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error Adding Question"
                    });
                }
            } else res.send(data);
        });
    }

};

exports.update_question = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const question = new QuizappQuestions({
        admin_id: req.body.admin_id,
        question: req.body.question,
        option1: req.body.option1,
        option2: req.body.option2,
        option3: req.body.option3,
        option4: req.body.option4,
        answer: req.body.answer,
        added_date: new Date()
    });

    if(validateValues(question, res) == 1){
        QuizappQuestions.updateQuestion(req.params.id, new QuizappQuestions(question), (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Question with id ${req.params.id}.`
                    });
                } else if (err.kind === "not_found_admin") {
                    res.status(404).send({
                        message: `Not found Admin with id ${question.admin_id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Question with id " + req.params.id
                    });
                }
            } else res.send(data);
        });
    }
};

exports.remove_question = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    QuizappQuestions.removeQuestion(req.params.id, req.body.admin_id, (err, data) => {
        if (err) {
            if (err.kind === "not_found_admin") {
                res.status(404).send({
                    message: `Not found Admin with id ${req.body.admin_id}.`
                });
            } else if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Question with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Admin with id " + req.params.id
                });
            }
        } else res.send({ message: `Question was deleted successfully!` });
    });
};