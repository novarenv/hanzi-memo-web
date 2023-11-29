const tones: {[key: string]: string[]} = {
    a: ['a', 'ā', 'á', 'ǎ', 'à', 'a'],
    A: ['A', 'Ā', 'Á', 'Ǎ', 'À', 'A'],
    e: ['e', 'ē', 'é', 'ě', 'è', 'e'],
    E: ['E', 'Ē', 'É', 'Ě', 'È', 'E'],
    i: ['i', 'ī', 'í', 'ǐ', 'ì', 'i'],
    I: ['I', 'Ī', 'Í', 'Ǐ', 'Ì', 'I'],
    o: ['o', 'ō', 'ó', 'ǒ', 'ò', 'o'],
    O: ['O', 'Ō', 'Ó', 'Ǒ', 'Ò', 'O'],
    u: ['u', 'ū', 'ú', 'ǔ', 'ù', 'u'],
    U: ['U', 'Ū', 'Ú', 'Ǔ', 'Ù', 'U'],
    v: ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
    V: ['Ü', 'Ǖ', 'Ǘ', 'Ǚ', 'Ǜ', 'Ü'],
}
export function mark(word: string, toneNumber: number) {
    if (toneNumber === 5) {
        return word
    }

    // Check for syllables in priority order
    if (word.includes('a')) {
        return word.replace('a', tones.a[toneNumber])
    } else if (word.includes('A')) {
        return word.replace('A', tones.A[toneNumber])
    } else if (word.includes('e')) {
        return word.replace('e', tones.e[toneNumber])
    } else if (word.includes('E')) {
        return word.replace('E', tones.E[toneNumber])
    } else if (word.includes('o')) {
        return word.replace('o', tones.o[toneNumber])
    } else if (word.includes('O')) {
        return word.replace('O', tones.O[toneNumber])
    } else {
        // Mark last syllable
        for (let i = word.length - 1; i >= 0; i--) {
            const index = 'iouvIOUV'.indexOf(word[i])
            if (index !== -1) {
                // last syllable found
                return word.replace(word[i], tones[word[i]][toneNumber])
            }
        }
        // No syllables found
        return word
    }
}

export function parsePinyin(pinyin: string): [string, number] {
    const original: [string, number] = [pinyin, 5];
    if(pinyin.length == 1){
        // For possible edge cases like:
        // B站: B zhan4, or T恤: T xu4
        return original;
    }

    const re = /[a-zA-Z]+\d/;
    if(!pinyin.match(re)){
        // catching non pinyin
        return original;
    }

    return [pinyin.slice(0, -1), parseInt(pinyin.slice(-1))]
}

