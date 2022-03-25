#shader vert
attribute vec4 Position;
attribute vec3 Normal;
attribute vec2 Coord;
varying vec2 v_coord;
varying vec3 v_normal;
varying vec3 v_fragPos;

uniform mat4 p;
uniform mat4 v;
uniform mat4 m;

void main () {
  gl_Position = p * v * m * Position;
  v_coord = Coord;
  v_normal = Normal;
  v_fragPos = vec3(m * Position);
}

#shader frag
precision mediump float;
uniform vec4 u_Color;
uniform vec3 u_lightPos;
uniform vec4 u_lightColor;
uniform mat4 u_normalMatrix;
uniform vec3 u_cameraPos;
uniform int u_light;
uniform int u_useTexture;
uniform sampler2D u_Texture;

varying vec2 v_coord;
varying vec3 v_normal;
varying vec3 v_fragPos;


float pow(float n, int m) {
  float r = 1.0;
  for (int i = 0; i < 256; i++) {
    r *= n;
    if (i >= m) {
      return r;
    }
  }
  return r;
}

vec3 getAmbient(float strenth) {
  return strenth * u_lightColor.xyz;
}

vec3 getDiffuse (vec3 norm) {
  vec3 lightDir = normalize(u_lightPos);
  float diff = max(dot(norm, lightDir), 0.0);
  return diff * u_lightColor.xyz;
}

vec3 getSpecular (float strength, vec3 norm) {
  vec3 viewDir = normalize(u_cameraPos - v_fragPos);
  vec3 reflectDir = reflect(-normalize(u_lightPos), norm);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32);
  return strength * spec * u_lightColor.xyz;
}

void main () {
  vec3 norm = normalize((u_normalMatrix * vec4(v_normal, 1)).xyz);
  vec3 ambient = getAmbient(0.1);
  vec3 diffuse = getDiffuse(norm);
  vec3 specular = getSpecular(0.5, norm);

  vec4 color = vec4((v_normal + 1.0) / 2.0, 1);
  vec4 lighting = vec4((ambient + diffuse + specular), 1);

  if (u_Color.xyz != vec3(0, 0, 0)) {
    color = lighting * u_Color;
  } else {
    color = lighting * color;
  }
  if (u_light == 1) {
    color = u_Color;
  }
  if (u_useTexture == 1) {
    color = lighting * texture2D(u_Texture, v_coord);
  }
  gl_FragColor =  color;
}