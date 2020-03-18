#version 300 es

in vec3 vcsNormal;
in vec3 vcsPosition;
in vec3 vcsCamera;

out vec4 out_FragColor;

uniform samplerCube skybox;

vec3 reflect(vec3 w, vec3 n){
	return-w+n*(dot(w, n)*2.0);
}

void main( void ) {

  	// Q4 : Calculate the vector that can be used to sample from the cubemap
  	vec3 normal = normalize(vcsNormal);
	vec3 reflected = reflect(normalize(-vcsPosition), normal);
	vec4 texColor0 = texture(skybox, reflected);

 	out_FragColor = vec4(texColor0.rgb, 1.0);
}
