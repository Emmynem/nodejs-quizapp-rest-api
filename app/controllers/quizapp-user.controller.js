const QuizappUser = require("../models/quizapp-user.model");

exports.signup = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const user = new QuizappUser({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        added_date: new Date()
    });

    QuizappUser.signup(user, (err, data) => {
        if (err) {
            if (err.kind === "found_email") {
                res.status(404).send({
                    message: `User already exists.`
                });
            }
            else {
                res.status(500).send({
                    message: "Error checking if email exists / sign up"
                });
                return 0;
            }
        }
        else res.send(data);
    });
};

exports.login = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    QuizappUser.login(req.body, (err, data) => {
        if (err) {
            if (err.kind === "login_incorrect") {
                res.status(404).send({
                    message: `Invalid login details.`
                });
            } else {
                res.status(500).send({
                    message: "Error logging in."
                });
            }
        } else res.send(data);
    });
};

exports.users = (req, res) => {
    QuizappUser.getUsers((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.send(data);
    });
};

exports.user = (req, res) => {
    QuizappUser.getUser(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found User with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving User with id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.update_user = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const user = new QuizappUser({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        added_date: new Date()
    });

    QuizappUser.updateUser(req.params.id, new QuizappUser(user), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found User with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error updating User with id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.remove_user = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    QuizappUser.removeUser(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found User with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete User with id " + req.params.id
                });
            }
        } else res.send({ message: `User was deleted successfully!` });
    });
};