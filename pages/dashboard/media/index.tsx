import DashLayout from "@/layouts/DashLayout";
import GlobalMediaGallery from "@/modules/media/components/global_media_gallery";
import { ReactElement } from "react";

function MediaIndex() {
  return (
    <>
      <GlobalMediaGallery className="w-full h-full space-y-5" showUpdateButton={false} enableGlobalOptions={false} visibleTranslateClass="" hiddenTranslateClass="" />
    </>
  );
}

MediaIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default MediaIndex;
