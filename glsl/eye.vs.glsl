#version 300 es

// Shared variable passed to the fragment shader
out vec3 color;

// HINT: YOU WILL NEED TWO UNIFORMS

#define MAX_EYE_DEPTH 0.05

void main() {
  // Simple way to color the pupil where there is a concavity in the sphere
  float d = min(1.0 - length(position), MAX_EYE_DEPTH);
  color = mix(vec3(1.0), vec3(0.0), d * 1.0 / MAX_EYE_DEPTH);

  mat4 S = mat4(0.5);
  S[3][3] = 1.0;

  // YOUR CODE STARTS HERE: translate and rotate eyes corresponding to the movement of magic circle 

  // HINT: ROTATE THE EYES FIRST TO FACE FORWARD
  // HINT: LOOKAT MATRIX WILL BE HELPFUL
  // HINT: ORDER OF MULTIPLICATION WILL BE IMPORTANT

  // Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
  gl_Position = projectionMatrix * viewMatrix * S * vec4(position, 1.0);
}
