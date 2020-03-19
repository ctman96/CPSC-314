#version 300 es

out vec3 vcsNormal;
out vec3 vcsPosition;

void main() {
	// viewing coordinate system
	vcsNormal = mat3(transpose(inverse(modelMatrix))) * normal; // Normal in world frame
	vcsPosition = vec3(modelMatrix * vec4(position, 1.0)); // Position in world frame

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
