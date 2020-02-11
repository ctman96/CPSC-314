#version 300 es

precision highp float;

out vec4 out_FragColor;

void main() {
	//TOTAL INTENSITY
	//TODO PART 1G: calculate light intensity
	float lightIntensity = 0.0;

    vec4 resultingColor = vec4(0.0,0.0,0.0,0.0);

    //TODO PART 1G: Change resultingColor based on lightIntensity
    //              Use gl_FragCoord and mod() to find 
    //              which fragments should be shaded dark

   	//TODO PART 1G: change resultingColor to silhouette objects

	out_FragColor = resultingColor;
}
