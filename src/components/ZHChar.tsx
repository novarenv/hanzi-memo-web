import {mark, parsePinyin} from '../utils/pinyin'

function ColoredZH(props: { zh: string, tone: number }) {
    // TODO: Pick better colors
    const colors = [
        "red", "limegreen", "rebeccapurple", "purple", "slategray"
    ];
    return (
        <>
            <span style={{color: colors[props.tone - 1]}}>
    {props.zh}
    </span>
        </>
    )
}

export function ZHChar(props: { zh: string, pinyin: string, is_visible: boolean }) {
    const zhs = props.zh.split("");
    const numbered_pinyin = props.pinyin.split(" ").map(parsePinyin);
    const tones = numbered_pinyin.map(x => x[1]);
    const marked_pinyin = numbered_pinyin
        .map(x => mark(x[0], x[1]))
        .join("");

    if (zhs.length != numbered_pinyin.length) {
        throw new Error("Number of character doesnt match the pinyin")
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center px-1.5">
                <div className="text-4xl">
                    {zhs.map((zh, i) => (
                        <ColoredZH zh={zh} tone={tones[i]} key={i}/>
                    ))}
                </div>
                <span className={`text-lg ${props.is_visible ? "visible" : "invisible"}`}>
                    {marked_pinyin}
                </span>
            </div>
        </>
    );
}
