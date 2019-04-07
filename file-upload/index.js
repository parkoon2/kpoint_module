const express = require("express");
const app = express();
const mkdir = require("mkdirp");
const fs = require("fs");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));

const multer = require("multer");

const { getToday } = require("./utils/date");
console.log(getToday());

app.use(express.static("uploads"));

const imageStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        let des = path.join(
            __dirname,
            `uploads/${req.params.userId}/${getToday()}`
        );
        let isDirExists = fs.existsSync(des) && fs.lstatSync(des).isDirectory();

        if (!isDirExists) mkdir.sync(des);

        req.filepath = `${req.params.userId}/${getToday()}`;

        callback(null, des);
    },
    filename: (req, file, callback) => {
        const filename = `${Date.now()}-${file.originalname}`;
        req.filename = filename;
        callback(null, filename);
    }
});

const imageMiddleware = multer({ storage: imageStorage });

const path = require("path");

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

app.get("/upload", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.post("/upload/image/:userId", imageMiddleware.array("images", 3), function(
    req,
    res
) {
    const { filepath, filename } = req;
    console.log("여긴 타겠지", req.filename, req.filepath);

    res.status(200).json({
        filepath: `http://localhost:3001/${filepath}/${filename}`
    });
});

app.listen("3001");
