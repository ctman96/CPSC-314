#version 300 es

precision highp float;

uniform vec3 ambientColor;
uniform vec3 lightColor;
uniform vec3 lightDirection;

uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;

in vec3 vNormal;
in vec3 vPosition;
in vec3 vLight;

out vec4 out_FragColor;

void main() {

	// Mostly-standard shiny material from 14.3
	vec3 toLight = normalize(vLight);	// Already have light vector
	vec3 toV = -normalize(vPosition);
	vec3 h =  normalize(toV + toLight);
	vec3 norm = normalize(vNormal);

	float specular = pow(max(0.0, dot(h, norm)), shininess);
	float diffuse = max(0.0, dot(norm, toLight));


	//AMBIENT
	vec3 light_AMB = ambientColor * kAmbient;

	//DIFFUSE
	vec3 light_DFF = diffuse * lightColor * kDiffuse;

	//SPECULAR
	vec3 light_SPC = specular * lightColor * kSpecular;

	//TOTAL
	vec3 TOTAL = light_AMB + light_DFF + light_SPC;
	out_FragColor = vec4(TOTAL, 1.0);
}