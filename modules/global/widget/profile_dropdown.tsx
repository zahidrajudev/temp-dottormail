import DropdownAndTooltip from "@/modules/global/elements/dropdown_tooltip";
import ImageBox from "@/modules/global/elements/image_box";
import { useRouter } from "next/router";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useState } from "react";
import SvgIcon from "@/modules/global/icons/svg_icons";

interface Props {
  showProfileImage?: boolean;
  showEdit?: boolean;
  showDashboard?: boolean;
  ShowLogout?: boolean;
  imageSize?: any;
}

function ProfileDropdown({ showProfileImage = true, showEdit = true, showDashboard = true, ShowLogout = true, imageSize = "size-14" }: Props) {
  const { appUserlogout, appUser, appUserLoading, appPermissions } = useAuthStore();
  const [showUserProfile, setShowUserProfile] = useState(false);
  if (appUserLoading) {
    return "Loading...";
  }
  const Router = useRouter();

  const handleRedirectToDashboard = () => {
    let url = "/";
    if (appPermissions && appPermissions?.admin_das?.view === 1) {
      url = "/dashboard";
      Router.push(url);
      return;
    }
    if (appPermissions && appPermissions?.client_das?.view === 1) {
      url = "/dashboard/v2";
      Router.push(url);
      return;
    }
    if (appPermissions && appPermissions?.author_das?.view === 1) {
      url = "/dashboard/v3";
      Router.push(url);
      return;
    }
    if (appPermissions && appPermissions?.affiliate_das?.view === 1) {
      url = "/dashboard/v4";
      Router.push(url);
      return;
    }
    if (appPermissions && appPermissions?.team_das?.view === 1) {
      url = "/dashboard/v5";
      Router.push(url);
      return;
    }
    Router.push(url);
  };

  return (
    <div>
      <DropdownAndTooltip
        position="bottom"
        side="left"
        width="w-[200px]"
        button={
          <div className="flex justify-between items-center gap-3">
            {showProfileImage && (
              <div className="">
                <ImageBox
                  src={appUser?.media?.path}
                  className={`${imageSize} rounded-full overflow-hidden`}
                  image_className="w-full h-full object-cover"
                  zoom_on_hover={false}
                />
              </div>
            )}
            <div className="flex-1 flex justify-between">
              <div className="text-[16px]">
                <div className="text-ellipsis line-clamp-1">{appUser?.translate?.name}</div>
                <div className="text-sm text-gray-500 text-ellipsis line-clamp-1">{appUser?.role?.name}</div>
              </div>
              <div className="hidden">
                <SvgIcon name="keyboard_arrow_down" className="size-6" />
              </div>
            </div>
          </div>
        }
      >
        <div className="py-3">
          <div className="p-3 bg-white rounded space-y-3 shadow-custom-1">
            {showEdit && (
              <div
                onClick={() => setShowUserProfile(true)}
                className="flex gap-3 items-center text-gray-500 px-2 py-2 hover:bg-cyan-700 hover:text-white rounded cursor-pointer"
              >
                <div>
                  <SvgIcon name="person" className="size-6" />
                </div>
                <div className="text-[16px]">Edit profile</div>
              </div>
            )}
            {showDashboard && (
              <div
                onClick={handleRedirectToDashboard}
                className="flex gap-3 items-center text-gray-500 px-2 py-2 hover:bg-cyan-700 hover:text-white rounded cursor-pointer"
              >
                <div>
                  <SvgIcon name="dashboard" className="size-6" />
                </div>
                <div className="text-[16px]">Dashboard</div>
              </div>
            )}
            {ShowLogout && (
              <div onClick={appUserlogout} className="flex gap-3 items-center text-gray-500 px-2 py-2 hover:bg-cyan-700 hover:text-white rounded cursor-pointer">
                <div>
                  <SvgIcon name="logout" className="size-6" />
                </div>
                <div className="text-[16px]">Log out</div>
              </div>
            )}
          </div>
        </div>
      </DropdownAndTooltip>
    </div>
  );
}

export default ProfileDropdown;
