#shader vert
attribute vec4 pos;
attribute vec2 coord;
varying vec2 v_coord;
void main () {
  gl_Position = pos;
  v_coord = coord;
}

#shader frag
precision mediump float;
uniform vec4 u_Color;
uniform sampler2D u_Texture;
varying vec2 v_coord;
void main () {
  gl_FragColor = texture2D(u_Texture, v_coord);
}