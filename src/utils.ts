export function getColorHex(color: string) {
  switch (color) {
    case 'red': return '#dc2626';
    case 'blue': return '#2563eb';
    case 'green': return '#16a34a';
    case 'yellow': return '#eab308';
    default: return '#171717';
  }
}
