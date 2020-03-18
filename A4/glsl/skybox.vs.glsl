#version 300 es

void main() {
	// Q3 (HINT) : The cube that the texture is mapped to is centered at the origin, using this information 
	// calculate the correct direction vector in the world coordinate system
	// which is used to sample a color from the cubemap

	// Q3 : Offset your pixel vertex position by the cameraPostion (given to you in world space) 
	// so that the cube is always in front of the camera even with zoom 
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}