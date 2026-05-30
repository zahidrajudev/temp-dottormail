import { useEffect, useState } from "react";
import SvgIcon from "@/modules/global/icons/svg_icons";
import ImageBox from "@/modules/global/elements/image_box";
import { useGlobalMediaStore } from "@/modules/media/store/useGlobalMediaStore";

interface MediaSelection {
  id?: string | number;
  path: string;
  type: number | any;
  alt?: string;
}

type MediaAreaProps = {
  items: MediaSelection[];
  setItems: (items: MediaSelection[]) => void;
  imageClassName?: string;
  className?: string;
  selectOnlyTypes?: string[];
  maxSelect?: number;
};

function MediaArea({ items, setItems, selectOnlyTypes = [], maxSelect = 0, className = "flex justify-start flex-wrap gap-2", imageClassName = "h-20" }: MediaAreaProps) {
  const { openMediaGallery, activeCallerId, appMediaItems } = useGlobalMediaStore();

  const [uniqueId, setUniqueId] = useState<string | number>("");

  useEffect(() => {
    if (uniqueId == activeCallerId) {
      setItems(appMediaItems);
      // console.log({ appMediaShow, uniqueId, activeCallerId, appMediaItems });
    }
  }, [appMediaItems]);

  const handleOpenGallery = () => {
    const uniq = Date.now();
    setUniqueId(uniq);
    // setAppMediaFor(uniq);
    let finalTypes: number[] = [];
    if (Array.isArray(selectOnlyTypes)) {
      selectOnlyTypes.map((itm) => {
        if (itm == "image" || itm == "img" || itm == "images" || itm == "Image" || itm == "Img" || itm == "Images") {
          finalTypes.push(1);
        }
        if (itm == "video" || itm == "Video") {
          finalTypes.push(2);
        }
        if (itm == "audio" || itm == "Audio") {
          finalTypes.push(3);
        }
        if (itm == "document" || itm == "Document" || itm == "doc" || itm == "Doc") {
          finalTypes.push(4);
        }
        if (itm == "file" || itm == "File") {
          finalTypes.push(5);
        }
      });
    }
    openMediaGallery({ id: uniq, items: items, max: maxSelect, types: finalTypes });
    // setAppMediaShow(true);
    // closeMediaGallery();
    // appMediaSelectOnly(selectOnlyTypes);
    // appMediaMaxSelect(maxSelect);
  };

  const removeMedia = (id: string | number) => {
    if (Array.isArray(items)) {
      setItems(items.filter((itm) => itm.id !== id));
    }
  };

  const printMedia = (file: MediaSelection) => {
    if (file?.type === 1) {
      return <ImageBox src={file?.path} className={imageClassName} image_className="h-full w-full object-cover" zoom_on_hover={false} />;
    } else {
      return (
        <div className={`${imageClassName} w-full relative flex justify-center items-center bg-blue-100`}>
          {file?.type === 2 && <SvgIcon name="smart_display" className="size-20 text-blue-950/50" filled />}
          {file?.type === 3 && <SvgIcon name="headphones" className="size-20 text-blue-950/50" filled />}
          {file?.type === 4 && <SvgIcon name="docs" className="size-20 text-blue-950/50" filled />}
        </div>
      );
    }
  };

  return (
    <div>
      <div className="flex flex-wrap group">
        <div
          onClick={handleOpenGallery}
          role="button"
          aria-label="Open media gallery"
          className="w-auto max-w-14 bg-blue-50 border-2 border-dashed border-violet-200 group-hover:border-violet-500 py-5 px-1 flex items-center cursor-cell">
          <SvgIcon name="add_a_photo" className="size-8 text-blue-950 group-hover:text-violet-500" />
        </div>
        <div className="flex-1 border-2 border-dashed border-violet-200 group-hover:border-violet-500 py-5 px-2">
          {Array.isArray(items) && items.length ? (
            <div className={className}>
              {items.map((itm: any, indx) => (
                <div className="relative p-1" key={itm?.id + indx}>
                  {printMedia(itm)}
                  <div onClick={() => removeMedia(itm?.id)} className="absolute z-10 top-0 right-0" title="Remove">
                    <SvgIcon
                      name="close"
                      className="size-5 opacity-0 group-hover:opacity-100 bg-red-500 rounded-full p-0.5 text-white hover:scale-125 duration-700 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex w-full h-full items-center justify-center text-gray-400 text-sm">No Media Selected</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MediaArea;
