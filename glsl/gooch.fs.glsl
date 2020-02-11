#version 300 es

precision highp float;

out vec4 out_FragColor;

void main() {

	//TOTAL INTENSITY
	//TODO PART 1F: calculate light intensity
	float lightIntensity = 0.0;

    vec4 resultingColor = vec4(0.0,0.0,0.0,0.0);

	//TODO PART 1F: compute cool and warm colors

   	//TODO PART 1F: change resultingColor based on lightIntensity 
	//              as an interpolation of cool and warm colors

   	//TODO PART 1F: change resultingColor to silhouette objects

	out_FragColor = resultingColor;
}
