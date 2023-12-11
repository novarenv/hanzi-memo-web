"use client";

import {multiline_chunk} from "@/utils/pinyin";
import {useEffect, useState} from "react";
import {useDebounce} from "use-debounce";
import {Header} from "@/components/Header";
import {InteractiveZHPinyin, Lexeme} from "@/components/ZHPinyin";
import {Collection, getCollections, getPinyins, Segment} from "./api/backend";
import ModalLayout from "@/components/Modal";
import {ChevronsRight, Crosshair, Eye, EyeOff, List} from 'react-feather'


enum TriggerMode {
  Debounce = "DEBOUNCE",
  Button = "BUTTON",
}

const envTriggerMode = process.env.NEXT_PUBLIC_TRIGGER_MODE as TriggerMode;
const TRIGGER_MODE = envTriggerMode ?? TriggerMode.Debounce;
const CHUNK_SIZE = parseInt(process.env.NEXT_PUBLIC_CHUNK_SIZE ?? "20");


const USER_DATA_VERSION = parseFloat(process.env.NEXT_PUBLIC_USER_DATA_VERSION ?? "0")

const noId = (x: string) => !x.startsWith("--no-id");

enum LSKey {
  Version = "version",
  BlacklistCollection = "collection_blacklist",
  LexemeBlacklist = "lexeme_blacklist",
  LexemeWhitelist = "lexeme_whitelist",
  PreviousText = "previous_text",
}

// TODO: Apply cosmetics
export default function Home() {

  const iconSize = 20;
  const visibilityMode = [
    {key: "show_all", label: "Show All", icon: (<Eye size={iconSize}/>)},
    {key: "smart", label: "Smart", icon: (<Crosshair size={iconSize}/>)},
    {key: "hide_all", label: "Hide All", icon: (<EyeOff size={iconSize}/>)},
  ];

  const [firstRender, setFirstRender] = useState(true);
  let _userBlackListColl: string[] = [];
  let _userBlacklist: string[] = [];
  let _userWhitelist: string[] = [];
  let _userPreviousText: string = "";
  let _userDataVersion = 0;

  useEffect(() => {
    if (typeof window === "undefined" || !firstRender) return;

    _userBlacklist = JSON.parse(localStorage.getItem(LSKey.LexemeBlacklist) || "[]");
    _userWhitelist = JSON.parse(localStorage.getItem(LSKey.LexemeWhitelist) || "[]")
    _userBlackListColl = JSON.parse(localStorage.getItem(LSKey.BlacklistCollection) || "[]");
    _userPreviousText = localStorage.getItem(LSKey.PreviousText) || "";


    _userDataVersion = parseFloat(localStorage.getItem(LSKey.Version) || "0")
    if (USER_DATA_VERSION > _userDataVersion) {
      // FIXME: migrate changes rather than clearing everything
      _userWhitelist = []
      _userBlacklist = []
      _userBlackListColl = []
      localStorage.setItem(LSKey.Version, USER_DATA_VERSION.toString())
    }

    setInputText(_userPreviousText)
    setWhitelist(_userWhitelist)
    setBlacklist(_userBlacklist)
    setBlacklistColl(_userBlackListColl)

    setFirstRender(false)
  }, [])

  type Segments = Segment[]
  type Line = Segments[]

  const [mode, setMode] = useState(visibilityMode[1].key);
  const [inputText, setInputText] = useState(_userPreviousText);
  const [debouncedInputText] = useDebounce(inputText, 1000);
  const [job, setJob] = useState<Line[]>([]);
  const [zhText, setZhText] = useState<Lexeme[][]>([]);
  const [visibleStates, setVisibleStates] = useState(
      zhText.map((x) => x.map(l => l.visible))
  );

  const [blacklist, setBlacklist] = useState(_userBlacklist);
  const [whitelist, setWhitelist] = useState(_userWhitelist);
  const [modalVisible, setModalVisible] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [blacklistColl, setBlacklistColl] = useState(_userBlackListColl);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    localStorage.setItem(LSKey.LexemeBlacklist, JSON.stringify(blacklist));
    localStorage.setItem(LSKey.LexemeWhitelist, JSON.stringify(whitelist));
  }, [whitelist, blacklist])


  function isVisible(mode: string, item: Lexeme): boolean {
    if (mode == "show_all") return true;
    if (mode == "hide_all") return false;

    if (blacklist.includes(item.id)) return false;
    if (whitelist.includes(item.id)) return true;

    return item.visible;
  }

  useEffect(() => {
    getCollections()
        .then((data) => {
          setCollections(data.data);
        })
        .catch((err) => console.log("Err", err));
  }, []);

  function fireChanges() {
    localStorage.setItem(LSKey.PreviousText, debouncedInputText)

    setIsLoading(true);
    const collectionBL = JSON.parse(localStorage.getItem(LSKey.BlacklistCollection) || "[]")
    const lines = multiline_chunk(inputText, CHUNK_SIZE)
        .map((line, l) => {
          const chunkLine =
              line.map((chunk, i) => ({text: chunk, index: i}))

          return {
            line_number: l,
            chunks: chunkLine,
          }
        })

    setJob(lines.map(line =>
        new Array(line.chunks.length).fill([]))
    )

    lines.forEach(line => {
      line.chunks.forEach(chunk => {
        const cleanBlacklist = blacklist.filter(noId);
        const cleanWhitelist = whitelist.filter(noId);
        getPinyins(chunk.text, cleanBlacklist, cleanWhitelist, collectionBL)
            .then((res) => {
              placeChunk(res.data, line.line_number, chunk.index)
            })
      })
    })
  }

  function placeChunk(chunk: Segments, line: number, column: number) {
    setJob(lines => {
      let oldLine = lines[line]
      oldLine.splice(column, 1, chunk)
      return [
        ...lines.slice(0, line),
        oldLine,
        ...lines.slice(line + 1),
      ]
    })
  }

  useEffect(() => {
    const flatSegment =
        job.map(line => {
          return line.reduce((acc, s) => [...acc, ...s], [])
        })

    function segmentToLexeme(s: Segment): Lexeme {
      let pinyin_id = `--no-id-${s.segment}--`;
      let pinyin_text = s.segment;

      if (s.pinyin.length > 0) {
        pinyin_id = s.pinyin[0].id;
        pinyin_text = s.pinyin[0].pinyin ?? "";
      }

      return {
        id: pinyin_id,
        pinyin: pinyin_text,
        zh: s.segment,
        visible: s.strict_visible,
      }
    }

    setZhText(flatSegment.map(line => line.map(segmentToLexeme)))
    setIsLoading(false);
  }, [job])

  useEffect(() => {
    if (TRIGGER_MODE == TriggerMode.Button) return;

    // FIX: don't fire on init
    if (debouncedInputText.trim().length != 0) {
      fireChanges();
    }
  }, [debouncedInputText]);

  useEffect(() => {
    setVisibleStates(
        zhText.map((line, i) =>
            line.map((x, j) => isVisible(mode, x)))
    );
  }, [mode, zhText]);

  function getLists(original: string[]): string[] {
    const makeSet = (a: string[], b: string) => {
      if (!a.includes(b)) a.push(b);
      return a;
    };

    const flatLexemes = zhText.reduce((acc, x) => [...acc, ...x], []);
    const allId = flatLexemes
        .map(x => x.id)

    const unrelated = original.filter(x => !allId.includes(x))
    const listFromRequest = flatLexemes
        .filter(x => original.includes(x.id))
        .map(x => x.id);

    return [
      ...unrelated,
      ...listFromRequest
    ].reduce(makeSet, []).filter(x => !x.startsWith("--no-id"))
  }

  // =================== Handler
  function updateCheckbox(item: Lexeme, checked: boolean) {
    const changes = zhText.map(line => line.map(lex => lex.id == item.id));

    function changeState(ori_state: boolean, row: number, col: number) {
      if (changes[row][col]) {
        return !checked;
      }
      return ori_state;
    }


    setVisibleStates(
        visibleStates
            .map((line, i) =>
                line.map((ori_state, j) =>
                    changeState(ori_state, i, j))))


    // FIXME: this didnt differentiate between words that blacklisted from the collection
    // TODO: get exclusive blacklist/white list from backend
    let newBlacklist = getLists(blacklist);
    let newWhitelist = getLists(whitelist);

    if (checked) {
      newBlacklist.push(item.id)
      newWhitelist = newWhitelist.filter(x => x !== item.id)
    } else {
      newBlacklist = newBlacklist.filter(x => x !== item.id)
      newWhitelist.push(item.id)
    }

    setBlacklist(newBlacklist.filter(noId))
    setWhitelist(newWhitelist.filter(noId))
  }


  function onCollectionModalOK(selectedCollection: string[]) {
    localStorage.setItem(LSKey.BlacklistCollection, JSON.stringify(selectedCollection))
    setModalVisible(false)
    fireChanges()
  }

  return (
      <main className="flex min-h-screen flex-col items-center justify-between l:p-24">
        <ModalLayout
            isVisible={modalVisible}
            collections={collections}
            blackListColl={blacklistColl}
            onOK={onCollectionModalOK}
            onCancel={() => setModalVisible(false)}
        />
        <Header onPresetChange={(t) => setInputText(t)}/>
        {/* ================ Body */}
        <section
            className="h-3/5 max-h-[65vh] min-h-[10rem] w-full flex justify-center flex-grow bg-gray-800 py-4 overflow-y-scroll items-start">
          <div className={`flex jusity-center items-center ${isLoading ? "" : "hidden"}`}>Loading...</div>
          <div className={`flex flex-col gap-2 ${!isLoading ? "visible" : "hidden"}`}>
            {zhText.map((line, i) =>
                (
                    visibleStates[i] &&
                    <div key={i} className="flex items-center">
                        <span className="p-2 md:p-4 text-xl text-gray-500 font-bold">
                          {i + 1}
                        </span>
                        <div key={i}
                             className="flex flex-row flex-wrap gap-y-2 p-2 border-l-2 border-solid border-gray-500">
                          {
                            line.map((item, j) => (
                                <InteractiveZHPinyin
                                    key={`${i}-${j}`}
                                    item={item}
                                    visibleState={visibleStates[i][j]}
                                    mode={mode}
                                    onCheckedChange={updateCheckbox}/>
                            ))
                          }
                        </div>

                    </div>
                )
            )}
          </div>
        </section>

        <section className="flex flex-col flex-grow h-2/5 min-h-[8rem] w-full relative">
          <div className="flex text-white text-lg bg-blue-900 items-center">
            <div
                className={`flex gap-2 p-2 bg-white text-black hover:bg-gray-400 hover:text-white md:hover:cursor-pointer font-bold`}
                onClick={() => setModalVisible(!modalVisible)}
            >
              <span className="flex gap-2 items-center">
                <List size={iconSize}/>
                Blacklist
              </span>
            </div>
            <div className="flex flex-row-reverse flex-grow">
              {visibilityMode.map((x, i) => (
                  <label
                      className={`flex gap-2 h-full px-3 py-2 hover:bg-gray-400 hover:cursor-pointer ${
                          mode == x.key ? "bg-gray-200 text-black font-bold" : ""
                      }`}
                      key={i}
                  >
                    <input
                        type="radio"
                        name="visibility-toggle"
                        onChange={() => setMode(x.key)}
                        hidden={true}
                    />
                    <span className="flex gap-1.5 items-center">
                      {x.icon}
                      {x.label}
                    </span>
                  </label>
              ))}
            </div>
          </div>
          <div className="flex-grow">
            <textarea
                className="w-full h-full bg-gray-900 p-4"
                placeholder="Write something here"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}/>
          </div>
          {TRIGGER_MODE == TriggerMode.Button &&
              <button
                  className="flex items-center p-2 bg-white text-black font-bold absolute bottom-5 right-5 hover:bg-gray-400 hover:text-white "
                  onClick={() => fireChanges()}>
                  Analyze
                  <ChevronsRight size={iconSize}/>
              </button>
          }
        </section>
      </main>
  );
}