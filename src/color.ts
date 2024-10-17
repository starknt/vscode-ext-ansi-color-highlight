export function makeRGB(r: number, g: number, b: number): string {
  return `rgb(${r}, ${g}, ${b})`
}

export function makeHex(h: string, m: string, l: string): string {
  return `#${h}${m}${l}`
}
