document.getElementById('call').addEventListener('click', handleCall)
document.getElementById('take').addEventListener('click', handleTake)
document.getElementById('login').addEventListener('click', handleLogin)
document.getElementById('start-record').addEventListener('click', handleStartRecord)
document.getElementById('stop-record').addEventListener('click', handleStopRecording)
document.getElementById('download-record').addEventListener('click', handleDownloadRecording)
//https://flaviocopes.com/webrtc/
let record = new Record()

function handleStartRecord() {

    record.startRecording()
}

async function handleStopRecording() {
    let data = await record.stopRecording()
    console.log(`${data} - you can download`, data)
}

function handleDownloadRecording() {
    record.downloadRecording()
}


let connection = null
let localStream = null
let remoteStream = null
let otherUsername = ''

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

async function loginSuccess() {


    const configuration = {
        iceServers: [{ url: 'stun:stun2.1.google.com:19302' }]
    }

    try {
        // connection 만들기
        connection = new RTCPeerConnection(configuration)

        // handle onaddstream
        connection.onaddstream = (event) => {
            console.log('event.stream', event.stream)
            remoteStream = event.stream
            document.querySelector('video#remote').srcObject = event.stream
        }

        // handle onicecandidate
        connection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('otherUsername', otherUsername)
                sendMessage({
                    type: 'candidate',
                    candidate: event.candidate,
                    otherUsername,
                })
            }
        }

        // 스트림 만들기
        const constraint = {
            video: true,
            audio: true,
        }

        localStream = await navigator.mediaDevices.getUserMedia(constraint)
        connection.addStream(localStream)

        document.querySelector('video#local').srcObject = localStream


    } catch (err) {
        console.error(err)
    }
}

function loginFailure() {
    alert('로그인 실패')
}

const handleCandidate = candidate => {
    connection.addIceCandidate(new RTCIceCandidate(candidate))
}

async function handleOffer(offer, username) {
    try {
        connection.setRemoteDescription(new RTCSessionDescription(offer))

        let answer = await connection.createAnswer()
        connection.setLocalDescription(new RTCSessionDescription(answer))

        sendMessage({
            type: 'answer',
            answer: answer,
            otherUsername: username,
        })

    } catch (err) {
        console.error(err)
    }
}

async function handleAnswer(answer) {
    connection.setRemoteDescription(new RTCSessionDescription(answer))
}

async function handleCall() {


    otherUsername = document.querySelector('#other-username').value

    if (!otherUsername) {
        return alert('Enter other user name you want to call')
    }

    if (!connection) {
        return alert('Cannot find RTC Connection')
    }

    try {

        document.getElementById('call').setAttribute('disabled', true)


        let offer = await connection.createOffer()
        connection.setLocalDescription(new RTCSessionDescription(offer))

        sendMessage({
            type: 'offer',
            offer,
            otherUsername
        })

    } catch (err) {
        alert(`${err.name}`)
        console.error(err)
    }
}

function handleTake() {
    alert(2)
}
