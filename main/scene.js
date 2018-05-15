//// SCENE

import config from  './config.js'
import data from '../data/worldcities.js'
import state from  './state.js'

const

    //// Objects for rendering.
    clock = new THREE.Clock()
  , scene = new THREE.Scene()
  , camera = new THREE.PerspectiveCamera(
        35, config.previewWidth/config.previewHeight, 0.1, 1000)
  , renderer = new THREE.WebGLRenderer({ antialias:true })
  , composer = new THREE.EffectComposer(renderer)
  , copyPass = new THREE.ShaderPass(THREE.CopyShader)
  , outlinePass = new THREE.OutlinePass(
        new THREE.Vector2(config.previewWidth, config.previewHeight), scene, camera)

    //// Object3Ds.
  , globe = new THREE.Object3D() // dot-sprites are attached to this
  // , atmosGeometry = new THREE.SphereGeometry(99.5, 64, 64)
  , earthGeometry = new THREE.SphereGeometry(99, 128, 128)
  , cloudGeometry = new THREE.SphereGeometry(100, 64, 64)
  , starGeometry  = new THREE.SphereGeometry(500, 12, 12)
  , sprites = []
  , top100Sprites = []

    //// Lights.
  , ambientLight = new THREE.AmbientLight(0xaaaab0)
  , directionalLight = new THREE.DirectionalLight(0xcccc99, 0.5)

    //// Textures.
  , earthMap = THREE.ImageUtils.loadTexture('images/1024_earth_daymap.jpg')
  , earthBumpMap = THREE.ImageUtils.loadTexture('images/1024_earth_normal_map.png')
  , earthSpecularMap = THREE.ImageUtils.loadTexture('images/1024_earth_specular_map.png')
  , cloudMap = THREE.ImageUtils.loadTexture('images/1024_earth_clouds.jpg')
  , starMap = THREE.ImageUtils.loadTexture('images/1024_stars_milky_way.jpg')
  , usualSpriteTexture = new THREE.CanvasTexture(
        document.getElementById('usual-sprite')
    )
  , top100SpriteTexture = new THREE.CanvasTexture(
        document.getElementById('top100-sprite')
    )

    //// Materials.
  // , atmosMaterial = THREEx.createAtmosphereMaterial()
  , earthMaterial = new THREE.MeshPhongMaterial({
        map: earthMap
      , bumpMap: earthBumpMap
      , bumpScale: 10
      , specularMap: earthSpecularMap
      , specular: new THREE.Color('grey')
    })
  , cloudMaterial = new THREE.MeshPhongMaterial({
        map: cloudMap
      , side: THREE.DoubleSide
      , opacity: 1.0
      , blending: THREE.AdditiveBlending
      , transparent: true
      , depthWrite: false
    })
  , starMaterial = new THREE.MeshBasicMaterial({
        map: starMap
      , side: THREE.BackSide
      , fog: false
    })
  , spriteMaterialTemplate = {
        map: usualSpriteTexture
      , blending: THREE.AdditiveBlending
      , depthTest: true
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
  // , atmosMesh = new THREE.Mesh(atmosGeometry, atmosMaterial)
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


scene.fog = new THREE.FogExp2(0x002060, 0.004) // RT: rgb(0, 90, 83)



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
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap // default THREE.PCFShadowMap
    	composer.addPass( new THREE.RenderPass(scene, camera) )
        outlinePass.selectedObjects = [earthMesh]
        outlinePass.edgeStrength = 1.0 // default is 3.0
        outlinePass.edgeGlow = 40 // default is 0.0
        outlinePass.edgeThickness = 5.0 // default is 1.0
        outlinePass.downSampleRatio = 1 // default is 2
        // outlinePass.usePatternTexture = false
        outlinePass.visibleEdgeColor.set('#208099')
        outlinePass.hiddenEdgeColor.set('#102099')
        composer.addPass(outlinePass)
    	// composer.addPass(rgbShiftPass)
    	composer.addPass(copyPass)
        scene.add(camera)
        scene.add(ambientLight)
    	directionalLight.position.set(-200,300,500)
    	// directionalLight.castShadow = true
        // directionalLight.shadow.mapSize.width = 512  // default is 512
        // directionalLight.shadow.mapSize.height = 512 // default is 512
        // directionalLight.shadow.camera.near = 0.5    // default is 0.5
        // directionalLight.shadow.camera.far = 500     // default is 500
        // earthMesh.receiveShadow = true
        // earthMaterial.shading = THREE.SmoothShading
        // atmosMaterial.uniforms.glowColor.value.set(0x00b3ff)
        // atmosMaterial.uniforms.coeficient.value	= 0.8
        // atmosMaterial.uniforms.power.value = 2.0
        // atmosMesh.scale.multiplyScalar(1.01)
    	scene.add(directionalLight)
        scene.add(globe)
        // scene.add(atmosMesh)
        scene.add(earthMesh)
        scene.add(cloudMesh)
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
