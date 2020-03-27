#version 300 es

in vec3 vcsNormal;
in vec3 vcsPosition;

out vec4 out_FragColor;

uniform samplerCube skybox;

void main( void ) {

  	// Q4 : Calculate the vector that can be used to sample from the cubemap
  	vec3 V = normalize(vcsPosition);
	vec3 reflected = reflect(V, normalize(vcsNormal)); // EXPL: Calculate the reflection of the vcsPosition world space vector, using the world space normal vcsNormal
	vec4 texColor0 = texture(skybox, reflected); // EXPL: Use this reflected direction to sample from the skybox

 	out_FragColor = vec4(texColor0.rgb, 1.0);
}
