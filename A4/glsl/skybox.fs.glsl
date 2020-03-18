#version 300 es

out vec4 out_FragColor;

// The cubmap texture is of type SamplerCube
uniform samplerCube skybox;

in vec3 texDir;

void main() {

	// HINT : Sample the texture from the samplerCube object, rememeber that cubeMaps are sampled 
	// using a direction vector that you calculated in the vertex shader 
	
	out_FragColor = texture(skybox, texDir);
}
