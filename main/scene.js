//// SCENE

import config from  './config.js'
import data from '../data/worldcities.js'
import state from  './state.js'

const

    //// Objects for rendering.
    clock = new THREE.Clock()
  , scene = new THREE.Scene()
  , renderer = new THREE.WebGLRenderer({ antialias:true })
  , composer = new THREE.EffectComposer(renderer)
  , copyPass = new THREE.ShaderPass(THREE.CopyShader)
  , camera = new THREE.PerspectiveCamera(
        35, config.previewWidth/config.previewHeight, 0.1, 1000)

    //// Object3Ds.
  , globe = new THREE.Object3D()
  , sprites = []
  , fog = new THREE.FogExp2(0x002080, 0.004) // RT: rgb(0, 90, 83)

    //// Textures.
  , usualSpriteTexture = new THREE.CanvasTexture(
        document.getElementById('usual-sprite')
    )
  , top100SpriteTexture = new THREE.CanvasTexture(
        document.getElementById('top100-sprite')
    )

    //// Materials.
  , spriteMaterialTemplate = {
        map: usualSpriteTexture
      , blending: THREE.AdditiveBlending
      , depthTest: false
      , transparent: true
      , opacity: config.usualSpriteOpacityBeginEnd
      , fog: true
    }
  , usualSpriteMaterial = new THREE.SpriteMaterial(
        Object.assign({}, spriteMaterialTemplate)
    )
  , top100SpriteMaterial = new THREE.SpriteMaterial(
        Object.assign({}, spriteMaterialTemplate, {
            fog: false
          , map: top100SpriteTexture
          , opacity: config.top100SpriteOpacityBegin
        })
    )

    //// Capture.
  , capture = new THREEcap({
        width: config.captureWidth
      , height: config.captureHeight
      , fps: config.captureFps
      , time: config.captureDuration / 1000 // convert ms to seconds
      , format: 'mp4'
      , composer: composer // faster than using a canvas
      , scriptbase: 'lib/threecap/'
    })
  , captureui = new THREEcapUI(capture)




let module; export default module = {

    copyPass
  , renderer
  , composer
  , clock
  , camera
  , captureui

  , usualSpriteMaterial

    //// Sets up the scene - should be called only once.
  , init () {

        clock.stop()
        renderer.domElement.id = 'three-scene'
    	renderer.setPixelRatio(config.pixelRatio)
    	renderer.autoClear = false
    	composer.addPass( new THREE.RenderPass(scene, camera) )
    	composer.addPass(copyPass)
        scene.add(camera)
        scene.add(globe)
        document.body.appendChild(renderer.domElement)

        //// Add a sprite for every location in the data.
        for (let i=1; i<data.length; i++) { // i=1, ignore header line
            const [ pop, city, x, y, z ] = data[i]
            const scale = Math.log(pop) / 8 // eg 2.27 for a million, 1.15 for 10000
            let sprite = new THREE.Sprite(usualSpriteMaterial)
            sprite.position.set(x, y, z)
            sprite.scale.set(scale, scale, scale)
            sprites.push(sprite)
            globe.add(sprite)
        }

    }

  , render () {
    	requestAnimationFrame(module.render)
    	const delta = clock.getDelta() // needed, to enable `clock.elapsedTime`
        const now = clock.elapsedTime
        if (state.prevNow === ~~now)
            if ('capture' === state.currMode) return // only render once a second
        else
            state.prevNow = ~~now // a new second!
        TWEEN.update(now * 1000) // convert seconds to ms
    	renderer.clear()
    	composer.render()
    }


}
