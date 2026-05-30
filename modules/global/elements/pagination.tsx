import React from "react";
import SvgIcon from "@/modules/global/icons/svg_icons";
import pageTranslation from "@/modules/language/components/PageTranslation";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";

interface Props {
  currentPage?: number;
  totalPages?: number;
  onPageChange: (page: number | string | any) => void;
  siblingCount?: number;
  paginateInfo?: string;
  className?: string;
  design?: number;
}

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange, siblingCount = 1, paginateInfo = "", className = "", design = 1 }: Props) => {
  const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, idx) => start + idx);

  const pageName = "pagination";
  const { appSelectedLocale, appLocales } = useLanguageStore();
  const { t } = pageTranslation(pageName, appSelectedLocale?.code ?? "en");

  const getPaginationRange = () => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - 1;

    const firstPage = 1;
    const lastPage = totalPages;

    if (!showLeftEllipsis && showRightEllipsis) {
      return [...range(1, 3 + siblingCount), "...", totalPages];
    }

    if (showLeftEllipsis && !showRightEllipsis) {
      return [firstPage, "...", ...range(totalPages - 2 - siblingCount, totalPages)];
    }

    if (showLeftEllipsis && showRightEllipsis) {
      return [firstPage, "...", ...range(leftSiblingIndex, rightSiblingIndex), "...", lastPage];
    }
  };

  const paginationRange = getPaginationRange();

  return (
    <div className={`w-full overflow-x-auto ${Array.isArray(paginationRange) && paginationRange.length && className}`}>
      <nav aria-label="Pagination" className={`flex items-center justify-center gap-1 sm:gap-3 mx-auto w-max`}>
        {Array.isArray(paginationRange) && paginationRange.length ? (
          <>
            {design === 1 && (
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-1 py-0.5 bg-gray-200 rounded-md hover:bg-orange-400 hover:text-white disabled:opacity-50"
              >
                <SvgIcon name="chevron_right" className="rotate-180" />
              </button>
            )}
            {design === 2 && (
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 gap-1 text-sm flex items-center disabled:opacity-50 hover:bg-cyan-600 hover:text-white rounded-md"
              >
                <SvgIcon name="arrow_right_alt" className="size-5 rotate-180" /> <span className="hidden sm:inline">{t("previous")}</span>
              </button>
            )}
          </>
        ) : (
          ""
        )}
        {Array.isArray(paginationRange) && paginationRange.length
          ? paginationRange.map((page, index) => {
              if (page === "...") {
                return (
                  <span key={index} className="px-2 py-0.5">
                    ...
                  </span>
                );
              }

              return (
                <React.Fragment key={index}>
                  {design === 1 && (
                    <button
                      key={index}
                      onClick={() => onPageChange(page)}
                      disabled={currentPage === page}
                      className={`px-2 py-0.5 rounded-md ${page === currentPage ? "bg-orange-400 text-white" : "bg-gray-200 hover:bg-orange-200"}`}
                    >
                      {page}
                    </button>
                  )}
                  {design === 2 && (
                    <button
                      key={index}
                      onClick={() => onPageChange(page)}
                      disabled={currentPage === page}
                      className={`size-9 text-sm flex justify-center items-center rounded-full ${
                        page === currentPage ? "bg-cyan-600 text-white" : " hover:bg-teal-600 hover:text-white"
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              );
            })
          : ""}
        {Array.isArray(paginationRange) && paginationRange.length ? (
          <>
            {design === 1 && (
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-1 py-0.5 bg-gray-200 rounded-md hover:bg-orange-400 hover:text-white disabled:opacity-50"
              >
                <SvgIcon name="chevron_right" />
              </button>
            )}
            {design === 2 && (
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 gap-1 text-sm flex items-center disabled:opacity-50 hover:bg-cyan-600 rounded-md hover:text-white"
              >
                <span className="hidden sm:inline">{t("next")}</span> <SvgIcon name="arrow_right_alt" className="size-5" />
              </button>
            )}
          </>
        ) : (
          ""
        )}
      </nav>
      {paginateInfo && <div className="hidden justify-center text-xs opacity-75 pt-1">{paginateInfo.replaceAll("null", "0")}</div>}
    </div>
  );
};

export default Pagination;
