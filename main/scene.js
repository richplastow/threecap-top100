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
  , globe = new THREE.Object3D() // dot-sprites are attached to this
  , earthGeometry = new THREE.SphereGeometry(100, 64, 64)
  , cloudGeometry = new THREE.SphereGeometry(105, 64, 64)
  , starGeometry  = new THREE.SphereGeometry(500, 32, 32)
  , sprites = []
  , top100Sprites = []

    //// Lights.
  , ambientLight = new THREE.AmbientLight(0x888888)
  , directionalLight = new THREE.DirectionalLight(0xcccccc, 1)

    //// Textures.
  , earthMap = THREE.ImageUtils.loadTexture('images/8k_earth_daymap.jpg')
  , earthBumpMap = THREE.ImageUtils.loadTexture('images/8k_earth_normal_map.jpg')
  , earthSpecularMap = THREE.ImageUtils.loadTexture('images/8k_earth_specular_map.jpg')
  , cloudMap = THREE.ImageUtils.loadTexture('images/8k_earth_clouds.jpg')
  , starMap = THREE.ImageUtils.loadTexture('images/8k_stars_milky_way.jpg')
  , usualSpriteTexture = new THREE.CanvasTexture(
        document.getElementById('usual-sprite')
    )
  , top100SpriteTexture = new THREE.CanvasTexture(
        document.getElementById('top100-sprite')
    )

    //// Materials.
  , earthMaterial = new THREE.MeshPhongMaterial({
        map: earthMap
      , bumpMap: earthBumpMap
      , bumpScale: 10
      , specularMap: earthSpecularMap
      , specular: new THREE.Color('grey')
    })
  , cloudMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.Texture(cloudMap)
      , side: THREE.DoubleSide
      , opacity: 0.8
      , transparent: true
      , depthWrite: false
    })
  , starMaterial = new THREE.MeshBasicMaterial({
        map: starMap
      , side: THREE.BackSide
    })
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
          , opacity: config.top100SpriteOpacityBeginEnd
        })
    )

    //// Meshes.
  , earthMesh = new THREE.Mesh(earthGeometry, earthMaterial)
  , cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial)
  , starMesh = new THREE.Mesh(starGeometry, starMaterial)

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


scene.fog = new THREE.FogExp2(0x002080, 0.004) // RT: rgb(0, 90, 83)



let module; export default module = {

    copyPass
  , renderer
  , composer
  , clock
  , camera
  , captureui

  , usualSpriteMaterial
  , top100SpriteMaterial

  , top100Sprites

    //// Sets up the scene - should be called only once.
  , init () {

        clock.stop()
        renderer.domElement.id = 'three-scene'
    	renderer.setPixelRatio(config.pixelRatio)
    	renderer.autoClear = false
    	composer.addPass( new THREE.RenderPass(scene, camera) )
    	composer.addPass(copyPass)
        scene.add(camera)
        scene.add(ambientLight)
    	directionalLight.position.set(5,3,5)
    	scene.add(directionalLight)
        scene.add(globe)
        scene.add(earthMesh)
        // scene.add(cloudMesh)
        scene.add(starMesh)
        document.body.appendChild(renderer.domElement)

        //// Add a ‘usual’ sprite for every location in the data.
        for (let i=1; i<data.length; i++) { // i=1, ignore header line
            const [ pop, city, x, y, z, lat, lon, overtourism ] = data[i]
            const scale = ( Math.log(pop) / 8 ) // eg 2.27 for a million, 1.15 for 10000
              + overtourism // show cities suffering from overtourism bigger
            if (overtourism) {
                const top100Sprite = new THREE.Sprite(top100SpriteMaterial)
                top100Sprite.position.set(x, y, z)
                top100Sprite.scale.set(scale, scale, scale)
                top100Sprite.basicScale = scale
                sprites.push(top100Sprite)
                top100Sprites.push(top100Sprite)
                globe.add(top100Sprite)
            } else {
                const usualSprite = new THREE.Sprite(usualSpriteMaterial)
                usualSprite.position.set(x, y, z)
                usualSprite.scale.set(scale, scale, scale)
                sprites.push(usualSprite)
                globe.add(usualSprite)
            }
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
