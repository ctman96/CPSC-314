#version 300 es

out vec4 out_FragColor;

in vec3 vcsNormal;
in vec3 vcsPosition;
in vec2 texcoord;

uniform vec3 ambientColor;
uniform vec3 lightColor;
uniform vec3 lightDirection;

uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;

// List textures are passed in as uniforms
uniform sampler2D colorMap;
uniform sampler2D normalMap;

void main() {
	// Q2: Normal from normal map? 
    vec3 n = texture(normalMap, texcoord).rgb;
    n = normalize(n * 2.0 - 1.0); /* https://learnopengl.com/Advanced-Lighting/Normal-Mapping */
    // Doesn't work, think need to calculate tangent/blitangent

	// SOME PRE-CALCS FOR BLINN PHONG LIGHTING
	vec3 N = normalize(vcsNormal);
	vec3 L = normalize(vec3(viewMatrix * vec4(lightDirection, 0.0)));
	vec3 V = -normalize(vcsPosition);
	vec3 H =  normalize(V + L);

	//AMBIENT
	vec3 light_AMB = ambientColor * kAmbient;

	//DIFFUSE
	vec3 diffuse = kDiffuse * lightColor;
	vec3 light_DFF = diffuse * max(0.0, dot(N, L));

	//SPECULAR
	float specular = pow(max(0.0, dot(H, N)), shininess);
	vec3 light_SPC = specular * lightColor * kSpecular;

	// Q2 : Multiply the diffuse color with the color sampled from the texture
	// WRITE YOUR CODE HERE
	light_DFF = light_DFF * texture(colorMap, texcoord).rgb;

	//TOTAL
	vec3 TOTAL = light_AMB + light_DFF + light_SPC;

	out_FragColor = vec4(TOTAL, 1.0);
}
