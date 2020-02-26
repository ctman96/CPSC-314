#version 300 es

precision highp float;
precision highp int;

uniform float spotlightCutoff;

in vec3 vLight;
in vec3 vSpotlight;

out vec4 out_FragColor;

void main() {

	vec3 toLight = normalize(vLight);
	vec3 toSpotLight = normalize(vSpotlight);

	float spotExponent = 5.0;
	float intensity = 0.0;

	// Get cos of angle:
	float c = dot(toSpotLight, toLight);

	// If point is within the spotlight cone
	if ( acos(c) < radians(spotlightCutoff) ) {
		intensity = pow(c, spotExponent);
	}
	
	vec3 SpotColor = intensity * vec3(1.0, 1.0, 0.0);
	
	out_FragColor = vec4(SpotColor, 1.0);
}