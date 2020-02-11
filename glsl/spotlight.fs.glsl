#version 300 es

precision highp float;
precision highp int;

out vec4 out_FragColor;

void main() {
	// TODO: PART 1D

	float spotExponent = 5.0;
	
	vec3 SpotColor = vec3(1.0, 1.0, 0.0);
	
	out_FragColor = vec4(SpotColor, 1.0);
}