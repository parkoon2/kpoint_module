const express = require('express')
const app = express()
const path = require('path')
const http = require('http')
const WebSocket = require('ws')

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

let users = {}

const sendTo = (ws, message) => {
    ws.send(JSON.stringify(message))
}

wss.on('connection', ws => {
    console.log('User connected')
    let data = {}
    ws.on('message', message => {
        try {
            data = JSON.parse(message)

            switch (data.type) {
                case 'login':
                    if (users[data.username]) {
                        sendTo(ws, { type: 'login', success: false })
                        return
                    }
                    users[data.username] = ws
                    ws.username = data.username

                    sendTo(ws, { type: 'login', success: true })
                    break;

                case 'offer':
                    if (!users[data.otherUsername]) {
                        sendTo(ws, { type: 'error', process: 'offer', message: `${data.otherUsername} is not found` })
                        return
                    }
                    sendTo(users[data.otherUsername], {
                        type: 'offer',
                        offer: data.offer,
                        username: ws.username
                    })
                    break;
                case 'answer':
                    if (!users[data.otherUsername]) {
                        sendTo(ws, { type: 'error', process: 'answer', message: `${data.otherUsername} is not found` })
                        return
                    }
                    console.log('ws', ws)
                    sendTo(users[data.otherUsername], {
                        type: 'answer',
                        answer: data.answer,
                        username: ws.username
                    })
                    break;
                case 'candidate':
                    console.log('Sending candidate to:', data.otherUsername)
                    if (users[data.otherUsername] != null) {
                        sendTo(users[data.otherUsername], {
                            type: 'candidate',
                            candidate: data.candidate
                        })
                    }
                    break

            }

        } catch (err) {
            console.error(`Invalid JSON ${error}`)
            data = {}
        }

        console.log(`Received message => ${message}`)
    })

    ws.on('close', () => {
        if (users[ws.username]) {
            console.log(`${ws.username} is disconnected`)
            delete users[ws.username]
        }
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
