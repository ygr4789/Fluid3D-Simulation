attribute float radius;
uniform float scale;

void main() {

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  gl_PointSize = radius * (scale / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}