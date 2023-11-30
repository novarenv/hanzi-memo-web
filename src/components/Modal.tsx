import { Dispatch, SetStateAction, useEffect, useState } from "react";

const LS_BL_COLL = "collection_blacklist";

export const ModalLayout = (props: {
  modalVis: boolean;
  setModalVis: Dispatch<SetStateAction<boolean>>;
  collections: {
    id: string;
    name: string;
    hz: string[];
  }[];
  blackListColl: string[];
}) => {
  const [hskList, setHskList] = useState([
    {
      id: "1",
      title: "HSK 1",
      hz: ["狐", "狸"],
    },
    {
      id: "2",
      title: "HSK 2",
      hz: ["狐", "狸"],
    },
  ]);
  const [selected, setSelected] = useState<string[]>([]);
  const [hskCheck, setHskCheck] = useState(props.collections.map((x) => false));

  useEffect(() => {
  }, [selected]);

  useEffect(() => {
    setHskList(
      props.collections.map((x) => ({
        id: x.id,
        title: x.name,
        hz: ["狐", "狸"],
      }))
    );

    setHskCheck(hskList.map((x) => props.blackListColl.includes(x.id)));

  }, [props.collections]);

  useEffect(() => {
    const tempSel = hskList.filter((x, i) => hskCheck[i]).map((x) => x.id);

    setSelected(tempSel);
  }, [hskCheck, hskList]);

  function onCheckboxChange(iHsk: number) {
    setHskCheck(
      hskCheck.map((x, i) => {
        if (i == iHsk) return !x;
        return x;
      })
    );
  }

  const acceptChanges = () => {
    localStorage.setItem(LS_BL_COLL, JSON.stringify(selected));
    props.setModalVis(!props.modalVis);
  };

  return (
    <div
      id="default-modal"
      aria-hidden="true"
      className={`${props.modalVis ? "" : "hidden"}
        overflow-y-auto overflow-x-hidden fixed z-50 max-w-max mx-auto min-w-[40vw]
        justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              Blacklist Hanzi
            </span>

            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg
                text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="default-modal"
              onClick={() => props.setModalVis(!props.modalVis)}
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
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">
            {hskList.map((hsk, iHsk) => {
              return (
                <div
                  className="flex flex-grow items-center px-2 py-4 w-full border-b-2 pr-4 cursor-pointer"
                  onClick={() => onCheckboxChange(iHsk)}
                  key={iHsk}
                >
                  <div className="flex flex-col flex-grow justify-center">
                    <span className="text-2xl p-2">{hsk.title}</span>
                    <div className="text-xl mt-1">
                      {hsk.hz.map((hz, iHz) => {
                        return (
                          <span className="p-2" key={iHz}>
                            {hz}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <input
                      id="checkbox"
                      type="checkbox"
                      checked={hskCheck[iHsk]}
                      // onChange={(e) => onCheckboxChange(iHsk, e.target.checked)}
                      onChange={() => {}}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded
                      focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800
                        focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              data-modal-hide="default-modal"
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
                font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={acceptChanges}
            >
              Accept Changes
            </button>
            <button
              data-modal-hide="default-modal"
              type="button"
              className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border
              border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500
              dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              onClick={() => {
                props.setModalVis(!props.modalVis);
              }}
            >
              Revert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalLayout;
