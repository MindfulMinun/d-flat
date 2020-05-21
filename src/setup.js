//@ts-ignore
import workletUrl from './processors.worklet.js'

const audioEl = document.querySelector('audio')
const audio = new AudioContext()
const audioSrcNode = audio.createMediaElementSource(audioEl)

// Add the modules
audio.audioWorklet.addModule('/dist/' + workletUrl)

let dFlat = null
// let dFlat = null new AudioWorkletNode(audio, 'subtract-overlap', {
//     processorOptions: {
//         maxChannels: audio.destination.maxChannelCount
//     }
// })

// audioSrcNode.connect(dFlat)
// dFlat.connect(audio.destination)

/**
 * Swaps out the processor
 * @param {string} name The name of the processor to use
 */
export function useProcessor(name) {
    if (dFlat) {
        dFlat.disconnect()
        audioSrcNode.disconnect()
    }

    dFlat = new AudioWorkletNode(audio, name, {
        processorOptions: {
            maxChannels: audio.destination.maxChannelCount
        }
    })
    audioSrcNode.connect(dFlat)
    dFlat.connect(audio.destination)
}

export { audio }


// const audioEl = document.querySelector('audio')
// const audio = new AudioContext()
// await audio.audioWorklet.addModule('/dist/' + workletUrl)

// const dFlat = new AudioWorkletNode(audio, 'subtract-overlap', {
// // const dFlat = new AudioWorkletNode(audio, 'bit-crusher', {
//     processorOptions: {
//         maxChannels: audio.destination.maxChannelCount
//     }
// })
// const audioSrcNode = audio.createMediaElementSource(audioEl)

// audioSrcNode.connect(dFlat)
// dFlat.connect(audio.destination)
// audioEl.src = URL.createObjectURL(audioFile)
