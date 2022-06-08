import { makeRGB } from "../color";
import { ColorRange } from "../types";
import { runStrategy } from "./strategy";

const ANSI_COLOR_REGEX =/\\x1b\[38;2;(?<r>\d+;)(?<g>\d+;)(?<b>\d+;?)(\d+;?)?m/ig;
const UNICODE_ANSI_REGEX =/\\u001b\[38;2;(?<r>\d+;)(?<g>\d+;)(?<b>\d+;?)(\d+;?)?m/ig;

export function findAnsi24Color(text: string): ColorRange[] {
    const result: ColorRange[] = [];

    let match: RegExpExecArray | null;

    while((match = runStrategy([ANSI_COLOR_REGEX, UNICODE_ANSI_REGEX], text)) !== null) {
        const ansiStr = match[0].toLowerCase();
        const start = match.index;
        const end = start + ansiStr.length;
        const r = parseInt(match.groups!.r, 10);
        const g = parseInt(match.groups!.g, 10);
        const b = parseInt(match.groups!.b, 10);

        const color = makeRGB(r, g, b);

        result.push({
            color,
            start,
            end,
        });
    }


    return result;
}