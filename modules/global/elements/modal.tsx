import { useEffect, useRef, useState } from "react";
import SvgIcon from "@/modules/global/icons/svg_icons";
import Section from "@/modules/global/elements/section";

interface Props {
  show: boolean;
  setShow: (val: boolean) => void;
  children?: React.ReactNode;
  permission?: boolean;
  size?: number;
  loading?: boolean;
  showCloseIcon?: boolean;
  className?: string;
  maxWidth?: string;
  maxHeight?: string;
  bodyMaxheight?: string;
  backgroundClass?: string;
  backdrop?: boolean;
  backdropscroll?: boolean;
  animationClass?: string;
  CloseIconDivClass?: string;
  CloseIconClass?: string;
  zIndex?: string;
}

function Modal({
  children = <div className="py-5 px-10 text-xl h-52 flex items-center justify-center">Body Content</div>,
  permission = true,
  loading = false,
  CloseIconDivClass = "sticky top-3 pr-3 text-end cursor-pointer h-0 z-50",
  CloseIconClass = "size-6 hover:scale-150 duration-700 cursor-pointer hover:text-red-500 opacity-40 hover:opacity-100",
  show = false,
  setShow,
  className = "rounded-lg bg-gray-100 shadow-custom-1",
  maxWidth = "w-full max-w-2xl",
  maxHeight = "max-h-[calc(100%-5rem)]",
  bodyMaxheight = "max-h-[calc(100vh-5rem)]",
  backgroundClass = "bg-gray-200/80",
  backdrop = true,
  backdropscroll = false,
  animationClass = "animate-in zoom-in-50 duration-1000",
  zIndex = "z-53",
}: Props) {
  const modalref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (show) {
      if (!backdropscroll) {
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollbarWidth}px`; // prevent body shift
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [backdropscroll, show]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalref.current && !modalref.current.contains(event.target as Node)) {
        if (!backdrop) {
          setShow(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [backdrop]);

  // animate__animated animate__zoomIn
  return (
    <>
      {show && (
        <div className={`fixed inset-0 ${zIndex} ${backgroundClass} flex items-center justify-center`}>
          <div ref={modalref} className={`${maxHeight} overflow-hidden ${className} ${maxWidth} ${animationClass}`}>
            <div title="Close" onClick={() => setShow(false)} className={CloseIconDivClass}>
              <SvgIcon name="close" className={CloseIconClass} />
            </div>
            <div className={`overflow-y-auto scrollbar-width-2 scrollbar-width-5 scrollbar-gray ${bodyMaxheight}`}>
              {permission ? (
                <Section loading={loading}>{children}</Section>
              ) : (
                <div className="min-h-[80vh] w-full flex items-center justify-center">
                  <div>
                    <p className="text-center text-gray-500 text-sm md:text-xl font-semibold">You are not authorized to perform this action.</p>
                    <p className="text-center text-red-300 text-xs">Your permissions are limited for certain actions only.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;

{
  /* <div className={`w-full ${className} overflow-y-auto scrollbar-thin scrollbar-corner-red-500`}>
  <div title="Close" onClick={() => setShow(false)} className={CloseIconDivClass}>
    <SvgIcon name="close" className={CloseIconClass} />
  </div>
  <Section permission={permission} loading={loading}>
    {children}
  </Section>
</div>; */
}

//  <div id="default-modal" tabIndex={-1} aria-hidden="true" className={`${show ? "" : "hidden"} ${backgroundClass} fixed z-[51] w-full inset-0 h-full`}>
//       <div ref={modalref} className={`${heightWidth} mx-auto bg-red-500 overflow-hidden h-full`}>
//         <div className={` bg-green-500 overflow-hidden`}>{children}</div>
//       </div>
//     </div>

//  <div
//       id="default-modal"
//       tabIndex={-1}
//       aria-hidden="true"
//       className={`${show ? "flex" : "hidden"} bg-gray-200/80 items-center fixed z-[51] justify-center w-full inset-0 h-full`}>
//       <div className={`w-full ${heightWidth} rounded-md overflow-y-auto scrollbar-width-5 scrollbar-gray overflow-x-hidden`}>
//         <div className="flex-col relative justify-between">
//           <Section permission={permission}>
//             <div className="bg-red-500">{children}</div>
//           </Section>
//         </div>
//       </div>
//     </div>
