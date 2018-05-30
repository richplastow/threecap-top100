//// TWEEN
import config from './config.js'
import scene from './scene.js'
import state from './state.js'


const tweenDefs = [
    { // camera position’s altitude BEGIN
        beginState: { alt:164.5 }
      , currState:  { }
      , endState:   { alt:165 }
      , beginFrac:  0
      , endFrac:    0.1
      , tween:      null
      , easing:     TWEEN.Easing.Linear.None
      , onReset:    function (def) {
            state.cameraCurrent.position.lat = 52
            state.cameraCurrent.position.lon = -20
            state.cameraCurrent.position.alt = 163
            setPositionUsingLla(
                scene.camera
              , state.cameraCurrent.position.lat
              , state.cameraCurrent.position.lon
              , state.cameraCurrent.position.alt
            )
            scene.camera.lookAt(0,0,0)
        }
      , onUpdate:   function (def) { return function () {
            state.cameraCurrent.position.alt = def.currState.alt
        } }
    }
  , { // camera position’s altitude END
        beginState: { alt:165 }
      , currState:  { }
      , endState:   { alt:270 }
      , beginFrac:  0.1
      , endFrac:    1
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.InOut
      , onReset:    function (def) {
        }
      , onUpdate:   function (def) { return function () {
            state.cameraCurrent.position.alt = def.currState.alt
        } }
    }
  //   { // camera position’s altitude BEGIN
  //       beginState: { alt:140 }
  //     , currState:  { }
  //     , endState:   { alt:190 }
  //     , beginFrac:  0
  //     , endFrac:    0.4
  //     , tween:      null
  //     , easing:     TWEEN.Easing.Cubic.In
  //     , onReset:    function (def) {
  //       }
  //     , onUpdate:   function (def) { return function () {
  //           state.cameraCurrent.position.alt = def.currState.alt
  //       } }
  //   }
  // , { // camera position’s altitude END
  //       beginState: { alt:190 }
  //     , currState:  {}
  //     , endState:   { alt:230 }
  //     , beginFrac:  0.4
  //     , endFrac:    1
  //     , tween:      null
  //     , easing:     TWEEN.Easing.Cubic.Out
  //     , onReset:    function (def) { }
  //     , onUpdate:   function (def) { return function () {
  //           state.cameraCurrent.position.alt = def.currState.alt
  //       } }
  //   }
  , { // camera position’s latitude and longitude BEGIN
        beginState: { lat:52, lon:-20 }
      , currState:  {}
      , endState:   { lat:0, lon:190 }
      , beginFrac:  0.0 // fraction of whole duration, so `0`...
      , endFrac:    0.6 // ...`1` fills the entire sequence
      , tween:      null
      , easing:     TWEEN.Easing.Quartic.In
      , onReset:    function (def) { }
      , onUpdate:   function (def) { return function () {
            if (20 < def.currState.lat)
                state.cameraCurrent.position.lat = def.currState.lat
            else
                state.cameraCurrent.position.lat = def.currState.lat / 2 + 10
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
  , { // camera position’s latitude and longitude END
        beginState: { lat:0, lon:190 }
      , currState:  {}
      , endState:   { lat:52, lon:370 }
      , beginFrac:  0.6 // fraction of whole duration, so `0`...
      , endFrac:    1 // ...`1` fills the entire sequence
      , tween:      null
      , easing:     TWEEN.Easing.Sinusoidal.Out
      , onReset:    function (def) { }
      , onUpdate:   function (def) { return function () {
            if (20 < def.currState.lat)
                state.cameraCurrent.position.lat = def.currState.lat
            else
                state.cameraCurrent.position.lat = def.currState.lat / 2 + 10
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

  , { // Venice sprite UP
        beginState: {
            opacity: config.top100SpriteOpacityBeginEnd
          , scale:   config.top100SpriteScaleBeginEnd
        }
      , currState:  {}
      , endState:   {
            opacity: config.top100SpriteOpacityFlying
          , scale:   config.top100SpriteScaleFlying
        }
      , beginFrac:  0.0
      , endFrac:    0.15
      , tween:      null
      , easing:     TWEEN.Easing.Bounce.Out
      , onReset:    function (def) {
            scene.specialSpriteMaterials[1].opacity = config.top100SpriteOpacityBeginEnd
            let scale = scene.specialSprites[1].basicScale * config.top100SpriteScaleBeginEnd
            scene.specialSprites[1].scale.set(scale, scale, scale)
        }
      , onUpdate:   function (def) { return function () {
            scene.specialSpriteMaterials[1].opacity = def.currState.opacity
            let scale = scene.specialSprites[1].basicScale * def.currState.scale
            scene.specialSprites[1].scale.set(scale, scale, scale)
        } }
    }

  , { // Barcelona sprite UP
        beginState: {
            opacity: config.top100SpriteOpacityBeginEnd
          , scale:   config.top100SpriteScaleBeginEnd
        }
      , currState:  {}
      , endState:   {
            opacity: config.top100SpriteOpacityFlying
          , scale:   config.top100SpriteScaleFlying
        }
      , beginFrac:  0.075
      , endFrac:    0.225
      , tween:      null
      , easing:     TWEEN.Easing.Bounce.Out
      , onReset:    function (def) {
            scene.specialSpriteMaterials[2].opacity = config.top100SpriteOpacityBeginEnd
            let scale = scene.specialSprites[2].basicScale * config.top100SpriteScaleBeginEnd
            scene.specialSprites[2].scale.set(scale, scale, scale)
        }
      , onUpdate:   function (def) { return function () {
            scene.specialSpriteMaterials[2].opacity = def.currState.opacity
            let scale = scene.specialSprites[2].basicScale * def.currState.scale
            scene.specialSprites[2].scale.set(scale, scale, scale)
        } }
    }

  , { // top-three (after Venice and Barcalona) city sprites UP
        beginState: {
            opacity: config.top100SpriteOpacityBeginEnd
          , scale:   config.top100SpriteScaleBeginEnd
        }
      , currState:  {}
      , endState:   {
            opacity: config.top100SpriteOpacityFlying
          , scale:   config.top100SpriteScaleFlying
        }
      , beginFrac:  0.175
      , endFrac:    0.325
      , tween:      null
      , easing:     TWEEN.Easing.Back.Out
      , onReset:    function (def) {
            scene.top3SpriteMaterial.opacity = config.top100SpriteOpacityBeginEnd
            scene.top3Sprites.forEach( sprite => {
                let scale = sprite.basicScale * config.top100SpriteScaleBeginEnd
                sprite.scale.set(scale, scale, scale)
            })
        }
      , onUpdate:   function (def) { return function () {
            scene.top3SpriteMaterial.opacity = def.currState.opacity
            scene.top3Sprites.forEach( sprite => {
                let scale = sprite.basicScale * def.currState.scale
                sprite.scale.set(scale, scale, scale)
            })
        } }
    }

  , { // top-seven (after the top three) city sprites UP
        beginState: {
            opacity: config.top100SpriteOpacityBeginEnd
          , scale:   config.top100SpriteScaleBeginEnd
        }
      , currState:  {}
      , endState:   {
            opacity: config.top100SpriteOpacityFlying
          , scale:   config.top100SpriteScaleFlying
        }
      , beginFrac:  0.25
      , endFrac:    0.4
      , tween:      null
      , easing:     TWEEN.Easing.Back.Out
      , onReset:    function (def) {
            scene.top7SpriteMaterial.opacity = config.top100SpriteOpacityBeginEnd
            scene.top7Sprites.forEach( sprite => {
                let scale = sprite.basicScale * config.top100SpriteScaleBeginEnd
                sprite.scale.set(scale, scale, scale)
            })
        }
      , onUpdate:   function (def) { return function () {
            scene.top7SpriteMaterial.opacity = def.currState.opacity
            scene.top7Sprites.forEach( sprite => {
                let scale = sprite.basicScale * def.currState.scale
                sprite.scale.set(scale, scale, scale)
            })
        } }
    }

  , { // top-twenty (after the top seven) city sprites UP
        beginState: {
            opacity: config.top100SpriteOpacityBeginEnd
          , scale:   config.top100SpriteScaleBeginEnd
        }
      , currState:  {}
      , endState:   {
            opacity: config.top100SpriteOpacityFlying
          , scale:   config.top100SpriteScaleFlying
        }
      , beginFrac:  0.3
      , endFrac:    0.45
      , tween:      null
      , easing:     TWEEN.Easing.Quartic.Out
      , onReset:    function (def) {
            scene.top20SpriteMaterial.opacity = config.top100SpriteOpacityBeginEnd
            scene.top20Sprites.forEach( sprite => {
                let scale = sprite.basicScale * config.top100SpriteScaleBeginEnd
                sprite.scale.set(scale, scale, scale)
            })
        }
      , onUpdate:   function (def) { return function () {
            scene.top20SpriteMaterial.opacity = def.currState.opacity
            scene.top20Sprites.forEach( sprite => {
                let scale = sprite.basicScale * def.currState.scale
                sprite.scale.set(scale, scale, scale)
            })
        } }
    }

  , { // Arabian and African (after the top 20 European) city sprites UP
        beginState: {
            opacity: config.top100SpriteOpacityBeginEnd
          , scale:   config.top100SpriteScaleBeginEnd
        }
      , currState:  {}
      , endState:   {
            opacity: config.top100SpriteOpacityFlying
          , scale:   config.arabianSpriteScaleFlying
        }
      , beginFrac:  0.4
      , endFrac:    0.5
      , tween:      null
      , easing:     TWEEN.Easing.Back.Out
      , onReset:    function (def) {
            scene.arabianSpriteMaterial.opacity = config.top100SpriteOpacityBeginEnd
            scene.arabianSprites.forEach( sprite => {
                let scale = sprite.basicScale * config.top100SpriteScaleBeginEnd
                sprite.scale.set(scale, scale, scale)
            })
        }
      , onUpdate:   function (def) { return function () {
            scene.arabianSpriteMaterial.opacity = def.currState.opacity
            scene.arabianSprites.forEach( sprite => {
                let scale = sprite.basicScale * def.currState.scale
                sprite.scale.set(scale, scale, scale)
            })
        } }
    }

  , { // Indian, Chinese and Russian (after Arabian) city sprites UP
        beginState: {
            opacity: config.top100SpriteOpacityBeginEnd
          , scale:   config.top100SpriteScaleBeginEnd
        }
      , currState:  {}
      , endState:   {
            opacity: config.top100SpriteOpacityFlying
          , scale:   config.indianSpriteScaleFlying
        }
      , beginFrac:  0.45
      , endFrac:    0.55
      , tween:      null
      , easing:     TWEEN.Easing.Back.Out
      , onReset:    function (def) {
            scene.indianSpriteMaterial.opacity = config.top100SpriteOpacityBeginEnd
            scene.indianSprites.forEach( sprite => {
                let scale = sprite.basicScale * config.top100SpriteScaleBeginEnd
                sprite.scale.set(scale, scale, scale)
            })
        }
      , onUpdate:   function (def) { return function () {
            scene.indianSpriteMaterial.opacity = def.currState.opacity
            scene.indianSprites.forEach( sprite => {
                let scale = sprite.basicScale * def.currState.scale
                sprite.scale.set(scale, scale, scale)
            })
        } }
    }

  , { // East Asian and Australasian (after Indian) city sprites UP
        beginState: {
            opacity: config.top100SpriteOpacityBeginEnd
          , scale:   config.top100SpriteScaleBeginEnd
        }
      , currState:  {}
      , endState:   {
            opacity: config.top100SpriteOpacityFlying
          , scale:   config.asianSpriteScaleFlying
        }
      , beginFrac:  0.50
      , endFrac:    0.56
      , tween:      null
      , easing:     TWEEN.Easing.Back.Out
      , onReset:    function (def) {
            scene.asianSpriteMaterial.opacity = config.top100SpriteOpacityBeginEnd
            scene.asianSprites.forEach( sprite => {
                let scale = sprite.basicScale * config.top100SpriteScaleBeginEnd
                sprite.scale.set(scale, scale, scale)
            })
        }
      , onUpdate:   function (def) { return function () {
            scene.asianSpriteMaterial.opacity = def.currState.opacity
            scene.asianSprites.forEach( sprite => {
                let scale = sprite.basicScale * def.currState.scale
                sprite.scale.set(scale, scale, scale)
            })
        } }
    }

  , { // American (after Asian) city sprites UP
        beginState: {
            opacity: config.top100SpriteOpacityBeginEnd
          , scale:   config.top100SpriteScaleBeginEnd
        }
      , currState:  {}
      , endState:   {
            opacity: config.top100SpriteOpacityFlying
          , scale:   config.americanSpriteScaleFlying
        }
      , beginFrac:  0.65
      , endFrac:    0.75
      , tween:      null
      , easing:     TWEEN.Easing.Back.Out
      , onReset:    function (def) {
            scene.americanSpriteMaterial.opacity = config.top100SpriteOpacityBeginEnd
            scene.americanSprites.forEach( sprite => {
                let scale = sprite.basicScale * config.top100SpriteScaleBeginEnd
                sprite.scale.set(scale, scale, scale)
            })
        }
      , onUpdate:   function (def) { return function () {
            scene.americanSpriteMaterial.opacity = def.currState.opacity
            scene.americanSprites.forEach( sprite => {
                let scale = sprite.basicScale * def.currState.scale
                sprite.scale.set(scale, scale, scale)
            })
        } }
    }

  // , { // top100 city sprites UP
  //       beginState: {
  //           top100Opacity: config.top100SpriteOpacityBeginEnd
  //         , top100Scale:   config.top100SpriteScaleBeginEnd
  //       }
  //     , currState:  {}
  //     , endState:   {
  //           top100Opacity: config.top100SpriteOpacityFlying
  //         , top100Scale:   config.top100SpriteScaleFlying
  //       }
  //     , beginFrac:  0.45
  //     , endFrac:    0.65
  //     , tween:      null
  //     , easing:     TWEEN.Easing.Cubic.Out
  //     , onReset:    function (def) {
  //           scene.top100SpriteMaterial.opacity = config.top100SpriteOpacityBeginEnd
  //           scene.top100Sprites.forEach( top100Sprite => {
  //               let scale = top100Sprite.basicScale * config.top100SpriteScaleBeginEnd
  //               top100Sprite.scale.set(scale, scale, scale)
  //           })
  //       }
  //     , onUpdate:   function (def) { return function () {
  //           scene.top100SpriteMaterial.opacity = def.currState.top100Opacity
  //           scene.top100Sprites.forEach( top100Sprite => {
  //               let scale = top100Sprite.basicScale * def.currState.top100Scale
  //               // scale = Math.max(0, top100Sprite.basicScale - 2) * scale
  //               top100Sprite.scale.set(scale, scale, scale)
  //           })
  //       } }
  //   }
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
