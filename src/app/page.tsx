"use client";

import {useEffect, useState} from "react";
import {useDebounce} from "use-debounce";
import {Header} from "@/components/Header";
import {ZHChar} from "@/components/ZHChar";
import {Collection, getCollections, getPinyins, getTexts, SampleText} from "./api/backend";
import ModalLayout from "@/components/Modal";

const LS_BL_COLL = "collection_blacklist";
const LS_LX_BLACKLIST = "lexeme_blacklist";
const LS_LX_WHITELIST = "lexeme_whitelist";
const LS_PREVIOUS_TEXT = "previous_text";

interface ZCharView {
  id: string
  zh: string
  pinyin: string
  visible: boolean
}

// TODO: Apply cosmetics
export default function Home() {
  const visibilityMode = [
    {key: "show_all", label: "Show All"},
    {key: "smart", label: "Smart"},
    {key: "hide_all", label: "Hide All"},
  ];

  let _userBlackListColl: string[] = [];
  let _userBlacklist: string[] = [];
  let _userWhitelist: string[] = [];
  let userPreviousText: string = "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      _userBlacklist = JSON.parse(localStorage.getItem(LS_LX_BLACKLIST) || "[]");
      _userWhitelist = JSON.parse(localStorage.getItem(LS_LX_WHITELIST) || "[]")
      _userBlackListColl = JSON.parse(localStorage.getItem(LS_BL_COLL) || "[]");
      userPreviousText = localStorage.getItem(LS_PREVIOUS_TEXT) || "";
    }
  }, [])

  const [mode, setMode] = useState(visibilityMode[1].key);
  const [inputText, setInputText] = useState(userPreviousText);
  const [debouncedInputText] = useDebounce(inputText, 500);

  const [zhText, setZhText] = useState<ZCharView[]>([]);
  const [visibleStates, setVisibleStates] = useState(
      zhText.map((x) => x.visible)
  );

  const [blacklist, setBlacklist] = useState(_userBlacklist);
  const [whitelist, setWhitelist] = useState(_userWhitelist);
  const [modalVis, setModalVis] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [blacklistColl, setBlacklistColl] = useState(_userBlackListColl);
  // const [sampleText, setSampleText] = useState<SampleText[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setInputText(localStorage.getItem(LS_PREVIOUS_TEXT) || "")
  }, [])

  useEffect(() => {
    setVisibleStates(zhText.map((x, i) => {
      return isVisible(mode, x.visible)
    }))
  }, [mode, zhText])

  useEffect(() => {
    localStorage.setItem(LS_LX_BLACKLIST, JSON.stringify(blacklist));
    localStorage.setItem(LS_LX_WHITELIST, JSON.stringify(whitelist));
  }, [whitelist, blacklist])


  function isVisible(mode: string, visibility: boolean): boolean {
    if (mode == "show_all") return true;
    if (mode == "hide_all") return false;
    return visibility;
  }

  useEffect(() => {
    getCollections()
        .then((data) => {
          setCollections(data.data);
        })
        .catch((err) => console.log("Err", err));
  }, []);

  function fireChanges() {
    console.log("Firing changes")
    setIsLoading(true);
    const collectionBL = JSON.parse(localStorage.getItem(LS_BL_COLL) || "[]")
    getPinyins(inputText, blacklist, whitelist, collectionBL)
        .then((res) => {
          setIsLoading(false);
          setZhText(res.data.map((s) => {
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
          }))
        })
        .catch((err: any) => console.log("Err", err));
  }

  useEffect(() => {
    // FIX: don't fire on init
    if (debouncedInputText.trim().length != 0) {
      fireChanges();
      localStorage.setItem(LS_PREVIOUS_TEXT, debouncedInputText)
    }
  }, [debouncedInputText]);

  useEffect(() => {
  }, [modalVis]);

  useEffect(() => {
    setVisibleStates(
        zhText.map((x, i) => {
          return isVisible(mode, x.visible);
        })
    );
  }, [mode, zhText]);

  useEffect(() => {

    const makeSet = (a: string[], b: string) => {
      if (!a.includes(b)) a.push(b);
      return a;
    };

    // Blacklist: when origin is visible, but visible state is false
    // TODO: Save to localStorage
    setBlacklist(() => {
          const newBlacklist = zhText
              .filter((x, i) => x.visible && x.visible != visibleStates[i])
              .map((x) => x.id);
          return [...blacklist, ...newBlacklist].reduce(makeSet, []);
        }
    );

    // Whitelist: when origin is not visible, but visible state is true
    setWhitelist(() => {
          const newWhitelist = zhText
              .filter((x, i) => !x.visible && x.visible != visibleStates[i])
              .map((x) => x.id);
          return [...whitelist, ...newWhitelist].reduce(makeSet, []);
        }
    );
  }, [visibleStates]);

  // FIXME: compare id instead of zh
  function updateCheckbox(name: string, value: boolean) {
    const changes = zhText.map((x, i) => x.id == name);
    setVisibleStates((prev) =>
        prev.map((original_state, i) => {
          if (changes[i]) {
            return !value;
          }
          return original_state;
        })
    );
  }


  return (
      <main className="flex min-h-screen flex-col items-center justify-between l:p-24">
        <ModalLayout
            modalVis={modalVis}
            setModalVis={setModalVis}
            collections={collections}
            blackListColl={blacklistColl}
            fireChanges={() => fireChanges}
        />
        <Header onPresetChange={(t) => setInputText(t)}/>
        {/* ================ Body */}
        <section
            className="h-3/5 min-h-[10rem] w-full flex justify-center flex-grow bg-gray-800 p-4 overflow-y-scroll">
          <div className={`flex jusity-center items-center ${isLoading ? "" : "hidden"}`}>Loading...</div>
          <div className={`flex flex-wrap ${!isLoading ? "visible" : "hidden"}`}>
            {zhText.map((item, i) => (
                <div key={i}>
                  <input
                      type="checkbox"
                      className="scale-75"
                      id={`toggle-${item.id}-i`}
                      alt="disable"
                      hidden
                      disabled={mode != "smart"}
                      name={item.zh}
                      checked={!visibleStates[i]}
                      onChange={(e) => updateCheckbox(item.id, e.target.checked)}
                  />
                  <label
                      htmlFor={`toggle-${item.id}-i`}
                      title={`click to ${
                          visibleStates[i] ? "hide" : "show"
                      } this character`}
                      className="hover:cursor-pointer"
                  >
                    <ZHChar
                        zh={item.zh}
                        pinyin={item.pinyin}
                        is_visible={visibleStates[i]}
                    />
                  </label>
                </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col flex-grow h-2/5 min-h-[8rem] w-full">
          <div className="flex text-white text-lg bg-blue-900 items-center py-1 px-2">

            <div
                className={`flex gap-2 p-2 bg-white text-black hover:bg-gray-400 hover:text-white md:hover:cursor-pointer font-bold`}
                onClick={() => setModalVis(!modalVis)}
            >
              <span>Blacklist</span>
            </div>
            <div className="flex flex-row-reverse flex-grow">
              {visibilityMode.map((x, i) => (
                  <label
                      className={`flex gap-2 py-1 px-2 hover:bg-gray-400 hover:cursor-pointer ${
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
                    <span>{x.label}</span>
                  </label>
              ))}
            </div>
          </div>
          <textarea
              className="flex-grow w-full bg-gray-900 p-4"
              placeholder="Write something here"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
          />
        </section>
      </main>
  );
}
