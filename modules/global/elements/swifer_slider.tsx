import { SwiperRef } from "swiper/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination, Grid, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";

import SvgIcon from "../icons/svg_icons";
import { useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  spaceBetween?: number;
  centeredSlides?: boolean;
  loop?: boolean;
  freeMode?: boolean;
  speed?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pagination_show?: boolean;
  slidesPerView?: number | "auto" | undefined;
  slidesPerGroup?: number | undefined;
  rows?: number;
  isResponsive?: boolean;
  slidesPerView_xs?: number | "auto" | undefined;
  slidesPerGroup_xs?: number | undefined;
  row_xs?: number;
  slidesPerView_sm?: number | "auto" | undefined;
  slidesPerGroup_sm?: number | undefined;
  row_sm?: number;
  slidesPerView_md?: number | "auto" | undefined;
  slidesPerGroup_md?: number | undefined;
  row_md?: number;
  slidesPerView_lg?: number | "auto" | undefined;
  slidesPerGroup_lg?: number | undefined;
  row_lg?: number;
  slidesPerView_xl?: number | "auto" | undefined;
  slidesPerGroup_xl?: number | undefined;
  row_xl?: number;
  slidesPerView_2xl?: number | "auto" | undefined;
  slidesPerGroup_2xl?: number | undefined;
  row_2xl?: number;
  navigation_show?: boolean;
  top_navigation?: {
    enable?: boolean;
    class?: string;
  };
  bottom_navigation?: {
    enable?: boolean;
    class?: string;
  };
  left_navigation?: {
    enable?: boolean;
    class?: string;
  };
  right_navigation?: {
    enable?: boolean;
    class?: string;
  };
}

export default function SwiperSlider({
  children,
  spaceBetween = 20,
  centeredSlides = false,
  loop = false,
  freeMode = false,
  speed = 1200,
  autoplay = false,
  autoplayDelay = 2500,
  pagination_show = false,
  slidesPerView = 1,
  slidesPerGroup = 1,
  rows = 1,
  isResponsive,
  slidesPerView_xs = 1,
  slidesPerGroup_xs = 1,
  row_xs = 1,
  slidesPerView_sm = 1,
  slidesPerGroup_sm = 1,
  row_sm = 1,
  slidesPerView_md = 1,
  slidesPerGroup_md = 1,
  row_md = 1,
  slidesPerView_lg = 1,
  slidesPerGroup_lg = 1,
  row_lg = 1,
  slidesPerView_xl = 1,
  slidesPerGroup_xl = 1,
  row_xl = 1,
  slidesPerView_2xl = 1,
  slidesPerGroup_2xl = 1,
  row_2xl = 1,
  top_navigation = {
    enable: false,
    class: "flex w-full justify-end gap-3 pb-5", // responsive classes also we can use example: md:hidden, xl:block
  },
  bottom_navigation = {
    enable: false,
    class: "flex w-full justify-between gap-3", // responsive classes also we can use example: md:hidden, xl:block
  },
  right_navigation = {
    enable: false,
    class: "flex w-auto justify-between gap-3", // responsive classes also we can use example: md:hidden, xl:block
  },
  left_navigation = {
    enable: false,
    class: "flex w-auto justify-between gap-3", // responsive classes also we can use example: md:hidden, xl:block
  },
}: Props) {
  const swiperRef = useRef<SwiperRef>(null); // Reference to the swiper instance
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);

  const handleSlideChange = () => {
    const swiper = swiperRef.current?.swiper;
    if (swiper) {
      //console.log({ start: swiper.isBeginning, end: swiper.isEnd });
      setIsNextDisabled(swiper.isEnd);
      setIsPrevDisabled(swiper.isBeginning);
    }
  };

  const breakPoints = isResponsive
    ? {
        // Define the breakpoints for different screen sizes
        0: {
          slidesPerView: slidesPerView,
          slidesPerGroup: slidesPerGroup,
          grid: { rows: rows, fill: "row" as const },
        },
        435: {
          slidesPerView: slidesPerView_xs,
          slidesPerGroup: slidesPerGroup_xs,
          grid: { rows: row_xs, fill: "row" as const },
        },
        640: {
          slidesPerView: slidesPerView_sm,
          slidesPerGroup: slidesPerGroup_sm,
          grid: { rows: row_sm, fill: "row" as const },
        },
        768: {
          slidesPerView: slidesPerView_md,
          slidesPerGroup: slidesPerGroup_md,
          grid: { rows: row_md, fill: "row" as const },
        },
        1024: {
          slidesPerView: slidesPerView_lg,
          slidesPerGroup: slidesPerGroup_lg,
          grid: { rows: row_lg, fill: "row" as const },
        },
        1280: {
          slidesPerView: slidesPerView_xl,
          slidesPerGroup: slidesPerGroup_xl,
          grid: { rows: row_xl, fill: "row" as const },
        },
        1536: {
          slidesPerView: slidesPerView_2xl,
          slidesPerGroup: slidesPerGroup_2xl,
          grid: { rows: row_2xl, fill: "row" as const },
        },
      }
    : undefined;

  const checkForAutoWidth = () => {
    if (isResponsive) {
      let classes = "";
      if (slidesPerView_xs == "auto") {
        classes += " [@media(min-width:435px)_and_(max-width:639px)]:!w-auto ";
      }

      if (slidesPerView_sm == "auto") {
        classes += " [@media(min-width:640px)_and_(max-width:767px)]:!w-auto ";
      }

      if (slidesPerView_md == "auto") {
        classes += " [@media(min-width:768px)_and_(max-width:1023px)]:!w-auto ";
      }

      if (slidesPerView_lg == "auto") {
        classes += " [@media(min-width:1024px)_and_(max-width:1279px)]:!w-auto ";
      }

      if (slidesPerView_xl == "auto") {
        classes += " [@media(min-width:1280px)_and_(max-width:1535px)]:!w-auto ";
      }

      if (slidesPerView_2xl == "auto") {
        classes += " min-[1535px]:!w-auto ";
      }
      return classes;
    } else {
      if (slidesPerView == "auto") {
        return "!w-auto";
      }
      return "";
    }
  };

  const handlePrev = () => swiperRef.current?.swiper?.slidePrev();
  const handleNext = () => swiperRef.current?.swiper?.slideNext();

  return (
    <>
      {typeof top_navigation == "object" && top_navigation?.enable ? (
        <div className={`${top_navigation?.class}`}>
          <div onClick={handlePrev} className="">
            <div className={`p-1 rounded-full bg-gray-50 text-gray-500 shadow-sm cursor-pointer ${isPrevDisabled && "opacity-40"}`}>
              <SvgIcon name="chevron_right" className="size-7 rotate-180" />
            </div>
          </div>

          <div onClick={handleNext} className="">
            <div className={`p-1 rounded-full bg-gray-50 text-gray-500 shadow-sm cursor-pointer ${isNextDisabled && "opacity-40"}`}>
              <SvgIcon name="chevron_right" className="size-7" />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="relative flex items-center w-full max-w-full">
        {typeof left_navigation == "object" && left_navigation?.enable ? (
          <div className={`${left_navigation?.class}`}>
            <div onClick={handlePrev} className="">
              <div className={`p-1 rounded-full bg-gray-50 text-gray-500 shadow-sm cursor-pointer ${isPrevDisabled && "opacity-40"}`}>
                <SvgIcon name="chevron_right" className="size-7 rotate-180" />
              </div>
            </div>

            <div onClick={handleNext} className="">
              <div className={`p-1 rounded-full bg-gray-50 text-gray-500 shadow-sm cursor-pointer ${isNextDisabled && "opacity-40"}`}>
                <SvgIcon name="chevron_right" className="size-7" />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Autoplay, Pagination, Grid, FreeMode]}
          navigation={{
            nextEl: nextRef?.current,
            prevEl: prevRef?.current,
            disabledClass: "opacity-40",
          }}
          onSlideChange={handleSlideChange}
          slidesPerView={slidesPerView}
          slidesPerGroup={slidesPerGroup}
          spaceBetween={spaceBetween}
          autoplay={autoplay ? { delay: autoplayDelay, disableOnInteraction: false } : false}
          loop={loop}
          speed={speed}
          freeMode={freeMode}
          centeredSlides={centeredSlides}
          onRealIndexChange={(swiper) => setActiveIndex(swiper.realIndex)}
          breakpoints={breakPoints}
          grid={
            !isResponsive
              ? {
                  rows: rows,
                  fill: "row",
                }
              : undefined
          }
        >
          {Array.isArray(children) ? (
            children.map((child, index) => (
              <SwiperSlide key={index} className={`${checkForAutoWidth()}`}>
                {child}
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>{children}</SwiperSlide>
          )}
        </Swiper>
        {typeof right_navigation == "object" && right_navigation?.enable ? (
          <div className={`${right_navigation?.class}`}>
            <div onClick={handlePrev} className="">
              <div className={`p-1 rounded-full bg-gray-50 text-gray-500 shadow-sm cursor-pointer ${isPrevDisabled && "opacity-40"}`}>
                <SvgIcon name="chevron_right" className="size-7 rotate-180" />
              </div>
            </div>

            <div onClick={handleNext} className="">
              <div className={`p-1 rounded-full bg-gray-50 text-gray-500 shadow-sm cursor-pointer ${isNextDisabled && "opacity-40"}`}>
                <SvgIcon name="chevron_right" className="size-7" />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

      {typeof bottom_navigation == "object" && bottom_navigation?.enable ? (
        <div className={`${bottom_navigation?.class}`}>
          <div onClick={handlePrev} className="">
            <div className={`p-1 rounded-full bg-gray-50 text-gray-500 shadow-sm cursor-pointer ${isPrevDisabled && "opacity-40"}`}>
              <SvgIcon name="chevron_right" className="size-7 rotate-180" />
            </div>
          </div>

          <div onClick={handleNext} className="">
            <div className={`p-1 rounded-full bg-gray-50 text-gray-500 shadow-sm cursor-pointer ${isNextDisabled && "opacity-40"}`}>
              <SvgIcon name="chevron_right" className="size-7" />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {pagination_show && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.isArray(children)
            ? children.map((_, index) => (
                <button
                  key={index}
                  onClick={() => swiperRef.current?.swiper?.slideToLoop(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === activeIndex ? "bg-black" : "bg-gray-300"}`}
                />
              ))
            : ""}
        </div>
      )}
    </>
  );
}
