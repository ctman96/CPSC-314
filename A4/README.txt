Name: Cody Newman
Student Number: 35833145
CWL: ctman96

Creative:
	- None 




Summary:

Note: Tagged all my explanation comments with "// EXPL: <Comment Here>" so should be easy to find with a ctrl+f if necessary

1. Basic Texture Mapping
- A4.js:
	- Just set the material properties to the provided texture uniforms in 


2. Texture Mapping with ShaderMaterial
- A4.js:
	- Pass in uniforms 
- wizard.vs.glsl:
	- Get texcoords by flipping uv.y coordinate
- wizard.fs.glsl:
	- Finish Blinn Phong using uniforms 
	- Sample color from texture using texcoords and multiply diffuse color


3. Skybox
- A4.js:
	- Load in the cubemap sides according to three.js docs
	- Pass in uniforms to material
	- Create skyboxGeometry
	- Set skybox to use skyboxGeometry and skyboxMaterial
- skybox.vs.glsl:
	- Get direction vetor by translating position into worldframe
	- Offset pixel position by offsetting by camPosition
- skybox.fs.glsl:
	- Sample texture using the direction vector


4. Shiny Objects
- A4.js:
	- Pass in uniforms
- envmap.vs.glsl:
	- convert vcsNormal/vcsPosition to the world frame
- envmap.fs.glsl:
	- Reflect vcsPosition using vcsNormal
	- Sample texture using reflected vector


5. Shadow Mapping
- A4.js:
	- Set light to cast shadow
	- Set camera zoom to 0.5 (so view frustum includes full shadow)
	- Add CameraHelper for shadow camera for debugging
	- Set terrain to receive shadows