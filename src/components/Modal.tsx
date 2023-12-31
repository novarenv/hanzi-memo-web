import {Collection} from "@/app/api/backend";
import {useEffect, useState} from "react";


function CloseIcon() {
  return <>
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
  </>
}


export const ModalLayout = (props: {
  isVisible: boolean;
  collections: Collection[];
  blackListColl: string[];
  onOK: (selected: string[]) => void,
  onCancel: () => void,
}) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [checkboxStates, setCheckboxStates] = useState(props.collections.map((x) => false));
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setCollections(
        props.collections.map((x) => ({
          id: x.id,
          name: x.name,
          preview: x.preview,
        }))
    );
  }, [props.collections]);

  useEffect(() => {
    const states = collections.map((x) => props.blackListColl.includes(x.id))
    setCheckboxStates(states);
  }, [collections])


  useEffect(() => {
    setSelected(
        collections
            .filter((x, i) => checkboxStates[i])
            .map((x) => x.id)
    );
  }, [checkboxStates]);

  function onCheckboxChange(iHsk: number) {
    setCheckboxStates(
        checkboxStates.map((x, i) => {
          if (i == iHsk) return !x;
          return x;
        })
    );
  }

  const acceptChanges = () => {
    props.onOK(selected);
  };

  return (
      <>
        <div
            id="default-modal"
            aria-hidden="true"
            className={`${props.isVisible ? "" : "hidden"}
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
                    onClick={props.onCancel}
                >
                  <CloseIcon/>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 flex flex-col gap-2">
                {collections.map((hsk, iHsk) => {
                  return (
                      <div
                          className="flex flex-grow items-center px-4 py-2 w-full cursor-pointer bg-gray-800"
                          onClick={() => onCheckboxChange(iHsk)}
                          key={iHsk}
                      >
                        <div className="flex flex-col flex-grow justify-center">
                          <span className="text-2xl">{hsk.name}</span>
                          <div className="flex text-xl overflow-hidden gap-2">
                            {hsk.preview.slice(0, 8).map((hz, iHz) => {
                              return (
                                  <span key={iHz}>
                                      {hz.zh_sc}
                                  </span>
                              );
                            })}
                            <span>...</span>
                          </div>
                        </div>
                        <div className="flex justify-center items-center">
                          <input
                              id="checkbox"
                              type="checkbox"
                              checked={checkboxStates[iHsk]}
                              // onChange={(e) => onCheckboxChange(iHsk, e.target.checked)}
                              onChange={() => {
                              }}
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
                    onClick={props.onCancel}
                >
                  Revert
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
  );
};

export default ModalLayout;
