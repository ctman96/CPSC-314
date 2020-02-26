#version 300 es

// Shared variable passed to the fragment shader
varying vec3 color;

out vec3 interpolatedNormal;

uniform mat4 T[2];

#define HIP_HEIGHT 2.8

void main() {

    interpolatedNormal = normal;

    // Procedurally compute weights in the shader
    float weightBone1, weightBone2;

    if (position.y > HIP_HEIGHT + 1.0) {
        weightBone1 = 0.0;
    }
    else if (position.y < HIP_HEIGHT - 1.0) {
        weightBone1 = 1.0;
    }
    else {
        weightBone1 = (HIP_HEIGHT + 1.0 - position.y) / 2.0;
    }

    weightBone2 = 1.0 - weightBone1;

    color = vec3(weightBone2, 0.0, 0.0);


    // translation in the global frame to position the armadillo
    mat4 globalTranslation = mat4(1.0, 0.0, 0.0, 0.0,
                                0.0, 1.0, 0.0, 0.0,
                                0.0, 0.0, 1.0, 0.0, 
                                10.0, 5.0, -10.0, 1.0);
    
    // // WRITE CODE HERE FOR PART 2, Q2 (a)
    // HINT : Linear combination of each T matrix with its respective weight to get the final transformation matrix. 

    // Weighted linear combination transformation matrices
    mat4 TW =  (T[0] * weightBone1) + (T[1] * weightBone2);
    
    gl_Position = projectionMatrix * viewMatrix * globalTranslation * TW * vec4(position, 1.0); // REPLACE ME
        
}
