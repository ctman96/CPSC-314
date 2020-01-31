#version 300 es

// NOTE: YOU DO NOT NEED TO MODIFY THIS SHADER
// If you are curious however, feel free to read the comments and make creative changes

precision highp float;
precision highp int;

// While this uses the 'out' classifier it is not in fact a shared variable,
// what 'out' tells us is that the following variable will be output from the shader it is used in,
// for vertex shaders we may output shared variables,
// for fragment shaders we always output fragment colors
out vec4 out_FragColor; 

// Textures are passed in as uniforms
uniform sampler2D colorMap;

// Texture coordinates are used to index into textures and read color information,
// it is standard practice to use shared variables to interpolate these coordinates between vertices,
// below we can see the shared variable we passed from the vertex shader using the 'in' classifier
in vec2 vcsTexcoord;

void main() {

    // Get the texture color information of the magic circle using the texture() lookup function
	vec4 color = texture(colorMap, vcsTexcoord);

	// Since we want transparency in our final result given that our texture source is a .PNG, 
	// we discard all fragments with an alpha of less than 0.5 to achieve this effect
	if (color.a < 0.5) discard;

	// Set final rendered color
    out_FragColor = vec4(color);
}