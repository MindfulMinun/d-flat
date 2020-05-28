//@ts-ignore
import processorUrl from './processors.worklet.js'
import visFactory from './visualizer.js'

const audioEl = document.querySelector('audio')
const audio = new AudioContext()
const visualizer = visFactory(audio, audioEl)
const audioSrcNode = audio.createMediaElementSource(audioEl)

let dFlat;

// Add the modules
audio.audioWorklet.addModule('/dist/' + processorUrl)

/**
 * Swaps out the processor
 * @param {string} name The name of the processor to use
 */
export function useProcessor(name) {
    if (dFlat) {
        dFlat.disconnect()
        audioSrcNode.disconnect()
        visualizer.disconnect()
    }

    dFlat = new AudioWorkletNode(audio, name, {
        processorOptions: {
            maxChannels: audio.destination.maxChannelCount
        }
    })
    audioSrcNode.connect(dFlat)
    dFlat.connect(visualizer)
    visualizer.connect(audio.destination)
}

export { audio }
