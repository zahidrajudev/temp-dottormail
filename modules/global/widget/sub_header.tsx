import SvgIcon from "@/modules/global/icons/svg_icons";
import { useRouter } from "next/router";
import Breadcrumbs from "@/modules/global/elements/breadcrumbs";

interface Props {
  title?: string;
  showTranslationIcon?: boolean;
  TranslationIconAction?: () => void;
}

function SubHeader({ title, showTranslationIcon, TranslationIconAction }: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-4 items-center justify-between w-full bg-white px-8 py-6 rounded-lg mb-5 border border-violet-200">
      <div className="flex gap-4 items-center">
        <div className="cursor-pointer" onClick={() => router.back()} title="Back">
          <SvgIcon name="keyboard_arrow_down" className="text-cyan-600 size-6.5 rotate-90 rounded hover:bg-teal-600 hover:text-white" />
        </div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {showTranslationIcon && (
          <div className="cursor-pointer flex items-center" onClick={TranslationIconAction} title="Manage Translations">
            <SvgIcon name="language" className="text-cyan-600 size-6 rotate-90 rounded hover:bg-teal-600 hover:text-white p-0.5 mt-1" />
          </div>
        )}
      </div>
      <Breadcrumbs
        homeHref="/dashboard"
        homeLabel="Dashboard"
        homeIconName="dashboard"
        startDepth={1}
        linkClassName="line-clamp-1"
        activeClassName="line-clamp-1 font-semibold"
      />
    </div>
  );
}

export default SubHeader;
