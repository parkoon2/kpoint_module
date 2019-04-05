const ws = new WebSocket('ws://localhost:3000')
const sendMessage = message => ws.send(JSON.stringify(message))

ws.onopen = () => {
    console.log('Connected to the signaling server')
}

ws.onmessage = message => {
    let data
    try {
        data = JSON.parse(message.data)
    } catch (err) {
        console.error(err)
    }

    switch (data.type) {

        case 'login':
            if (data.success) return loginSuccess()
            return loginFailure()
        case 'offer':
            handleOffer(data.offer, data.username)
            break
        case 'answer':
            handleAnswer(data.answer)
            break
        case 'candidate':
            handleCandidate(data.candidate)
            break;
        case 'error':
            alert(`${data.process} : ${data.message}`)
            break

    }

    console.log('data', data)
}

ws.onerror = err => {
    console.error(err)
}
