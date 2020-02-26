#version 300 es

// Shared variable passed to the fragment shader
out vec3 color;

// HINT: YOU WILL NEED TWO UNIFORMS
uniform vec3 offset;
uniform vec3 magicPosition;

#define MAX_EYE_DEPTH 0.05
#define M_PI 3.1415926535897932384626433832795

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



  // 1.a Translation to offset position
  mat4 T = mat4(1.0, 0.0, 0.0, 0.0, 
                0.0, 1.0, 0.0, 0.0, 
                0.0, 0.0, 1.0, 0.0,  
                offset, 1.0);

  // 1.b -90 degree rotation to look forwards:
  float r = -M_PI/2.0;
  mat4 R = mat4(1.0, 0.0, 0.0, 0.0, 
                0.0, cos(r), -sin(r), 0.0, 
                0.0, sin(r), cos(r), 0.0,  
                0.0, 0.0, 0.0, 1.0);

  vec3 up = vec3(0.0,1.0,0.0);

  vec3 lz = normalize(offset - magicPosition);          // Forward vector
  vec3 lx = normalize(cross(up, lz));                   // Right vector
  vec3 ly = cross(lz, lx);                              // Up vector
  mat4 lookAt = mat4( lx, 0.0,
                      ly, 0.0,
                      lz, 0.0,
                      0.0,0.0,0.0, 1.0);

  // lookAt was originally off by 180 degrees. Feel like it maybe has to do with 'up', but couldn't figure out. So manually adjust the 180 degrees
  float r2 = M_PI;
  lookAt = lookAt * mat4( 1.0, 0.0, 0.0, 0.0, 
                          0.0, cos(r2), -sin(r2), 0.0, 
                          0.0, sin(r2), cos(r2), 0.0,  
                          0.0, 0.0, 0.0, 1.0);


  gl_Position = projectionMatrix * viewMatrix * T * lookAt * R * S * vec4(position, 1.0);
}
