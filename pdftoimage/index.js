const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const mkdir = require("mkdirp");
const fs = require("fs");

var upload = multer({ dest: "uploads/d/d" }).single("pdf");

app.use(express.static("public"));
app.use(express.static("uploads"));

app.get("/pdf", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

const imageStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        let des = path.join(
            __dirname,
            `uploads/${req.params.userId}/2019-05-20`
        );
        let isDirExists = fs.existsSync(des) && fs.lstatSync(des).isDirectory();

        if (!isDirExists) mkdir.sync(des);

        req.filepath = `${req.params.userId}/2019-05-20`;

        callback(null, des);
    },
    filename: (req, file, callback) => {
        const filename = `${Date.now()}-${"pdf"}.png`;
        req.filename = filename;
        callback(null, filename);
    }
});

const pdfMiddleware = multer({ storage: imageStorage }).single("pdf");

const middleWare = (req, res, next) => {
    console.log(`this is middleware`);
    next();
};

app.post("/upload/pdf/:userId", (req, res) => {
    pdfMiddleware(req, res, err => {
        if (err) {
            console.error(err);
            res.status(400).json({ success: false });

            return;
        }

        const { filepath, filename } = req;

        res.status(200).json({
            success: true,
            filepath: `http://localhost:3002/${filepath}/${filename}`
        });
    });
});

app.listen(3002);

// (async () => {

//     const pdfjs = require('./public/module/pdf')
//     const axios = require('axios')

//     const PDFJs = new pdfjs()
//     const pdf = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

//     let result = await PDFJs.pdfToBlob(pdf)

//     console.log(result)

// })()
