"use client";

import {ChangeEvent, useEffect, useState} from "react";
import {useDebounce} from "use-debounce";
import {ZHChar} from "../components/ZHChar";
import {getCollecitons, getPinyins, getTexts, SampleText} from "../app/api/route";
import ModalLayout from "@/components/Modal";

const LS_BL_COLL = "collection_blacklist";
const LS_LX_BLACKLIST = "lexeme_blacklist";
const LS_LX_WHITELIST = "lexeme_whitelist";

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

  const userBlackListColl = JSON.parse(
      localStorage.getItem(LS_BL_COLL) || "[]"
  );

  const [inputLength, setInputLength] = useState(1);
  const [mode, setMode] = useState(visibilityMode[1].key);
  const [inputText, setInputText] = useState("");
  const [debouncedInputText] = useDebounce(inputText, 500);

  const [zhText, setZhText] = useState<ZCharView[]>([]);
  const [visibleStates, setVisibleStates] = useState(
      zhText.map((x) => x.visible)
  );

  const _userBlacklist = JSON.parse(localStorage.getItem(LS_LX_BLACKLIST) || "[]");
  const _userWhitelist = JSON.parse(localStorage.getItem(LS_LX_WHITELIST) || "[]");
  const [blacklist, setBlacklist] = useState<string[]>(_userBlacklist);
  const [whitelist, setWhitelist] = useState<string[]>(_userWhitelist);
  const [modalVis, setModalVis] = useState(false);
  const [collections, setCollections] = useState([]);
  const [aboutUsVis, setAboutUsVis] = useState(false);
  const [blacklistColl, setBlacklistColl] = useState(userBlackListColl);
  const [sampleText, setSampleText] = useState<SampleText[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    getTexts().then((res) => {
      setSampleText(res.data)
    })
  }, [])

  useEffect(() => {
    setInputLength(debouncedInputText.length);
  }, [debouncedInputText]);

  useEffect(() => {
    setVisibleStates(zhText.map((x, i) => {
      return isVisible(mode, x.visible)
    }))
  }, [mode, zhText])

  useEffect(() => {
    // Blacklist: when origin is visible, but visible state is false
    setBlacklist(zhText
        .filter((x, i) => x.visible && x.visible != visibleStates[i])
        .map(x => x.id)
        .reduce<string[]>((a, b) => {
          if (!a.includes(b)) a.push(b);
          return a;
        }, []))

    // Whitelist: when origin is not visible, but visible state is true
    setWhitelist(zhText
        .filter((x, i) => !x.visible && x.visible != visibleStates[i])
        .map(x => x.id)
        .reduce<string[]>((a, b) => {
          if (!a.includes(b)) a.push(b);
          return a;
        }, []))

  }, [visibleStates])

  useEffect(() => {
    localStorage.setItem(LS_LX_BLACKLIST, JSON.stringify(blacklist));
    localStorage.setItem(LS_LX_WHITELIST, JSON.stringify(whitelist));
  }, [whitelist, blacklist])

  const TripleDots = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-more-vertical"
        >
          <circle cx="12" cy="12" r="1"/>
          <circle cx="12" cy="5" r="1"/>
          <circle cx="12" cy="19" r="1"/>
        </svg>
    );
  };

  function isVisible(mode: string, visibility: boolean): boolean {
    if (mode == "show_all") return true;
    if (mode == "hide_all") return false;
    return visibility;
  }

  useEffect(() => {
    getCollecitons()
        .then((res) => res.json())
        .then((data) => {
          setCollections(data.data.data);
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
    console.log("debouncing")
    //TODO: Fetch data, then set zhText
    setInputLength(debouncedInputText.length);
    if (debouncedInputText.trim().length != 0) {
      console.log("Input empty, is firing?")
      fireChanges();
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
    // Blacklist: when origin is visible, but visible state is false
    // TODO: Save to localStorage
    setBlacklist(
        zhText
            .filter((x, i) => x.visible && x.visible != visibleStates[i])
            .map((x) => x.id)
            .reduce<string[]>((a, b) => {
              if (!a.includes(b)) a.push(b);
              return a;
            }, [])
    );

    // Whitelist: when origin is not visible, but visible state is true
    setWhitelist(
        zhText
            .filter((x, i) => !x.visible && x.visible != visibleStates[i])
            .map((x) => x.id)
            .reduce<string[]>((a, b) => {
              if (!a.includes(b)) a.push(b);
              return a;
            }, [])
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

  function handlePresetChange(e: ChangeEvent<HTMLSelectElement>) {
    const x = sampleText.find(x => x.id === e.target.value);
    console.log(x)
    setInputText(x ? x.text : "")
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

        <div className="w-full flex items-center bg-indigo-300">
          <div
              className={`${
                  !aboutUsVis ? "hidden" : ""
              } fixed top-0 right-0 min-w-[10vm] max-w-[80vm] p-8 z-50 bg-gray-700
          mt-4 mr-4 rounded-lg border-2`}
          >
            <div
                className="flex justify-end cursor-pointer"
                onClick={() => setAboutUsVis(!aboutUsVis)}
            >
              <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
              >
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </div>
            <div className="flex flex-col justify-center text-xl">
              <span className="mb-4 font-bold">Made with love by:</span>
              <span>Novaren Veraldo</span>
              <span>Gumelar Purnama Nugraha</span>
              <span>Ndombasi D. J. Andre</span>
            </div>
            <span className="flex justify-center mt-12 text-md font-bold">
            @NUIST
          </span>
          </div>

          <span className="flex-grow text-3xl text-black p-2">Hanzi Memo</span>

          <div
              className={`flex gap-2 p-2 text-black hover:bg-gray-100 hover:rounded-md
            md:hover:cursor-pointer mr-2 border-r-indigo-500 border-r-2`}
              onClick={() => setModalVis(!modalVis)}
          >
            <span>Blacklist</span>
          </div>
          <span
              className="md:hidden text-black p-2 cursor-pointer hover:bg-gray-100 rounded-md"
              onClick={() => setAboutUsVis(!aboutUsVis)}
          >
          <TripleDots/>
        </span>
          <span
              className="hidden md:flex text-black p-2 cursor-pointer hover:bg-gray-100 rounded-md"
              onClick={() => setAboutUsVis(!aboutUsVis)}
          >
          About Us
        </span>
        </div>
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
            <div className="">
              <select
                  name="Preset"
                  id=""
                  className="bg-gray-800 p-1 text-white"
                  onChange={handlePresetChange}>
                <option value="1" disabled hidden>
                  Presets
                </option>
                {sampleText.map((item, i) => (
                    <option value={item.id} key={i}>
                      {item.title}
                    </option>
                ))}
              </select>
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
