#shader vert
attribute vec4 pos;
attribute vec2 coord;
varying vec2 v_coord;

uniform mat4 u_proj;
uniform mat4 u_view;
uniform mat4 u_model;

void main () {
  gl_Position = u_proj * u_view * u_model * pos;
  v_coord = coord;
}

#shader frag
precision mediump float;
uniform vec4 u_Color;
uniform sampler2D u_Texture;
uniform sampler2D u_Texture2;
varying vec2 v_coord;
void main () {
  vec4 tex = mix(texture2D(u_Texture2, v_coord), texture2D(u_Texture, v_coord), 0.2);
  gl_FragColor = tex;
}