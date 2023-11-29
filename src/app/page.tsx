'use client'

import Image from "next/image";
import {useEffect, useState} from "react";
import { useDebounce } from 'use-debounce'
import { ZHChar } from '../components/ZHChar'

// TODO: Apply cosmetics
export default function Home() {
    const textShownFont = "flex justify-center font-mono font-bold text-violet-600";
    const visibilityMode = [
        {key: "show_all", label: "Show All"},
        {key: "smart", label: "Smart"},
        {key: "hide_all", label: "Hide All"},
    ];

    const [curVisibility, setCurVisibility] = useState(visibilityMode[1].key);
    const [inputText, setInputText] = useState("");
    const [debouncedInputText] = useDebounce(inputText, 500);
    const [zhText, setZHText] = useState([
        {zh: "你", pinyin: "ni3", visible: true},
    ]);

    useEffect(() => {
        //TODO: Fetch data, then set zhText
    }, [debouncedInputText])

    return (
        <main className="h-screen flex flex-col text-2xl text-white">
            <section className="h-3/5 min-h-[10rem] bg-gray-800 p-4 overflow-y-scroll">
                <div className="flex flex-wrap">
                    {/*TODO: Adjust visibility based on mode*/}
                    {zhText.map((item, i) => (
                        <ZHChar zh={item.zh} pinyin={item.pinyin} is_visible={item.visible} key={i}/>
                    ))}
                </div>
            </section>
            <section className="flex flex-col flex-grow min-h-[8rem] md:h-80">
                <div className="flex text-white text-lg bg-blue-900 items-center py-1 px-2">
                    <div className="">
                        {/* TODO: Fetch data from /texts */}
                        <select name="Preset" id="" className="bg-gray-800 p-1 bg-white text-black" >
                            <option value="" disabled selected hidden>Presets</option>
                            <option value="">HSK 1</option>
                            <option value="">HSK 2</option>
                            <option value="">Intermediate</option>
                        </select>
                    </div>
                    <div className="flex flex-row-reverse flex-grow">
                        {visibilityMode.map((x, i) => (
                            <label
                                className={`flex gap-2 py-1 px-2 hover:bg-gray-400 hover:cursor-pointer ${(curVisibility == x.key ? "bg-gray-200 text-black font-bold" : "")}`}
                                key={i}>
                                <input type="radio" name="visibility-toggle" onChange={() => setCurVisibility(x.key)}
                                       hidden={true}/>
                                <span>
                          {x.label}
                      </span>
                            </label>
                        ))}
                    </div>
                </div>
                <textarea
                    className="flex-grow w-full bg-gray-900 p-4"
                    placeholder="Write something here"
                    defaultValue={inputText} onChange={e => setInputText(e.target.value)}>
                </textarea>
            </section>
        </main>
    );
}
