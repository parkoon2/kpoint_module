const express = require('express')
const app = express()
const path = require('path')
const http = require('http')
const WebSocket = require('ws')

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

wss.on('connection', ws => {
    console.log('User connected')
    let data = {}
    ws.on('message', message => {
        try {
            data = JSON.parse(message)
            console.log('data', data)
        } catch (err) {
            console.error(`Invalid JSON ${error}`)
            data = {}
        }

        console.log(`Received message => ${message}`)
    })

    ws.on('close', () => {
        //handle closing
    })
})
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

server.listen(3000, () => {
    console.log(`Server is running on 3000 port`)
})
