#version 300 es

precision highp float;

uniform vec3 ambientColor;
uniform vec3 lightColor;
uniform vec3 lightDirection;
uniform vec3 lightFogColor;

uniform float fogDensity;
uniform float kAmbient;
uniform float kDiffuse;

in vec3 vNormal;
in vec3 vPosition;
in vec3 vLight;

out vec4 out_FragColor;

void main() {

	vec3 toLight = normalize(vLight);
	vec3 toV = -normalize(vPosition);
	vec3 norm = normalize(vNormal);

	float diffuse = max(0.0, dot(norm, toLight));

	float distance = length(vPosition);

	float fogLevel = 1.0 / exp(distance * fogDensity);


	//AMBIENT
	vec3 light_AMB = ambientColor * kAmbient;

	//DIFFUSE
	vec3 light_DFF = diffuse * lightColor * kDiffuse;

	// Mix by fogLevel
	vec3 TOTAL = mix(lightFogColor, light_AMB + light_DFF, fogLevel);

	out_FragColor = vec4(TOTAL, 1.0);
}
