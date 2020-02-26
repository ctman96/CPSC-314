#version 300 es

uniform vec3 offset;
uniform bool magicActive;
uniform vec3 magicPosition;

out vec4 out_FragColor;

void main() {

	// TODO 

	vec4 color = vec4(1.0, 0.0, 0.0, 1.0);
	if (!magicActive) {
		discard;
	}

	out_FragColor = color;
}