#version 300 es

void main() {

    // TODO: PART 1D

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);
}
