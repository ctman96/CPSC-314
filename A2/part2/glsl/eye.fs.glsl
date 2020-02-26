#version 300 es

precision highp float;
precision highp int;

// While this uses the 'out' classifier it is not in fact a shared variable,
// what 'out' tells us is that the following variable will be output from the shader it is used in,
// for vertex shaders we may output shared variables,
// for fragment shaders we always output fragment colors
out vec4 out_FragColor;

// Shared variable interpolated across the triangle
in vec3 color;

void main() {
  // Setting final pixel color
  out_FragColor = vec4(color, 1.0);
}
