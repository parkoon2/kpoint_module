const express = require('express')
const app = express()

const multer = require('multer')

const { getToday } = require('./utils/date')
console.log(getToday())
const imageStorage = multer.diskStorage({
    filename: (req, fiel, callback) => {
        callback(null, `uploads/id/${getToday()}`)
    },
    destination: (req, file, callback) => {

    }
})

const upload = multer({ dest: 'uploads/' })

const path = require('path')



app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.post('/upload/image', upload.single('image'), function (req, res) {
    res.send('image Uploaded! : ' + req.file); // object를 리턴함
    console.log(req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
})

app.post('/upload/record', upload.single('record'), function (req, res) {
    res.send('record Uploaded! : ' + req.file); // object를 리턴함
    console.log(req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
})


app.listen('3001')