import DashLayout from "@/layouts/DashLayout";
import GlobalMediaGalleryTrash from "@/modules/media/components/trash_files";
import { ReactElement } from "react";

function MediaTrashFileIndex() {
  return (
    <>
      <GlobalMediaGalleryTrash />
    </>
  );
}

MediaTrashFileIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default MediaTrashFileIndex;
