import { useLanguageStore } from "@/modules/language/store/useLanguageStore";

interface Props {
  currentLanguage: string | any;
  setCurrentLnaguage: (lang: string) => void;
}

function LanguageSelectForInputFields({ currentLanguage, setCurrentLnaguage }: Props) {
  const { appLocales } = useLanguageStore();

  return (
    <>
      {Array.isArray(appLocales) && (
        <div className="flex flex-col p-6 border border-violet-200 rounded hover:border-cyan-600 group">
          <div className="flex justify-center">
            <div className="px-6 h-9 bg-gray-100 rounded-full -mt-10.5 flex items-center border border-violet-200 group-hover:border-emerald-600">
              <p className="leading-0 font-semibold">Select Language</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 items-center p-2">
            {appLocales.map((itm, indx) => (
              <div
                onClick={() => setCurrentLnaguage(itm?.code)}
                key={indx}
                className={`px-4 py-1.5 rounded font-semibold border border-violet-200 group-hover:border-cyan-500 ${
                  currentLanguage == itm?.code ? "bg-linear-to-r from-cyan-400 to-teal-400 hover:from-cyan-500 hover:to-emerald-500 text-white" : " bg-white"
                } hover:bg-linear-to-r hover:from-emerald-500 hover:to-cyan-500 hover:text-white cursor-pointer`}
              >
                {itm?.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default LanguageSelectForInputFields;
