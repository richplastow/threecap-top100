//// TWEEN
import config from './config.js'
import scene from './scene.js'
import state from './state.js'


const tweenDefs = [
    { //0 camera position’s altitude UP
        beginState: { alt:null } // set by `tweenDefs[0].reset()`
      , currState:  {}
      , endState:   { alt:250 }
      , beginFrac:  0
      , endFrac:    0.5
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.InOut
      , onReset:    function (def) {

            //// Start the audio, if it’s not playing
            if ('playing' !== state.audio) {
                state.audio = 'playing'
                scene.$audio.play(0)
            }

            //// Camera’s start altitude.
            { const
                def = tweenDefs[0].beginState
              , alt = def.alt = state.fromData ? 120 : 250
            }

            //// Camera’s end altitude.
            { const
                def = tweenDefs[1].endState
              , alt = def.alt = state.toData ? 120 : 250
            }

            //// Camera’s start and end latitude and longitude.
            { const
                def = tweenDefs[2].beginState
              , lat = def.lat = state.fromData ? state.fromData[5] : state.toData ? state.toData[5] : 0
              , lon = def.lon = state.fromData ? state.fromData[6] : state.toData ? state.toData[6] - 100 : 0
            }
            { const
                def = tweenDefs[2].endState
              , lat = def.lat = state.toData ? state.toData[5] : state.fromData ? state.fromData[5] : 0
              , lon = def.lon = state.toData ? state.toData[6] : state.fromData ? state.fromData[6] + 100 : 0
            }

            //// ‘from’ text and dot, REVEAL.
            { const
                def = tweenDefs[3].beginState
              , fromOpacity = def.fromOpacity
                  = config.fromSpriteOpacityBegin
              , fromScale = def.fromScale
                  = state.fromData ? scene.fromSprite.origScale * 27 : 0
              , fromTextOpacity = def.fromTextOpacity
                  = state.fromData ? config.fromTextSpriteOpacityVeryBegin : 0
            }
            { const
                def = tweenDefs[3].endState
              , fromOpacity = def.fromOpacity
                  = config.usualSpriteOpacityFlying
              , fromScale = def.fromScale
                  = state.fromData ? scene.fromSprite.origScale * 2 : 0
              , fromTextOpacity = def.fromTextOpacity
                  = state.fromData ? config.fromTextSpriteOpacityNearBegin : 0
            }

            //// ‘from’ text, HIDE.
            { const
                def = tweenDefs[4].beginState
              , fromTextOpacity = def.fromTextOpacity
                  = state.fromData ? config.fromTextSpriteOpacityNearBegin : 0
            }
            { const
                def = tweenDefs[4].endState
              , fromTextOpacity = def.fromTextOpacity
                  = state.fromData ? config.fromTextSpriteOpacityFlying : 0
            }

            //// ‘to’ text and dot, REVEAL.
            { const
                def = tweenDefs[5].beginState
              , toOpacity = def.toOpacity
                  = config.usualSpriteOpacityFlying
              , toTextOpacity = def.toTextOpacity
                  = state.toData ? config.toTextSpriteOpacityFlying : 0
              , toScale = def.toScale
                  = state.toData ? scene.toSprite.origScale * 2 : 0
                scene.toSpriteMaterial.opacity = toOpacity
                scene.toTextSpriteMaterial.opacity = toTextOpacity
                scene.toSprite.scale.set(toScale, toScale, toScale)
            }
            { const
                def = tweenDefs[5].endState
              , toOpacity = def.toOpacity
                  = config.toSpriteOpacityEnd
              , toTextOpacity = def.toTextOpacity
                  = state.toData ? config.toTextSpriteOpacityNearEnd : 0
              , toScale = def.toScale
                  = state.toData ? scene.toSprite.origScale * 8 : 0
            }

            //// ‘to’ text and dot, FINAL ZOOM-IN.
            { const
                def = tweenDefs[6].beginState
              , toTextOpacity = def.toTextOpacity
                  = state.toData ? config.toTextSpriteOpacityNearEnd : 0
              , toScale = def.toScale
                  = state.toData ? scene.toSprite.origScale * 8 : 0
            }
            { const
                def = tweenDefs[6].endState
              , toTextOpacity = def.toTextOpacity
                  = state.toData ? config.toTextSpriteOpacityVeryEnd : 0
              , toScale = def.toScale
                  = state.toData ? scene.toSprite.origScale * 27 : 0
            }


            console.log(state.fromData, def.beginState.alt);
            scene.toSpriteMaterial.opacity = config.toSpriteOpacityBegin
            // usualSpriteMaterial.opacity = state.fromData ? config.usualSpriteOpacityBeginEnd : config.usualSpriteOpacityFlying
        }
      , onUpdate:   function (def) { return function () {
            state.cameraCurrent.position.alt = def.currState.alt
        } }
    }

  , { //1 camera position’s altitude DOWN
        beginState: { alt:250 }
      , currState:  {}
      , endState:   { alt:null } // set by `tweenDefs[0].reset()`
      , beginFrac:  0.5
      , endFrac:    1
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.InOut
      , onReset:    function (def) { }
      , onUpdate:   function (def) { return function () {
            state.cameraCurrent.position.alt = def.currState.alt
        } }
    }

  , { //2 camera position’s latitude and longitude
        beginState: { lat:null, lon:null } // set by `tweenDefs[0].reset()`
      , currState:  {}
      , endState:   { lat:null, lon:null } // set by `tweenDefs[0].reset()`
      , beginFrac:  0 // fraction of whole duration, so `0`...
      , endFrac:    1 // ...`1` fills the entire sequence
      , tween:      null
      , easing:     state.fromData ? TWEEN.Easing.Cubic.InOut : TWEEN.Easing.Linear.None
      , onReset:    function (def) { }
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

  , { //3 ‘from’ sprite - the origin - show text and sprite
        beginState: { fromOpacity:null, fromScale:null, fromTextOpacity:null }
      , currState:  {}
      , endState:   { fromOpacity:null, fromScale:null, fromTextOpacity:null }
      , beginFrac:  0.1
      , endFrac:    0.3
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.Out
      , onReset:    function (def) {
            const { fromOpacity, fromTextOpacity, fromScale } = def.beginState
            scene.fromSprite.scale.set(fromScale, fromScale, fromScale)
            scene.fromSpriteMaterial.opacity = fromOpacity
            scene.fromTextSpriteMaterial.opacity = fromTextOpacity
        }
      , onUpdate:   function (def) { return function () {
            const { fromOpacity, fromTextOpacity, fromScale } = def.currState
            scene.fromSprite.scale.set(fromScale, fromScale, fromScale)
            scene.fromSpriteMaterial.opacity = fromOpacity
            scene.fromTextSpriteMaterial.opacity = fromTextOpacity
            // usualSpriteMaterial.opacity = usualOpacity
        } }
    }

  , { //4 ‘from’ sprite - the origin - hide text
        beginState: { fromTextOpacity:null }
      , currState:  {}
      , endState:   { fromTextOpacity:null }
      , beginFrac:  0.3
      , endFrac:    0.5
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.Out
      , onReset:    function (def) { }
      , onUpdate:   function (def) { return function () {
            const { fromTextOpacity } = def.currState
            scene.fromTextSpriteMaterial.opacity = fromTextOpacity
        } }
    }

  , { //5 ‘to’ sprite - the destination - show text and pause
        beginState: { toOpacity:null , toTextOpacity:null , toScale:null }
      , currState:  {}
      , endState:   { toOpacity:null , toTextOpacity:null , toScale:null }
      , beginFrac:  0.4
      , endFrac:    0.6
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.Out
      , onReset:    function (def) { }
      , onUpdate:   function (def) { return function () {
            const { toOpacity, toTextOpacity, toScale } = def.currState
            scene.toSprite.scale.set(toScale, toScale, toScale)
            scene.toSpriteMaterial.opacity = toOpacity
            scene.toTextSpriteMaterial.opacity = toTextOpacity
        } }
    }

  , { //6 ‘to’ sprite - the destination - after pause, final zoom-in
        beginState: { toTextOpacity:null, toScale:null }
      , currState:  {}
      , endState:   { toTextOpacity:null, toScale:null }
      , beginFrac:  0.7
      , endFrac:    0.9
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.Out
      , onReset:    function (def) { }
      , onUpdate:   function (def) { return function () {
            const { toTextOpacity, toScale } = def.currState
            scene.toSprite.scale.set(toScale, toScale, toScale)
            scene.toTextSpriteMaterial.opacity = toTextOpacity
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
