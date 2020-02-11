#version 300 es

precision highp float;

out vec4 out_FragColor;

void main() {
	
	//TOTAL INTENSITY
	//TODO PART 1E: calculate light intensity (ambient+diffuse+speculars' intensity term)
	float lightIntensity = 0.0;

   	vec4 resultingColor = vec4(0.0,0.0,0.0,0.0);

   	//TODO PART 1E: change resultingColor based on lightIntensity (toon shading)

   	//TODO PART 1E: change resultingColor to silhouette objects

	out_FragColor = resultingColor;
}
