import type { ColorRange } from '../types'
import { makeRGB } from '../color'
import { runStrategy } from './strategy'

const ANSI_COLOR_REGEX = /\\x1b\[38;2;(?<r>\d+;)(?<g>\d+;)(?<b>\d+;?)(\d+;?)?m/giu
const UNICODE_ANSI_REGEX = /\\u001b\[38;2;(?<r>\d+;)(?<g>\d+;)(?<b>\d+;?)(\d+;?)?m/giu

export function findAnsi24Color(text: string): ColorRange[] {
  let match = runStrategy([ANSI_COLOR_REGEX, UNICODE_ANSI_REGEX], text)
  const result: ColorRange[] = []

  while (match !== null) {
    const ansiStr = match[0].toLowerCase()
    const start = match.index
    const end = start + ansiStr.length
    const r = Number.parseInt(match.groups!.r, 10)
    const g = Number.parseInt(match.groups!.g, 10)
    const b = Number.parseInt(match.groups!.b, 10)

    const color = makeRGB(r, g, b)

    result.push({
      color,
      start,
      end,
    })

    match = runStrategy([ANSI_COLOR_REGEX, UNICODE_ANSI_REGEX], text)
  }

  return result
}
