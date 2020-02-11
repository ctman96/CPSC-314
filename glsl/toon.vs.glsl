#version 300 es

void main() {

   // TODO: PART 1E
   
   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}