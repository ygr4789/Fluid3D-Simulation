const vec4 color = vec4(1, 1, 1, 1);

void main() {

  vec3 N;
  N.xy = gl_PointCoord*2.0 - 1.0;
  float r2 = dot(N.xy, N.xy);
  if(r2 > 1.0) discard;
  N.z = -sqrt(1.0 - r2);
  
  gl_FragColor = color;
}