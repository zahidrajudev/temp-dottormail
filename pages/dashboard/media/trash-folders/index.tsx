import DashLayout from "@/layouts/DashLayout";
import GlobalMediaGalleryFolderTrash from "@/modules/media/components/trash_folders";
import { ReactElement } from "react";

function MediaTrashFolderIndex() {
  return (
    <>
      <GlobalMediaGalleryFolderTrash className="w-full h-full space-y-5" />
    </>
  );
}

MediaTrashFolderIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default MediaTrashFolderIndex;
