#version 300 es

precision highp float;

out vec4 out_FragColor;

void main() {
	//TODO: PART 1A

	//AMBIENT
	vec3 light_AMB = vec3(0.0, 0.0, 0.0);

	//DIFFUSE
	vec3 light_DFF = vec3(0.0, 0.0, 0.0);

	//SPECULAR
	vec3 light_SPC = vec3(0.0, 0.0, 0.0);

	//TOTAL
	vec3 TOTAL = light_AMB + light_DFF + light_SPC;
	out_FragColor = vec4(TOTAL, 1.0);
}