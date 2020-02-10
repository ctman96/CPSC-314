/*
 * UBC CPSC 314, Vjan2020
 * Assignment 2 Part 1 Template
 */

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
renderer.setClearColor(0XFF8B3D); // orange background colour
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
var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
var floorGeometry = new THREE.PlaneBufferGeometry(30.0, 30.0);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1;
floor.rotation.x = Math.PI / 2.0;
scene.add(floor);
floor.parent = worldFrame;

// LOAD WIZARD
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

// GLTF LOADER
const gltfFileName = "armature/armadillo.gltf";
let armadilloObject
{
    const gltfLoader = new THREE.GLTFLoader();
    gltfLoader.load(gltfFileName, (gltf) => {
      
	  armadilloObject = gltf.scene;
      
      armadilloObject.traverse(function(child) {
        if (child instanceof THREE.SkinnedMesh) {
          child.material = skinningArmadilloMaterial;
        }
      });

      inverseBindMatrices[0] = armadilloObject.children[0].children[1].skeleton.boneInverses[0];
      inverseBindMatrices[1] = armadilloObject.children[0].children[1].skeleton.boneInverses[1];
      // Rotate about Y by 90 degrees to get inverseBindMatrix1 into the world coordinate frame
      inverseBindMatrices[1].multiply(new THREE.Matrix4().makeRotationY(1.571));
      
      var boneMatrix0 = new THREE.Matrix4();
      boneMatrix0.getInverse(inverseBindMatrices[0]);
      var boneMatrix1 = new THREE.Matrix4();
      boneMatrix1.getInverse(inverseBindMatrices[1]);

      boneMatrices[0] = boneMatrix0; 
      boneMatrices[1] = boneMatrix1;
    });
}
/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// GLOBAL VARIABLES DEFINED FOR SKINNING (PART 2)
// World transformation matrix of bone1, bone2
var boneMatrices        = [new THREE.Matrix4(), new THREE.Matrix4() ]
// Inverse of the world transformation matrix  of bone1, bone2 in bind pose
var inverseBindMatrices = [new THREE.Matrix4(), new THREE.Matrix4() ]

// MAGIC CIRCLE & SCORCH TEXTURES
var magicTexture = new THREE.TextureLoader().load('images/magic_circle.png');
magicTexture.minFilter = THREE.LinearFilter;
var scorchTexture = new THREE.TextureLoader().load('images/scorch.png');
scorchTexture.minFilter = THREE.LinearFilter;

// UNIFORMS
var colorMapMagic = {type: 't', value: magicTexture};
var colorMapScorch = {type: 't', value: scorchTexture};
var magicPosition = {type: 'v3', value: new THREE.Vector3(0.0, 0.0, 0.0)};
var offsetLEye = {type: 'v3', value: new THREE.Vector3(-0.6, 9.0, -6.5)};
var offsetREye = {type: 'v3', value: new THREE.Vector3(0.6, 9.0, -6.5)};
var offsetWand = {type: 'v3', value: new THREE.Vector3(-2.5, 7.9, -6.4)};
var nodRotation = {type: 'f', value: 0.0};

// MATERIALS: specifying uniforms and shaders
var wizardMaterial = new THREE.ShaderMaterial({});
var magicMaterial = new THREE.ShaderMaterial({ 
	side: THREE.DoubleSide,
	uniforms: {
		colorMap: colorMapMagic,
		magicPosition: magicPosition,
	}
});

var scorchMaterial = new THREE.ShaderMaterial({ 
	side: THREE.DoubleSide,
	uniforms: {
		colorMap: colorMapScorch,
	}
});

// EYES MATERIAL: offsetLEye and offsetREye should be used to position each eye
var leftEyeMaterial = new THREE.ShaderMaterial({});
var rightEyeMaterial = new THREE.ShaderMaterial({});


// PART (2.1)  
// HINT : Pass a new uniform to the shader to determine the angle of rotation of the head
var noddingArmadilloMaterial = new THREE.ShaderMaterial({
  uniforms: {
    rotation: nodRotation,
  }
});

// PART (2.2) SKINNING
// HINT : The necessary uniforms are already passed. you will only need to modify them 
// in the setMatrices function
// TMatrices has global transformation matrices for each bone
var TMatrices = {type: 'm4v', value : [new THREE.Matrix4(), new THREE.Matrix4() ]}

var skinningArmadilloMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  uniforms: {
    T : TMatrices
  }
});

// LOAD SHADERS
// ADD SHADERS FOR LASER, EYES, WIZARD
var shaderFiles = [
'glsl/wizard.vs.glsl',
'glsl/wizard.fs.glsl',
'glsl/magic.vs.glsl',
'glsl/magic.fs.glsl',
'glsl/scorch.vs.glsl',
'glsl/scorch.fs.glsl',
'glsl/eye.vs.glsl',
'glsl/eye.fs.glsl',
'glsl/noddingArmadillo.vs.glsl',
'glsl/noddingArmadillo.fs.glsl',
'glsl/skinningArmadillo.vs.glsl',
'glsl/skinningArmadillo.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
	wizardMaterial.vertexShader = shaders['glsl/wizard.vs.glsl'];
	wizardMaterial.fragmentShader = shaders['glsl/wizard.fs.glsl'];

	magicMaterial.vertexShader = shaders['glsl/magic.vs.glsl'];
	magicMaterial.fragmentShader = shaders['glsl/magic.fs.glsl'];

	scorchMaterial.vertexShader = shaders['glsl/scorch.vs.glsl'];
	scorchMaterial.fragmentShader = shaders['glsl/scorch.fs.glsl'];

	// ADD SHADERS FOR LASER, EYES, ARMADILLO
	leftEyeMaterial.vertexShader = shaders['glsl/eye.vs.glsl'];
	leftEyeMaterial.fragmentShader = shaders['glsl/eye.fs.glsl'];

	rightEyeMaterial.vertexShader = shaders['glsl/eye.vs.glsl'];
	rightEyeMaterial.fragmentShader = shaders['glsl/eye.fs.glsl'];

	// PART 2
	noddingArmadilloMaterial.vertexShader = shaders['glsl/noddingArmadillo.vs.glsl']
  	noddingArmadilloMaterial.fragmentShader = shaders['glsl/noddingArmadillo.fs.glsl']

  	skinningArmadilloMaterial.vertexShader = shaders['glsl/skinningArmadillo.vs.glsl']
  	skinningArmadilloMaterial.fragmentShader = shaders['glsl/skinningArmadillo.fs.glsl']

});

// LOAD OBJECTS
loadOBJ('obj/wizard.obj', wizardMaterial, 1.0, 0.0, 0.0, -8.0, 0.0, 0.0, 0.0);
loadOBJ('obj/eye.obj', leftEyeMaterial, 0.5, 0, 0, 0, 0, 0, 0);
loadOBJ('obj/eye.obj', rightEyeMaterial, 0.5, 0, 0, 0, 0, 0, 0);

// CREATE MAGIC CIRCLE
// https://threejs.org/docs/#api/en/geometries/PlaneGeometry
var magicGeometry = new THREE.PlaneBufferGeometry(10.0, 10.0, 50.0, 50.0);
var magicCircle = new THREE.Mesh(magicGeometry, magicMaterial);
magicCircle.position.y = 0.1;
magicCircle.rotation.x = Math.PI / 2.0;
scene.add(magicCircle);
magicCircle.parent = worldFrame;

// CREATE BLUEPRINTS FOR SCORCH MARKS
var scorchGeometry = new THREE.PlaneBufferGeometry(10.0, 10.0, 50.0, 50.0);
var scorch = new THREE.Mesh(scorchGeometry, scorchMaterial);
scorch.position.y = 0.1;
scorch.rotation.x = Math.PI / 2.0;

// LASER GEOMETRY
var laserGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
for (let i = 0; i < laserGeometry.vertices.length; ++i)
	laserGeometry.vertices[i].y += 0.5;


//---------------------------
// PART 2 -- DEFORMATIONS
// WORK HERE FOR PART 2
//---------------------------

// ADD NODDING CODE HERE
loadOBJ('obj/armadillo.obj', noddingArmadilloMaterial, 1.0, -5.0, 5.0, 8.0, 0.0, 3.14, 0.0);

// ADD SKINNING CODE HERE
var angle = 0.0;
var angle2 = 0.0;
function setMatrices(angle)
{ 
  // BONE 1
  // The transformation matrix is built relative to the parent coordinate frame.
  var Transform1 = new THREE.Matrix4();
  Transform1.multiply(boneMatrices[0]);
  Transform1.multiply(new THREE.Matrix4().makeRotationX(angle));
  Transform1.multiply(inverseBindMatrices[0]);
  TMatrices.value[0] = Transform1 ; 

  // BONE 2

  var Transform2 = new THREE.Matrix4().copy(Transform1);          // Copy Parent
  Transform2.multiply(boneMatrices[1]);                           // Frame
  Transform2.multiply(new THREE.Matrix4().makeRotationX(angle2));  // Rotate X
  Transform2.multiply(new THREE.Matrix4().makeRotationZ(angle2));  // Rotate Z
  Transform2.multiply(inverseBindMatrices[1]);                    // Inverse Frame
  TMatrices.value[1] = Transform2; 
  
  skinningArmadilloMaterial.needsUpdate = true;
}

// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  // KEY BINDINGS 
		if (keyboard.pressed("W")){
			magicPosition.value.z -= 0.3;
		}
		else if (keyboard.pressed("S")) {
			magicPosition.value.z += 0.3;
		}
		if (keyboard.pressed("A")) {
			magicPosition.value.x -= 0.3;
		}
		else if (keyboard.pressed("D")) {
			magicPosition.value.x += 0.3;
		}
		if (keyboard.pressed("space")) {
			// COMMENT IN TO CREATE NEW SCORCH MARKS
			/*
			var newScorch = scorch.clone();
			newScorch.position.set(magicPosition.value.x, 0.1, magicPosition.value.z);
			scene.add(newScorch);
			*/
		}

    // Controls to move the armadillo's head   
    if (keyboard.pressed("Z"))
        nodRotation.value += 0.01;      
    if (keyboard.pressed("X"))
        nodRotation.value -= 0.01;     

  	// PART 2
		if (keyboard.pressed("1")){
			if (armadilloObject)
				scene.add(armadilloObject);
		}
    // Controls to move the armadillo's upper body    
    if (keyboard.pressed("K"))
        angle2 += 0.01;      
    if (keyboard.pressed("J"))
        angle2 -= 0.01;   

    // Controls to move the armadillo's lower body		
		if (keyboard.pressed("M"))
		  	angle += 0.01;      
		if (keyboard.pressed("N"))
		  	angle -= 0.01;      			  


	rightEyeMaterial.needsUpdate = true; // Tells three.js that some uniforms might have changed
	leftEyeMaterial.needsUpdate = true;
	wizardMaterial.needsUpdate = true; 
	magicMaterial.needsUpdate = true;
	noddingArmadilloMaterial.needsUpdate = true;
}

// SETUP UPDATE CALL-BACK
function update() {
	// ADD 
	setMatrices(angle);
	checkKeyboard();
	requestAnimationFrame(update); // Requests the next update call, this creates a loop
	renderer.render(scene, camera);
}

update();