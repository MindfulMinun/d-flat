/// <reference path="./types.d.ts" />

const carry = Symbol()

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

        return true;
    }
}
  
registerProcessor('derivative-processor', DerivativeProcessor)


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

        return true;
    }
}
  
registerProcessor('integral-processor', IntegralProcessor)


// class BitCrusher extends AudioWorkletProcessor {
//     /**
//      * @param {Float32Array[][]} inputs
//      * @param {Float32Array[][]} outputs
//      */
//     process(inputs, outputs) {
//         const input = inputs[0]
//         const output = outputs[0]

//         for (let channel = 0; channel < input.length; channel++) {
//             for (let sample = 0; sample < input[channel].length; sample++) {
//                 output[channel][sample] = input[channel][sample] ** 2
//             }
//         }

//         return true;
//     }
// }
  
// registerProcessor('bit-crusher', BitCrusher)


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
        const input = inputs[0]
        const output = outputs[0]

        for (let channel = 0; channel < input.length; channel++) {
            for (let sample = 0; sample < input[0].length; sample++) {
                output[0][sample] += (channel % 2 === 0 ? 1 : -1) * input[channel][sample]
            }
            if (channel !== 0) {
                output[channel].set(output[0])
            }
        }

        return true;
    }
}
  
registerProcessor('subtract-overlap', SubtractOverlap)
