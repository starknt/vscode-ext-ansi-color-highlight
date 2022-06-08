export function runStrategy(regexs: RegExp[], text: string): RegExpExecArray | null {
    for(const regex of regexs) {
        const match = regex.exec(text);

        if(match) {return match;};
    }

    return null;
}