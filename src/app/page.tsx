"use client";

import {useEffect, useState} from "react";
import {useDebounce} from "use-debounce";
import {ZHChar} from "../components/ZHChar";
import {GET} from "../app/api/route";

// TODO: Apply cosmetics
export default function Home() {
    const textShownFont =
        "flex justify-center font-mono font-bold text-violet-600";
    const visibilityMode = [
        {key: "show_all", label: "Show All"},
        {key: "smart", label: "Smart"},
        {key: "hide_all", label: "Hide All"},
    ];

    const [inputLength, setinputLength] = useState(1);
    const [get, setGet] = useState([]);
    const [mode, setMode] = useState(visibilityMode[1].key);
    const [inputText, setInputText] = useState("");
    const [debouncedInputText] = useDebounce(inputText, 500);

    // TODO: Optimize, store only the `visible` prop
    const [originZHText, setOriginZHText] = useState([
        {zh: "南京", pinyin: "Nan2 jing1", visible: true},
        {zh: "林业", pinyin: "lin2 ye4", visible: true},
        {zh: "大学", pinyin: "da4 xue2", visible: false},
    ]);
    const [shownZHText, setShownZHText] = useState(originZHText);

    useEffect(() => {
        GET()
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("Data", data.data.data);
                setGet(data.data.data);
            })
            .catch((err) => console.log("Err", err));
    }, []);

    useEffect(() => {
        console.log("Get", get);
    }, [get]);

    function isVisible(mode: string, visibility: boolean): boolean {
        if(mode == "show_all") return true;
        if(mode == "hide_all") return false;
        return visibility;
    }

    useEffect(() => {
        //TODO: Fetch data, then set zhText
        setinputLength(debouncedInputText.length);
    }, [debouncedInputText]);

    useEffect(() => {
        setShownZHText(() => originZHText.map((item, i) => ({...item, visible: isVisible(mode, item.visible)})));
    }, [mode])

    return (
        <main className="flex min-h-screen flex-col items-center justify-between l:p-24">
            <section
                className="h-3/5 min-h-[10rem] w-full flex justify-center flex-grow bg-gray-800 p-4 overflow-y-scroll">
                <div className="flex flex-wrap">
                    {/*TODO: Adjust visibility based on mode*/}
                    {shownZHText.map((item, i) => (
                        <ZHChar key={i}
                            zh={item.zh}
                            pinyin={item.pinyin}
                            is_visible={item.visible}/>
                    ))}
                </div>
            </section>
            <section className="flex flex-col flex-grow h-2/5 min-h-[8rem] w-full">
                <div className="flex text-white text-lg bg-blue-900 items-center py-1 px-2">
                    <div className="">
                        <select name="Preset" id="" className="bg-gray-800 p-1 text-white">
                            <option value="" disabled hidden>
                                Presets
                            </option>
                            <option value="">HSK 1</option>
                            <option value="">HSK 2</option>
                            <option value="">Intermediate</option>
                        </select>
                    </div>
                    <div className="flex flex-row-reverse flex-grow">
                        {visibilityMode.map((x, i) => (
                            <label
                                className={`flex gap-2 py-1 px-2 hover:bg-gray-400 hover:cursor-pointer ${
                                    mode == x.key
                                        ? "bg-gray-200 text-black font-bold"
                                        : ""
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
                    defaultValue={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
            </section>
        </main>
    );
}
