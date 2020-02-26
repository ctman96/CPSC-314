#version 300 es

// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 magicPosition;

// HINT: YOU WILL NEED AN ADDITIONAL UNIFORM VARIABLE TO MAKE THE MAGIC CIRCLE DISTORTION
uniform bool magicActive;
uniform float time;

// The shared variable is initialized in the vertex shader and attached to the current vertex being processed,
// such that each vertex is given a shared variable and when passed to the fragment shader,
// these values are interpolated between vertices and across fragments,
// below we can see the shared variable is initialized in the vertex shader using the 'out' classifier
out vec2 vcsTexcoord;

void main() {

  	// We now give the shared variable its value,
  	// this specific one handles texture (uv) coordinates which will be covered later in the course
    vcsTexcoord = uv;

    // HINT: GLSL PROVIDES TRIG FUNCTIONS SIN(), COS(), & TAN()

  	// HINT: BE MINDFUL OF WHICH COORDINATE SYSTEM THE MAGIC CIRCLE'S POSITION IS IN

    // Multiply each vertex by the model matrix to get the world position of each vertex, 
    // then the view matrix to get the position in the camera coordinate system, 
    // and finally the projection matrix to get final vertex position

	vec4 coord = vec4(position, 1.0);

	if (magicActive) {
		float b = 0.002;
		float d = 5.0;
		// Combine two wave distortions, one based on x coordinate and one on y coordinate.
		float ywav = coord.z - abs( sin(b*(1000.0*coord.y + time)) / d );
		float xwav = coord.z - abs( sin(b*(1000.0*coord.x + time)) / d );
        coord.z = xwav + ywav;
    }
	
	// Multiply by a translation matrix to move with magicPosition
    mat4 translation = mat4(1.0, 0.0, 0.0, 0.0, 
					  0.0, 1.0, 0.0, 0.0, 
					  0.0, 0.0, 1.0, 0.0,  
					  magicPosition.x, magicPosition.y, magicPosition.z, 1.0);

    gl_Position = projectionMatrix * viewMatrix * translation * modelMatrix * coord;
}