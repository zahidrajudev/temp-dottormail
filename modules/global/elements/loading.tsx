import { useEffect, useState } from "react";
import SvgIcon from "../icons/svg_icons";

interface Props {
  show: boolean;
  style?: number;
}

function Loading({ show = false, style = 1 }: Props) {
  if (!show) {
    return null;
  }

  if (style == 1) {
    return (
      <div className="p-3 bg-white rounded-full shadow-2xl">
        <SvgIcon name="loading" loading className="size-64" />
      </div>
    );
  }

  if (style == 2) {
    const [number, setNumber] = useState(0);
    useEffect(() => {
      if (number <= 100) {
        setTimeout(() => {
          setNumber((prev) => prev + 1);
        }, 200);
      } else {
        setNumber(0);
      }
    }, [number]);
    return (
      <div className="size-14 bg-white rounded-full flex items-center justify-center font-black text-xl shadow-2xl relative">
        {number}
        <div className="absolute">
          <SvgIcon name="loading" loading className="size-16" loading_front_color="text-violet-600" />
        </div>
      </div>
    );
  }

  return null;
}

export default Loading;
