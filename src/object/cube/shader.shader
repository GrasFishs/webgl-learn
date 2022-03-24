#shader vert
attribute vec4 pos;
attribute vec3 normal;
attribute vec2 coord;
varying vec2 v_coord;
varying vec3 v_normal;
varying vec3 v_fragPos;

uniform mat4 p;
uniform mat4 v;
uniform mat4 m;

void main () {
  gl_Position = p * v * m * pos;
  v_coord = coord;
  v_normal = normal;
  v_fragPos = vec3(m * pos);
}

#shader frag
precision mediump float;
uniform vec4 u_Color;
uniform vec3 u_lightPos;
uniform vec4 u_lightColor;
uniform mat4 u_normalMatrix;
uniform int u_light;
varying vec2 v_coord;
varying vec3 v_normal;
varying vec3 v_fragPos;

vec3 getAmbient(float strenth) {
  return strenth * u_lightColor.xyz;
}

vec3 getDiffuse () {
  vec3 lightDir = normalize(u_lightPos);
  vec3 norm = normalize((u_normalMatrix * vec4(v_normal, 1)).xyz);
  float diff = max(dot(norm, lightDir), 0.0);
  return diff * u_lightColor.xyz;
}

void main () {
  vec3 diffuse = getDiffuse();

  float strenth = 0.1;
  vec3 ambient = getAmbient(strenth);
  vec4 color = vec4((v_normal + 1.0) / 2.0, 1);
  vec4 lighting = vec4((ambient + diffuse), 1);

  if (u_Color.xyz != vec3(0, 0, 0)) {
    color = lighting * u_Color;
  } else {
    color *= lighting;
  }
  if (u_light == 1) {
    color = u_Color;
  }
  gl_FragColor =  color;
}