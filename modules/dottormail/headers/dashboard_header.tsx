import Link from "next/link";
import DropdownAndTooltip from "@/modules/global/elements/dropdown_tooltip";
import { useState } from "react";
import SvgIcon from "@/modules/global/icons/svg_icons";
import ImageBox from "@/modules/global/elements/image_box";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { useCurrencyStore } from "@/modules/currency/store/useCurrencyStore";
import LanguageDropdown from "@/modules/language/components/LanguageDropdown";
import CurrencyDropdown from "@/modules/currency/components/CurrencyDropdown";

interface Props {
  HEIGHT?: string;
}

function DottormailAdminDashboardHeader({ HEIGHT = "h-20" }) {
  const { appUser, appUserlogout, appUserLoading } = useAuthStore();
  const { appSelectedLocale } = useLanguageStore();
  const { appSelectedCurrency } = useCurrencyStore();
  const [searchText, setSearchText] = useState("");

  return (
    <div className={`${HEIGHT} bg-linear-to-tr from-white via-white to-fuchsia-200 sticky top-0 z-51  border-b border-teal-500/50`}>
      <div className="relative overflow-hidden h-full px-12">
        <div className="flex items-center justify-between h-full relative z-2">
          <div className="w-full max-w-80">
            {/* <Input
              value={searchText}
              setValue={setSearchText}
              labelShow={false}
              placeholder="Search Here ..."
              id="searchText"
              padding="py-2.5 px-5"
              border="rounded-lg border border-gray-100"
              iconName="search"
              iconSide="right"
              iconClass="size-5 text-white"
              extraClass="bg-linear-to-r from-violet-500 to-fuchsia-500 text-white"
            /> */}
          </div>

          <div className="flex gap-8 items-center h-full">
            <CurrencyDropdown />
            <LanguageDropdown />
            <DropdownAndTooltip
              position="bottom"
              side="right"
              width="w-[200px]"
              button={
                <div className="flex justify-between items-center gap-3">
                  <div className="">
                    <ImageBox
                      src={appUser?.media?.path}
                      className="size-10 rounded-full overflow-hidden border-4 border-cyan-600"
                      image_className="w-full h-full object-cover"
                      zoom_on_hover={false}
                    />
                  </div>
                </div>
              }
            >
              <div className="py-3">
                <div className="p-3 bg-white rounded-lg space-y-3 shadow-lg">
                  <Link href={`/dashboard/user/profile`} className="flex gap-3 items-center text-gray-500 px-2 py-2 hover:bg-cyan-800 hover:text-white rounded">
                    <div>
                      <SvgIcon name="person" className="size-6" />
                    </div>
                    <div className="text-[16px]">Edit profile</div>
                  </Link>

                  <div onClick={appUserlogout} className="flex gap-3 items-center text-gray-500 px-2 py-2 hover:bg-cyan-800 hover:text-white rounded cursor-pointer">
                    <div>
                      <SvgIcon name="logout" className="size-6" />
                    </div>
                    <div className="text-[16px]">Log out</div>
                  </div>
                </div>
              </div>
            </DropdownAndTooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DottormailAdminDashboardHeader;
