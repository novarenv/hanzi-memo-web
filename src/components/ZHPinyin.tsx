import {mark, parsePinyin} from '@/utils/pinyin'
import {useEffect, useState} from "react";

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

export function ZHPinyin(props: { zh: string, pinyin: string, is_visible: boolean }) {
  const zhs = props.zh.split("");
  const numbered_pinyin = props.pinyin.split(" ").map(parsePinyin);
  const tones = numbered_pinyin.map(x => x[1]);
  const marked_pinyin = numbered_pinyin
      .map(x => mark(x[0], x[1]))
      .join("");

  const [show, setShow] = useState(props.is_visible);
  const isVisibleCharacter = zhs.length == numbered_pinyin.length;

  function toggleVisiblity(value: boolean) {
    setShow(props.is_visible || value)
  }

  useEffect(() => {
    toggleVisiblity(props.is_visible)
  }, [props.is_visible])

  const isChinese = props.zh.match(/\p{sc=Han}/u);

  return (
      <>
        <div className="flex flex-col items-center justify-center px-1.5 gap-1.5"
             onMouseOver={() => toggleVisiblity(true)}
             onMouseLeave={() => toggleVisiblity(false)}>
          <div className="text-4xl">
            {isVisibleCharacter &&
                zhs.map((zh, i) => (<ColoredZH zh={zh} tone={tones[i]} key={i}/>))
            }
          </div>
          {isChinese &&
              <div
                  className={`border border-solid rounded-sm text-white ${!show ? "bg-gray-800 border-gray-600" : "border-gray-800"}`}>
                      <span className={`text-lg  ${show ? "visible" : "invisible"}`}>
                          {marked_pinyin}
                      </span>
              </div>
          }
        </div>
      </>
  );
}


export interface Lexeme {
  id: string
  zh: string
  pinyin: string
  visible: boolean
}

export function InteractiveZHPinyin(props: {
  item: Lexeme
  visibleState: boolean,
  mode: string,
  onCheckedChange: (item: Lexeme, checked: boolean) => void,
}) {
  return (
      <>
        <input
            type="checkbox"
            className="scale-75"
            id={`toggle-${props.item.id}-i`}
            alt="disable"
            hidden
            disabled={props.mode != "smart"}
            name={props.item.zh}
            checked={!props.visibleState}
            onChange={(e) => props.onCheckedChange(props.item, e.target.checked)}
        />
        <label
            htmlFor={`toggle-${props.item.id}-i`}
            title={`click to ${
                props.visibleState ? "hide" : "show"
            } this character`}
            className="hover:cursor-pointer"
        >
          <ZHPinyin
              zh={props.item.zh}
              pinyin={props.item.pinyin}
              is_visible={props.visibleState}
          />
        </label>
      </>
  )
}
