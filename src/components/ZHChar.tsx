export function ZHChar(props: {
  zh: string;
  pinyin: string;
  is_visible: boolean;
}) {
  // TODO: Change the behaviour so that it shows lexeme as unit, instead of each char
  // Example:
  //   美国人     vs   美   国   人
  // meiguoren       mei  guo  ren

  // TODO: Pick better colors
  const colors = ["red", "limegreen", "rebeccapurple", "purple", "slategray"];

  const tone = parseInt(props.pinyin.slice(-1));
  const color = colors[tone - 1];

  return (
    <div className="flex flex-col items-center justify-center px-2">
      <span style={{ color }}>{props.zh}</span>
      <span className={props.is_visible ? "visible" : "invisible"}>
        {props.pinyin.slice(0, -1)}
      </span>
    </div>
  );
}
