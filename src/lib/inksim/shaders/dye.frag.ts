import glsl from "./glsl";

// Re-tinted for Garyfalia: the dye field is a density (0..1); composite it as
// navy ink over a marble ground so the sim stays on-brand (light hero).
export default glsl`

precision highp float;

in vec2 v_texCoord;

uniform sampler2D u_dye;

out vec4 outColor;

const vec3 MARBLE = vec3(0.961, 0.953, 0.933);
const vec3 NAVY = vec3(0.086, 0.149, 0.247);

void main() {
  float d = clamp(texture(u_dye, v_texCoord).r, 0.0, 1.0);
  d = pow(d, 0.82);
  outColor = vec4(mix(MARBLE, NAVY, d), 1.0);
}

`;
