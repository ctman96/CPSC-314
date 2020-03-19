#version 300 es

in vec3 vcsNormal;
in vec3 vcsPosition;

out vec4 out_FragColor;

uniform samplerCube skybox;
uniform vec3 camPosition;

void main( void ) {

  	// Q4 : Calculate the vector that can be used to sample from the cubemap
  	vec3 V = normalize(vcsPosition - camPosition);
	vec3 reflected = reflect(V, normalize(vcsNormal));
	vec4 texColor0 = texture(skybox, reflected);

 	out_FragColor = vec4(texColor0.rgb, 1.0);
}
