import DropdownAndTooltip from "@/modules/global/elements/dropdown_tooltip";
import { useLanguageStore } from "../store/useLanguageStore";
import SvgIcon from "@/modules/global/icons/svg_icons";
import { useRouter } from "next/router";

interface Props {
  className?: string;
  iconClass?: string;
}

function LanguageDropdown({
  className = "flex gap-1 items-center bg-linear-to-r from-teal-500 to-cyan-500 text-white px-3 py-2 rounded",
  iconClass = "size-5 text-white",
}: Props) {
  const router = useRouter();
  const { appLocales, appSelectedLocale, appDefaultLocale, changeLocale } = useLanguageStore();

  const handleChange = (lang: any) => {
    changeLocale(lang);

    const isDefault = lang.default === 1;

    if (isDefault) {
      // Remove locale param for default language
      const { locale, ...rest } = router.query;

      router.replace(
        {
          pathname: router.pathname,
          query: rest,
        },
        undefined,
        { shallow: true },
      );
    } else {
      // Add / update locale param
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, locale: lang.code },
        },
        undefined,
        { shallow: true },
      );
    }
  };

  return (
    <DropdownAndTooltip
      position="bottom"
      side="middle"
      width="w-40"
      button={
        <div className={className}>
          <div className="leading-0">{appSelectedLocale?.name}</div>
          <div>
            <SvgIcon name="keyboard_arrow_down" className={iconClass} />
          </div>
        </div>
      }
    >
      <div className="pt-2">
        <div className="bg-white rounded shadow-custom-6 overflow-hidden">
          <ul className="space-y-1">
            {appLocales.map((lang) => (
              <li
                key={lang.code}
                onClick={() => handleChange(lang)}
                className={`px-4 p-2 cursor-pointer group ${
                  appSelectedLocale?.code === lang.code
                    ? "bg-linear-to-r from-cyan-500 to-teal-500 text-white font-semibold"
                    : "hover:bg-linear-to-r hover:from-teal-500 hover:to-cyan-500 hover:text-white"
                }`}
              >
                <div className="group-hover:translate-x-2 duration-700">
                  {lang.flag}&nbsp;&nbsp;&nbsp;&nbsp;{lang.name}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DropdownAndTooltip>
  );
}

export default LanguageDropdown;
