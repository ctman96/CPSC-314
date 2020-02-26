#version 300 es

uniform vec3 origin;

out vec2 vcsTexcoord;

void main()
{
	// TODO maybe try to have alwyas facing camera like doom?
	vcsTexcoord = uv;
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
}
