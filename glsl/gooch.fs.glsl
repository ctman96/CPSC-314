#version 300 es

precision highp float;

uniform float goochDiffuse;
uniform float goochShininess;
uniform float goochBlue;
uniform float goochAlpha;
uniform float goochYellow;
uniform float goochBeta;


in vec3 vNormal;
in vec3 vPosition;
in vec3 vLight;

out vec4 out_FragColor;

void main() {

	vec3 toLight = normalize(vLight);
	vec3 toV = -normalize(vPosition);
	vec3 h =  normalize(toV + toLight);
	vec3 norm = normalize(vNormal);

	//TOTAL INTENSITY
	// calculate light intensity
	float lightIntensity = dot(toLight, norm);

    vec4 resultingColor = vec4(0.0,0.0,0.0,0.0);

	// compute cool and warm colors
	vec3 coolColor = vec3(0.0,0.0,goochBlue);
    vec3 warmColor = vec3(goochYellow,goochYellow,0.0);
	vec3 kcool = coolColor + goochAlpha * goochDiffuse;
	vec3 kwarm = warmColor + goochBeta 	* goochDiffuse;

   	// change resultingColor based on lightIntensity 
	// as an interpolation of cool and warm colors
	float interp = (1.0 + lightIntensity) / 2.0;
	vec3 color = (interp * kcool) + ((1.0-interp) * kwarm);
	resultingColor = vec4(color, 1.0);

   	// change resultingColor to silhouette objects
   	float edge = abs(dot(norm, toV));
	if (edge < 0.4)
		resultingColor = vec4(0.0, 0.0, 0.0, 1.0);

	out_FragColor = resultingColor;
}
