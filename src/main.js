import { audio, useProcessor } from './setup.js'

document.getElementById('choose').addEventListener('click', () => {
    document.getElementById('file').click()
})

document.querySelector('input').addEventListener('input', function () {
    //@ts-ignore
    fileGuard(this.files)
})

window.addEventListener('drop', async ev => {
    ev.preventDefault()
    fileGuard(ev.dataTransfer.files)
})

// Prevent Chrome from replacing the document when a file's dropped over it
document.addEventListener('dragover', ev => {
    ev.preventDefault()
})


/**
 * @param {FileList} files
 */
function fileGuard(files) {
    const candidates = [...files]
    const file =
        candidates.find(file => file.type.startsWith('audio/')) ||
        candidates.find(file => file.type.startsWith('video/'))
    if (!file) {
        console.log(candidates.map(f => f.type))
        alert("Be sure to drop an audio file your browser supports :)")
        return
    }

    init(file)
}

const select = document.querySelector('select')
select.addEventListener('input', () => {
    useProcessor(select.value)
})

/**
 * @param {File} audioFile
 */
async function init(audioFile) {
    const audioEl = document.querySelector('audio')
    audioEl.src = URL.createObjectURL(audioFile)
    useProcessor(select.value)

    audio.resume().then(() => audioEl.play())

    document.title = `D♭ • ${audioFile.name}`

    if (navigator.mediaSession && typeof MediaMetadata !== 'undefined') {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: audioFile.name,
            album: "D♭"
        });
        navigator.mediaSession.setActionHandler('play', () => {
            audioEl.play()
        })
        navigator.mediaSession.setActionHandler('pause', () => {
            audioEl.pause()
        })
        navigator.mediaSession.setActionHandler('seekbackward', () => {
            audioEl.currentTime -= 5
        })
        navigator.mediaSession.setActionHandler('seekforward', () => {
            audioEl.currentTime += 5
        })
    }
}
