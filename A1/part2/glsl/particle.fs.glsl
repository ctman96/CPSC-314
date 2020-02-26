#version 300 es

precision highp float;
precision highp int;

in vec2 vcsTexcoord;

uniform sampler2D colorMap;
uniform vec3 origin;
uniform vec3 pos;

out vec4 out_FragColor; 

void main()
{
	// alpha based on dist from origin
	vec4 color = texture(colorMap, vcsTexcoord);
	color.a = color.a  - ((pos.y - origin.y) / 10.0);
	out_FragColor = vec4(0.5, 0.0,0.0, color.a );
}