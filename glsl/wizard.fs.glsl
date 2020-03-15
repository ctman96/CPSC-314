#version 300 es

out vec4 out_FragColor;

in vec3 vcsNormal;

uniform vec3 lightColor;
uniform float kDiffuse;

uniform vec3 lightDirection;

// List textures are passed in as uniforms

void main() {
	// SOME PRE-CALCS FOR BLINN PHONG LIGHTING
	vec3 N = normalize(vcsNormal);
	vec3 L = normalize(vec3(viewMatrix * vec4(lightDirection, 0.0)));

	//AMBIENT

	//DIFFUSE
	vec3 diffuse = kDiffuse * lightColor;
	vec3 light_DFF = diffuse * max(0.0, dot(N, L));

	//SPECULAR

	// Q2 : Multiply the diffuse color with the color sampled from the texture
	// WRITE YOUR CODE HERE

	//TOTAL
	//vec3 TOTAL = light_AMB + light_DFF + light_SPC;

	out_FragColor = vec4(light_DFF, 1.0);
}
