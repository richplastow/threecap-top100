//// CONFIGURATION AND CONSTANTS

const

    //// Dimensions, framerate, duration.
    previewWidth = 854
  , previewHeight = 480
  , previewFps = 25
  , previewDuration = 16000 // in ms

  , captureWidth = 1920
  , captureHeight = 1080
  , captureFps = 1
  , captureDuration = previewDuration * (previewFps / captureFps)

    //// Whether to render the animation during capture.
  , showDuringCapture = false




let module; export default module = {

    //// Dimensions, framerate, duration.
    previewDuration
  , previewWidth
  , previewHeight
  , previewFps

  , captureWidth
  , captureHeight
  , captureFps
  , captureDuration

    //// Whether to render the animation during capture.
  , showDuringCapture

    //// Visual.
  , fromTextLonOffset: 8
  , toTextLonOffset  : 14
  , usualSpriteOpacityBeginEnd  : 0
  , usualSpriteOpacityFlying    : 1
  , top100SpriteOpacityBeginEnd : 0
  , top100SpriteOpacityFlying   : 1
  , arabianSpriteScaleFlying    : 1.5
  , indianSpriteScaleFlying     : 1.5
  , asianSpriteScaleFlying      : 1.1
  , americanSpriteScaleFlying   : 1.5
  , top100SpriteScaleBeginEnd   : 0
  , top100SpriteScaleFlying     : 0.8

  , pixelRatio: window.devicePixelRatio || 0

}
