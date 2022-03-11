const QuizappAdmin = require("../models/quizapp-admin.model");

exports.signup = (req, res) => {
    if(!req.body){
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const admin = new QuizappAdmin({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        added_date: new Date()
    });

    QuizappAdmin.signup(admin, (err, data) => {
        if(err) {
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
    if(!req.body){
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    QuizappAdmin.login(req.body, (err, data) => {
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

exports.admins = (req, res) => {
    QuizappAdmin.getAdmins((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving admins."
            });
        else res.send(data);
    });
};

exports.admin = (req, res) => {
    QuizappAdmin.getAdmin(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Admin with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Admin with id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.update_admin = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const admin = new QuizappAdmin({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        added_date: new Date()
    });

    QuizappAdmin.updateAdmin(req.params.id, new QuizappAdmin(admin), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Admin with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error updating Admin with id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.remove_admin = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    QuizappAdmin.removeAdmin(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Admin with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Admin with id " + req.params.id
                });
            }
        } else res.send({ message: `Admin was deleted successfully!` });
    });
};