export function hexToRgba(
  hex: string,
  opacity: number,
): string {
  const cleanHex = hex.replace("#", "");

  if (cleanHex.length !== 6) {
    return `rgba(255, 255, 255, ${opacity})`;
  }

  const red = parseInt(cleanHex.slice(0, 2), 16);
  const green = parseInt(cleanHex.slice(2, 4), 16);
  const blue = parseInt(cleanHex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}