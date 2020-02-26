/*
 * UBC CPSC 314, Vjan2020
 * Assignment 1 Template
 */

var TIMER_DUR = 5000;
var PARTICLE_SPEED = 5;
var PARTICLE_HEIGHT = 10; // TODO: pass as uniform to particle to have it be configurable.

// CHECK WEBGL VERSION
if ( WEBGL.isWebGL2Available() === false ) {
  document.body.appendChild( WEBGL.getWebGL2ErrorMessage() );
}

// SETUP RENDERER & SCENE
var container = document.createElement( 'div' );
document.body.appendChild( container );

var canvas = document.createElement("canvas");
var context = canvas.getContext( 'webgl2' );
var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
renderer.setClearColor(0X80CEE1); // blue background colour
container.appendChild( renderer.domElement );
var scene = new THREE.Scene();

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30.0, 1.0, 0.1, 1000.0); // view angle, aspect ratio, near, far
camera.position.set(0.0,30.0,55.0);
camera.lookAt(scene.position);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera, container);
controls.damping = 0.2;
controls.autoRotate = false;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
 window.scrollTo(0,0);
}

// WORLD COORDINATE FRAME: other objects are defined with respect to it
var worldFrame = new THREE.AxesHelper(1) ;
scene.add(worldFrame);

// FLOOR WITH PATTERN
var floorTexture = new THREE.TextureLoader().load('images/floor.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(2, 2);

var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
var floorGeometry = new THREE.PlaneBufferGeometry(30.0, 30.0);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1;
floor.rotation.x = Math.PI / 2.0;
scene.add(floor);
floor.parent = worldFrame;

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// MAGIC CIRCLE TEXTURE
var magicTexture = new THREE.TextureLoader().load('images/magic_circle.png');
magicTexture.minFilter = THREE.LinearFilter;

// UNIFORMS
var colorMap = {type: 't', value: magicTexture};
var magicPosition = {type: 'v3', value: new THREE.Vector3(0.0, 0.0, 0.0)};
var magicActive = {type: 'b', value: false };

var magicActiveTimer = 0;
var time = {type: 'f', value: 0};

// MATERIALS: specifying uniforms and shaders
var wizardMaterial = new THREE.ShaderMaterial();
var itemMaterial = new THREE.ShaderMaterial();
var magicMaterial = new THREE.ShaderMaterial({ 
  side: THREE.DoubleSide,
  uniforms: {
    colorMap: colorMap,
    magicPosition: magicPosition,
    magicActive: magicActive,
    time: time,
  }
});

// Particle material
var particleTexture = new THREE.TextureLoader().load('images/particle.png');
particleTexture.minFilter = THREE.NearestFilter;

var particle_colorMap = {type: 't', value: particleTexture};
var particleMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  uniforms: {
    colorMap: particle_colorMap,
    origin: magicPosition,
    pos: {type: 'v3', value: new THREE.Vector3(0.0, 0.0, 0.0)},
  },
  blending: THREE.NormalBlending, // https://stackoverflow.com/questions/28011525/three-js-transparancy-with-shadermaterial
  transparent: true,
});

// LOAD SHADERS
var shaderFiles = [
'glsl/wizard.vs.glsl',
'glsl/wizard.fs.glsl',
'glsl/item.vs.glsl',
'glsl/item.fs.glsl',
'glsl/magic.vs.glsl',
'glsl/magic.fs.glsl',
'glsl/particle.vs.glsl',
'glsl/particle.fs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  wizardMaterial.vertexShader = shaders['glsl/wizard.vs.glsl'];
  wizardMaterial.fragmentShader = shaders['glsl/wizard.fs.glsl'];

  itemMaterial.vertexShader = shaders['glsl/item.vs.glsl'];
  itemMaterial.fragmentShader = shaders['glsl/item.fs.glsl'];

  magicMaterial.vertexShader = shaders['glsl/magic.vs.glsl'];
  magicMaterial.fragmentShader = shaders['glsl/magic.fs.glsl'];

  particleMaterial.vertexShader = shaders['glsl/particle.vs.glsl'];
  particleMaterial.fragmentShader = shaders['glsl/particle.fs.glsl'];
})

// OBJ LOADER
function loadOBJ(file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
  var manager = new THREE.LoadingManager();
  manager.onProgress = function (item, loaded, total) {
    console.log( item, loaded, total );
  };

  var onProgress = function (xhr) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100.0;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };

  var onError = function (xhr) {
  };

  var loader = new THREE.OBJLoader( manager );
  loader.load(file, function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });

    object.position.set(xOff,yOff,zOff);
    object.rotation.x= xRot;
    object.rotation.y = yRot;
    object.rotation.z = zRot;
    object.scale.set(scale,scale,scale);
    object.parent = worldFrame;
    scene.add(object);

  }, onProgress, onError);
}

// LOAD WIZARD & WIZARD HAT
loadOBJ('obj/wizard.obj', wizardMaterial, 1.0, 0.0, 0.0, -8.0, 0.0, 0.0, 0.0);
loadOBJ('obj/hat.obj', wizardMaterial, 1.0, 0.0, 10.0, -8.0, -0.1, 0.0 * Math.PI/2, 0.0);

// CREATE MAGIC CIRCLE
// https://threejs.org/docs/#api/en/geometries/PlaneGeometry
var magicGeometry = new THREE.PlaneBufferGeometry(10.0, 10.0, 50.0, 50.0);
var magicCircle = new THREE.Mesh(magicGeometry, magicMaterial);
magicCircle.position.y = 0.1;
magicCircle.rotation.x = Math.PI / 2.0;
scene.add(magicCircle);
magicCircle.parent = worldFrame;

// CREATE MAGICAL ITEMS
// https://threejs.org/docs/#api/en/geometries/SphereGeometry
var sphereGeometry = new THREE.SphereGeometry(1.0, 32.0, 32.0);
var sphere = new THREE.Mesh(sphereGeometry, itemMaterial);
sphere.position.set(7.0, 1.0, 7.0);
sphere.scale.set(1.0, 1.0, 1.0);
sphere.parent = worldFrame;
scene.add(sphere);

// https://threejs.org/docs/#api/en/geometries/TorusGeometry
var torusGeometry = new THREE.TorusGeometry(0.9, 0.4, 10, 20);
var torus = new THREE.Mesh(torusGeometry, itemMaterial);
torus.position.set(10.0, 0.4, 10.0);
torus.scale.set(1.0, 1.0, 1.0);
torus.rotation.x = Math.PI / 2.0;
torus.parent = worldFrame;
scene.add(torus);

// https://threejs.org/docs/#api/en/geometries/CylinderGeometry
var pyramidGeometry = new THREE.CylinderGeometry(0.0, 1.0, 2.0, 4.0, 1.0);
var pyramid = new THREE.Mesh(pyramidGeometry, itemMaterial);
pyramid.position.set(11.0, 1.0, 6.0);
pyramid.scale.set(1.0, 1.0, 1.0);
pyramid.parent = worldFrame;
scene.add(pyramid);

function summon() {
  var r = Math.floor(Math.random() * 3);
  switch(r) {
    case 0:
      var sphere = new THREE.Mesh(sphereGeometry, itemMaterial);
      sphere.position.set(magicPosition.value.x, magicPosition.value.y+1.0, magicPosition.value.z);
      sphere.scale.set(1.0, 1.0, 1.0);
      sphere.parent = worldFrame;
      scene.add(sphere);
      break;
    case 1:
      var torus = new THREE.Mesh(torusGeometry, itemMaterial);
      torus.position.set(magicPosition.value.x, magicPosition.value.y+0.4, magicPosition.value.z);
      torus.scale.set(1.0, 1.0, 1.0);
      torus.rotation.x = Math.PI / 2.0;
      torus.parent = worldFrame;
      scene.add(torus);
      break;
    case 2:
      var pyramid = new THREE.Mesh(pyramidGeometry, itemMaterial);
      pyramid.position.set(magicPosition.value.x, magicPosition.value.y+1.0, magicPosition.value.z);
      pyramid.scale.set(1.0, 1.0, 1.0);
      pyramid.parent = worldFrame;
      scene.add(pyramid);
      break;
  }
}

var particles = [];
var particleGeometry = new THREE.PlaneBufferGeometry(10.0, 10.0, 50.0, 50.0); // TODO
function spawnParticle() {
  // random position https://stackoverflow.com/a/50746409
  var r = 5 * Math.sqrt(Math.random());
  var theta = Math.random() * 2 * Math.PI;
  var randx = magicPosition.value.x + r * Math.cos(theta);
  var randz = magicPosition.value.z + r * Math.sin(theta);

  var position = new THREE.Vector3(randx,0.0,randz);
  var material = particleMaterial.clone(); // https://stackoverflow.com/questions/15597846/three-js-sharing-shadermaterial-between-meshes-but-with-different-uniform-sets
  material.uniforms = {
    colorMap: particle_colorMap,
    origin: magicPosition,
    pos: {type: 'v3', value: position},
  }
  var particle = new THREE.Mesh(particleGeometry, material)
  var idx = particles.push({ particle, material, position});
  particle.position.x = position.x;
  particle.position.y = position.y;
  particle.position.z = position.z;
  particle.rotation.x = 0 //Math.PI / 2.0;
  particle.scale.set(0.1,0.1,0.1);
  scene.add(particle);
  particle.parent = worldFrame;
}

function updateParticles(ms) {
  // Spawn new particles while magic is active
  if (magicActive.value) {
    // TODO untie from framerate...
    spawnParticle();
  }
  var toRemove = [];
  for (var i = particles.length-1; i >= 0; i--) {
    var particle = particles[i].particle;
    if (particle.position.y - magicPosition.value.y > PARTICLE_HEIGHT) {   // Get the indexes all particles above height limit
      toRemove.push(i);
    } else {
      particle.position.y += ms/1000 * PARTICLE_SPEED; // update particle positions
      
      // Probably a better way to do it, but manually update the position uniform to match
      particles[i].position.y = particle.position.y;
    }
  }
  // remove particles above height limit
  toRemove.forEach((idx) => {
    scene.remove(particles[idx].particle);
    particles[idx].material.dispose();
    particles.splice(idx, 1);
  });
  particleMaterial.needsUpdate = true;
}

// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("W"))
    magicPosition.value.z -= 0.3;
  else if (keyboard.pressed("S"))
    magicPosition.value.z += 0.3;

  if (keyboard.pressed("A"))
    magicPosition.value.x -= 0.3;
  else if (keyboard.pressed("D"))
    magicPosition.value.x += 0.3;
  if (keyboard.pressed("space")) {
    magicActiveTimer = TIMER_DUR;
  }

  wizardMaterial.needsUpdate = true; // Tells three.js that some uniforms might have changed
  itemMaterial.needsUpdate = true;
  magicMaterial.needsUpdate = true;
}

var startTime = Date.now();
var last_ts = startTime;
// SETUP UPDATE CALL-BACK
function update() {
  checkKeyboard();
  var cur_ts = Date.now();
  var dif = cur_ts - last_ts;
  // Update magicActive and/or timer timer      
  if (magicActiveTimer > 0) {
    magicActive.value = true;
    magicActiveTimer -= dif;
  } else {
    if (magicActive.value === true) {
      summon();
      magicActiveTimer = 0;
      magicActive.value = false;
    }
  }
  wizardMaterial.needsUpdate = true; 

  updateParticles(dif);

  last_ts = cur_ts; // Keep track of last timestamp to determine dif
  time.value = cur_ts - startTime; // Pass in current time to shader
  requestAnimationFrame(update); // Requests the next update call, this creates a loop
  renderer.render(scene, camera);
}

update();