#version 300 es

precision highp float;

uniform vec3 ambientColor;
uniform vec3 lightColor;
uniform vec3 lightDirection;
uniform vec3 tangentDirection;

uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;

in vec3 vNormal;
in vec3 vPosition;
in vec3 vLight;

out vec4 out_FragColor;

void main() {
	
	vec3 toLight = normalize(vLight);	// Already have light vector
	vec3 toV = -normalize(vPosition);
	vec3 h =  normalize(toV + toLight);
	vec3 norm = normalize(vNormal);

	vec3 vTangent3 = normalize(cross(vNormal, tangentDirection));

	float nl = dot(norm, toLight);
	float dif = max(0.0,0.75*nl+0.25);
	float v = dot(vTangent3, h);
	v = pow(1.0 - v*v, shininess);

	float diffuse = max(0.0, dot(norm, toLight));

	//AMBIENT
	vec3 light_AMB = ambientColor * kAmbient;

	//DIFFUSE
	vec3 light_DFF = diffuse * lightColor * kDiffuse;

	//SPECULAR
	vec3 light_SPC = lightColor * dif + kSpecular * v; // TODO: This doesn't look right

	//TOTAL
	vec3 TOTAL = light_AMB + light_DFF + light_SPC;
	out_FragColor = vec4(TOTAL, 1.0);
}
