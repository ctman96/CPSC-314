#version 300 es

out vec3 vcsNormal;
out vec3 vcsPosition;
out vec3 vcsCamera;

uniform vec3 camPosition;

void main() {
	// viewing coordinate system
	vcsNormal = normalMatrix * normal;
	vcsPosition = vec3(modelViewMatrix * vec4(position, 1.0));
	vcsCamera = vec3(viewMatrix * vec4(-camPosition, 0.0));

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
