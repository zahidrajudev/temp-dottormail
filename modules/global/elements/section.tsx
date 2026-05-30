import React from "react";
import SvgIcon from "../icons/svg_icons";
import Button from "./button";
import Loading from "@/modules/global/elements/loading";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  permission?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string; // This handles positioning (sticky, relative, m-4, etc.)
  outerClassName?: string; // This handles children layout (flex, grid, gap, items-center)
  confirmation?: boolean;
  confirmation_yes?: () => void;
  confirmation_no?: () => void;
}

const Section = ({
  children,
  permission = true,
  loading = false,
  fullWidth = false,
  className = "",
  outerClassName = "",
  confirmation = false,
  confirmation_yes,
  confirmation_no,
  ...props
}: Props) => {
  const containerWidth = fullWidth ? "w-full" : "container mx-auto";

  // 1. OUTER STYLES: Sticky and Position must be on the 'section' tag.
  const outerBase = `relative ${containerWidth} ${outerClassName}`;

  // 2. INNER STYLES: Flex/Grid layout for children.
  const innerBase = `w-full h-full transition-all duration-300 ${className} ${loading || confirmation ? "pointer-events-none opacity-50" : ""}`;

  return (
    <section className={outerBase} {...props}>
      {permission ? <div className={innerBase}>{children}</div> : <div className="h-64 w-full" />}

      {/* OVERLAYS (Absolute to the section) */}
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <Loading show style={2} />
        </div>
      )}

      {!permission && !loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-50/90 border border-dashed border-gray-200">
          <div className="space-y-4 text-center p-6">
            <div className="inline-flex justify-center p-4 bg-red-100 rounded-full">
              <SvgIcon name="security" className="w-12 h-12 text-red-600" />
            </div>
            <div>
              <h3 className="text-red-600 text-lg font-bold">Access Restricted</h3>
              <p className="text-red-500">You don&apos;t have permission to access this area</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL (Fixed to screen) */}
      {confirmation && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* ... (Modal content same as before) */}
            <div className="bg-red-50 p-6 flex flex-col items-center">
              <SvgIcon name="delete" className="w-8 h-8 text-red-600 mb-2" />
              <h3 className="text-xl font-bold">Are you sure?</h3>
            </div>
            <div className="p-6 flex justify-center space-x-4">
              <Button onClick={confirmation_yes} className="bg-green-600 text-white px-6 py-2 rounded-full">
                Yes
              </Button>
              <Button onClick={confirmation_no} className="bg-gray-200 px-6 py-2 rounded-full">
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Section;
