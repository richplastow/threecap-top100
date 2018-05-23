//// CONFIGURATION AND CONSTANTS

const

    //// Dimensions, framerate, duration.
    previewWidth = 854
  , previewHeight = 480
  , previewFps = 25
  , previewDuration = 32000 // in ms

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

  , top100SpriteScaleBeginEnd   : 0
  , top100SpriteScaleFlying     : 0.5
  , arabianSpriteScaleFlying    : 0.5
  , indianSpriteScaleFlying     : 0.4
  , asianSpriteScaleFlying      : 0.4
  , americanSpriteScaleFlying   : 0.5

  , pixelRatio: window.devicePixelRatio || 0

}
