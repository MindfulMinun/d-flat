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

/**
 * Sample-rate reduction
 */
class BitCrusher_Sr8 extends AudioWorkletProcessor {
    /**
     * @param {Float32Array[][]} inputs
     * @param {Float32Array[][]} outputs
     */
    process(inputs, outputs) {
        const input = inputs[0]
        const output = outputs[0]

        const chunkSize = 1 << 3

        for (let channel = 0; channel < input.length; channel++) {
            for (let sample = 0; sample < input[channel].length; sample += chunkSize) {
                // Take the average of a few samples
                let sum = 0
                for (let i = 0; i < chunkSize; i++) {
                    sum += input[channel][sample + i]
                }
                const avg = sum / chunkSize

                // Set the output to the average, effectively reducing the sampling rate
                for (let i = 0; i < chunkSize; i++) {
                    output[channel][sample + i] = avg
                }
            }
        }

        return true
    }
}
registerProcessor('bit-crusher-sr8', BitCrusher_Sr8)

/**
 * Resolution reduction
 */
class BitCrusher_Res extends AudioWorkletProcessor {
    /**
     * @param {Float32Array[][]} inputs
     * @param {Float32Array[][]} outputs
     */
    process(inputs, outputs) {
        const input = inputs[0]
        const output = outputs[0]

        const res = 16

        // Resolution reduction
        for (let channel = 0; channel < input.length; channel++) {
            for (let sample = 0; sample < input[channel].length; sample++) {
                output[channel][sample] = Math.round(input[channel][sample] * res) / res
            }
        }

        return true
    }
}
registerProcessor('bit-crusher-res', BitCrusher_Res)

class BitCrusher_Both extends AudioWorkletProcessor {
    /**
     * @param {Float32Array[][]} inputs
     * @param {Float32Array[][]} outputs
     */
    process(inputs, outputs) {
        const input = inputs[0]
        const output = outputs[0]

        const chunkSize = 1 << 3
        const res = 16

        for (let channel = 0; channel < input.length; channel++) {
            for (let sample = 0; sample < input[channel].length; sample += chunkSize) {
                // Take the average of a few samples
                let sum = 0
                for (let i = 0; i < chunkSize; i++) {
                    sum += Math.round(input[channel][sample] * res) / res
                }
                const avg = sum / chunkSize

                // Set the output to the average, effectively reducing the sampling rate
                for (let i = 0; i < chunkSize; i++) {
                    output[channel][sample + i] = avg
                }
            }
        }

        return true
    }
}
registerProcessor('bit-crusher-both', BitCrusher_Both)

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
