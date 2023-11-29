"use client";

import { AppInitialProps } from "next/app";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { ZHChar } from "../components/ZHChar";
import { GET } from "../app/api/route";

// TODO: Apply cosmetics
export default function Home() {
  const textShownFont =
    "flex justify-center font-mono font-bold text-violet-600";
  const visibilityMode = [
    { key: "show_all", label: "Show All" },
    { key: "smart", label: "Smart" },
    { key: "hide_all", label: "Hide All" },
  ];

  const [curVisibility, setCurVisibility] = useState(visibilityMode[1].key);
  const [inputText, setInputText] = useState("");
  const [debouncedInputText] = useDebounce(inputText, 500);
  const [zhText, setZHText] = useState([
    { zh: "你", pinyin: "ni3", visible: true },
  ]);
  const [get, setGet] = useState([]);

  useEffect(() => {
    GET()
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("Data", data.data.data)
        setGet(data.data.data)
      })
      .catch((err) => console.log("Err", err));
  }, []);

  useEffect(() => {
    console.log("Get", get);
  }, [get]);

  useEffect(() => {
    //TODO: Fetch data, then set zhText
  }, [debouncedInputText]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between l:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div
          className="flex flex-end h-48 w-full items-end justify-center bg-gradient-to-t from-white
            via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none"
        >
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            /> */}
            <div>Show</div>
            <div>Collections</div>
          </a>
        </div>
      </div>

      {/* <div
        className="relative flex flex-col place-items-center before:absolute before:h-[300px] before:w-[480px]
          before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent
          before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3
          after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br
          before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff]
          after:dark:opacity-40 before:lg:h-[360px] z-[-1]"
      ></div> */}

      <div>
        <div className="mb-6">
          <p
            className="flex flex-col w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200
                pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto
                rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 mb-4"
          >
            {/* <p className=""> */}
            <code className={`text-2xl ${textShownFont}`}>郑</code>
            <code className={`text-l ${textShownFont}`}>zheng</code>
            {/* </p> */}
          </p>
          <input
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
                focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 border-blue-1000"
            placeholder="john.doe@company.com"
            required
          />
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Explore starter templates for Next.js.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}
