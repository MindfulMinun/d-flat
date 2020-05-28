/// <reference path="./types.d.ts" />

/**
 * @param {AudioContext} audioContext
 * @param {HTMLAudioElement} audioElement
 */
export default function visFactory(audioContext, audioElement) {
    const analyzer = audioContext.createAnalyser()
    const samples = new Uint8Array(analyzer.frequencyBinCount)
    
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')

    /** @type {HTMLSelectElement} */
    // @ts-ignore
    const dropdown = document.getElementById('visualizerSelect')

    let mode = 0

    dropdown.addEventListener('input', () => {
        mode = +dropdown.value
    })

    // Animation loop
    requestAnimationFrame(function rAF() {
        if (!audioElement.paused) {
            canvas.width = window.innerWidth * window.devicePixelRatio
            canvas.height = window.innerHeight * window.devicePixelRatio

            switch (mode) {
                case 0: drawTime()
                    break
                case 1: drawFreq()
                    break
            }
        }
        requestAnimationFrame(rAF)
    })

    function drawTime() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    
        ctx.fillStyle = 'rgba(255, 255, 255, .72)'
        ctx.strokeStyle = 'rgba(255, 255, 255, .72)'
        ctx.lineWidth = 2 * window.devicePixelRatio

        analyzer.getByteTimeDomainData(samples)
        
        const increment = canvas.width / analyzer.frequencyBinCount
    
        let x = 0,
            i = 0,
            y = 0;
    
        // ctx.beginPath()
        for (; i < analyzer.frequencyBinCount; i++) {
            y = (samples[i] / 128) * (canvas.height / 2)
            ctx.lineTo(x, y)
            x += increment
        }
        ctx.stroke()
    }

    function drawFreq() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    
        ctx.fillStyle = 'rgba(255, 255, 255, .72)'
        ctx.strokeStyle = 'rgba(255, 255, 255, .72)'
        ctx.lineWidth = 2 * window.devicePixelRatio

        analyzer.getByteFrequencyData(samples)
        
        const increment = canvas.width / analyzer.frequencyBinCount
    
        let x = 0,
            i = analyzer.frequencyBinCount,
            y = 0;
    
        // ctx.beginPath()
        for (; 0 < i; i--) {
            y = canvas.height - (samples[i] / 128) * (canvas.height / 2)
            ctx.lineTo(x, y)
            x += increment
        }
        ctx.stroke()
    }

    return analyzer
}
