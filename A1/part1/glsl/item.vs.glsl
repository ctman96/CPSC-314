#version 300 es

// HINT: YOU WILL NEED TO OUTPUT THE CORRECT VARYING (SHARED) VARIABLE
out vec3 interpolatedNormal;

void main() {

	interpolatedNormal = normal;

    // Multiply each vertex by the model matrix to get the world position of each vertex, 
    // then the view matrix to get the position in the camera coordinate system, 
    // and finally the projection matrix to get final vertex position
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}