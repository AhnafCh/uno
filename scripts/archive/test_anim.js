function test() {
  const N = 4;
  for(let i=0; i<N; i++) {
    const startAngle = Math.PI * 1.15;
    const endAngle = -Math.PI * 0.15;
    const angle = startAngle - (i / (N - 1)) * (startAngle - endAngle);
    
    // Wider oval
    const top = 40 - Math.sin(angle) * 35; // %
    const left = 50 + Math.cos(angle) * 45; // %
    console.log(`i=${i} angle=${angle} top=${top} left=${left}`);
  }
}
test();
