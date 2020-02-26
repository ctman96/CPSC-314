#version 300 es

precision highp float;

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
	// calculate light intensity (ambient+diffuse+speculars' intensity term)
	float lightIntensity = dot(toLight, norm);

   	vec4 resultingColor = vec4(0.0,0.0,0.0,0.0);

   	// change resultingColor based on lightIntensity (toon shading)
   	if (lightIntensity > 0.5) {
   		resultingColor = vec4(0.5,0.75,0.5,1.0);
   	} else if (lightIntensity > 0.0) {
   		resultingColor = vec4(0.25,0.5,0.25,1.0);
   	} else {
   		resultingColor = vec4(0.125,0.25,0.125,1.0);
   	}

   	// change resultingColor to silhouette objects
   	float edge = abs(dot(norm, toV));
	if (edge < 0.4)
		resultingColor = vec4(0.0, 0.0, 0.0, 1.0);

	out_FragColor = resultingColor;
}
