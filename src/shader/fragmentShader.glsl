// varying float depth;
const vec3 lightDir = vec3(0.8, -0.53, -0.27);
const vec3 color = vec3(1.0, 1.0, 1.0);

void main() {

  vec3 N;
  N.xy = gl_PointCoord*2.0 - 1.0;
  float r2 = dot(N.xy, N.xy);
  if(r2 > 1.0) discard;
  N.z = -sqrt(1.0 - r2);
  
  // float diffuse = max(0.0, dot(N, lightDir));
  // gl_FragColor = vec4(diffuse * color, 1.0);
  gl_FragColor = vec4(color, 1.0);
}