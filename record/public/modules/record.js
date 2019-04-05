class Record {
    constructor() {



        // this.enableStartRecord = true
        // this.enableStopRecord = false
        // this.enableDownloadRecord = false

        this.localAudio = null
        this.remoteAudio = null
        this.mergedAudioTrack = null
        this.recordStream = null
        this.mediaRecorder = null
        this.chunks = []

        this.timeSlice = 10
    }

    mergeAudiotrack(tracks = []) {
        // 컨텍스트 만들고
        let audioCtx = new AudioContext()

        let audioStreamSources = tracks.map(track => {

            if (track) {

                return audioCtx.createMediaStreamSource(new MediaStream([track]))

            }

        })



        let streamDest = audioCtx.createMediaStreamDestination()

        audioStreamSources.forEach(audioStream => {

            if (audioStream) {
                console.log('audioStream', audioStream)
                audioStream.connect(streamDest)
            }
        });


        return streamDest.stream.getAudioTracks()[0]

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


    async startRecording(localStream = null, remoteStream = null) {
        console.log('Start recording...')
        if (!localStream) {
            console.warn('Local stream source is not found. Cannot record your audio')
        }
        if (!remoteStream) {
            console.warn('Remote stream source is not found. Cannot record remote audio')
        }

        this.localAudio = localStream && localStream.getAudioTracks()[0]
        this.remoteAudio = remoteStream && remoteStream.getAudioTracks()[0]

        this.mergedAudioTrack = this.mergeAudiotrack([this.localAudio, this.remoteAudio])

        // this.enableStartRecord = false
        // this.enableStopRecord = true
        // this.enableDownloadRecord = false

        this.recordStream = await Record.startScreenCapture()

        this.recordStream.addTrack(this.mergedAudioTrack)
        console.log('After merge with audio stream - ', this.recordStream.getTracks())

        this.recordStream.addEventListener('inactive', e => {
            console.log('Record Stream inactive - stop recording')
            this.stopRecording()
        })

        this.mediaRecorder = new MediaRecorder(this.recordStream, { mimeType: 'video/webm' })
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
            Record.clearTracks(this.recordStream)
            this.recordStream = null

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