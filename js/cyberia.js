import * as THREE from 'three';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

let camera, controls, scene, renderer, effect;

let textObj;


const loader = new FontLoader()
function loadFont(url) {
    return new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject)
    })
}
const font = await loadFont('fonts/helvetiker_regular.typeface.json')
let text = 'cyberia.world'
console.log(window.innerWidth)
const geometry = new TextGeometry(text, {
    font: font,
    size: window.innerWidth * 0.06,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelOffset: 0,
    bevelThickness: 10,
    bevelSize: 0.3,
    bevelSegments: 5
})

const start = Date.now();

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = 150;
    camera.position.z = 500;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0, 0, 0 );

    const pointLight1 = new THREE.PointLight( 0xffffff, 3, 0, 0 );
    pointLight1.position.set( 500, 500, 500 );
    scene.add( pointLight1 );

    const pointLight2 = new THREE.PointLight( 0xffffff, 1, 0, 0 );
    pointLight2.position.set( - 500, - 500, - 500 );
    scene.add( pointLight2 );

    textObj = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial( { flatShading: true } ) )
    textObj.geometry.center();
    console.log(textObj.geometry.computeBoundingBox())
    scene.add(textObj)

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    effect = new AsciiEffect( renderer, ' .:-+*=%@#', { invert: true } );
    effect.setSize( window.innerWidth, window.innerHeight );
    effect.domElement.style.color = 'purple';
    effect.domElement.style.backgroundColor = 'black';

    // Special case: append effect.domElement, instead of renderer.domElement.
    // AsciiEffect creates a custom domElement (a div container) where the ASCII elements are placed.

    document.body.appendChild( effect.domElement );

    controls = new TrackballControls( camera, effect.domElement );

    //

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    effect.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    const timer = Date.now() - start;

    textObj.rotation.x = (Math.abs( Math.sin( timer * 0.002 ) ) * 0.8 ) - 0.6;
    controls.update();

    effect.render( scene, camera );

}