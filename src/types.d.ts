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

// MediaSession definitions
interface Navigator {
    readonly mediaSession?: MediaSession
}
  
interface Window {
    MediaSession?: MediaSession
}
  
type MediaSessionPlaybackState = 'none' | 'paused' | 'playing'
  
type MediaSessionAction =
    | 'play'
    | 'pause'
    | 'seekbackward'
    | 'seekforward'
    | 'previoustrack'
    | 'nexttrack'
  
interface MediaSession {
    // Current media session playback state.
    playbackState: MediaSessionPlaybackState
    // Current media session meta data.
    metadata: MediaMetadata | null
  
    // Set/Unset actions handlers.
    setActionHandler(
        action: MediaSessionAction,
        listener: (() => void) | null
    ): void
}
  
interface MediaImage {
    // URL from which the user agent can fetch the image’s data.
    src: string
    // Specify the MediaImage object’s sizes. It follows the spec of sizes attribute in HTML link element.
    sizes?: string
    // A hint as to the media type of the image.
    type?: string
}
  
interface MediaMetadataInit {
    // Media's title.
    title?: string
    // Media's artist.
    artist?: string
    // Media's album.
    album?: string
    // Media's artwork.
    artwork?: MediaImage[]
}
  
declare class MediaMetadata {
    public title: string
    // Media's artist.
    public artist: string
    // Media's album.
    public album: string
    // Media's artwork.
    public artwork: MediaImage[]
  
    constructor(init?: MediaMetadataInit)
    // Media's title.
}
