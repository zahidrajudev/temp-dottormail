"use client";
import DottormailFooter from "@/modules/dottormail/footers/main_footer";
import DottormailHeader from "@/modules/dottormail/headers/main_header";

interface Props {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
  return (
    <div className="w-full">
      <DottormailHeader />
      <div className="min-h-screen">{children}</div>
      <DottormailFooter />
    </div>
  );
};

export default MainLayout;
