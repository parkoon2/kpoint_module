document.getElementById('call').addEventListener('click', handleCall)
document.getElementById('take').addEventListener('click', handleTake)
document.getElementById('login').addEventListener('click', handleLogin)
document.getElementById('start-record').addEventListener('click', handleStartRecord)
document.getElementById('stop-record').addEventListener('click', handleStop)
//https://flaviocopes.com/webrtc/

function handleStartRecord() {

    const record = new Record()
    record.startRecording()
}

function handleStop() {

}

function handleLogin() {
    const username = document.getElementById('username').value

    if (!username) {
        alert('Please enter a username!')
        return
    }
    sendMessage({
        type: 'login',
        username,
    })
}

async function handleCall() {
    const constraint = {
        audio: true,
        video: true,
    }

    // video: {
    //     mandatory: { minAspectRatio: 1.333, maxAspectRatio: 1.334 },
    //     optional: [
    //       { minFrameRate: 60 },
    //       { maxWidth: 640 },
    //       { maxHeigth: 480 }
    //     ]
    //   }

    try {
        let stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        })

        document.getElementById('my-video').srcObject = stream
        document.getElementById('call').setAttribute('disabled', true)
        console.log('stream', stream)
    } catch (err) {
        alert(`${err.name}`)
        console.error(err)
    }
}

function handleTake() {
    alert(2)
}
