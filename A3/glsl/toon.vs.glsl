#version 300 es

uniform vec3 lightDirection;

out vec3 vNormal;
out vec3 vPosition;
out vec3 vLight;

void main() {

   	vNormal = vec3(normalMatrix * normal);
	vPosition = vec3(modelViewMatrix * vec4(position, 1.0));
	vLight = vec3(viewMatrix * vec4(lightDirection, 0.0));
   
   	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}