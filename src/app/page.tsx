'use client'

import Image from "next/image";
import {useEffect, useState} from "react";
import { useDebounce } from 'use-debounce'

// <code className={`text-2xl ${textShownFont}`}>郑</code>
// <code className={`text-l ${textShownFont}`}>zheng</code>

// <input
//     id="email"
//     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
//                 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
//                 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 border-blue-1000"
//     placeholder="john.doe@company.com"
//     required
// />

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
    const [inputLength, setinputLength] = useState(1);

    useEffect(() => {
        setinputLength(debouncedInputText.length)
    }, [debouncedInputText])

    return (
        <main className="h-screen flex flex-col text-2xl text-white">
            <section className="h-3/5 min-h-[10rem] bg-gray-800">
                <p> {inputLength} characters </p>
            </section>
            <section className="flex flex-col flex-grow min-h-[8rem] md:h-80">
                <div className="flex text-white text-lg bg-blue-900 items-center py-1 px-2">
                    <div className="">
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
