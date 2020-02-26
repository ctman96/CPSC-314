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

	// TOTAL INTENSITY
	// calculate light intensity
	float lightIntensity = dot(toLight, norm);

    vec4 resultingColor = vec4(0.0,0.0,0.0,0.0);

    vec4 black = vec4(0.0, 0.0, 0.0, 1.0);

    // Change resultingColor based on lightIntensity
    // Use gl_FragCoord and mod() to find 
    // which fragments should be shaded dark

    // TR->BL lines
    if (lightIntensity < 0.4) {
    	// Closer together at lower intensity
    	if (mod(gl_FragCoord.x - gl_FragCoord.y, 5.0) == 0.0) {
    		resultingColor = black;
    	}
    } else if (lightIntensity < 0.8) {
    	if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0) {
    		resultingColor = black;
    	}
    }

    // TL->BR lines
    if (lightIntensity < 0.2) {
    	// Closer together at lower intensity
    	if (mod(gl_FragCoord.x + gl_FragCoord.y, 5.0) == 0.0) {
    		resultingColor = black;
    	}
    } else if (lightIntensity < 0.6) {
    	if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0) {
    		resultingColor = black;
    	}
    } 

   	// change resultingColor to silhouette objects
   	float edge = dot(norm, toV);
	if (edge < 0.5)
		resultingColor = black;

	out_FragColor = resultingColor;
}
