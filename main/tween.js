//// TWEEN
import config from './config.js'
import scene from './scene.js'
import state from './state.js'


const tweenDefs = [
    { // camera position’s altitude UP
        beginState: { alt:200 }
      , currState:  { }
      , endState:   { alt:250 }
      , beginFrac:  0
      , endFrac:    0.5
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.InOut
      , onReset:    function (def) {
        }
      , onUpdate:   function (def) { return function () {
            state.cameraCurrent.position.alt = def.currState.alt
        } }
    }
  , { // camera position’s altitude DOWN
        beginState: { alt:250 }
      , currState:  {}
      , endState:   { alt:200 }
      , beginFrac:  0.5
      , endFrac:    1
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.InOut
      , onReset:    function (def) { }
      , onUpdate:   function (def) { return function () {
            state.cameraCurrent.position.alt = def.currState.alt
        } }
    }
  , { // camera position’s latitude and longitude
        beginState: { lat:10, lon:-100 }
      , currState:  {}
      , endState:   { lat:50, lon:20 }
      , beginFrac:  0 // fraction of whole duration, so `0`...
      , endFrac:    1 // ...`1` fills the entire sequence
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.InOut
      , onReset:    function (def) {
        }
      , onUpdate:   function (def) { return function () {
            state.cameraCurrent.position.lat = def.currState.lat
            state.cameraCurrent.position.lon = def.currState.lon
            setPositionUsingLla(
                scene.camera
              , state.cameraCurrent.position.lat
              , state.cameraCurrent.position.lon
              , state.cameraCurrent.position.alt
            )
            scene.camera.lookAt(0,0,0)
        } }
    }
  , { // usual city sprites UP
        beginState: { usualOpacity: config.usualSpriteOpacityBeginEnd }
      , currState:  {}
      , endState:   { usualOpacity: config.usualSpriteOpacityFlying  }
      , beginFrac:  0.1
      , endFrac:    0.3
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.Out
      , onReset:    function (def) {
            scene.usualSpriteMaterial.opacity = config.usualSpriteOpacityBeginEnd
        }
      , onUpdate:   function (def) { return function () {
            scene.usualSpriteMaterial.opacity = def.currState.usualOpacity
        } }
    }
  , { // top100 city sprites UP
        beginState: { top100Opacity: config.top100SpriteOpacityBeginEnd }
      , currState:  {}
      , endState:   { top100Opacity: config.top100SpriteOpacityFlying  }
      , beginFrac:  0.6
      , endFrac:    0.9
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.Out
      , onReset:    function (def) {
            scene.top100SpriteMaterial.opacity = config.top100SpriteOpacityBeginEnd
        }
      , onUpdate:   function (def) { return function () {
            scene.top100SpriteMaterial.opacity = def.currState.top100Opacity
        } }
    }
]




let module; export default module = {

    //// Delete all existing tweens, and create a fresh new set.
    reset () {

        //// Stop and remove all tweens.
        tweenDefs.forEach( def => { if (def.tween) def.tween.stop() })
        TWEEN.removeAll()

        ////
        for (let i=0; i<tweenDefs.length; i++) {
            const def = tweenDefs[i]
            def.onReset(def)
            def.currState = Object.assign({}, def.beginState)
            def.tween =
                new TWEEN.Tween(def.currState)
                   .to(def.endState, (def.endFrac-def.beginFrac) * state.currDuration)
                   .easing(def.easing)
                   .onUpdate( def.onUpdate(def) )
                   .start(def.beginFrac * state.currDuration)
        }
    }

}




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
