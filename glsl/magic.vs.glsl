#version 300 es

// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 magicPosition;

// The shared variable is initialized in the vertex shader and attached to the current vertex being processed,
// such that each vertex is given a shared variable and when passed to the fragment shader,
// these values are interpolated between vertices and across fragments,
// below we can see the shared variable is initialized in the vertex shader using the 'out' classifier
out vec2 vcsTexcoord;

void main() {

  	// We now give the shared variable its value,
  	// this specific one handles texture (uv) coordinates which will be covered later in the course
    vcsTexcoord = uv;

    // Multiply each vertex by the model matrix to get the world position of each vertex, 
    // then add the magic position translation,
    // then multiply by the view matrix to get the position in the camera coordinate system, 
    // and finally the projection matrix to get final vertex position
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    worldPosition += vec4(magicPosition, 0.0);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;

}