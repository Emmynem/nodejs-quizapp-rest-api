const express = require("express");
const cors = require("cors");
const app = express();

var corsOptions = {
    origin: "http:localhost:8081"
};
// add cors
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (request, response) => {
    request.json({ message: "Quizapp server activated." });
})

require("./app/routes/quizapp.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})

