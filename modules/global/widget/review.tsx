import ImageBox from "@/modules/global/elements/image_box";
import SvgIcon from "@/modules/global/icons/svg_icons";

interface ReviewProps {
  data: { photo?: string; name?: string; description?: string; profession?: string }[];
  root_className?: string;
  className?: string;
}
function Review({ data, root_className = "grid grid-cols-1 gap-8 px-4", className = "bg-white p-5 rounded-lg shadow-custom-5 space-y-4" }: ReviewProps) {
  return (
    <div className={root_className}>
      {Array.isArray(data) &&
        data.map((item: any, index: number) => (
          <div key={index} className={className}>
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <ImageBox src={item?.photo} zoom_on_hover={false} className="size-14 rounded-full border border-violet-500" image_className="object-cover max-w-full max-h-full" />
                <div className="space-y-1">
                  <p className="font-semibold">{item?.name}</p>
                  <p className="text-sm text-gray-500">{item?.profession}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-center text-gray-500">{item?.date}</p>
                <div className="flex">
                  <SvgIcon name="star" className="size-5 text-fuchsia-400" filled />
                  <SvgIcon name="star" className="size-5 text-fuchsia-400" filled />
                  <SvgIcon name="star" className="size-5 text-fuchsia-400" filled />
                  <SvgIcon name="star" className="size-5 text-fuchsia-400" filled />
                  <SvgIcon name="star" className="size-5 text-fuchsia-400" filled />
                </div>
              </div>
            </div>
            <hr className="border-gray-200" />
            <div className="text-gray-600">{item?.description}</div>
          </div>
        ))}
    </div>
  );
}

export default Review;
