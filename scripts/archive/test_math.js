const N = 3;
for(let i=0; i<N; i++) {
  const angle = Math.PI - ((i + 1) / (N + 1)) * Math.PI;
  console.log(`i=${i}, angle=${angle}, cos=${Math.cos(angle).toFixed(2)}, sin=${Math.sin(angle).toFixed(2)}`);
}
