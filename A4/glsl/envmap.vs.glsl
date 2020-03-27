#version 300 es

uniform vec3 camPosition;

out vec3 vcsNormal;
out vec3 vcsPosition;

void main() {
	// viewing coordinate system
	vcsNormal = mat3(transpose(inverse(modelMatrix))) * normal; // EXPL: Convert normal into world space
	vcsPosition = vec3(modelMatrix * vec4(position, 1.0)) - camPosition; // EXPL: Position  in world space

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
