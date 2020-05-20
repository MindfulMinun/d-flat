/// <reference lib="webworker" />

class AudioWorkletProcessor {
    readonly port: MessagePort
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Map<string, Float32Array>): void;
}

interface AudioWorkletProcessorConstructor {
    prototype: AudioWorkletProcessor;
    new(options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
}

function registerProcessor(
    name: string,
    processorCtor: AudioWorkletProcessorConstructor
): void
