#version 300 es

uniform vec3 camPosition;

out vec3 texDir;

void main() {
	// Q3 (HINT) : The cube that the texture is mapped to is centered at the origin, using this information 
	// calculate the correct direction vector in the world coordinate system
	// which is used to sample a color from the cubemap
	texDir = vec3(modelMatrix * vec4(position, 1.0)); // EXPL: Pass world space position as the texDir to fragment shader

	// Q3 : Offset your pixel vertex position by the cameraPostion (given to you in world space) 
	// so that the cube is always in front of the camera even with zoom 
	gl_Position = projectionMatrix * viewMatrix * vec4(texDir + camPosition, 1.0); // EXPL: Offset world space position (texDir) by world space camPosition
}