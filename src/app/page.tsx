'use client'

import Image from "next/image";
import { useEffect } from "react";

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
  const inputText: string = "";

  useEffect(() => {}, [])

  return (
    <main className="h-screen flex flex-col text-2xl text-white">
      <section className="h-1/2 min-h-[10rem] bg-gray-800 md:flex-grow">
      </section>
      <section className="flex-grow min-h-[10rem] md:flex-initial md:h-80">
          <textarea
              className="h-full w-full bg-gray-900 p-4"
              placeholder="Write something here"
              value={inputText}
              readOnly={true}>
          </textarea>
      </section>
    </main>
  );
}
