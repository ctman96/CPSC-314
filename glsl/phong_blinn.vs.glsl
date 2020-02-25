#version 300 es

uniform vec3 lightDirection;

out vec3 vNormal;
out vec3 vPosition;
out vec3 vLight;

void main() {

    // transform normal from World to Eye frame
    vNormal = vec3(normalMatrix * normal);
    // transform position vector to Eye frame
    vPosition = vec3(modelViewMatrix * vec4(position, 1.0));
    // transform light vector to Eye frame
    vLight = vec3(viewMatrix * vec4(lightDirection, 0.0));
   
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}