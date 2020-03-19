#version 300 es

out vec3 vcsPosition;
out vec3 vcsNormal;

out vec2 texcoord;

void main() {
	// write here the required lighting calculations for blinn phong 
    vcsNormal = normalMatrix * normal;
	vcsPosition = vec3(modelViewMatrix * vec4(position, 1.0));

    // Q2 : Assign texture coordinates to the texCoord variable. Remember the texture for Shay D Pixel(our wizard)
    // is flipped along the vertical axis. 
    // WRITE YOUR CODE HERE
    texcoord = vec2(uv.x, 1.0-uv.y);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

 }