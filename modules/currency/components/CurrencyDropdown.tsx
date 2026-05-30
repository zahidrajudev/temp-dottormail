import DropdownAndTooltip from "@/modules/global/elements/dropdown_tooltip";
import SvgIcon from "@/modules/global/icons/svg_icons";
import { useCurrencyStore } from "@/modules/currency/store/useCurrencyStore";

interface Props {
  className?: string;
  iconClass?: string;
}

function CurrencyDropdown({
  className = "flex gap-1 items-center bg-linear-to-r from-cyan-500 to-teal-500 text-white text-[17px] px-3 py-2 rounded",
  iconClass = "size-5 text-white",
}: Props) {
  const { appCurrencies, appSelectedCurrency, changeCurrency } = useCurrencyStore();

  return (
    <DropdownAndTooltip
      position="bottom"
      side="middle"
      width="w-26"
      button={
        <div className={className}>
          <div className="leading-0">{appSelectedCurrency?.code}</div>
          <div>
            <SvgIcon name="keyboard_arrow_down" className={iconClass} />
          </div>
        </div>
      }
    >
      <div className="pt-2">
        <div className=" bg-white rounded shadow-custom-6 overflow-hidden">
          <ul className="space-y-1">
            {appCurrencies.map((curr) => (
              <li
                key={curr.code}
                onClick={() => changeCurrency(curr?.code)}
                className={`px-4 p-2 cursor-pointer group ${appSelectedCurrency?.code === curr.code ? "bg-linear-to-r from-cyan-500 to-teal-500 text-white font-semibold" : "hover:bg-linear-to-r hover:from-violet-500 hover:to-fuchsia-500 hover:text-white"}`}
              >
                <div className="group-hover:translate-x-2 duration-700">
                  {curr.symbol}&nbsp;&nbsp;&nbsp;&nbsp;{curr.code}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DropdownAndTooltip>
  );
}

export default CurrencyDropdown;
