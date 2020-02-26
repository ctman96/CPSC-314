/*
 * UBC CPSC 314, Vjan2020
 * Assignment 3 Template
 */

// CHECK WEBGL VERSION
if ( WEBGL.isWebGL2Available() === false ) {
  document.body.appendChild( WEBGL.getWebGL2ErrorMessage() );
}
// Scene Modes
var Part = {
    GOURAUD: 0,
    BLINNPHONG: 1,
    ANISOTROPIC: 2,
    FOG: 3,
    SPOTLIGHT: 4,
    NPR: 5,
    COUNT: 6,
    //ANISOTROPIC
}
var mode = Part.GOURAUD// current mode

// Setup renderer
var container = document.createElement( 'div' );
document.body.appendChild( container );

var canvas = document.createElement("canvas");
var context = canvas.getContext( 'webgl2' );
var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
renderer.setClearColor(0X808080); // background colour
container.appendChild( renderer.domElement );

// Adapt backbuffer to window size
function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    for (let i = 0; i < Part.COUNT; ++i) {
        cameras[i].aspect = window.innerWidth / window.innerHeight;
        cameras[i].updateProjectionMatrix();
    }
}

// Hook up to event listener
window.addEventListener('resize', resize);

// Disable scrollbar functi on
window.onscroll = function() {
    window.scrollTo(0, 0);
}

// Setup scenes
var scenes = [
    new THREE.Scene(),
    new THREE.Scene(),
    new THREE.Scene(),
    new THREE.Scene(),
    new THREE.Scene(),
    new THREE.Scene()
]

// Setting up all shared objects
var cameras = []
var controls = []
var worldFrames = []

for (let i = 0; i < Part.COUNT; ++i) {
    cameras[i] = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
    cameras[i].position.set(0.0, 7.0, 25.0);
    cameras[i].lookAt(scenes[i].position);
    scenes[i].add(cameras[i]);

    var directionlight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    directionlight.position.set(5.0, 8.0, 5.0);
    scenes[i].add(directionlight);

    // orbit controls
    controls[i] = new THREE.OrbitControls(cameras[i], container);
    controls[i].damping = 0.2;
    controls[i].autoRotate = false;

    worldFrames[i] = new THREE.AxisHelper(2);
    scenes[i].add(worldFrames[i]);

}
resize();

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////
// Parameters defining the light position
var lightColor = new THREE.Color(1.0,1.0,1.0);
var lightFogColor = new THREE.Color(0.5,0.5,0.5);
var ambientColor = new THREE.Color(0.4,0.4,0.4);
var lightDirection = new THREE.Vector3(0.49,0.79, 0.49);
var tangentDirection = new THREE.Vector3(0.5, 0.0, 1.0);
var spotlightPosition = new THREE.Vector3(0,7.0,0);


// Material properties
var kAmbient = 0.4;
var kDiffuse = 0.8;
var kSpecular = 0.5;
var shininess = 10.0;

var goochDiffuse = 1.0;
var goochShininess = 1.0;
var goochBlue = 0.3;
var goochYellow = 0.5;
var goochAlpha = 0.2;
var goochBeta = 0.6;

// Uniforms
var lightColorUniform = {type: "c", value: lightColor};
var lightFogColorUniform = {type: "c", value: lightFogColor};
var ambientColorUniform = {type: "c", value: ambientColor};
var lightDirectionUniform = {type: "v3", value: lightDirection};
var tangentDirectionUniform = {type: "v3", value: tangentDirection};
var spotlightPositionUniform = {type: "v3", value: spotlightPosition};

var kAmbientUniform = {type: "f", value: kAmbient};
var kDiffuseUniform = {type: "f", value: kDiffuse};
var kSpecularUniform = {type: "f", value: kSpecular};
var shininessUniform = {type: "f", value: shininess};
var fogDensity = {type: "f", value: 0.1};
var spotDirectPosition = {type: 'v3', value: new THREE.Vector3(0.0,0.0,0.0)};
var spotlightCutoff = {type: "f", value: 70.0};

var gDiffuseUniform = {type: "f", value: goochDiffuse};
var gShininessUniform = {type: "f", value: goochShininess};
var blueUniform = {type: "f", value: goochBlue};
var yellowUniform = {type: "f", value: goochYellow};
var alphaUniform = {type: "f", value: goochAlpha};
var betaUniform = {type: "f", value: goochBeta};

// Materials

var bPhongMaterial = new THREE.ShaderMaterial({
    uniforms: {
      ambientColor: ambientColorUniform,
      lightColor: lightColorUniform,
      lightDirection: lightDirectionUniform,

      kAmbient: kAmbientUniform,
      kDiffuse: kDiffuseUniform,
      kSpecular: kSpecularUniform,
      shininess: shininessUniform,
    },
});

var anisotropicMaterial = new THREE.ShaderMaterial({
    uniforms: {
      ambientColor: ambientColorUniform,
      lightColor: lightColorUniform,
      lightDirection: lightDirectionUniform,
      tangentDirection: tangentDirectionUniform,

      kAmbient: kAmbientUniform,
      kDiffuse: kDiffuseUniform,
      kSpecular: kSpecularUniform,
      shininess: shininessUniform,
    },
});

var fogMaterial = new THREE.ShaderMaterial({
    uniforms: {
      ambientColor: ambientColorUniform,
      lightColor: lightColorUniform,
      lightDirection: lightDirectionUniform,
      lightFogColor: lightFogColorUniform,

      fogDensity,
      kAmbient: kAmbientUniform,
      kDiffuse: kDiffuseUniform,
    },
});

var spotlightMaterial = new THREE.ShaderMaterial({
  uniforms: {
    spotlightPosition: spotlightPositionUniform,
    spotDirectPosition,
    spotlightCutoff,
  }
});

var toonMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightDirection: lightDirectionUniform,
  },
});
var goochMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightDirection: lightDirectionUniform,
    
    goochDiffuse: gDiffuseUniform,
    goochShininess: gShininessUniform,
    goochBlue: blueUniform,
    goochAlpha: alphaUniform,
    goochYellow: yellowUniform,
    goochBeta: betaUniform,
  },
});
var hatchMaterial = new THREE.ShaderMaterial({
  uniforms: {
    // TODO: pass in the uniforms you need
  },
});

// LOAD SHADERS
var shaderFiles = [
  'glsl/phong_blinn.vs.glsl',
  'glsl/phong_blinn.fs.glsl',
  'glsl/anisotropic.vs.glsl',
  'glsl/anisotropic.fs.glsl',
  'glsl/fog.vs.glsl', 
  'glsl/fog.fs.glsl',
  'glsl/spotlight.vs.glsl',
  'glsl/spotlight.fs.glsl',
  'glsl/toon.fs.glsl',
  'glsl/toon.vs.glsl',
  'glsl/gooch.fs.glsl',
  'glsl/gooch.vs.glsl',
  'glsl/hatch.fs.glsl',
  'glsl/hatch.vs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  bPhongMaterial.vertexShader = shaders['glsl/phong_blinn.vs.glsl'];
  bPhongMaterial.fragmentShader = shaders['glsl/phong_blinn.fs.glsl'];
  anisotropicMaterial.vertexShader = shaders['glsl/anisotropic.vs.glsl'];
  anisotropicMaterial.fragmentShader = shaders['glsl/anisotropic.fs.glsl'];
  fogMaterial.vertexShader = shaders['glsl/fog.vs.glsl'];
  fogMaterial.fragmentShader = shaders['glsl/fog.fs.glsl'];
  spotlightMaterial.vertexShader = shaders['glsl/spotlight.vs.glsl'];
  spotlightMaterial.fragmentShader = shaders['glsl/spotlight.fs.glsl'];
  toonMaterial.fragmentShader = shaders['glsl/toon.fs.glsl'];
  toonMaterial.vertexShader = shaders['glsl/toon.vs.glsl'];
  goochMaterial.fragmentShader = shaders['glsl/gooch.fs.glsl'];
  goochMaterial.vertexShader = shaders['glsl/gooch.vs.glsl'];
  hatchMaterial.fragmentShader = shaders['glsl/hatch.fs.glsl'];
  hatchMaterial.vertexShader = shaders['glsl/hatch.vs.glsl'];
})

var ctx = renderer.context;
ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers

function loadOBJ(mode, file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
    var onProgress = function(query) {
        if (query.lengthComputable) {
            var percentComplete = query.loaded / query.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function() {
        console.log('Failed to load ' + file);
    };

    var loader = new THREE.OBJLoader();
    loader.load(file, function(object) {
        object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.material = material;
            }
        });

        object.position.set(xOff, yOff, zOff);
        object.rotation.x = xRot;
        object.rotation.y = yRot;
        object.rotation.z = zRot;
        object.scale.set(scale, scale, scale);
        object.parent = worldFrames[mode];
        scenes[mode].add(object);
    }, onProgress, onError);
}


/////////////////////////////////
//       GOURAUD SCENE           //
//    RELEVANT TO PART 1.A B & C //
/////////////////////////////////
var GOURAUDMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});

var ballGeometry = new THREE.SphereGeometry(3.5, 20, 20);
function addEggs(lightingMaterial, scene_number){
    for (var i = 0;  i < 100; i++) {
        var mesh = new THREE.Mesh(ballGeometry, lightingMaterial);
        var offset = 0;
        if (Math.floor(i/10)%2 == 0) offset = 0.5;
        mesh.position.x = (i % 10 + offset) * 4 - 20;
        mesh.position.z = Math.floor(i/4) * 4 - 80;
        mesh.scale.set(0.3, 0.4, 0.3);
        scenes[scene_number].add(mesh);
    }
}

function addScene(lightingMaterial, scene_number){
  yAngle = 0.0;
  for (var i = 0;  i < 64; i++) {
      var offset = 0;
      if (Math.floor(i/8)%2 == 0) offset = 0.5;
      var xOffset = (i % 8 + offset) * 3 - 12;
      var zOffset = Math.floor(i/8) * 3 - 12; 

      var yAngle = Math.random() * Math.PI;
      var objType = Math.floor(Math.random() * 10.0);

      if (objType == 0) {
        loadOBJ(scene_number, 'obj/wizard.obj', 
                lightingMaterial, 0.2, 
                xOffset, 0, zOffset, 
                0, yAngle, 0);
      }
      else if (objType == 1) {
        loadOBJ(scene_number, 'obj/armadillo_lowPoly.obj', 
                lightingMaterial, 0.2, 
                xOffset, 1.0, zOffset, 
                0, yAngle, 0);
      }
      else if (objType == 2) {
        loadOBJ(scene_number, 'obj/tree01.obj', 
                lightingMaterial, 1.0, 
                xOffset+4, 0, zOffset-2, 
                0, 0, 0);
      }
      else if (objType == 3) {
        loadOBJ(scene_number, 'obj/tree02.obj', 
                lightingMaterial, 1.0, 
                xOffset+4.5, 0, zOffset, 
                0, 0, 0);
      }
      else if (objType == 4) {
        loadOBJ(scene_number, 'obj/tree03.obj', 
                lightingMaterial, 1.0, 
                xOffset+4.5, 0, zOffset+2.5, 
                0, 0, 0);
      }
      else if (objType <= 6) {
        loadOBJ(scene_number, 'obj/cat.obj', 
                lightingMaterial, 0.005, 
                xOffset, 0, zOffset, 
                0, yAngle, 0);
      }
      else if (objType <= 8) {
        loadOBJ(scene_number, 'obj/bunny.obj', 
                lightingMaterial, 10.0, 
                xOffset, -0.5, zOffset, 
                0, yAngle, 0);
      }
      else {
        loadOBJ(scene_number, 'obj/LEGO_Man.obj', 
                lightingMaterial, 0.5, 
                xOffset, 0, zOffset, 
                0, yAngle, 0);
      }
  }
}

addEggs(GOURAUDMaterial, Part.GOURAUD);
addEggs(bPhongMaterial, Part.BLINNPHONG);
addEggs(anisotropicMaterial, Part.ANISOTROPIC);
addScene(fogMaterial, Part.FOG);


/////////////////////////////////
//      SPOTLIGHT SCENE        //
//    RELEVANT TO PART 1.D     //
/////////////////////////////////

loadOBJ(Part.SPOTLIGHT, 'obj/wizard.obj', spotlightMaterial, 0.5, 0, 0, 0, 0,0,0);

// floor
var geoFloor = new THREE.PlaneBufferGeometry( 2000.0, 2000.0 );
var floor = new THREE.Mesh( geoFloor, spotlightMaterial );
floor.rotation.x = - Math.PI * 0.5;
floor.position.set( 0, - 0.05, 0 );
scenes[Part.SPOTLIGHT].add(floor);


/////////////////////////////////
//       NPR SCENE             //
//    RELEVANT TO PART 1.E     //
/////////////////////////////////

// TODO: load your objects here

loadOBJ(Part.NPR, 'obj/wizard.obj', toonMaterial, 0.5, -3.5, 0, 0, 0,0,0);
loadOBJ(Part.NPR, 'obj/wizard.obj', goochMaterial, 0.5, 0, 0, 0, 0,0,0);
loadOBJ(Part.NPR, 'obj/wizard.obj', hatchMaterial, 0.5, 3.5, 0, 0, 0,0,0);

// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();

function checkKeyboard() {
    if (keyboard.pressed("1"))
        mode = Part.GOURAUD
    else if (keyboard.pressed("2"))
        mode = Part.BLINNPHONG  
    else if (keyboard.pressed("3"))
        mode = Part.ANISOTROPIC     
    else if (keyboard.pressed("4"))
        mode = Part.FOG
    else if (keyboard.pressed("5"))
        mode = Part.SPOTLIGHT
    else if (keyboard.pressed("6"))
        mode = Part.NPR

    if (keyboard.pressed("W"))
      spotDirectPosition.value.z -= 0.1;
    else if (keyboard.pressed("S"))
      spotDirectPosition.value.z += 0.1;

    if (keyboard.pressed("A"))
      spotDirectPosition.value.x -= 0.1;
    else if (keyboard.pressed("D"))
      spotDirectPosition.value.x += 0.1;


    if (keyboard.pressed("N"))
      spotlightCutoff.value -= 0.1;
    else if (keyboard.pressed("M"))
      spotlightCutoff.value += 0.1;

    spotlightMaterial.needsUpdate = true;
    bPhongMaterial.needsUpdate = true;
    anisotropicMaterial.needsUpdate = true;
    toonMaterial.needsUpdate = true;
    fogMaterial.needsUpdate = true;
    goochMaterial.needsUpdate = true;
    hatchMaterial.needsUpdate = true;
}

// SETUP UPDATE CALL-BACK
function update() {
  checkKeyboard();
  requestAnimationFrame(update);
  renderer.render(scenes[mode], cameras[mode]);
}

update();

