class Record {
    constructor(localStream = '', remoteStream = '') {
        this.localAudio = localStream && localStream.getAudioTracks()[0]
        this.remoteAudio = remoteStream && remoteStream.getAudioTracks()[0]


        let audioCtx = new AudioContext()


        this.enableStartRecord = true
        this.enableStopRecord = false
        this.enableDownloadRecord = false

        this.stream = null
        this.mediaRecorder = null
        this.chunks = []

        this.timeSlice = 10
    }

    static startScreenCapture() {
        if (navigator.getDisplayMedia) {
            return navigator.getDisplayMedia({ video: true });
        } else if (navigator.mediaDevices.getDisplayMedia) {
            return navigator.mediaDevices.getDisplayMedia({ video: true });
        } else {
            return navigator.mediaDevices.getUserMedia({ video: { mediaSource: 'screen' } });
        }
    }

    static get properties() {
        return {

        }
    }


    async startRecording() {
        console.log('Start recording...')
        if (!this.localAudio) {
            console.warn('local audio source is not found')
        }
        if (!this.remoteAudio) {
            console.warn('local audio source is not found')
        }


        this.enableStartRecord = false
        this.enableStopRecord = true
        this.enableDownloadRecord = false

        this.stream = await Record.startScreenCapture()
        this.stream.addEventListener('inactive', e => {
            console.log('Record Stream inactive - stop recording')
            this.stopRecording()
        })

        this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: 'video/webm' })
        this.mediaRecorder.addEventListener('dataavailable', ({ data }) => {
            if (data && data.size > 0) {
                this.chunks.push(data)
            }
        })

        this.mediaRecorder.start(this.timeSlice)
    }

    async stopRecording() {
        console.log('Stop recording!')

        if (this.mediaRecorder) {
            this.mediaRecorder.stop()
            this.mediaRecorder = null
            Record.clearTracks(this.stream)
            this.stream = null

            this.recording = new Blob(this.chunks, { type: 'video/webm' })

            return this.recording
        }
    }

    downloadRecording() {
        if (!this.recording) {
            console.error('Record data is empty')
            return
        }
        const a = document.createElement('a')
        a.href = window.URL.createObjectURL(this.recording)
        a.download = `${Date.now()}_recording.webm`
        a.type = 'video/webm'
        a.addEventListener('progress', e => console.log(e))
        a.click()
    }

    static clearTracks(stream) {
        try {
            stream.getTracks().forEach((track) => {
                track.stop()
                console.log(`${track.kind} (id: ${track.id}) is stop!`)
            })
        } catch (err) {
            console.error(err)
        }
    }
}