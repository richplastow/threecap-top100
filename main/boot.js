import data from '../data/worldcities.js'
import config from './config.js'
import scene from './scene.js'
import state from './state.js'
import tweenFromTo from './tween-for-from-to.js'
import tweenTop100 from './tween-for-top100.js'


export function boot() {

    //// Bind buttons to functions.
    document.querySelector('#restart-preview').addEventListener(
        'click', restartForPreview)
    document.querySelector('#recordpanel button').addEventListener(
        'mousedown', prepareCaptureui)

    ////
    scene.init()
    scene.render()
    restartForPreview()
}




//// Resets the scene state and zeros the timer.
function restart () {

    scene.clock.stop()
    resetFromTo()
    resetFromToSprites()
    resetTextSprites()
    tweenFromTo.reset() //@TODO switch to tweenTop100 if ‘orbit’ to ‘orbit’
    scene.clock.start() // reset `clock.elapsedTime` to zero
}


//// Restarts the scene for development and previewing.
function restartForPreview (evt) {

    //// Allow preview-duration override. @TODO DRY
    if (window.previewDurationOverride) {
        config.previewDuration = window.previewDurationOverride
        config.captureDuration = config.previewDuration * (config.previewFps / config.captureFps)
    }

    const { previewWidth, previewHeight, previewDuration, previewFps
      , pixelRatio } = config
    state.currDuration = previewDuration
    if ('preview' !== state.currMode) {
        state.currMode = 'preview'
        scene.copyPass.renderToScreen = true
        state.currFps = previewFps
        scene.renderer.setSize(previewWidth, previewHeight)
        scene.composer.setSize(previewWidth * pixelRatio, previewHeight * pixelRatio)
    }

    //// Reset audio.
    scene.$audio.pause()
    scene.$audio.fastSeek(0)
    scene.$audio.play()
    state.audio = 'playing'

    restart()
}

//// Make available to <input#to> when [ENTER] is pressed.
window.restartForPreview = restartForPreview


//// Restarts the scene for capture.
function restartForCapture () {

    //// Allow preview-duration override. @TODO DRY
    if (window.previewDurationOverride) {
        config.previewDuration = window.previewDurationOverride
        config.captureDuration = config.previewDuration * (config.previewFps / config.captureFps)
    }

    const { captureWidth, captureHeight, captureDuration, captureFps
      , pixelRatio, showDuringCapture } = config
    state.currDuration = captureDuration
    if ('capture' !== state.currMode) {
        state.currMode = 'capture'
        scene.copyPass.renderToScreen = showDuringCapture
        state.currFps = captureFps
        scene.renderer.setSize(captureWidth, captureHeight)
        scene.composer.setSize(captureWidth * pixelRatio, captureHeight * pixelRatio)
    }
    restart()
}


////
function prepareCaptureui (e) {
    const captureui = scene.captureui
    restartForCapture()
    captureui.settings.framerate = config.captureFps
    captureui.settings.resolution = `${config.captureWidth}x${config.captureHeight}`
    captureui.settings.time = config.captureDuration / 1000 // convert ms to seconds
    const oldFilename = captureui.settings.filename
    captureui.settings.filename =
        oldFilename.split('.')[0] + '.' + captureui.settings.format
    document.querySelector('#cli-help').innerHTML =
        `mv $HOME/Downloads/'${captureui.settings.filename}' `
      + `'./${captureui.settings.filename}'; \n`
      + `./ffmpeg -i '${captureui.settings.filename}' `
      + `-r ${config.previewFps} -filter:v `
      + `"setpts=${config.captureFps / config.previewFps}*PTS" `
      + `'${oldFilename}-${config.previewFps}fps.${captureui.settings.format}'; \n`
      + `unlink '${captureui.settings.filename}'`
}





//// FROM / TO
function resetFromTo () {
    const
        fromVal = document.getElementById('from').value
      , toVal = document.getElementById('to').value
    state.fromData = fromVal ? [ 0 ] : null // population zero...
    state.toData   = toVal   ? [ 0 ] : null // ...which simplifies big-city search
    for (let i=0; i<data.length; i++) {
        const row = data[i]
        if (state.fromData && fromVal === row[1]) // found a candidate city...
            if (state.fromData[0] < row[0]) // ...its pop is bigger than the previously found city...
                state.fromData = row // ...so prefer it
        if (state.toData && toVal === row[1])
            if (state.toData[0] < row[0])
                state.toData = row
    }
    window.updateFromText(state.fromData ? state.fromData[1] : 'orbit')
    window.updateToText(state.toData ? state.toData[1] : 'orbit')
    scene.fromTextSpriteMaterial.map.needsUpdate = true
    scene.toTextSpriteMaterial.map.needsUpdate = true
    if (toVal && 0 > state.toData[6] && 0 < state.fromData[6])
        state.toData[6] += 360 // fly east, it’s shorter
    console.log(
        'From', state.fromData ? `${state.fromData[1]} (${state.fromData[6]})` : 'orbit'
      , 'to',   state.toData   ? `${state.toData[1]} (${state.toData[6]})`   : 'orbit'
    )
}





function resetFromToSprites () {
    if (state.fromData)
        scene.fromSprite.position.set(state.fromData[2], state.fromData[3], state.fromData[4])
    if (state.toData)
        scene.toSprite.position.set(state.toData[2], state.toData[3], state.toData[4])
}
// resetFromToSprites()

//// Text which goes next to the ‘to’ dot.
function resetTextSprites () {
    // const toLla = xyzToLla(toSprite.position) //@TODO fix!
    if (state.fromData) {
        const fromLla = { lat:state.fromData[5], lon:state.fromData[6], alt:100 }
        setPositionUsingLla(
            scene.fromTextSprite
          , fromLla.lat      // same latitude
          , fromLla.lon + config.fromTextLonOffset
          , fromLla.alt + 5  // a little higher in altitude
        )
    }
    if (state.toData) {
        const toLla = { lat:state.toData[5], lon:state.toData[6], alt:100 }
        setPositionUsingLla(
            scene.toTextSprite
          , toLla.lat      // same latitude
          , toLla.lon + config.toTextLonOffset
          , toLla.alt + 5  // a little higher in altitude
        )
    }
}
// resetTextSprites()




function setPositionUsingLla (object3d, lat, lon, alt) {
    const cosLat = Math.cos(lat * Math.PI / 180)
    const sinLat = Math.sin(lat * Math.PI / 180)
    const cosLon = Math.cos(lon * Math.PI / 180)
    const sinLon = Math.sin(lon * Math.PI / 180)
    const x = alt * cosLat * cosLon
    const y = alt * cosLat * sinLon
    const z = alt * sinLat
    object3d.position.x = x
    object3d.position.y = z // for correct THREE.js coords, swap y with z...
    object3d.position.z = - y // ...and z with negative y
}
