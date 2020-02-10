#version 300 es

uniform vec3 offset;
uniform bool magicActive;
uniform vec3 magicPosition;

void main() {

  vec3 lz = normalize(offset - magicPosition);          // Forward vector
  vec3 lx = normalize(cross(vec3(0.0, 1.0, 0.0), lz));  // Right vector
  vec3 ly = cross(lz, lx);                              // Up vector
  mat4 lookAt = mat4( lx, 0.0,
                      ly, 0.0,
                      lz, 0.0,
                      offset, 1.0);

  // 90 degree rotation to look forwards: cos=0, sin=1
  mat4 R2 = mat4(1.0, 0.0, 0.0, 0.0, 
                0.0, 0.0, -1.0, 0.0, 
                0.0, 1.0, 0.0, 0.0,  
                0.0, 0.0, 0.0, 1.0);

  mat4 S = mat4(1.0, 0.0, 0.0, 0.0, 
                0.0, distance(offset, magicPosition), 0.0, 0.0, 
                0.0, 0.0, 1.0, 0.0,  
                0.0, 0.0, 0.0, 1.0);
	
	gl_Position =  projectionMatrix * viewMatrix * lookAt * R2 * S * vec4(position, 1.0);
}