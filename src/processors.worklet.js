/// <reference path="./types.d.ts" />

const carry = Symbol()

class NoopProcessor extends AudioWorkletProcessor {
    /**
     * @param {Float32Array[][]} inputs
     * @param {Float32Array[][]} outputs
     */
    process(inputs, outputs) {
        const input = inputs[0]
        const output = outputs[0]

        for (let channel = 0; channel < input.length; channel++) {
            output[channel].set(input[channel])
        }
        return true
    }
}
registerProcessor('noop', NoopProcessor)

class Mono extends AudioWorkletProcessor {
    /**
     * @param {Float32Array[][]} inputs
     * @param {Float32Array[][]} outputs
     */
    process(inputs, outputs) {
        // This processor has only one input and one output.
        const input = inputs[0]
        const output = outputs[0]

        for (let channel = 0; channel < input.length; channel++) {
            for (let sample = 0; sample < input[0].length; sample++) {
                // Mono: (L + R) / 2
                // More generally: 1/n * (\sum_{i = 0}^n C_i)
                output[0][sample] += input[channel][sample] * (1 / input.length)
            }
            if (channel !== 0) {
                output[channel].set(output[0])
            }
        }

        return true
    }
}
registerProcessor('mono', Mono)

class DerivativeProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super()
        this[carry] = new Float32Array(options.processorOptions.maxChannels)
    }
    
    /**
     * @param {Float32Array[][]} inputs
     * @param {Float32Array[][]} outputs
     */
    process(inputs, outputs) {
        const input = inputs[0]
        const output = outputs[0]

        for (let channel = 0; channel < input.length; channel++) {
            output[channel][0] = this[carry][channel]
            for (let sample = 1; sample < input[channel].length; sample++) {
                // dy/dx: (s2 - s1) / time
                output[channel][sample] = input[channel][sample] - input[channel][sample - 1]
            }
            this[carry][channel] = input[channel][input.length - 1]
        }

        return true
    }
}
registerProcessor('derivative', DerivativeProcessor)

class IntegralProcessor extends AudioWorkletProcessor {

    constructor(options) {
        super()
        this[carry] = new Float32Array(options.processorOptions.maxChannels)
    }
  
    /**
     * @param {Float32Array[][]} inputs
     * @param {Float32Array[][]} outputs
     */
    process(inputs, outputs) {
        const input = inputs[0]
        const output = outputs[0]

        for (let channel = 0; channel < input.length; channel++) {
            output[channel][0] = (this[carry][channel] + input[channel][0]) / 2
            for (let sample = 1; sample < input[channel].length; sample++) {
                // Integral of two samples: (time * (s1 + s2)) / 2
                output[channel][sample] = (input[channel][sample - 1] + input[channel][sample]) / 2
            }
            this[carry][channel] = input[channel][input.length - 1]
        }

        return true
    }
}
registerProcessor('integral', IntegralProcessor)


class BitCrusher extends AudioWorkletProcessor {
    /**
     * @param {Float32Array[][]} inputs
     * @param {Float32Array[][]} outputs
     */
    process(inputs, outputs) {
        const input = inputs[0]
        const output = outputs[0]

        let phase = 1
        const step = 2 * Math.pow(.5, 8)

        for (let channel = 0; channel < input.length; channel++) {
            for (let sample = 0; sample < input[channel].length; sample++) {
                output[channel][sample] = input[channel][sample]
            }
        }

        return true
    }
}
registerProcessor('bit-crusher', BitCrusher)


/**
 * Inverts the amplitude of every even-numbered channel and merges them to mono.
 * Quick-and-dirty way of removing vocals
 */
class SubtractOverlap extends AudioWorkletProcessor {
    /**
     * @param {Float32Array[][]} inputs
     * @param {Float32Array[][]} outputs
     */
    process(inputs, outputs) {
        // This processor has only one input and one output.
        const input = inputs[0]
        const output = outputs[0]

        for (let channel = 0; channel < input.length; channel++) {
            for (let sample = 0; sample < input[channel].length; sample++) {
                output[0][sample] += (channel % 2 === 0 ? 1 : -1) * input[channel][sample]
            }
            if (channel !== 0) {
                output[channel].set(output[0])
            }
        }

        return true
    }
}
registerProcessor('subtract-overlap', SubtractOverlap)

/**
 * Like `subtract-overlap`, but isolates the overlap instead of removing it.
 * Quick-and-dirty way to isolate vocals
 */
class IsolateOverlap extends AudioWorkletProcessor {
    /**
     * @param {Float32Array[][]} inputs
     * @param {Float32Array[][]} outputs
     */
    process(inputs, outputs) {
        // This processor has only one input and one output.
        const input = inputs[0]
        const output = outputs[0]

        // FIXME: I can't get this filter to work :/

        for (let channel = 0; channel < input.length; channel++) {
            for (let sample = 0; sample < input[channel].length; sample++) {
                output[0][sample] += (channel % 2 === 0 ? 1 : -1) * input[channel][sample]
            }
        }

        for (let channel = input.length - 1; 0 <= channel; channel--) {
            for (let sample = 0; sample < input[channel].length; sample++) {
                output[channel][sample] = input[channel][sample] - output[0][sample]
            }
        }


        return true
    }
}
registerProcessor('isolate-overlap', IsolateOverlap)
