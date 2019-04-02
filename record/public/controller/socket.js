const ws = new WebSocket('ws://localhost:3000')
const sendMessage = message => ws.send(JSON.stringify(message))

ws.onopen = () => {
    console.log('Connected to the signaling server')
    sendMessage('hello')
}

ws.onerror = err => {
    console.error(err)
}
