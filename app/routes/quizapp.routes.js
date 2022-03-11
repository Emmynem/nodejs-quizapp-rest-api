module.exports = app => {
    const quizapp_admin = require("../controllers/quizapp-admin.controller");
    const quizapp_user = require("../controllers/quizapp-user.controller");
    const quizapp_questions = require("../controllers/quizapp-questions.controller");
    const quizapp_results = require("../controllers/quizapp-results.controller");
    var router = require("express").Router();

    // Admin controls
    router.post("/backoffice", quizapp_admin.login);
    
    router.get("/backoffice/admins", quizapp_admin.admins);

    router.get("/backoffice/admin/:id", quizapp_admin.admin);

    router.post("/backoffice/signup", quizapp_admin.signup);

    router.put("/backoffice/update/:id", quizapp_admin.update_admin);

    router.delete("/backoffice/remove/:id", quizapp_admin.remove_admin);

    // Users controls
    router.post("/", quizapp_user.login);

    router.get("/", quizapp_user.users);

    router.get("/profile/:id", quizapp_user.user);

    router.post("/signup", quizapp_user.signup);

    router.put("/update/:id", quizapp_user.update_user);

    router.delete("/remove/:id", quizapp_user.remove_user);

    // Question controls
    router.get("/questions", quizapp_questions.questions);

    router.get("/backoffice/questions", quizapp_questions.admin_questions);

    router.get("/backoffice/question/:id", quizapp_questions.question);

    router.post("/backoffice/question", quizapp_questions.add_question);

    router.put("/backoffice/question/update/:id", quizapp_questions.update_question);

    router.delete("/backoffice/question/remove/:id", quizapp_questions.remove_question);

    // Result controls
    router.post("/result", quizapp_results.add_result);

    app.use('/api/quizapp', router);    
};