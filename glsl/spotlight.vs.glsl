#version 300 es

precision highp float;

uniform vec3 spotlightPosition;
uniform vec3 spotDirectPosition;

out vec3 vLight;
out vec3 vSpotlight;

void main() {

	vec3 spotlightDirection = normalize(spotDirectPosition - spotlightPosition);
	vec3 lightDirection = normalize(vec3(modelMatrix * vec4(position, 1.0)) - spotlightPosition);
	vLight = lightDirection;
	vSpotlight = spotlightDirection;

 	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}