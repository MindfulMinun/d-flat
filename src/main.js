//@ts-ignore
import workletUrl from './processors.worklet.js'

document.getElementById('choose').addEventListener('click', ev => {
    document.getElementById('file').click()
})

document.getElementById('file').addEventListener('input', ev => {
    fileGuard(ev.target.files)
})

window.addEventListener('drop', async ev => {
    ev.preventDefault()
    fileGuard(ev.dataTransfer.files)
})

document.addEventListener('dragover', ev => {
    ev.preventDefault()
})


function fileGuard(files) {
    const candidates = [...files]
    const file = candidates.find(file => file.type.startsWith('audio/'))
    if (!file) {
        alert("Be sure to drop an audio file your browser supports :)")
        return
    }

    init(file)
}

/**
 * @param {File} audioFile
 */
async function init(audioFile) {
    const audioEl = document.querySelector('audio')
    const audio = new AudioContext()
    await audio.audioWorklet.addModule('/dist/' + workletUrl)

    const dFlat = new AudioWorkletNode(audio, 'subtract-overlap', {
        processorOptions: {
            maxChannels: audio.destination.maxChannelCount
        }
    })
    const audioSrcNode = audio.createMediaElementSource(audioEl)

    audioSrcNode.connect(dFlat)
    dFlat.connect(audio.destination)
    audioEl.src = URL.createObjectURL(audioFile)

    //@ts-ignore
    if (navigator['mediaSession'] && typeof MediaMetadata !== 'undefined') {
        //@ts-ignore
        navigator['mediaSession'].metadata = new MediaMetadata({
            title: audioFile.name
        });
        navigator['mediaSession'].setActionHandler('play', () => {
            audioEl.play()
        })
        navigator['mediaSession'].setActionHandler('pause', () => {
            audioEl.pause()
        })
        navigator['mediaSession'].setActionHandler('seekbackward', () => {
            audioEl.currentTime -= 5
        })
        navigator['mediaSession'].setActionHandler('seekforward', () => {
            audioEl.currentTime += 5
        })
    }


}
