const QuizappResults = require("../models/quizapp-results.model");

const validatePercentage = (percentage, res) => {
    if (percentage == "" || percentage == undefined){
        res.status(400).send({
            message: "Percentage is required"
        });
        return 0;
    }
    else if(percentage < 0){
        res.status(400).send({
            message: "Percentage can't be less than 0"
        });
        return 0;
    }
    else if (percentage > 100){
        res.status(400).send({
            message: "Percentage can't be more than 100"
        });
        return 0;
    }
    else {
        return 1;
    }
};

exports.add_result = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const result = new QuizappResults({
        user_email: req.body.user_email,
        percentage: req.body.percentage,
        added_date: new Date()
    });

    if(validatePercentage(result.percentage, res) == 1){
        QuizappResults.addResult(new QuizappResults(result), (err, data) => {
            if (err) {
                if (err.kind === "not_found_user") {
                    res.status(404).send({
                        message: `Not found User with email - ${result.user_email}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error Adding Result"
                    });
                }
            } else res.send(data);
        });
    }
};