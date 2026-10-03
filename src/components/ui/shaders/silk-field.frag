// React Bits Silk, David Haz. MIT + Commons Clause; see ../licenses/react-bits-LICENSE.md.
// https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Backgrounds/Silk/Silk.tsx
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_color;
uniform float u_opacity;
uniform float u_scale;
uniform float u_rotation;
uniform float u_noise;

float noise(vec2 coordinate) {
  const float e = 2.718281828459045;
  vec2 r = e * sin(e * coordinate);
  return fract(r.x * r.y * (1.0 + coordinate.x));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float c = cos(u_rotation);
  float s = sin(u_rotation);
  vec2 tex = mat2(c, -s, s, c) * uv * u_scale * u_scale;
  tex.y += 0.03 * sin(8.0 * tex.x - u_time);
  float pattern = 0.6 + 0.4 * sin(
    5.0 * (tex.x + tex.y + cos(3.0 * tex.x + 5.0 * tex.y) + 0.02 * u_time)
    + sin(20.0 * (tex.x + tex.y - 0.1 * u_time))
  );
  float grain = noise(gl_FragCoord.xy) / 15.0 * u_noise;
  vec3 color = clamp(u_color * pattern - vec3(grain), 0.0, 1.0);
  // Composite the silver folds onto black directly, preserving a reliable opaque canvas.
  gl_FragColor = vec4(color * u_opacity, 1.0);
}
