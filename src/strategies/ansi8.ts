import type { ColorRange } from '../types'
import { makeRGB } from '../color'
import { runStrategy } from './strategy'

const ANSI_COLOR_REGEX = /\\x1b\[38;5;(?<i>\d+;?)(\d+;?)?m/giu
const UNICODE_ANSI_REGEX = /\\u001b\[38;5;(?<i>\d+;?)(\d+;?)?m/giu

const gap = [0, 95, 40, 40, 40, 40]

const ANSI8_COLOR_MAP = {
  0: 'rgb(0, 0, 0)',
  1: 'rgb(128, 0, 0)',
  2: 'rgb(0, 128, 0)',
  3: 'rgb(128, 128, 0)',
  4: 'rgb(0, 0, 128)',
  5: 'rgb(128, 0, 128)',
  6: 'rgb(0, 128, 128)',
  7: 'rgb(192, 192, 192)',
  8: 'rgb(128, 128, 128)',
  9: 'rgb(255, 0, 0)',
  10: 'rgb(0, 255, 0)',
  11: 'rgb(255, 255, 0)',
  12: 'rgb(0, 0, 255)',
  13: 'rgb(255, 0, 255)',
  14: 'rgb(0, 255, 255)',
  15: 'rgb(255, 255, 255)',
} as Record<number, string>

function generation16to232(map: Record<number, string>) {
  let gapIndex = 0
  let basic = 0

  const r = 0
  const g = 0
  const b = 0

  for (let i = 16; i < 232; i++, gapIndex++) {
    if (gapIndex === gap.length) {
      gapIndex = 0
      basic++
      if (basic === 3) {
        basic = 0
      }
    }

    switch (basic) {
      case 0:
        map[i] = makeRGB(r, g, b + gap[gapIndex])
        break
      case 1:
        map[i] = makeRGB(r, g + gap[gapIndex], b)
        break
      case 2:
        map[i] = makeRGB(r + gap[gapIndex], g, b)
        break
      default:
        break
    }
  }
}

function generation232to256(map: Record<number, string>) {
  const basic = 8

  for (let i = 232; i < 256; i++) {
    const color = basic + ((i - 232) * 10)

    map[i] = makeRGB(color, color, color)
  }
}

generation16to232(ANSI8_COLOR_MAP)
generation232to256(ANSI8_COLOR_MAP)

export function findAnsi8Color(text: string): ColorRange[] {
  let match = runStrategy([ANSI_COLOR_REGEX, UNICODE_ANSI_REGEX], text)
  const result: ColorRange[] = []

  while (match !== null) {
    const ansiStr = match[0].toLowerCase()
    const start = match.index
    const end = start + ansiStr.length
    const i = Number.parseInt(match.groups!.i, 10) % 256

    const color = ANSI8_COLOR_MAP[i]

    result.push({
      color,
      start,
      end,
    })

    match = runStrategy([ANSI_COLOR_REGEX, UNICODE_ANSI_REGEX], text)
  }

  return result
}
