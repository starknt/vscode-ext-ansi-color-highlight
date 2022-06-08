import { ColorRange } from '../types';
import { runStrategy } from './strategy';

const ANSI_COLOR_REGEX = /\\x1[b|B]\[\d+m/ig;
const ANSI_XTERM_REGEX = /\\x1b\[38;(\d+;)+m/ig;
const UNICODE_ANSI_REGEX = /\\u001b\[\d+m/ig;

const ANSI_COLOR_MAP = {
    '\\x1b[30m': 'rgb(0, 0, 0)',
    '\\x1b[31m': 'rgb(194,54,33)',
    '\\x1b[32m': 'rgb(37,188,36)',
    '\\x1b[33m': 'rgb(173,173,39)',
    '\\x1b[34m': 'rgb(73,46,225)',
    '\\x1b[35m': 'rgb(211,56,211)',
    '\\x1b[36m': 'rgb(51,187,200)',
    '\\x1b[37m': 'rgb(203,204,205)',
    '\\x1b[90m': 'rgb(129,131,131)',
    '\\x1b[91m': 'rgb(252,57,31)',
    '\\x1b[92m': 'rgb(49,231,34)',
    '\\x1b[93m': 'rgb(234,236,35)',
    '\\x1b[94m': 'rgb(88,51,255)',
    '\\x1b[95m': 'rgb(249,53,248)',
    '\\x1b[96m': 'rgb(20,240,240)',
    '\\x1b[97m': 'rgb(233,235,235)',
    '\\x1b[40m': 'rgb(0, 0, 0)',
    '\\x1b[41m': 'rgb(194,54,33)',
    '\\x1b[42m': 'rgb(37,188,36)',
    '\\x1b[43m': 'rgb(173,173,39)',
    '\\x1b[44m': 'rgb(73,46,225)',
    '\\x1b[45m': 'rgb(211,56,211)',
    '\\x1b[46m': 'rgb(51,187,200)',
    '\\x1b[47m': 'rgb(203,204,205)',
    '\\x1b[100m': 'rgb(129,131,131)',
    '\\x1b[101m': 'rgb(252,57,31)',
    '\\x1b[102m': 'rgb(49,231,34)',
    '\\x1b[103m': 'rgb(234,236,35)',
    '\\x1b[104m': 'rgb(88,51,255)',
    '\\x1b[105m': 'rgb(249,53,248)',
    '\\x1b[106m': 'rgb(20,240,240)',
    '\\x1b[107m': 'rgb(233,235,235)',
} as Record<string | number, string>;

const UNICODE_ANSI_COLOR_MAP = {
    '\\u001b[30m': 'rgb(0, 0, 0)',
    '\\u001b[31m': 'rgb(194,54,33)',
    '\\u001b[32m': 'rgb(37,188,36)',
    '\\u001b[33m': 'rgb(173,173,39)',
    '\\u001b[34m': 'rgb(73,46,225)',
    '\\u001b[35m': 'rgb(211,56,211)',
    '\\u001b[36m': 'rgb(51,187,200)',
    '\\u001b[37m': 'rgb(203,204,205)',
    '\\u001b[90m': 'rgb(129,131,131)',
    '\\u001b[91m': 'rgb(252,57,31)',
    '\\u001b[92m': 'rgb(49,231,34)',
    '\\u001b[93m': 'rgb(234,236,35)',
    '\\u001b[94m': 'rgb(88,51,255)',
    '\\u001b[95m': 'rgb(249,53,248)',
    '\\u001b[96m': 'rgb(20,240,240)',
    '\\u001b[97m': 'rgb(233,235,235)',
    '\\u001b[40m': 'rgb(0, 0, 0)',
    '\\u001b[41m': 'rgb(194,54,33)',
    '\\u001b[42m': 'rgb(37,188,36)',
    '\\u001b[43m': 'rgb(173,173,39)',
    '\\u001b[44m': 'rgb(73,46,225)',
    '\\u001b[45m': 'rgb(211,56,211)',
    '\\u001b[46m': 'rgb(51,187,200)',
    '\\u001b[47m': 'rgb(203,204,205)',
    '\\u001b[100m': 'rgb(129,131,131)',
    '\\u001b[101m': 'rgb(252,57,31)',
    '\\u001b[102m': 'rgb(49,231,34)',
    '\\u001b[103m': 'rgb(234,236,35)',
    '\\u001b[104m': 'rgb(88,51,255)',
    '\\u001b[105m': 'rgb(249,53,248)',
    '\\u001b[106m': 'rgb(20,240,240)',
    '\\u001b[107m': 'rgb(233,235,235)',
} as Record<string | number, string>;

export function findAnsi4Color(text: string): ColorRange[] {
    let match = runStrategy([ANSI_COLOR_REGEX, UNICODE_ANSI_REGEX], text);
    const result: ColorRange[] = [];

    while(match !== null) {
        const ansiStr = match[0].toLowerCase();
        const start = match.index;
        const end = start + ansiStr.length;

        result.push({
            color: ANSI_COLOR_MAP[ansiStr] || UNICODE_ANSI_COLOR_MAP[ansiStr],
            start,
            end
        });

        match = runStrategy([ANSI_COLOR_REGEX, UNICODE_ANSI_REGEX], text);
    }

    return result;
}