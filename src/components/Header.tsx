import {ChangeEvent, useEffect, useState} from "react";
import {getTexts, SampleText} from "@/app/api/backend";

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

export function Header(props: {
  onPresetChange: (text: string) => void
}) {
  const [aboutUsVis, setAboutUsVis] = useState(false);
  const [sampleText, setSampleText] = useState<SampleText[]>([]);

  function handlePresetChange(e: ChangeEvent<HTMLSelectElement>) {
    const sampleObj = sampleText.find(x => x.id === e.target.value);
    props.onPresetChange(sampleObj ? sampleObj.text : "")
  }

  useEffect(() => {
    getTexts().then((res) => {
      setSampleText(res.data)
    })
  }, [])


  return (
      <div className="w-full flex items-stretch bg-blue-900 text-white gap-2">
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
            <span>Gumelar Purnama Nugraha</span>
            <span>Ndombasi D. J. Andre</span>
            <span>Novaren Veraldo</span>
          </div>
          <span className="flex justify-center mt-12 text-md font-bold">
            @NUIST
          </span>
        </div>

        <div className="flex justify-center items-center px-4 gap-1">
          <img src="/hzm-logo.svg" alt="HanziMemo" className="h-12 md:h-16"/>
          <div
              className="flex flex-col md:flex-row md:gap-0.5 text-xl font-bold md:text-3xl text-white md:items-center justify-center">
            <span> Hanzi </span>
            <span> Memo </span>
          </div>
        </div>

        <div className="flex-grow"></div>
        <div className="flex gap-2">
          <div className="shrink py-2">
            <span className="text-white">Sample Text: </span>
            <br/>
            <select
                name="Preset"
                id=""
                className="bg-white p-1 text-black"
                onChange={handlePresetChange}>
              <option value="1" disabled hidden selected>
                Sample Text
              </option>
              {sampleText.map((item, i) => (
                  <option value={item.id} key={i}>
                    {item.title}
                  </option>
              ))}
            </select>
          </div>
          <div
              className="md:hidden flex items-center text-white cursor-pointer hover:bg-gray-400 hover:text-white"
              onClick={() => setAboutUsVis(!aboutUsVis)}>
            <TripleDots/>
          </div>
          <div
              className="hidden md:flex text-white px-2 cursor-pointer hover:bg-gray-400 hover:text-white items-center"
              onClick={() => setAboutUsVis(!aboutUsVis)}>
            About Us
          </div>
        </div>
      </div>
  );
}
